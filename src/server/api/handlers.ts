/**
 * API Handlers for Waitlist & Analytics
 * 
 * Designed for serverless deployment (Vercel/Netlify Edge Functions)
 */

import { getSupabaseClient } from '../db/client';
import {
    sanitizeText,
    checkRateLimit,
    getClientIp,
} from '../security/middleware';
import { getWaitlistService } from '../services/waitlist';
import { AirtableService } from '../services/airtable';
import { addResendContact } from '../services/email';

// ============================================
// TYPES
// ============================================

export interface WaitlistRequest {
    email: string;
    name?: string;
    phone?: string;
    phoneNumber?: string;
    postalCode?: string;
    propertyType?: 'residential' | 'commercial' | 'industrial';
    currentHeating?: string;
    monthlyHeatingCost?: number;
    interestedInBeta?: boolean;
    marketingConsent?: boolean;
    privacyAccepted: boolean;
    csrfToken: string;
    sessionId: string;
    // UTM params
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    utmTerm?: string;
    referralSource?: string;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        field?: string;
    };
}

// ============================================
// WAITLIST HANDLER
// ============================================

export async function handleWaitlistSignup(
    request: WaitlistRequest,
    headers: Record<string, string>
): Promise<{ response: ApiResponse<{ id: string; position: number }>; status: number }> {
    // Initialize service
    const waitlistService = getWaitlistService({
        baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://genesisheatingsolutions.ca',
        enableSecurityChecks: process.env.NODE_ENV === 'production',
        email: process.env.RESEND_API_KEY ? {
            provider: 'resend',
            apiKey: process.env.RESEND_API_KEY,
            fromEmail: 'hello@genesisheatingsolutions.ca',
            fromName: 'Genesis Heating',
        } : undefined,
        integrations: {
            slack: process.env.SLACK_WEBHOOK_URL ? { webhookUrl: process.env.SLACK_WEBHOOK_URL } : undefined,
            zapier: process.env.ZAPIER_WEBHOOK_URL ? { webhookUrl: process.env.ZAPIER_WEBHOOK_URL } : undefined,
            hubspot: (process.env.HUBSPOT_PORTAL_ID && process.env.HUBSPOT_FORM_ID) ? {
                portalId: process.env.HUBSPOT_PORTAL_ID,
                formId: process.env.HUBSPOT_FORM_ID
            } : undefined,
        }
    });

    // 1. Initial State & Logging
    console.log(`[LeadCapture] Processing signup for ${request.email}`);
    const results = { supabase: false, airtable: false, webhook: false };
    let leadId = 'alt_' + Date.now();
    let leadPosition = 0;

    // 2. Delegate to primary service (Supabase)
    try {
        const result = await waitlistService.signup(request as any, headers);
        if (result.success) {
            results.supabase = true;
            leadId = result.data?.id || leadId;
            leadPosition = result.data?.position || 0;
            console.log(`[Supabase] Success: ${leadId}`);
        } else if (result.error && ['RATE_LIMITED', 'INVALID_EMAIL', 'INVALID_POSTAL_CODE', 'PRIVACY_REQUIRED'].includes(result.error.code)) {
            // High-priority validation/security errors
            console.warn(`[Waitlist] Blocked: ${result.error.code}`);
            return {
                response: { success: false, error: result.error },
                status: result.error.code === 'RATE_LIMITED' ? 429 : 400
            };
        }
    } catch (err) {
        console.error('[Supabase] Fatal failure:', err);
    }

    // 3. Fallback/Sync to Airtable (Industry Standard)
    try {
        const airtableSuccess = await AirtableService.createLead({
            email: request.email,
            name: request.name || 'Anonymous',
            phoneNumber: request.phoneNumber || request.phone || 'N/A',
            postalCode: request.postalCode || 'N/A',
            propertyType: request.propertyType || 'residential',
            monthlyHeatingCost: request.monthlyHeatingCost || 0,
            marketingConsent: !!request.marketingConsent,
            source: request.utmSource || request.referralSource || 'Organic'
        });
        results.airtable = airtableSuccess;
        if (airtableSuccess) console.log('[Airtable] Success');
    } catch (err) {
        console.error('[Airtable] Fatal failure:', err);
    }

    // 4. Best Practice Storage: Resend Audience (Free & Secure)
    if (process.env.RESEND_API_KEY && process.env.RESEND_AUDIENCE_ID) {
        try {
            const resendResult = await addResendContact(
                process.env.RESEND_API_KEY,
                process.env.RESEND_AUDIENCE_ID,
                {
                    email: request.email,
                    firstName: request.name?.split(' ')[0] || 'Subscriber',
                    lastName: request.name?.split(' ').slice(1).join(' ') || '',
                }
            );
            results.webhook = resendResult.success; // Reuse result slot for brevity
            if (resendResult.success) console.log('[Resend] Contact stored');
        } catch (err) {
            console.error('[Resend] Fatal failure:', err);
        }
    }

    // 5. Automation Trigger (Webhook for Zapier/Make)
    if (process.env.AUTOMATION_WEBHOOK_URL) {
        try {
            const webhookRes = await fetch(process.env.AUTOMATION_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event: 'waitlist_signup',
                    timestamp: new Date().toISOString(),
                    lead: {
                        id: leadId,
                        email: request.email,
                        name: request.name,
                        phone: request.phoneNumber || request.phone,
                        postalCode: request.postalCode,
                        propertyType: request.propertyType,
                        monthlyHeatingCost: request.monthlyHeatingCost,
                        source: request.utmSource || 'Organic',
                        priority: leadPosition
                    }
                })
            });
            results.webhook = webhookRes.ok;
            if (webhookRes.ok) console.log('[Webhook] Success');
        } catch (err) {
            console.error('[Webhook] Fatal failure:', err);
        }
    }

    // 6. Final Response Decision
    // If ANY system succeeded, we count it as a success for the user
    const overallSuccess = results.supabase || results.airtable || results.webhook;

    if (overallSuccess) {
        return {
            response: {
                success: true,
                data: { id: leadId, position: leadPosition }
            },
            status: 201
        };
    }

    // Comprehensive Failure
    console.error('[LeadCapture] Complete system failure for lead:', request.email);
    return {
        response: {
            success: false,
            error: { code: 'SERVER_ERROR', message: 'The collection service is temporarily unavailable. Please try again soon.' }
        },
        status: 500
    };
}

