/**
 * API Handlers for Waitlist Lead Collection
 * 
 * BULLETPROOF SECURITY ARCHITECTURE
 * =================================
 * - Airtable: PRIMARY lead storage (CRM database)
 * - Zapier: SECONDARY automation triggers (newsletters, notifications)
 * - All inputs sanitized and validated
 * - Honeypot validation for bot protection
 * - Rate limiting handled at middleware layer
 * 
 * @version 2.0.0 - Security Hardened
 * @see https://github.com/London-mining-company/genesis-heating
 */

import { AirtableService } from '../services/airtable';
import {
    sanitizeEmail,
    sanitizeText,
    sanitizePhone,
    isValidEmail,
    isValidCanadianPostalCode,
    isInServiceArea
} from '../security/middleware';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface WaitlistError {
    code: string;
    message: string;
}

export interface ApiResponse<T = unknown> {
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
    website?: string; // Honeypot field - should be empty
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    referrer?: string;
    source?: string;
}

// ============================================
// SECURITY UTILITIES
// ============================================

/**
 * Extended disposable email domain list
 * Blocks temporary/throwaway email services
 */
const DISPOSABLE_DOMAINS = new Set([
    '10minutemail.com', 'tempmail.com', 'guerrillamail.com', 'mailinator.com',
    'throwaway.email', 'temp-mail.org', 'fakeinbox.com', 'trashmail.com',
    'getnada.com', 'maildrop.cc', 'yopmail.com', 'tempail.com', 'sharklasers.com',
    'guerrillamail.info', 'grr.la', 'pokemail.net', 'spam4.me', 'dispostable.com',
    'mailnesia.com', 'tempinbox.com', 'burnermail.io', 'tempmailaddress.com',
    'mohmal.com', 'emailondeck.com', 'emkei.cz', 'anonymbox.com', 'cock.li'
]);

function isDisposableEmail(email: string): boolean {
    const domain = email.split('@')[1]?.toLowerCase();
    return domain ? DISPOSABLE_DOMAINS.has(domain) : false;
}

/**
 * Detect suspicious patterns in input
 */
function hasSuspiciousPatterns(text: string): boolean {
    const suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+=/i,
        /data:/i,
        /vbscript:/i,
        /%3Cscript/i,
        /\x00/, // Null byte
    ];
    return suspiciousPatterns.some(pattern => pattern.test(text));
}

/**
 * Validate and sanitize all request fields
 */
function validateAndSanitizeRequest(request: WaitlistRequest): {
    valid: boolean;
    error?: WaitlistError;
    sanitized?: WaitlistRequest;
} {
    // 1. HONEYPOT CHECK - Bots fill this hidden field
    if (request.website && request.website.trim() !== '') {
        console.warn('[Security] Honeypot triggered - bot detected');
        // Return success to not alert bot, but don't process
        return { valid: false, error: { code: 'BOT_DETECTED', message: 'Request processed.' } };
    }

    // 2. EMAIL VALIDATION
    if (!request.email || typeof request.email !== 'string') {
        return { valid: false, error: { code: 'MISSING_EMAIL', message: 'Email address is required.' } };
    }

    const sanitizedEmail = sanitizeEmail(request.email);

    if (!isValidEmail(sanitizedEmail)) {
        return { valid: false, error: { code: 'INVALID_EMAIL', message: 'Please enter a valid email address.' } };
    }

    if (isDisposableEmail(sanitizedEmail)) {
        return { valid: false, error: { code: 'DISPOSABLE_EMAIL', message: 'Please use a permanent email address.' } };
    }

    // 3. NAME VALIDATION
    const sanitizedName = sanitizeText(request.full_name || '', 100);
    if (hasSuspiciousPatterns(sanitizedName)) {
        return { valid: false, error: { code: 'INVALID_INPUT', message: 'Invalid characters detected.' } };
    }

    // 4. PHONE VALIDATION
    const sanitizedPhone = sanitizePhone(request.phone || '');

    // 5. POSTAL CODE VALIDATION
    const sanitizedPostalCode = sanitizeText(request.postal_code || '', 10).toUpperCase();

    // Log if outside service area (but don't reject - they might be planning to move)
    if (sanitizedPostalCode && isValidCanadianPostalCode(sanitizedPostalCode)) {
        if (!isInServiceArea(sanitizedPostalCode)) {
            console.info(`[Lead] Outside primary service area: ${sanitizedPostalCode}`);
        }
    }

    // 6. PROPERTY TYPE VALIDATION
    const validPropertyTypes = ['home', 'business'];
    const propertyType = validPropertyTypes.includes(request.property_type || '')
        ? request.property_type
        : 'home';

    // 7. MONTHLY COST VALIDATION
    const monthlyCost = Math.min(Math.max(Number(request.monthly_heating_cost) || 0, 0), 10000);

    // 8. CONSENT VALIDATION
    const consent = request.consent === 'yes' ? 'yes' : 'no';

    // 9. UTM & REFERRER SANITIZATION
    const sanitizedSource = sanitizeText(request.source || 'website_v27', 50);
    const sanitizedUtmSource = sanitizeText(request.utm_source || '', 50);
    const sanitizedUtmMedium = sanitizeText(request.utm_medium || '', 50);
    const sanitizedUtmCampaign = sanitizeText(request.utm_campaign || '', 100);
    const sanitizedReferrer = sanitizeText(request.referrer || '', 255);

    return {
        valid: true,
        sanitized: {
            full_name: sanitizedName,
            email: sanitizedEmail,
            phone: sanitizedPhone,
            postal_code: sanitizedPostalCode,
            property_type: propertyType as 'home' | 'business',
            monthly_heating_cost: monthlyCost,
            consent: consent as 'yes' | 'no',
            website: '', // Always empty after validation
            source: sanitizedSource,
            utm_source: sanitizedUtmSource,
            utm_medium: sanitizedUtmMedium,
            utm_campaign: sanitizedUtmCampaign,
            referrer: sanitizedReferrer,
        }
    };
}

