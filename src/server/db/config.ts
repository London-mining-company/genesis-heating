/**
 * Database Configuration & Connection
 * 
 * Environment-based configuration for Supabase PostgreSQL
 */

export interface DatabaseConfig {
    supabaseUrl: string;
    supabaseAnonKey: string;
    supabaseServiceKey: string;
}

export interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
}

export interface SecurityConfig {
    allowedOrigins: string[];
    csrfTokenExpiry: number;
    emailVerificationExpiry: number;
}

// Environment-specific configurations
const configs: Record<string, {
    database: Partial<DatabaseConfig>;
    rateLimit: RateLimitConfig;
    security: SecurityConfig;
}> = {
    development: {
        database: {
            supabaseUrl: 'http://localhost:54321',
        },
        rateLimit: {
            windowMs: 60000, // 1 minute
            maxRequests: 100,
        },
        security: {
            allowedOrigins: ['http://localhost:5173', 'http://localhost:3000'],
            csrfTokenExpiry: 3600000, // 1 hour
            emailVerificationExpiry: 172800000, // 48 hours
        },
    },
    production: {
        database: {},
        rateLimit: {
            windowMs: 60000,
            maxRequests: 20, // Stricter in production
        },
        security: {
            allowedOrigins: [
                'https://Genesis Heating.ca',
                'https://www.Genesis Heating.ca',
                'https://Genesis Heating-landing.vercel.app',
            ],
            csrfTokenExpiry: 1900000, // ~32 minutes
            emailVerificationExpiry: 172800000,
        },
    },
};

export function getConfig(env: string = process.env.NODE_ENV || 'development') {
    const config = configs[env] || configs.development;

    return {
        database: {
            supabaseUrl: process.env.SUPABASE_URL || config.database.supabaseUrl,
            supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
            supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY || '',
        } as DatabaseConfig,
        rateLimit: config.rateLimit,
        security: config.security,
    };
}

// Validation
export function validateConfig(config: ReturnType<typeof getConfig>): void {
    const required = ['supabaseUrl', 'supabaseAnonKey'];
    const missing = required.filter(key => !config.database[key as keyof DatabaseConfig]);

    if (missing.length > 0) {
        throw new Error(`Missing required configuration: ${missing.join(', ')}`);
    }
}
