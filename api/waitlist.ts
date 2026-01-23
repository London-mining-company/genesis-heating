/**
 * Vercel Serverless Function - Waitlist Signup
 * 
 * Self-contained handler with inline dependencies for Vercel deployment.
 * Deploy to: /api/waitlist
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// ============================================
// INLINE UTILITIES (No external imports)
// ============================================

function sanitizeEmail(email: string): string {
    return email.toLowerCase().trim().replace(/[<>'"]/g, '').slice(0, 255);
}

function sanitizeText(input: string, maxLength = 100): string {
    return input.trim().replace(/<[^>]*>/g, '').replace(/[<>'"\\]/g, '').slice(0, maxLength);
}

function sanitizePhone(phone: string): string {
    return phone.replace(/[^\d+\-() ]/g, '').slice(0, 20);
}

function isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) && email.length <= 255;
}

const DISPOSABLE_DOMAINS = new Set([
    '10minutemail.com', 'tempmail.com', 'guerrillamail.com', 'mailinator.com',
    'throwaway.email', 'temp-mail.org', 'fakeinbox.com', 'trashmail.com',
    'getnada.com', 'maildrop.cc', 'yopmail.com', 'tempail.com', 'sharklasers.com'
]);

function isDisposableEmail(email: string): boolean {
    const domain = email.split('@')[1]?.toLowerCase();
    return domain ? DISPOSABLE_DOMAINS.has(domain) : false;
}

// ============================================
// AIRTABLE SERVICE (INLINE)
// ============================================

interface AirtableLead {
    email: string;
    name: string;
    phoneNumber?: string;
    postalCode: string;
    propertyType: string;
    monthlyHeatingCost: number;
    marketingConsent: boolean;
    source?: string;
}

async function createAirtableLead(lead: AirtableLead): Promise<boolean> {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    // Use table ID (more reliable than name) - fallback to user's actual table ID
    const tableId = process.env.AIRTABLE_TABLE_NAME || 'tblKtQcafbT4AjKWo';

    // Enhanced debug logging
    console.log('[Airtable] === DEBUG START ===');
    console.log('[Airtable] API_KEY exists:', !!apiKey, '| Length:', apiKey?.length || 0, '| Prefix:', apiKey?.substring(0, 10) || 'MISSING');
    console.log('[Airtable] BASE_ID:', baseId || 'MISSING');
    console.log('[Airtable] TABLE_ID:', tableId);

    if (!apiKey || !baseId) {
        console.error('[Airtable] CRITICAL: Missing API_KEY or BASE_ID environment variables');
        return false;
    }

    // Use table ID directly (not URL encoded since IDs are already URL-safe)
    const url = `https://api.airtable.com/v0/${baseId}/${tableId}`;
    console.log('[Airtable] Request URL:', url);


    // Map property type: frontend sends 'home'/'business', Airtable expects 'residential'/'commercial'
    const propertyTypeMap: Record<string, string> = { 'home': 'residential', 'business': 'commercial' };
    const mappedPropertyType = propertyTypeMap[lead.propertyType] || lead.propertyType || 'residential';

    // Use the official "Records Collection" wrap format
    const payload = {
        records: [
            {
                fields: {
                    'Email': lead.email,
                    'Full Name': lead.name || 'Anonymous',
                    'Phone': lead.phoneNumber || '',
                    'Postal Code': lead.postalCode || '',
                    'Property Type': mappedPropertyType,
                    'Monthly Heating Cost': lead.monthlyHeatingCost || 0,
                    'Marketing Consent': lead.marketingConsent ? 'Yes' : 'No', // Use strings for better typecast compatibility
                    'Source': lead.source || 'Website',
                    'Created At': new Date().toLocaleString('en-CA', {
                        timeZone: 'America/Toronto',
                        hour12: false,
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    }).replace(/,/g, '')
                }
            }
        ],
        typecast: true
    };


    console.log('[Airtable] Payload (Official Collection Wrap):', JSON.stringify(payload, null, 2));
    console.log('[Airtable] Attempting to create lead:', lead.email);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        const responseText = await response.text();
        if (!response.ok) {
            console.error(`[Airtable] API Error ${response.status}: ${responseText}`);
            return false;
        }

        console.info('[Airtable] Lead synced successfully. Response:', responseText);
        return true;
    } catch (error) {
        console.error('[Airtable] Network error:', error);
        return false;
    }
}

// ============================================
// MAIN HANDLER
// ============================================

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' } });
    }

    try {
        let body = req.body;

        // Safety: Parse string body if it hasn't been parsed by middleware
        if (typeof body === 'string') {
            try {
                body = JSON.parse(body);
            } catch (e) {
                console.error('[API] Failed to parse string body:', body);
            }
        }

        if (!body || typeof body !== 'object') {
            body = {};
        }

        // Honeypot check
        if (body.website && body.website.trim() !== '') {
            return res.status(200).json({ success: true, data: { id: 'processed' } });
        }

        // Validate email
        const email = sanitizeEmail(body.email || '');
        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ success: false, error: { code: 'INVALID_EMAIL', message: 'Please enter a valid email address.' } });
        }
        if (isDisposableEmail(email)) {
            return res.status(400).json({ success: false, error: { code: 'DISPOSABLE_EMAIL', message: 'Please use a permanent email address.' } });
        }

        // Sanitize other fields
        const name = sanitizeText(body.full_name || body.name || '', 100);
        const phone = sanitizePhone(body.phone || body.phoneNumber || '');
        const postalCode = sanitizeText(body.postal_code || body.postalCode || '', 10).toUpperCase();
        const propertyType = ['home', 'business'].includes(body.property_type) ? body.property_type : 'home';
        const monthlyCost = Math.min(Math.max(Number(body.monthly_heating_cost) || 0, 0), 10000);
        const consent = body.consent === 'yes' || body.marketingConsent === true;

        // Save to Airtable
        const airtableSuccess = await createAirtableLead({
            email,
            name,
            phoneNumber: phone,
            postalCode,
            propertyType,
            monthlyHeatingCost: monthlyCost,
            marketingConsent: consent,
            source: body.source || 'website_v10'
        });

        // Trigger Zapier (fire and forget)
        const zapierUrl = process.env.AUTOMATION_WEBHOOK_URL || process.env.ZAPIER_WEBHOOK_URL;
        if (zapierUrl) {
            fetch(zapierUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event: 'waitlist_signup',
                    timestamp: new Date().toISOString(),
                    lead: { email, name, phone, postalCode, propertyType, monthlyCost, consent }
                })
            }).catch(err => console.warn('[Zapier] Webhook failed:', err));
        }

        // Return result
        if (!airtableSuccess && !zapierUrl) {
            return res.status(500).json({ success: false, error: { code: 'STORAGE_ERROR', message: 'Unable to process request. Please try again.' } });
        }

        return res.status(200).json({ success: true, data: { id: email.split('@')[0] + '_' + Date.now().toString(36) } });

    } catch (error) {
        console.error('Waitlist error:', error);
        return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
    }
}
