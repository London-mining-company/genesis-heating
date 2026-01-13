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

// ============================================
// TYPES
// ============================================

export interface WaitlistRequest {
    email: string;
    name?: string;
    phone?: string;
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
        baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://genesisheatingsolutions.com',
        enableSecurityChecks: process.env.NODE_ENV === 'production',
        email: process.env.RESEND_API_KEY ? {
            provider: 'resend',
            apiKey: process.env.RESEND_API_KEY,
            fromEmail: 'hello@genesisheatingsolutions.com',
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

    // Delegate to service layer
    const result = await waitlistService.signup(request as any, headers);

    if (!result.success && result.error) {
        // Map service errors to standard API response codes
        let status = 400;
        if (result.error.code === 'RATE_LIMITED') status = 429;
        if (result.error.code === 'SERVER_ERROR') status = 500;
        if (result.error.code === 'VERIFICATION_REQUIRED') status = 403;

        return {
            response: {
                success: false,
                error: result.error
            },
            status
        };
    }

    // Async sync to Airtable (non-blocking for the user response)
    AirtableService.createLead({
        email: request.email,
        name: request.name || 'Anonymous',
        postalCode: request.postalCode || 'N/A',
        propertyType: request.propertyType || 'residential',
        monthlyHeatingCost: request.monthlyHeatingCost || 0,
        marketingConsent: !!request.marketingConsent,
        source: request.utmSource || 'Organic'
    }).catch(err => console.error('[Airtable] Background sync failed:', err));

    // Success response
    return {
        response: {
            success: true,
            data: result.data ? {
                id: result.data.id,
                position: result.data.position
            } : undefined
        },
        status: 201
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
