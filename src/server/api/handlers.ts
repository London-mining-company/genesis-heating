/**
 * API Handlers for Waitlist Proxy
 * 
 * BULLETPROOF VERSION - No external dependencies
 * Just validate and forward to Zapier.
 */

export interface WaitlistError {
    code: string;
    message: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: WaitlistError;
}

export interface WaitlistRequest {
    full_name: string;
    email: string;
    phone?: string;
    postal_code?: string;
    property_type?: 'home' | 'business';
    monthly_heating_cost?: number;
    consent?: 'yes' | 'no';
    [key: string]: any;
}

// Simple email validation
function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Disposable email domains (inline for zero dependencies)
const DISPOSABLE_DOMAINS = new Set([
    '10minutemail.com', 'tempmail.com', 'guerrillamail.com', 'mailinator.com',
    'throwaway.email', 'temp-mail.org', 'fakeinbox.com', 'trashmail.com',
    'getnada.com', 'maildrop.cc', 'yopmail.com', 'tempail.com'
]);

function isDisposableEmail(email: string): boolean {
    const domain = email.split('@')[1]?.toLowerCase();
    return domain ? DISPOSABLE_DOMAINS.has(domain) : false;
}

/**
 * Process a waitlist signup - SIMPLE AND BULLETPROOF
 */
export async function handleWaitlistSignup(
    request: WaitlistRequest,
    _headers: Record<string, string>
): Promise<{ response: ApiResponse<{ id: string }>; status: number }> {

    // 1. Basic validation
    if (!request.email || !isValidEmail(request.email)) {
        return {
            response: { success: false, error: { code: 'INVALID_EMAIL', message: 'Please enter a valid email.' } },
            status: 400
        };
    }

    if (isDisposableEmail(request.email)) {
        return {
            response: { success: false, error: { code: 'DISPOSABLE_EMAIL', message: 'Please use a permanent email.' } },
            status: 400
        };
    }

    // 2. Forward to Zapier
    const webhookUrl = process.env.AUTOMATION_WEBHOOK_URL || process.env.ZAPIER_WEBHOOK_URL;

    if (!webhookUrl) {
        console.warn('[Proxy] No webhook URL configured - lead not forwarded');
        // Still return success to user
        return {
            response: { success: true, data: { id: 'offline' } },
            status: 200
        };
    }

    try {
        const payload = {
            event: 'waitlist_signup',
            timestamp: new Date().toISOString(),
            full_name: request.full_name || '',
            email: request.email,
            phone: request.phone || '',
            postal_code: request.postal_code || '',
            property_type: request.property_type || 'home',
            monthly_heating_cost: request.monthly_heating_cost || 0,
            consent: request.consent || 'no',
            utm_source: request.utm_source || '',
            utm_medium: request.utm_medium || '',
            utm_campaign: request.utm_campaign || '',
            referrer: request.referrer || '',
            source: request.source || 'genesis_uplink_v9'
        };

        const res = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            console.error(`[Proxy] Zapier returned ${res.status}`);
        }

        return {
            response: { success: true, data: { id: request.email } },
            status: 200
        };
    } catch (err) {
        console.error('[Proxy] Webhook error:', err);
        // Fail gracefully - don't let webhook issues block user
        return {
            response: { success: true, data: { id: 'queued' } },
            status: 200
        };
    }
}