// ============================================
// ANALYTICS HANDLER
// ============================================

export interface AnalyticsRequest {
    sessionId: string;
    eventType: string;
    eventName: string;
    pageUrl?: string;
    pageTitle?: string;
    referrerUrl?: string;
    eventData?: Record<string, unknown>;
    deviceType?: 'mobile' | 'tablet' | 'desktop';
    screenWidth?: number;
    screenHeight?: number;
    pageLoadTime?: number;
    timeOnPage?: number;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
}

export async function handleAnalyticsEvent(
    request: AnalyticsRequest,
    headers: Record<string, string>
): Promise<{ status: number }> {
    // Rate limit analytics (more lenient)
    const clientIp = getClientIp(headers);
    const rateCheck = checkRateLimit(clientIp, 'analytics', 100, 60000);

    if (!rateCheck.allowed) {
        return { status: 429 };
    }

    const db = getSupabaseClient();
    if (!db) return { status: 204 };

    await db.trackEvent({
        session_id: request.sessionId,
        event_type: sanitizeText(request.eventType, 50),
        event_name: sanitizeText(request.eventName, 100),
        page_url: request.pageUrl?.slice(0, 500),
        page_title: request.pageTitle ? sanitizeText(request.pageTitle, 255) : undefined,
        referrer_url: request.referrerUrl?.slice(0, 500),
        event_data: request.eventData || {},
        device_type: request.deviceType,
        screen_width: request.screenWidth,
        screen_height: request.screenHeight,
        page_load_time: request.pageLoadTime,
        time_on_page: request.timeOnPage,
        utm_source: request.utmSource ? sanitizeText(request.utmSource) : undefined,
        utm_medium: request.utmMedium ? sanitizeText(request.utmMedium) : undefined,
        utm_campaign: request.utmCampaign ? sanitizeText(request.utmCampaign) : undefined,
    });

    return { status: 204 }; // No content
}

// ============================================
// FUNNEL TRACKING HANDLER
// ============================================

export interface FunnelRequest {
    sessionId: string;
    stage: string;
    subscriberId?: string;
    variant?: string;
}

export async function handleFunnelEvent(
    request: FunnelRequest,
    headers: Record<string, string>
): Promise<{ status: number }> {
    const clientIp = getClientIp(headers);
    const rateCheck = checkRateLimit(clientIp, 'funnel', 50, 60000);

    if (!rateCheck.allowed) {
        return { status: 429 };
    }

    const db = getSupabaseClient();
    if (!db) return { status: 204 };

    await db.trackFunnelEvent({
        session_id: request.sessionId,
        subscriber_id: request.subscriberId,
        stage: sanitizeText(request.stage, 50),
        variant: request.variant ? sanitizeText(request.variant, 50) : undefined,
    });

    return { status: 204 };
}

// ============================================
// EMAIL VERIFICATION HANDLER
// ============================================

export async function handleEmailVerification(
    token: string
): Promise<{ response: ApiResponse; status: number }> {
    if (!token || token.length !== 36) { // UUID length
        return {
            response: {
                success: false,
                error: {
                    code: 'INVALID_TOKEN',
                    message: 'Invalid verification link.',
                },
            },
            status: 400,
        };
    }

    const db = getSupabaseClient();
    if (!db) {
        return {
            response: {
                success: false,
                error: { code: 'VERIFICATION_DISABLED', message: 'Verification is currently disabled.' }
            },
            status: 500
        };
    }
    const result = await db.verifySubscriber(token);

    if (result.error || !result.data) {
        return {
            response: {
                success: false,
                error: {
                    code: 'VERIFICATION_FAILED',
                    message: 'Verification link expired or invalid.',
                },
            },
            status: 400,
        };
    }

    return {
        response: {
            success: true,
            data: { verified: true },
        },
        status: 200,
    };
}
