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

import { sendVerificationEmail, EmailConfig } from './email'
import { notifyAllIntegrations, IntegrationConfig } from '../../lib/integrations'
import {
    performSecurityCheck,
    checkProgressiveRateLimit,
} from '../security/enhanced'
import {
    sanitizeEmail,
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

        // 6. DB Check Removed: We rely on Airtable/Resend uniqueness or just accept dupes for now (fail-open)

        // 7. Calculate priority score
        const priorityScore = this.calculatePriorityScore(input, inServiceArea)
        const subscriberId = 'lead_' + Date.now() + Math.random().toString(36).substring(7)
        const verificationToken = '' // Token generation moved to DB usually, skipping for now

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
    async getStats(): Promise<{
        total: number
        verified: number
        last24h: number
        last7d: number
        byPropertyType: Record<string, number>
        avgHeatingCost: number
    }> {
        // Placeholder - Stats would come from Airtable or Analytics tool
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