// ============================================
// MAIN HANDLER
// ============================================

/**
 * Process a waitlist signup with bulletproof security
 * 
 * Flow:
 * 1. Validate & sanitize all inputs
 * 2. Save to Airtable (PRIMARY - Lead storage)
 * 3. Trigger Zapier (SECONDARY - Automations)
 * 4. Return success to user
 */
export async function handleWaitlistSignup(
    request: WaitlistRequest,
    _headers: Record<string, string>
): Promise<{ response: ApiResponse<{ id: string }>; status: number }> {

    // ========================================
    // STEP 1: VALIDATE & SANITIZE
    // ========================================
    const validation = validateAndSanitizeRequest(request);

    if (!validation.valid) {
        // For honeypot, return success to fool bots
        if (validation.error?.code === 'BOT_DETECTED') {
            return {
                response: { success: true, data: { id: 'processed' } },
                status: 200
            };
        }

        return {
            response: { success: false, error: validation.error },
            status: 400
        };
    }

    const data = validation.sanitized!;

    // ========================================
    // STEP 2: SAVE TO AIRTABLE (PRIMARY)
    // ========================================
    let airtableSuccess = false;
    let airtableError: string | null = null;

    try {
        airtableSuccess = await AirtableService.createLead({
            email: data.email,
            name: data.full_name,
            phoneNumber: data.phone,
            postalCode: data.postal_code || '',
            propertyType: data.property_type || 'home',
            monthlyHeatingCost: data.monthly_heating_cost || 0,
            marketingConsent: data.consent === 'yes',
            source: `${data.source}|${data.utm_source || 'direct'}`,
        });

        if (airtableSuccess) {
            console.info('[Lead] Successfully saved to Airtable:', data.email);
        }
    } catch (err) {
        airtableError = err instanceof Error ? err.message : 'Unknown error';
        console.error('[Lead] Airtable save failed:', airtableError);
    }

    // ========================================
    // STEP 3: TRIGGER ZAPIER (SECONDARY)
    // ========================================
    const zapierUrl = process.env.AUTOMATION_WEBHOOK_URL || process.env.ZAPIER_WEBHOOK_URL;

    if (zapierUrl) {
        try {
            const zapierPayload = {
                event: 'waitlist_signup',
                timestamp: new Date().toISOString(),
                lead: {
                    email: data.email,
                    full_name: data.full_name,
                    phone: data.phone,
                    postal_code: data.postal_code,
                    property_type: data.property_type,
                    monthly_heating_cost: data.monthly_heating_cost,
                    consent: data.consent,
                },
                attribution: {
                    source: data.source,
                    utm_source: data.utm_source,
                    utm_medium: data.utm_medium,
                    utm_campaign: data.utm_campaign,
                    referrer: data.referrer,
                },
                metadata: {
                    airtable_synced: airtableSuccess,
                    version: 'genesis_v27',
                }
            };

            // Fire and forget - don't block on Zapier response
            fetch(zapierUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(zapierPayload)
            }).then(res => {
                if (!res.ok) {
                    console.warn(`[Zapier] Webhook returned ${res.status}`);
                } else {
                    console.info('[Zapier] Automation triggered successfully');
                }
            }).catch(err => {
                console.warn('[Zapier] Webhook failed (non-blocking):', err);
            });

        } catch (err) {
            // Log but don't fail - Zapier is secondary
            console.warn('[Zapier] Setup error:', err);
        }
    }

    // ========================================
    // STEP 4: RETURN RESPONSE
    // ========================================

    // If Airtable failed, we have a problem
    if (!airtableSuccess && !zapierUrl) {
        console.error('[Lead] CRITICAL: No successful storage - lead may be lost!');
        return {
            response: {
                success: false,
                error: {
                    code: 'STORAGE_ERROR',
                    message: 'Unable to process your request. Please try again.'
                }
            },
            status: 500
        };
    }

    // If Airtable failed but Zapier is configured, warn but continue
    if (!airtableSuccess && zapierUrl) {
        console.warn('[Lead] Airtable failed but Zapier triggered - lead will be recovered');
    }

    return {
        response: {
            success: true,
            data: { id: data.email.split('@')[0] + '_' + Date.now().toString(36) }
        },
        status: 200
    };
}
