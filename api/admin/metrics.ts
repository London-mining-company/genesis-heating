/**
 * Vercel Serverless Function - Admin Metrics
 * 
 * Self-contained handler for Genesis Command Intelligence.
 * Avoids module resolution issues by inlining logic.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// ============================================
// AIRTABLE ACCESS (INLINED)
// ============================================

async function getAirtableLeads(): Promise<any[]> {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableId = process.env.AIRTABLE_TABLE_NAME || 'tblKtQcafbT4AjKWo';

    if (!apiKey || !baseId) {
        console.error('[Admin] Missing Airtable Credentials');
        return [];
    }

    const url = `https://api.airtable.com/v0/${baseId}/${tableId}?sort[0][field]=Created At&sort[0][direction]=desc`;

    try {
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error('[Admin] Airtable Error:', response.status, errText);
            return [];
        }

        const data = await response.json();
        return data.records || [];
    } catch (error) {
        console.error('[Admin] Connection Error:', error);
        return [];
    }
}

// ============================================
// MAIN HANDLER
// ============================================

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // 1. CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).end();

    try {
        // 2. Security Check
        const token = (req.query.token as string) || req.headers.authorization?.replace('Bearer ', '');
        if (!token || token !== process.env.APP_SECRET) {
            return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid admin token' } });
        }

        // 3. Data Retrieval
        const leads = await getAirtableLeads();

        if (!leads || !Array.isArray(leads)) {
            return res.status(200).json({ success: false, error: { code: 'DATA_ERROR', message: 'No metrics available yet.' } });
        }

        // 4. Intelligence Calculations (The Gold Book Engine)
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const totalLeads = leads.length;

        // Velocity & Growth
        const newLeads7d = leads.filter((l: any) => {
            const createdAt = l.fields?.['Created At'];
            if (!createdAt) return false;
            const d = new Date(createdAt);
            return !isNaN(d.getTime()) && d > sevenDaysAgo;
        }).length;

        // Geographic Density
        const density: Record<string, number> = {};
        leads.forEach((l: any) => {
            const pcVal = l.fields?.['Postal Code'];
            if (!pcVal) return;
            const pc = String(pcVal).substring(0, 3).toUpperCase();
            if (pc.length === 3) density[pc] = (density[pc] || 0) + 1;
        });

        // Property & Sales Logic
        const propertyMix = { residential: 0, business: 0 };
        const attribution: Record<string, number> = {};
        let totalMonthlyCost = 0;

        const topPostalCodes = new Set(['N6G', 'N6A', 'N6H', 'N6B']);
        const scoredLeads = leads.map((l: any) => {
            const fields = l.fields || {};
            const cost = Number(fields['Monthly Heating Cost']) || 0;
            const pcVal = fields['Postal Code'];
            const pc = pcVal ? String(pcVal).substring(0, 3).toUpperCase() : '';

            totalMonthlyCost += cost;
            propertyMix[String(fields['Property Type']).toLowerCase() === 'business' ? 'business' : 'residential']++;

            const sourceStr = String(fields['Source'] || 'Direct');
            const source = (sourceStr.split('|')[1] || sourceStr.split('|')[0] || 'Direct').toLowerCase();
            attribution[source] = (attribution[source] || 0) + 1;

            let score = 0;
            if (cost > 250) score += 5; else if (cost > 150) score += 3;
            if (pc && topPostalCodes.has(pc)) score += 5;
            return { cost, score };
        });

        const highValueLeads = scoredLeads.filter(l => l.score >= 8).length;
        const estimatedMRR = totalMonthlyCost * 0.8;

        // Growth Trend (14 Day Window)
        const dailyTrend: Record<string, number> = {};
        for (let i = 0; i < 14; i++) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            dailyTrend[d.toISOString().split('T')[0]] = 0;
        }
        leads.forEach((l: any) => {
            const createdAt = l.fields?.['Created At'];
            if (createdAt) {
                const date = String(createdAt).split('T')[0];
                if (dailyTrend[date] !== undefined) dailyTrend[date]++;
            }
        });

        // ROI Projections
        const projectedLTV = (estimatedMRR / (totalLeads || 1)) * 36;
        const projectedCAC = 15;

        // 5. Final Intelligence Payload
        return res.status(200).json({
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
                    pathAnalysis: {
                        ownerPotential: scoredLeads.filter(l => l.cost >= 300).length,
                        builderPotential: scoredLeads.filter(l => l.cost < 300).length
                    },
                    financialPotential: {
                        totalStatedCost: totalMonthlyCost,
                        estimatedMRR,
                        portfolioYield36: estimatedMRR * 36,
                        avgLeadValue: totalLeads > 0 ? estimatedMRR / totalLeads : 0,
                        cacLtvRatio: (projectedLTV / projectedCAC).toFixed(1)
                    }
                },
                lastSync: now.toISOString()
            }
        });

    } catch (error: any) {
        console.error('[Admin] Server Error:', error);
        return res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: error.message || 'Internal server error' }
        });
    }
}
