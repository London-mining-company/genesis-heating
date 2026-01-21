/**
 * Waitlist Service Layer
 * 
 * Clean separation of business logic from API handlers
 * Makes it easy to:
 * - Add new features
 * - Write unit tests
 * - Swap out implementations
 * 
 * @author Genesis Heating Engineering
 */

import { getSupabaseClient, WaitlistSubscriber } from '../db/client'
import { sendVerificationEmail, sendWelcomeEmail, EmailConfig } from './email'
import { notifyAllIntegrations, IntegrationConfig } from '../../lib/integrations'
import {
    performSecurityCheck,
    checkProgressiveRateLimit,
} from '../security/enhanced'
import {
    sanitizeEmail,
    sanitizeText,
    sanitizePhone,
    isValidEmail,
    isValidCanadianPostalCode,
    isInServiceArea,
    getClientIp,
} from '../security/middleware'

// ============================================
// TYPES
// ============================================

export interface SignupInput {
    email: string
    name?: string
    phone?: string
    postalCode?: string
    propertyType?: 'residential' | 'commercial' | 'industrial'
    currentHeating?: string
    monthlyHeatingCost?: number
    interestedInBeta?: boolean
    marketingConsent?: boolean
    privacyAccepted: boolean
    // Hidden honeypot field
    website?: string
    // Timing data for bot detection
    formLoadTime?: number
    submitTime?: number
    fieldInteractions?: number
    mouseMovements?: number
    // Attribution
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
    utmContent?: string
    utmTerm?: string
    referralSource?: string
}

export interface SignupResult {
    success: boolean
    data?: {
        id: string
        position: number
        emailSent: boolean
    }
    error?: {
        code: string
        message: string
        field?: string
    }
}

export interface ServiceConfig {
    email?: EmailConfig
    integrations?: IntegrationConfig
    baseUrl: string
    enableSecurityChecks: boolean
}

// ============================================
// WAITLIST SERVICE
// ============================================

export class WaitlistService {
    private config: ServiceConfig
    private db = getSupabaseClient()

    constructor(config: ServiceConfig) {
        this.config = config
    }

