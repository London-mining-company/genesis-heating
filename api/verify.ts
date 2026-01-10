/**
 * Vercel Serverless Function - Email Verification
 * 
 * Deploy to: /api/verify
 * 
 * Handles email verification from magic link
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleEmailVerification } from '../src/server/api/handlers'

// Node.js runtime

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).end()
    }

    const token = req.query.token as string

    if (!token) {
        return res.redirect(302, '/?error=missing_token')
    }

    try {
        const { response, status } = await handleEmailVerification(token)

        if (response.success) {
            // Redirect to success page
            return res.redirect(302, '/?verified=true')
        } else {
            // Redirect with error
            return res.redirect(302, `/?error=${response.error?.code.toLowerCase()}`)
        }
    } catch (error) {
        console.error('Verification error:', error)
        return res.redirect(302, '/?error=server_error')
    }
}
