/**
 * Enhanced Security Module
 * 
 * Additional security layers:
 * - Honeypot field detection
 * - Email entropy checking (detect gibberish)
 * - Disposable email blocking
 * - Request signature validation
 * - Enhanced rate limiting with progressive delays
 * - Bot detection heuristics
 * 
 * @author Genesis Heating Engineering
 */

// ============================================
// HONEYPOT DETECTION
// ============================================

/**
 * Check if honeypot field was filled (bot detection)
 * The 'website' or 'url' field should always be empty for real users
 */
export function isHoneypotTriggered(formData: Record<string, unknown>): boolean {
    const honeypotFields = ['website', 'url', 'homepage', 'company_website', 'fax']

    for (const field of honeypotFields) {
        const value = formData[field]
        if (value && typeof value === 'string' && value.trim() !== '') {
            return true
        }
    }

    return false
}

// ============================================
// DISPOSABLE EMAIL DETECTION
// ============================================

// Common disposable email domains (expand as needed)
const DISPOSABLE_DOMAINS = new Set([
    '10minutemail.com', 'tempmail.com', 'guerrillamail.com', 'mailinator.com',
    'throwaway.email', 'temp-mail.org', 'fakeinbox.com', 'trashmail.com',
    'getnada.com', 'maildrop.cc', 'mohmal.com', 'tempail.com', 'tempr.email',
    'discard.email', 'mailnesia.com', 'yopmail.com', 'emailondeck.com',
    'spamgourmet.com', 'mintemail.com', 'mytemp.email', 'burnermail.io',
])

/**
 * Check if email is from a disposable email provider
 */
export function isDisposableEmail(email: string): boolean {
    const domain = email.split('@')[1]?.toLowerCase()
    if (!domain) return false

    return DISPOSABLE_DOMAINS.has(domain)
}

// ============================================
// EMAIL ENTROPY CHECK (Gibberish Detection)
// ============================================

/**
 * Calculate Shannon entropy of a string
 * Real emails typically have entropy between 3.0 and 4.5
 * Random/gibberish strings tend to be higher
 */
export function calculateEntropy(str: string): number {
    const freq = new Map<string, number>()
    for (const char of str) {
        freq.set(char, (freq.get(char) || 0) + 1)
    }

    let entropy = 0
    const len = str.length
    for (const count of freq.values()) {
        const p = count / len
        entropy -= p * Math.log2(p)
    }

    return entropy
}

/**
 * Check if email local part looks like gibberish
 */
export function isGibberishEmail(email: string): boolean {
    const localPart = email.split('@')[0]
    if (!localPart) return false

    // Check entropy
    const entropy = calculateEntropy(localPart)
    if (entropy > 4.5) return true

    // Check for too many numbers
    const numberRatio = (localPart.match(/\d/g)?.length || 0) / localPart.length
    if (numberRatio > 0.5) return true

    // Check for keyboard smashing patterns
    const keyboardPatterns = /^[qwerty]{4,}|^[asdfg]{4,}|^[zxcvb]{4,}|^[12345]{4,}/i
    if (keyboardPatterns.test(localPart)) return true

    // Too short with many special chars
    if (localPart.length < 5 && /[._%+-]{2,}/.test(localPart)) return true

    return false
}

// ============================================
// TIMING ANALYSIS (Bot Detection)
// ============================================

interface TimingData {
    formLoadTime: number
    submitTime: number
    fieldInteractions: number
    mouseMovements: number
}

/**
 * Analyze form submission timing for bot behavior
 * Real users take time to fill forms and move the mouse
 */
export function analyzeTimingPatterns(timing: TimingData): {
    isSuspicious: boolean
    reason?: string
    score: number
} {
    const fillDuration = timing.submitTime - timing.formLoadTime

    // Score from 0 (likely bot) to 100 (likely human)
    let score = 100

    // Form filled too fast (< 3 seconds)
    if (fillDuration < 3000) {
        score -= 50
        return { isSuspicious: true, reason: 'form_too_fast', score }
    }

    // Form filled very fast (< 10 seconds)
    if (fillDuration < 10000) {
        score -= 20
    }

    // No field interactions tracked
    if (timing.fieldInteractions < 2) {
        score -= 30
    }

    // No mouse movements
    if (timing.mouseMovements === 0) {
        score -= 25
    }

    return {
        isSuspicious: score < 50,
        reason: score < 50 ? 'low_interaction_score' : undefined,
        score,
    }
}

