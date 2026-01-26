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

/**
 * Handle Admin Dashboard Metrics
 * Securely aggregates data from Airtable for insights
 */
export async function handleAdminMetrics(token: string): Promise<{ response: ApiResponse<any>; status: number }> {
    // 1. SECURITY: Simple token check against APP_SECRET
    // In a real app, this would be a JWT or OAuth session
    if (!token || token !== process.env.APP_SECRET) {
        return { response: { success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid admin token' } }, status: 401 };
    }

    try {
        const leads = await AirtableService.getLeads();

        // 2. DEFENSIVE CHECK: Handle empty results safely
        if (!leads || !Array.isArray(leads)) {
            return { response: { success: false, error: { code: 'DATA_ERROR', message: 'No metrics available yet.' } }, status: 200 };
        }

        // Compute Metrics
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const totalLeads = leads.length;

        // Safely filter for new leads
        const newLeads7d = leads.filter((l: any) => {
            const createdAt = l.fields?.['Created At'];
            if (!createdAt) return false;
            const d = new Date(createdAt);
            return !isNaN(d.getTime()) && d > sevenDaysAgo;
        }).length;

        // Geographic Density (Postal Code Prefix)
        const density: Record<string, number> = {};
        leads.forEach((l: any) => {
            const pcArr = l.fields?.['Postal Code'];
            if (!pcArr) return;
            const pc = String(pcArr).substring(0, 3).toUpperCase();
            if (pc && pc.length === 3) {
                density[pc] = (density[pc] || 0) + 1;
            }
        });

        // Property Mix
        const propertyMix = { residential: 0, business: 0 };
        leads.forEach((l: any) => {
            const typeValue = l.fields?.['Property Type'];
            const type = String(typeValue || '').toLowerCase() === 'business' ? 'business' : 'residential';
            propertyMix[type]++;
        });

        // Marketing Attribution
        const attribution: Record<string, number> = {};
        leads.forEach((l: any) => {
            const sourceStr = String(l.fields?.['Source'] || 'Direct');
            const s = sourceStr.split('|')[1] || sourceStr.split('|')[0] || 'Direct';
            const normalized = s.toLowerCase();
            attribution[normalized] = (attribution[normalized] || 0) + 1;
        });

        // Potential MRR
        const totalMonthlyCost = leads.reduce((sum: number, l: any) => {
            const cost = Number(l.fields?.['Monthly Heating Cost']) || 0;
            return sum + cost;
        }, 0);
        const estimatedMRR = totalMonthlyCost * 0.8;

        // --- BUSINESS INTELLIGENCE (GOLD BOOK v1.1) ---

        // 1. Lead Scoring (A-Class Leads)
        const topPostalCodes = new Set(['N6G', 'N6A', 'N6H', 'N6B']);
        const scoredLeads = leads.map((l: any) => {
            let score = 0;
            const fields = l.fields || {};
            const cost = Number(fields['Monthly Heating Cost']) || 0;
            const pcVal = fields['Postal Code'];
            const pc = pcVal ? String(pcVal).substring(0, 3).toUpperCase() : '';

            if (cost > 250) score += 5;
            else if (cost > 150) score += 3;

            if (pc && topPostalCodes.has(pc)) score += 5;

            return { id: l.id, score, cost, pc };
        });

        const highValueLeads = scoredLeads.filter(l => l.score >= 8).length;

        // 2. Growth Trend (Last 14 days)
        const dailyTrend: Record<string, number> = {};
        for (let i = 0; i < 14; i++) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            dailyTrend[d.toISOString().split('T')[0]] = 0;
        }

        leads.forEach((l: any) => {
            const createdAt = l.fields?.['Created At'];
            if (!createdAt) return;

            // Handle ISO strings correctly
            const date = String(createdAt).split('T')[0];
            if (dailyTrend[date] !== undefined) {
                dailyTrend[date]++;
            }
        });

        // 3. Gold Book Path Analysis
        const pathAnalysis = {
            ownerPotential: scoredLeads.filter(l => l.cost >= 300).length,
            builderPotential: scoredLeads.filter(l => l.cost < 300).length
        };

        // 4. Financial Modeling
        const portfolioYield36 = estimatedMRR * 36;
        const projectedCAC = 15;
        const projectedLTV = (estimatedMRR / (totalLeads || 1)) * 36;

        return {
            response: {
                success: true,
                data: {
                    overview: {
                        totalLeads,
                        newLeads7d,
                        highValueLeads,
                        growthRate: totalLeads > 0 ? (newLeads7d / (totalLeads - newLeads7d || 1)) * 100 : 0
                    },
                    trends: {
                        daily: Object.entries(dailyTrend).sort(),
                    },
                    insights: {
                        geographicDensity: Object.entries(density).sort((a, b) => b[1] - a[1]).slice(0, 10),
                        propertyMix,
                        attribution,
                        pathAnalysis,
                        financialPotential: {
                            totalStatedCost: totalMonthlyCost,
                            estimatedMRR,
                            portfolioYield36,
                            avgLeadValue: totalLeads > 0 ? estimatedMRR / totalLeads : 0,
                            cacLtvRatio: (projectedLTV / (projectedCAC || 1)).toFixed(1)
                        }
                    },
                    lastSync: now.toISOString()
                }
            },
            status: 200
        };
    } catch (error: any) {
        console.error('[Admin] Metrics error:', error);
        return {
            response: {
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message || 'Failed to aggregate metrics'
                }
            },
            status: 500
        };
    }
}
