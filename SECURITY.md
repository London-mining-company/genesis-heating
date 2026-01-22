# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 27.x    | :white_check_mark: |
| < 27.0  | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within Genesis Heating Solutions, please send an email to [genesisheatingsolutions@gmail.com](mailto:genesisheatingsolutions@gmail.com). All security vulnerabilities will be promptly addressed.

**Please do not disclose security-related issues publicly until a fix has been deployed.**

## Security Architecture

### Data Protection Layers

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
├─────────────────────────────────────────────────────────┤
│  • Honeypot field (bot detection)                       │
│  • Client-side validation (UX only)                     │
│  • HTTPS enforcement                                    │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              VERCEL EDGE (CDN/WAF)                      │
├─────────────────────────────────────────────────────────┤
│  • DDoS protection                                      │
│  • TLS 1.3                                              │
│  • Geographic restrictions (optional)                   │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│           SERVERLESS FUNCTION (/api/waitlist)           │
├─────────────────────────────────────────────────────────┤
│  Level 1: Rate Limiting                                 │
│  • 20 requests per minute per IP                        │
│  • Lazy cleanup of expired entries                      │
│                                                         │
│  Level 2: CSRF Protection                               │
│  • Cryptographic tokens                                 │
│  • Constant-time comparison                             │
│  • 1-hour expiry                                        │
│                                                         │
│  Level 3: Input Validation                              │
│  • Email format validation                              │
│  • Disposable email blocking (25+ domains)              │
│  • HTML/script injection prevention                     │
│  • Null byte detection                                  │
│  • Length limits on all fields                          │
│                                                         │
│  Level 4: Honeypot Validation                           │
│  • Hidden field detection                               │
│  • Silent rejection (fools bots)                        │
│                                                         │
│  Level 5: Data Sanitization                             │
│  • Email normalization (lowercase, trim)                │
│  • Phone number normalization                           │
│  • Postal code formatting                               │
│  • Dangerous character removal                          │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              AIRTABLE (Primary Storage)                 │
├─────────────────────────────────────────────────────────┤
│  • API key stored in environment variables              │
│  • HTTPS-only communication                             │
│  • Audit logging enabled                                │
└─────────────────────────────────────────────────────────┘
```

### Security Headers

All API responses include:

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `X-XSS-Protection` | `1; mode=block` | XSS filter |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Referrer control |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Feature restrictions |
| `Content-Security-Policy` | See below | Content restrictions |

### Content Security Policy

```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self';
connect-src 'self' https://*.supabase.co;
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
```

## Data Handling

### Personal Information Collected

| Field | Purpose | Retention |
|-------|---------|-----------|
| Email | Communication | Until unsubscribe |
| Full Name | Personalization | Until request deletion |
| Phone | Appointment scheduling | Until request deletion |
| Postal Code | Service area validation | Until request deletion |
| Property Type | Service matching | Until request deletion |
| Heating Cost | Savings estimation | Until request deletion |

### Data Minimization

- No tracking cookies
- No third-party analytics
- No social media pixels
- Minimal client-side storage (form drafts only, cleared on submit)

### Third-Party Services

| Service | Purpose | Data Shared |
|---------|---------|-------------|
| Airtable | Lead CRM | All lead fields |
| Zapier | Automations | Lead summary |
| Vercel | Hosting | IP addresses (logs) |

## Environment Variables

**Never commit these to source control:**

```bash
# Required for lead collection
AIRTABLE_API_KEY=pat***
AIRTABLE_BASE_ID=app***
AIRTABLE_TABLE_NAME=Leads

# Optional - for automations
AUTOMATION_WEBHOOK_URL=https://hooks.zapier.com/***
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/***

# Security
APP_SECRET=***
```

## Incident Response

1. **Detection**: Monitor Vercel/Airtable logs for anomalies
2. **Containment**: Immediately rotate compromised credentials
3. **Notification**: Alert affected users within 72 hours
4. **Recovery**: Restore from clean state
5. **Post-mortem**: Document and improve defenses

## Compliance

- **PIPEDA** (Canada): Personal information handling compliant
- **CASL** (Canada): Marketing consent required before sending commercial emails
- **GDPR** (EU visitors): Right to deletion, data portability

## Audit Log

| Date | Version | Change |
|------|---------|--------|
| 2026-01-21 | v27.0 | Security hardening: Airtable primary, enhanced validation |
| 2026-01-18 | v25.0 | Initial security architecture |

---

*Last updated: January 21, 2026*
