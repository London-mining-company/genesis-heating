/**
 * Supabase Client Singleton
 * 
 * Provides type-safe database access with proper error handling
 */

import { getConfig, validateConfig } from './config';

// Types matching our schema
export interface WaitlistSubscriber {
    id: string;
    email: string;
    name?: string;
    phone?: string;
    postal_code?: string;
    city: string;
    province: string;
    property_type?: 'residential' | 'commercial' | 'industrial';
    current_heating?: string;
    monthly_heating_cost?: number;
    referral_source?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
    priority_score: number;
    interested_in_beta: boolean;
    marketing_consent: boolean;
    marketing_consent_at?: string;
    privacy_accepted: boolean;
    privacy_accepted_at?: string;
    ip_address?: string;
    user_agent?: string;
    referrer_url?: string;
    landing_page?: string;
    email_verified: boolean;
    email_verified_at?: string;
    verification_token: string;
    verification_expires_at: string;
    status: 'pending' | 'verified' | 'contacted' | 'converted' | 'unsubscribed';
    created_at: string;
    updated_at: string;
}

export interface AnalyticsEvent {
    id: string;
    session_id: string;
    event_type: string;
    event_name: string;
    page_url?: string;
    page_title?: string;
    referrer_url?: string;
    event_data: Record<string, unknown>;
    device_type?: 'mobile' | 'tablet' | 'desktop';
    browser_family?: string;
    os_family?: string;
    screen_width?: number;
    screen_height?: number;
    country_code?: string;
    region?: string;
    city?: string;
    page_load_time?: number;
    time_on_page?: number;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    created_at: string;
}

export interface FunnelEvent {
    id: string;
    session_id: string;
    subscriber_id?: string;
    stage: string;
    variant?: string;
    created_at: string;
}

export interface RateLimit {
    id: string;
    identifier: string;
    endpoint: string;
    request_count: number;
    window_start: string;
}

// Database response types
export interface DbResult<T> {
    data: T | null;
    error: DbError | null;
}

export interface DbError {
    message: string;
    code?: string;
    details?: string;
}

// Simple fetch-based Supabase client for edge functions
// This avoids the heavy @supabase/supabase-js package for the frontend
export class SupabaseClient {
    private url: string;
    private headers: Record<string, string>;

    constructor(url: string, key: string) {
        this.url = url;
        this.headers = {
            'apikey': key,
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
        };
    }

    private async request<T>(
        table: string,
        method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
        options?: {
            body?: Record<string, unknown>;
            filters?: Record<string, string>;
            select?: string;
        }
    ): Promise<DbResult<T>> {
        try {
            let endpoint = `${this.url}/rest/v1/${table}`;

            // Build query string
            const params = new URLSearchParams();
            if (options?.select) params.set('select', options.select);
            if (options?.filters) {
                Object.entries(options.filters).forEach(([key, value]) => {
                    params.set(key, value);
                });
            }
            if (params.toString()) endpoint += `?${params.toString()}`;

            const response = await fetch(endpoint, {
                method,
                headers: this.headers,
                body: options?.body ? JSON.stringify(options.body) : undefined,
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                return {
                    data: null,
                    error: {
                        message: error.message || `HTTP ${response.status}`,
                        code: error.code,
                        details: error.details,
                    },
                };
            }

            const data = await response.json();
            return { data, error: null };
        } catch (err) {
            return {
                data: null,
                error: {
                    message: err instanceof Error ? err.message : 'Unknown error',
                },
            };
        }
    }

    // Waitlist operations
    async createSubscriber(
        data: Partial<WaitlistSubscriber>
    ): Promise<DbResult<WaitlistSubscriber>> {
        return this.request<WaitlistSubscriber>('waitlist_subscribers', 'POST', {
            body: data as Record<string, unknown>,
        });
    }

    async getSubscriberByEmail(email: string): Promise<DbResult<WaitlistSubscriber[]>> {
        return this.request<WaitlistSubscriber[]>('waitlist_subscribers', 'GET', {
            filters: { email: `eq.${email}` },
        });
    }

    async verifySubscriber(token: string): Promise<DbResult<WaitlistSubscriber>> {
        return this.request<WaitlistSubscriber>('waitlist_subscribers', 'PATCH', {
            filters: { verification_token: `eq.${token}` },
            body: {
                email_verified: true,
                email_verified_at: new Date().toISOString(),
                status: 'verified',
            },
        });
    }

    // Analytics operations
    async trackEvent(data: Partial<AnalyticsEvent>): Promise<DbResult<AnalyticsEvent>> {
        return this.request<AnalyticsEvent>('analytics_events', 'POST', {
            body: data as Record<string, unknown>,
        });
    }

    async trackFunnelEvent(data: Partial<FunnelEvent>): Promise<DbResult<FunnelEvent>> {
        return this.request<FunnelEvent>('funnel_events', 'POST', {
            body: data as Record<string, unknown>,
        });
    }

    // Rate limiting
    async checkRateLimit(
        identifier: string,
        endpoint: string,
        windowMs: number,
        maxRequests: number
    ): Promise<boolean> {
        const windowStart = new Date(Date.now() - windowMs).toISOString();

        const result = await this.request<RateLimit[]>('rate_limits', 'GET', {
            filters: {
                identifier: `eq.${identifier}`,
                endpoint: `eq.${endpoint}`,
                window_start: `gte.${windowStart}`,
            },
        });

        if (result.error || !result.data) return true; // Allow on error

        const totalRequests = result.data.reduce((sum, r) => sum + r.request_count, 0);
        return totalRequests < maxRequests;
    }
}

// Singleton instance
let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
    try {
        if (!client) {
            const config = getConfig();
            validateConfig(config);
            client = new SupabaseClient(config.database.supabaseUrl, config.database.supabaseServiceKey);
        }
        return client;
    } catch (err) {
        console.warn('[Supabase] Client initialization skipped:', (err as Error).message);
        return null;
    }
}