    /**
     * Process a new waitlist signup
     */
    async signup(
        input: SignupInput,
        headers: Record<string, string>
    ): Promise<SignupResult> {
        const clientIp = getClientIp(headers)

        // 1. Rate limiting with progressive penalties
        const rateCheck = checkProgressiveRateLimit(clientIp, 'waitlist', 5, 300000)
        if (!rateCheck.allowed) {
            return {
                success: false,
                error: {
                    code: 'RATE_LIMITED',
                    message: `Too many attempts. Please wait ${Math.ceil(rateCheck.waitMs / 60000)} minutes.`,
                },
            }
        }

        // 2. Sanitize email first
        const email = sanitizeEmail(input.email)
        if (!isValidEmail(email)) {
            return {
                success: false,
                error: {
                    code: 'INVALID_EMAIL',
                    message: 'Please enter a valid email address.',
                    field: 'email',
                },
            }
        }

        // 3. Security checks (honeypot, disposable email, gibberish, timing)
        if (this.config.enableSecurityChecks) {
            const securityCheck = performSecurityCheck(
                { website: input.website }, // Honeypot check
                email,
                input.formLoadTime && input.submitTime ? {
                    formLoadTime: input.formLoadTime,
                    submitTime: input.submitTime,
                    fieldInteractions: input.fieldInteractions || 0,
                    mouseMovements: input.mouseMovements || 0,
                } : undefined
            )

            if (securityCheck.recommendation === 'block') {
                // Log but don't reveal to user that we caught them
                console.warn('[Security] Blocked signup:', { email, flags: securityCheck.flags })

                // Return success to not reveal bot detection
                return {
                    success: true,
                    data: { id: 'blocked', position: 0, emailSent: false },
                }
            }

            if (securityCheck.recommendation === 'challenge') {
                return {
                    success: false,
                    error: {
                        code: 'VERIFICATION_REQUIRED',
                        message: 'Please complete the verification challenge.',
                    },
                }
            }
        }

        // 4. Privacy check
        if (!input.privacyAccepted) {
            return {
                success: false,
                error: {
                    code: 'PRIVACY_REQUIRED',
                    message: 'Please accept the privacy policy.',
                    field: 'privacyAccepted',
                },
            }
        }

        // 5. Postal code validation
        let postalCode: string | undefined
        let inServiceArea = false

        if (input.postalCode) {
            postalCode = input.postalCode.toUpperCase().replace(/\s/g, '')
            if (!isValidCanadianPostalCode(postalCode)) {
                return {
                    success: false,
                    error: {
                        code: 'INVALID_POSTAL_CODE',
                        message: 'Please enter a valid Canadian postal code.',
                        field: 'postalCode',
                    },
                }
            }
            inServiceArea = isInServiceArea(postalCode)
        }

        // 6. Check for existing subscriber (if DB is available)
        if (this.db) {
            const existing = await this.db.getSubscriberByEmail(email)
            if (existing.data && existing.data.length > 0) {
                // Don't reveal if email exists (privacy)
                return {
                    success: true,
                    data: { id: 'existing', position: 0, emailSent: false },
                }
            }
        }

        // 7. Calculate priority score
        const priorityScore = this.calculatePriorityScore(input, inServiceArea)

        // 8. Create subscriber
        const subscriberData: Partial<WaitlistSubscriber> = {
            email,
            name: input.name ? sanitizeText(input.name) : undefined,
            phone: input.phone ? sanitizePhone(input.phone) : undefined,
            postal_code: postalCode,
            property_type: input.propertyType,
            current_heating: input.currentHeating ? sanitizeText(input.currentHeating) : undefined,
            monthly_heating_cost: input.monthlyHeatingCost,
            interested_in_beta: input.interestedInBeta || false,
            marketing_consent: input.marketingConsent || false,
            marketing_consent_at: input.marketingConsent ? new Date().toISOString() : undefined,
            privacy_accepted: true,
            privacy_accepted_at: new Date().toISOString(),
            priority_score: priorityScore,
            ip_address: clientIp,
            user_agent: headers['user-agent'],
            referrer_url: headers['referer'],
            utm_source: input.utmSource ? sanitizeText(input.utmSource) : undefined,
            utm_medium: input.utmMedium ? sanitizeText(input.utmMedium) : undefined,
            utm_campaign: input.utmCampaign ? sanitizeText(input.utmCampaign) : undefined,
            utm_content: input.utmContent ? sanitizeText(input.utmContent) : undefined,
            utm_term: input.utmTerm ? sanitizeText(input.utmTerm) : undefined,
            referral_source: input.referralSource ? sanitizeText(input.referralSource) : undefined,
            status: 'pending',
        }

        let subscriberId = 'alt_' + Date.now();
        let verificationToken = '';

        if (this.db) {
            const result = await this.db.createSubscriber(subscriberData)

            if (result.error || !result.data) {
                console.error('Database error:', result.error)
                return {
                    success: false,
                    error: {
                        code: 'SERVER_ERROR',
                        message: 'Something went wrong. Please try again.',
                    },
                }
            }
            subscriberId = result.data.id;
            verificationToken = result.data.verification_token || '';
        }

        // 9. Track funnel event
        if (this.db) {
            await this.db.trackFunnelEvent({
                session_id: headers['x-session-id'] || 'unknown',
                subscriber_id: subscriberId,
                stage: 'form_success',
            }).catch(() => { });
        }

        // 10. Send verification email (non-blocking)
        let emailSent = false
        if (this.config.email && verificationToken) {
            sendVerificationEmail(
                this.config.email,
                email,
                input.name || '',
                verificationToken,
                this.config.baseUrl
            ).then(emailResult => {
                if (!emailResult.success) {
                    console.error('Failed to send verification email:', emailResult.error)
                }
            }).catch(console.error)
            emailSent = true
        }

        // 11. Notify integrations (non-blocking)
        if (this.config.integrations) {
            notifyAllIntegrations(
                this.config.integrations,
                'waitlist_signup',
                {
                    email,
                    name: input.name,
                    postalCode,
                    propertyType: input.propertyType,
                    priorityScore,
                    inServiceArea,
                    source: input.utmSource || 'direct',
                }
            ).catch(console.error)
        }

        return {
            success: true,
            data: {
                id: subscriberId,
                position: priorityScore, // TODO: Calculate actual queue position
                emailSent,
            },
        }
    }

