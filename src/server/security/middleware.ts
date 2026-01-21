/**
 * Security Middleware & Utilities
 * 
 * Provides:
 * - CSRF token generation/validation
 * - Input sanitization
 * - Rate limiting
 * - Security headers
 */

import crypto from 'node:crypto';
// Config removed, using inline constants

// ============================================
// CSRF PROTECTION
// ============================================

const CSRF_TOKEN_LENGTH = 32;
const csrfTokens = new Map<string, { token: string; expires: number }>();

/**
 * Generate a cryptographically secure CSRF token
 */
export function generateCsrfToken(sessionId: string): string {
    const token = crypto.randomBytes(CSRF_TOKEN_LENGTH).toString('hex');

    // Default: 1 hour expiry
    const CSRF_EXPIRY = 3600 * 1000;

    csrfTokens.set(sessionId, {
        token,
        expires: Date.now() + CSRF_EXPIRY,
    });

    return token;
}

/**
 * Validate a CSRF token
 */
export function validateCsrfToken(sessionId: string, token: string): boolean {
    const stored = csrfTokens.get(sessionId);
    if (!stored) return false;
    if (Date.now() > stored.expires) {
        csrfTokens.delete(sessionId);
        return false;
    }

    // Constant-time comparison to prevent timing attacks
    if (stored.token.length !== token.length) return false;
    let mismatch = 0;
    for (let i = 0; i < stored.token.length; i++) {
        mismatch |= stored.token.charCodeAt(i) ^ token.charCodeAt(i);
    }
    return mismatch === 0;
}

// ============================================
// INPUT SANITIZATION
// ============================================

/**
 * Sanitize email input
 */
export function sanitizeEmail(email: string): string {
    return email
        .toLowerCase()
        .trim()
        .replace(/[<>'"]/g, '')
        .slice(0, 255);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) && email.length <= 255;
}

/**
 * Sanitize general text input
 */
export function sanitizeText(input: string, maxLength = 100): string {
    return input
        .trim()
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/[<>'"\\]/g, '') // Remove dangerous chars
        .slice(0, maxLength);
}

/**
 * Sanitize phone number
 */
export function sanitizePhone(phone: string): string {
    return phone.replace(/[^\d+\-() ]/g, '').slice(0, 20);
}

/**
 * Validate Canadian postal code
 */
export function isValidCanadianPostalCode(code: string): boolean {
    const postalRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    return postalRegex.test(code);
}

/**
 * Check if postal code is in London, Ontario service area
 */
export function isInServiceArea(postalCode: string): boolean {
    // London, Ontario postal codes start with N5V, N5W, N5X, N5Y, N5Z, N6A-N6P
    const code = postalCode.toUpperCase().replace(/\s/g, '');
    const londonPrefixes = [
        'N5V', 'N5W', 'N5X', 'N5Y', 'N5Z',
        'N6A', 'N6B', 'N6C', 'N6E', 'N6G', 'N6H', 'N6J', 'N6K', 'N6L', 'N6M', 'N6N', 'N6P',
    ];

    // Extended service area (surrounding regions)
    const extendedPrefixes = [
        'N0M', 'N0L', 'N4S', 'N4T', 'N4V', 'N4W', 'N4X', 'N4Z', // Surrounding areas
    ];

    const prefix = code.slice(0, 3);
    return londonPrefixes.includes(prefix) || extendedPrefixes.includes(prefix);
}

// ============================================
// RATE LIMITING (In-Memory for Edge)
// ============================================

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const rateLimits = new Map<string, RateLimitEntry>();

/**
 * Check and update rate limit for an identifier
 */
export function checkRateLimit(
    identifier: string,
    endpoint: string,
    maxRequests = 20,
    windowMs = 60000
): { allowed: boolean; remaining: number; resetAt: number } {
    const key = `${identifier}:${endpoint}`;
    const now = Date.now();

    // Lazy cleanup
    cleanOldRateLimits();

    const entry = rateLimits.get(key);

    if (!entry || now > entry.resetAt) {
        // New window
        rateLimits.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
    }

    if (entry.count >= maxRequests) {
        return { allowed: false, remaining: 0, resetAt: entry.resetAt };
    }

    entry.count++;
    return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt };
}

// Cleanup old rate limit entries (Lazy cleanup instead of setInterval)
function cleanOldRateLimits() {
    const now = Date.now();
    for (const [key, entry] of rateLimits.entries()) {
        if (now > entry.resetAt) rateLimits.delete(key);
    }
}

// ============================================
// SECURITY HEADERS
// ============================================

/**
 * Get security headers for responses
 */
export function getSecurityHeaders(): Record<string, string> {
    return {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'Content-Security-Policy': [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline'", // Needed for inline scripts
            "style-src 'self' 'unsafe-inline'", // Needed for inline styles
            "img-src 'self' data: https:",
            "font-src 'self'",
            "connect-src 'self' https://*.supabase.co",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
        ].join('; '),
    };
}

// ============================================
// FINGERPRINT GENERATION (Privacy-Respecting)
// ============================================

/**
 * Generate a privacy-respecting browser fingerprint
 * Uses minimal data to create a session identifier
 * Does NOT track across sites or store personal data
 */
export function generateSessionFingerprint(
    userAgent: string,
    acceptLanguage: string,
    screenRes?: string
): string {
    const data = [
        userAgent.slice(0, 50),
        acceptLanguage.slice(0, 10),
        screenRes || 'unknown',
        new Date().toDateString(), // Rotate daily
    ].join('|');

    // Simple hash function (FNV-1a)
    let hash = 2166136261;
    for (let i = 0; i < data.length; i++) {
        hash ^= data.charCodeAt(i);
        hash = (hash * 16777619) >>> 0;
    }

    return hash.toString(36);
}

// ============================================
// IP EXTRACTION
// ============================================

/**
 * Extract client IP from request headers
 */
export function getClientIp(headers: Record<string, string>): string {
    // Check common proxy headers
    const forwardedFor = headers['x-forwarded-for'];
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }

    const realIp = headers['x-real-ip'];
    if (realIp) {
        return realIp;
    }

    const cfConnectingIp = headers['cf-connecting-ip'];
    if (cfConnectingIp) {
        return cfConnectingIp;
    }

    return 'unknown';
}
