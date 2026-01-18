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

export class AirtableService {
    private static apiKey = process.env.AIRTABLE_API_KEY;
    private static baseId = process.env.AIRTABLE_BASE_ID;
    private static tableName = process.env.AIRTABLE_TABLE_NAME || 'Leads';

    /**
     * Creates a new lead record in Airtable
     */
    static async createLead(lead: AirtableLead): Promise<boolean> {
        if (!this.apiKey || !this.baseId) {
            console.error('[Airtable] Missing API Key or Base ID');
            return false;
        }

        const url = `https://api.airtable.com/v0/${this.baseId}/${encodeURIComponent(this.tableName)}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    records: [
                        {
                            fields: {
                                'Phone': lead.phoneNumber || 'N/A',
                                'Full Name': lead.name,
                                'Email': lead.email,
                                'Postal Code': lead.postalCode,
                                'Property Type': lead.propertyType,
                                'Monthly Heating Cost': lead.monthlyHeatingCost,
                                'Marketing Consent': lead.marketingConsent ? 'Yes' : 'No',
                                'Source': lead.source || 'Website',
                                'Created At': (() => {
                                    const now = new Date();
                                    const time = now.toLocaleTimeString('en-GB', { timeZone: 'America/Toronto', hour: '2-digit', minute: '2-digit', hour12: false });
                                    const date = now.toLocaleDateString('en-GB', { timeZone: 'America/Toronto', day: '2-digit', month: '2-digit' });
                                    return `${time} ${date}`;
                                })()
                            }
                        }
                    ]
                })
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('[Airtable] Error creating record:', error);
                return false;
            }

            console.info('[Airtable] Lead successfully synced');
            return true;
        } catch (error) {
            console.error('[Airtable] Network error:', error);
            return false;
        }
    }
}