    /**
     * Calculate priority score for queue ordering
     */
    private calculatePriorityScore(input: SignupInput, inServiceArea: boolean): number {
        let score = 0

        // Location priority
        if (inServiceArea) score += 50

        // Beta interest
        if (input.interestedInBeta) score += 30

        // Property type (commercial = higher value)
        if (input.propertyType === 'commercial') score += 20
        if (input.propertyType === 'industrial') score += 25

        // High heating costs = more motivated
        if (input.monthlyHeatingCost) {
            if (input.monthlyHeatingCost > 500) score += 25 // >$500/month
            else if (input.monthlyHeatingCost > 300) score += 15 // >$300/month
            else if (input.monthlyHeatingCost > 150) score += 10 // >$150/month
        }

        // Marketing consent (engaged user)
        if (input.marketingConsent) score += 5

        // Phone provided (more reachable)
        if (input.phone) score += 5

        return score
    }

    /**
     * Verify email address
     */
    async verifyEmail(token: string): Promise<SignupResult> {
        if (!token || token.length !== 36) {
            return {
                success: false,
                error: {
                    code: 'INVALID_TOKEN',
                    message: 'Invalid verification link.',
                },
            }
        }

        if (!this.db) {
            return {
                success: false,
                error: { code: 'VERIFICATION_DISABLED', message: 'Verification is currently disabled.' }
            }
        }

        const result = await this.db.verifySubscriber(token)

        if (result.error || !result.data) {
            return {
                success: false,
                error: {
                    code: 'VERIFICATION_FAILED',
                    message: 'Verification link expired or invalid.',
                },
            }
        }

        // Send welcome email
        if (this.config.email) {
            const position = result.data.priority_score || 0
            sendWelcomeEmail(
                this.config.email,
                result.data.email,
                result.data.name || '',
                position
            ).catch(console.error)
        }

        // Track verification funnel
        await this.db.trackFunnelEvent({
            session_id: result.data.id, // Use subscriber ID as session
            subscriber_id: result.data.id,
            stage: 'email_verified',
        }).catch(() => { })

        // Notify integrations
        if (this.config.integrations) {
            notifyAllIntegrations(
                this.config.integrations,
                'email_verified',
                {
                    email: result.data.email,
                    name: result.data.name,
                    subscriberId: result.data.id,
                }
            ).catch(console.error)
        }

        return {
            success: true,
            data: {
                id: result.data.id,
                position: result.data.priority_score || 0,
                emailSent: true,
            },
        }
    }

    /**
     * Get waitlist stats for admin dashboard
     */
    async getStats(): Promise<{
        total: number
        verified: number
        last24h: number
        last7d: number
        byPropertyType: Record<string, number>
        avgHeatingCost: number
    }> {
        // This would query the waitlist_stats view
        // For now, return placeholder
        return {
            total: 0,
            verified: 0,
            last24h: 0,
            last7d: 0,
            byPropertyType: {},
            avgHeatingCost: 0,
        }
    }
}

// ============================================
// SINGLETON FACTORY
// ============================================

let serviceInstance: WaitlistService | null = null

export function getWaitlistService(config?: ServiceConfig): WaitlistService {
    if (config) {
        serviceInstance = new WaitlistService(config)
    }
    if (!serviceInstance && !config) {
        throw new Error('WaitlistService not initialized. Please provide config.')
    }
    return serviceInstance!
}
