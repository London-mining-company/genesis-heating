/**
 * Airtable Service for Genesis Heating
 * 
 * Securely pushes waitlist leads to Airtable CRM.
 * Uses native fetch to minimize bundle size.
 */

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

interface AirtableErrorResponse {
    error?: {
        type: string;
        message: string;
    };
}

export class AirtableService {
    private static get apiKey(): string | undefined {
        return process.env.AIRTABLE_API_KEY;
    }

    private static get baseId(): string | undefined {
        return process.env.AIRTABLE_BASE_ID;
    }

    private static get tableName(): string {
        return process.env.AIRTABLE_TABLE_NAME || 'Leads';
    }

    /**
     * Creates a new lead record in Airtable
     */
    static async createLead(lead: AirtableLead): Promise<boolean> {
        // Validate configuration
        if (!this.apiKey) {
            console.error('[Airtable] AIRTABLE_API_KEY is not set');
            return false;
        }
        if (!this.baseId) {
            console.error('[Airtable] AIRTABLE_BASE_ID is not set');
            return false;
        }

        const url = `https://api.airtable.com/v0/${this.baseId}/${encodeURIComponent(this.tableName)}`;

        // Build the payload with exact field names from user's Airtable
        const payload = {
            records: [
                {
                    fields: {
                        'Email': lead.email,
                        'Full Name': lead.name || 'Anonymous',
                        'Phone': lead.phoneNumber || '',
                        'Postal Code': lead.postalCode || '',
                        'Property Type': lead.propertyType || 'residential',
                        'Monthly Heating Cost': lead.monthlyHeatingCost || 0,
                        'Marketing Consent': lead.marketingConsent ? 'Yes' : 'No',
                        'Source': lead.source || 'Website',
                        'Created At': new Date().toISOString(),
                    }
                }
            ]
        };

        console.log('[Airtable] Sending lead:', JSON.stringify({ email: lead.email, name: lead.name }));

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorBody = await response.text();
                console.error(`[Airtable] API Error ${response.status}: ${errorBody}`);
                console.error(`[Airtable] Request URL: ${url}`);
                console.error(`[Airtable] Request payload fields: ${Object.keys(payload.records[0].fields).join(', ')}`);

                // Try to parse error for more detail
                try {
                    const parsed = JSON.parse(errorBody) as AirtableErrorResponse;
                    if (parsed.error) {
                        console.error(`[Airtable] Error type: ${parsed.error.type}, Message: ${parsed.error.message}`);
                        // Common error: UNKNOWN_FIELD_NAME means field name mismatch
                        if (parsed.error.type === 'UNKNOWN_FIELD_NAME') {
                            console.error('[Airtable] FIELD NAME MISMATCH - Check Airtable column names match exactly');
                        }
                    }
                } catch {
                    // Not JSON, already logged raw body
                }
                return false;
            }

            const result = await response.json();
            console.info('[Airtable] Lead successfully synced:', result.records?.[0]?.id || 'unknown');
            return true;
        } catch (error) {
            console.error('[Airtable] Network/fetch error:', error);
            return false;
        }
    }

    /**
     * Fetches all leads from Airtable
     */
    static async getLeads(): Promise<any[]> {
        if (!this.apiKey || !this.baseId) return [];

        const url = `https://api.airtable.com/v0/${this.baseId}/${encodeURIComponent(this.tableName)}?sort[0][field]=Created At&sort[0][direction]=desc`;

        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                }
            });

            if (!response.ok) return [];

            const data = await response.json();
            return data.records || [];
        } catch (error) {
            console.error('[Airtable] Fetch error:', error);
            return [];
        }
    }
}
