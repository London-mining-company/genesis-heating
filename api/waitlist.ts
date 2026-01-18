/**
 * Vercel Serverless Function - Waitlist Signup
 * 
 * Deploy to: /api/waitlist
 * 
 * Handles:
 * - Rate limiting
 * - CSRF validation
 * - Input validation
 * - Database insertion
 * - Email verification trigger
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import crypto from 'node:crypto'
import { handleWaitlistSignup, WaitlistRequest } from '../src/server/api/handlers'
import { getSecurityHeaders, generateCsrfToken } from '../src/server/security/middleware'

// Use default Node.js runtime for compatibility

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Set security headers
    const securityHeaders = getSecurityHeaders()
    Object.entries(securityHeaders).forEach(([key, value]) => {
        res.setHeader(key, value)
    })

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', process.env.VITE_APP_URL || '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-Token')

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }

    // Handle CSRF Token Request
    if (req.method === 'GET') {
        return getCsrfToken(req, res)
    }

    // Only accept POST for signup
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' },
        })
    }

    try {
        const body = req.body as WaitlistRequest
        const headers = Object.fromEntries(
            Object.entries(req.headers).map(([k, v]) => [k, String(v)])
        )

        const { response, status } = await handleWaitlistSignup(body, headers)
        return res.status(status).json(response)
    } catch (error) {
        console.error('Waitlist signup error:', error)
        return res.status(500).json({
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: error instanceof Error ? error.message : 'Internal server error',
                stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
            },
        })
    }
}

// GET handler for CSRF token
export async function getCsrfToken(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).end()
    }

    const sessionId = req.cookies['sh_sid'] || crypto.randomUUID()
    const token = generateCsrfToken(sessionId)

    res.setHeader('Set-Cookie', `sh_sid=${sessionId}; HttpOnly; Secure; SameSite=Strict; Path=/`)
    return res.status(200).json({ token })
}