// ============================================
// PROGRESSIVE RATE LIMITING
// ============================================

interface ProgressiveRateLimitEntry {
    count: number
    windowStart: number
    penaltyUntil: number
    penaltyLevel: number
}

const progressiveRateLimits = new Map<string, ProgressiveRateLimitEntry>()

/**
 * Progressive rate limiting with exponential backoff penalties
 * First violation: 1 minute penalty
 * Second: 5 minutes
 * Third: 15 minutes
 * Fourth+: 1 hour
 */
export function checkProgressiveRateLimit(
    identifier: string,
    endpoint: string,
    maxRequests = 5,
    windowMs = 60000
): { allowed: boolean; waitMs: number; penaltyLevel: number } {
    const key = `${identifier}:${endpoint}`
    const now = Date.now()

    let entry = progressiveRateLimits.get(key)

    // Check if in penalty period
    if (entry && now < entry.penaltyUntil) {
        return {
            allowed: false,
            waitMs: entry.penaltyUntil - now,
            penaltyLevel: entry.penaltyLevel,
        }
    }

    // Reset if window expired
    if (!entry || now > entry.windowStart + windowMs) {
        entry = {
            count: 1,
            windowStart: now,
            penaltyUntil: 0,
            penaltyLevel: 0,
        }
        progressiveRateLimits.set(key, entry)
        return { allowed: true, waitMs: 0, penaltyLevel: 0 }
    }

    entry.count++

    // Check if over limit
    if (entry.count > maxRequests) {
        entry.penaltyLevel++

        // Calculate penalty duration
        const penaltyMs = [60000, 300000, 900000, 3600000][Math.min(entry.penaltyLevel - 1, 3)]
        entry.penaltyUntil = now + penaltyMs

        return {
            allowed: false,
            waitMs: penaltyMs,
            penaltyLevel: entry.penaltyLevel,
        }
    }

    return { allowed: true, waitMs: 0, penaltyLevel: 0 }
}

// ============================================
// REQUEST SIGNATURE VALIDATION
// ============================================

/**
 * Verify HMAC signature for webhook security
 */
export async function verifyRequestSignature(
    payload: string,
    signature: string,
    secret: string
): Promise<boolean> {
    const encoder = new TextEncoder()

    try {
        const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(secret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['verify']
        )

        const signatureBytes = new Uint8Array(
            signature.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
        )

        return await crypto.subtle.verify('HMAC', key, signatureBytes, encoder.encode(payload))
    } catch {
        return false
    }
}

// ============================================
// COMBINED SECURITY CHECK
// ============================================

export interface SecurityCheckResult {
    passed: boolean
    flags: string[]
    score: number
    recommendation: 'allow' | 'challenge' | 'block'
}

export function performSecurityCheck(
    formData: Record<string, unknown>,
    email: string,
    timing?: TimingData
): SecurityCheckResult {
    const flags: string[] = []
    let score = 100

    // Honeypot check
    if (isHoneypotTriggered(formData)) {
        flags.push('honeypot_triggered')
        score -= 100
    }

    // Disposable email check
    if (isDisposableEmail(email)) {
        flags.push('disposable_email')
        score -= 40
    }

    // Gibberish email check
    if (isGibberishEmail(email)) {
        flags.push('gibberish_email')
        score -= 30
    }

    // Timing analysis
    if (timing) {
        const timingResult = analyzeTimingPatterns(timing)
        if (timingResult.isSuspicious) {
            flags.push(timingResult.reason || 'suspicious_timing')
            score -= (100 - timingResult.score)
        }
    }

    // Determine recommendation
    let recommendation: 'allow' | 'challenge' | 'block'
    if (score >= 70) {
        recommendation = 'allow'
    } else if (score >= 40) {
        recommendation = 'challenge' // Could show CAPTCHA
    } else {
        recommendation = 'block'
    }

    return {
        passed: score >= 40,
        flags,
        score,
        recommendation,
    }
}

// ============================================
// CLEANUP UTILITY
// ============================================

// Periodically clean up old rate limit entries
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now()
        for (const [key, entry] of progressiveRateLimits.entries()) {
            // Remove entries that have been inactive for > 2 hours
            if (now > entry.windowStart + 7200000 && now > entry.penaltyUntil) {
                progressiveRateLimits.delete(key)
            }
        }
    }, 300000) // Every 5 minutes
}
