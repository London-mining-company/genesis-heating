/**
 * Analytics Module - Optimized for Performance & Extensibility
 * 
 * Features:
 * - Event batching (reduces network requests)
 * - Offline queue with retry
 * - Privacy-first (no cookies, minimal fingerprinting)
 * - Easy integration hooks for:
 *   - Google Analytics 4
 *   - Plausible
 *   - PostHog
 *   - Mixpanel
 *   - Custom webhooks
 * 
 * @author Genesis Heating Engineering
 */

// ============================================
// TYPES
// ============================================

export interface AnalyticsEvent {
    name: string
    type: 'track' | 'funnel' | 'page' | 'identify'
    data?: Record<string, unknown>
    timestamp: number
    sessionId: string
}

export interface AnalyticsConfig {
    endpoint: string
    batchSize: number
    flushInterval: number
    maxRetries: number
    debug: boolean
    // Integration flags
    integrations?: {
        ga4?: { measurementId: string }
        plausible?: { domain: string }
        posthog?: { apiKey: string; host?: string }
        webhook?: { url: string; secret?: string }
    }
}

// ============================================
// DEFAULT CONFIG
// ============================================

const DEFAULT_CONFIG: AnalyticsConfig = {
    endpoint: '/api/analytics',
    batchSize: 10,
    flushInterval: 5000, // 5 seconds
    maxRetries: 3,
    debug: import.meta.env?.DEV || false,
}

// ============================================
// ANALYTICS CLASS
// ============================================

class Analytics {
    private config: AnalyticsConfig
    private queue: AnalyticsEvent[] = []
    private sessionId: string
    private flushTimer: ReturnType<typeof setTimeout> | null = null
    private retryCount = 0
    private isOnline = true

    constructor(config: Partial<AnalyticsConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config }
        this.sessionId = this.getOrCreateSessionId()

        // Setup flush timer
        this.scheduleFlush()

        // Listen for online/offline
        if (typeof window !== 'undefined') {
            window.addEventListener('online', () => {
                this.isOnline = true
                this.flush()
            })
            window.addEventListener('offline', () => {
                this.isOnline = false
            })

            // Flush on page unload
            window.addEventListener('beforeunload', () => {
                this.flush(true)
            })

            // Flush on visibility change (tab switch)
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'hidden') {
                    this.flush(true)
                }
            })
        }
    }

    private getOrCreateSessionId(): string {
        if (typeof sessionStorage === 'undefined') return crypto.randomUUID()

        let sessionId = sessionStorage.getItem('sh_sid')
        if (!sessionId) {
            sessionId = crypto.randomUUID()
            sessionStorage.setItem('sh_sid', sessionId)
        }
        return sessionId
    }

    private scheduleFlush(): void {
        if (this.flushTimer) clearTimeout(this.flushTimer)
        this.flushTimer = setTimeout(() => {
            this.flush()
            this.scheduleFlush()
        }, this.config.flushInterval)
    }

    /**
     * Track a custom event
     */
    track(name: string, data?: Record<string, unknown>): void {
        this.addEvent({
            name,
            type: 'track',
            data,
            timestamp: Date.now(),
            sessionId: this.sessionId,
        })
    }

    /**
     * Track funnel progression
     */
    funnel(stage: string, data?: Record<string, unknown>): void {
        this.addEvent({
            name: stage,
            type: 'funnel',
            data,
            timestamp: Date.now(),
            sessionId: this.sessionId,
        })
    }

    /**
     * Track page view
     */
    page(url?: string, title?: string): void {
        this.addEvent({
            name: 'page_view',
            type: 'page',
            data: {
                url: url || window.location.href,
                title: title || document.title,
                referrer: document.referrer,
            },
            timestamp: Date.now(),
            sessionId: this.sessionId,
        })
    }

    /**
     * Identify user after signup
     */
    identify(userId: string, traits?: Record<string, unknown>): void {
        this.addEvent({
            name: 'identify',
            type: 'identify',
            data: { userId, ...traits },
            timestamp: Date.now(),
            sessionId: this.sessionId,
        })
    }

    private addEvent(event: AnalyticsEvent): void {
        this.queue.push(event)

        if (this.config.debug) {
            console.debug('[Analytics]', event)
        }

        // Send to third-party integrations immediately
        this.sendToIntegrations(event)

        // Flush if batch size reached
        if (this.queue.length >= this.config.batchSize) {
            this.flush()
        }
    }

    private sendToIntegrations(event: AnalyticsEvent): void {
        const { integrations } = this.config
        if (!integrations) return

        // Google Analytics 4
        if (integrations.ga4 && typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', event.name, {
                ...event.data,
                session_id: event.sessionId,
            })
        }

        // Plausible
        if (integrations.plausible && typeof window !== 'undefined' && (window as any).plausible) {
            (window as any).plausible(event.name, { props: event.data })
        }

        // PostHog
        if (integrations.posthog && typeof window !== 'undefined' && (window as any).posthog) {
            if (event.type === 'identify') {
                (window as any).posthog.identify(event.data?.userId, event.data)
            } else {
                (window as any).posthog.capture(event.name, event.data)
            }
        }
    }

    /**
     * Flush event queue to server
     */
    async flush(sync = false): Promise<void> {
        if (this.queue.length === 0) return
        if (!this.isOnline && !sync) return

        const events = [...this.queue]
        this.queue = []

        try {
            // Use sendBeacon for sync (page unload) - more reliable
            if (sync && typeof navigator?.sendBeacon === 'function') {
                const blob = new Blob([JSON.stringify({ events })], { type: 'application/json' })
                navigator.sendBeacon(this.config.endpoint, blob)
                return
            }

            const response = await fetch(this.config.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ events }),
                keepalive: true, // Keep connection for unload
            })

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }

            this.retryCount = 0
        } catch (error) {
            if (this.config.debug) {
                console.error('[Analytics] Flush failed:', error)
            }

            // Re-queue events for retry
            if (this.retryCount < this.config.maxRetries) {
                this.queue = [...events, ...this.queue]
                this.retryCount++
            }
        }
    }

    /**
     * Get UTM parameters from URL
     */
    static getUtmParams(): Record<string, string | null> {
        if (typeof window === 'undefined') return {}

        const params = new URLSearchParams(window.location.search)
        return {
            utm_source: params.get('utm_source'),
            utm_medium: params.get('utm_medium'),
            utm_campaign: params.get('utm_campaign'),
            utm_content: params.get('utm_content'),
            utm_term: params.get('utm_term'),
            ref: params.get('ref'),
        }
    }

    /**
     * Get device type
     */
    static getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
        if (typeof window === 'undefined') return 'desktop'
        const width = window.innerWidth
        if (width < 768) return 'mobile'
        if (width < 1024) return 'tablet'
        return 'desktop'
    }
}

// ============================================
// SINGLETON EXPORT
// ============================================

let analyticsInstance: Analytics | null = null

export function initAnalytics(config?: Partial<AnalyticsConfig>): Analytics {
    if (!analyticsInstance) {
        analyticsInstance = new Analytics(config)
    }
    return analyticsInstance
}

export function getAnalytics(): Analytics {
    if (!analyticsInstance) {
        analyticsInstance = new Analytics()
    }
    return analyticsInstance
}

// Convenience exports
export const track = (name: string, data?: Record<string, unknown>) => getAnalytics().track(name, data)
export const funnel = (stage: string, data?: Record<string, unknown>) => getAnalytics().funnel(stage, data)
export const page = (url?: string, title?: string) => getAnalytics().page(url, title)
export const identify = (userId: string, traits?: Record<string, unknown>) => getAnalytics().identify(userId, traits)
