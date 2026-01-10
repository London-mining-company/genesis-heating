/**
 * Vercel Serverless Function - Analytics Events
 * 
 * Deploy to: /api/analytics
 * 
 * Privacy-first analytics collection
 * - No cookies required
 * - Minimal data collection
 * - GDPR/PIPEDA compliant
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleAnalyticsEvent, AnalyticsRequest } from '../src/server/api/handlers'
import { getSecurityHeaders } from '../src/server/security/middleware'

// Node.js runtime

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Set security headers
    const securityHeaders = getSecurityHeaders()
    Object.entries(securityHeaders).forEach(([key, value]) => {
        res.setHeader(key, value)
    })

    // CORS
    res.setHeader('Access-Control-Allow-Origin', process.env.VITE_APP_URL || '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }

    if (req.method !== 'POST') {
        return res.status(405).end()
    }

    try {
        const body = req.body as AnalyticsRequest
        const headers = Object.fromEntries(
            Object.entries(req.headers).map(([k, v]) => [k, String(v)])
        )

        const { status } = await handleAnalyticsEvent(body, headers)
        return res.status(status).end()
    } catch (error) {
        console.error('Analytics error:', error)
        return res.status(500).end()
    }
}
