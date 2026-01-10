# Superheat Landing Page

> Revolutionary zero-cost heating technology for London, Ontario. Join the waitlist for Spring 2026.

## 🏗️ Architecture Overview

This is a performance-optimized landing page designed to be **under 14KB gzipped** for instant loading (TCP slow-start optimization).

### Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + TypeScript + Vite | Ultra-lightweight SPA |
| **Styling** | Vanilla CSS (Custom Properties) | No framework overhead |
| **Backend** | Vercel Edge Functions | Low-latency serverless API |
| **Database** | Supabase (PostgreSQL) | Managed, scalable, RLS-enabled |
| **Analytics** | Custom (Privacy-First) | GDPR/PIPEDA compliant tracking |

### Key Features

- ⚡ **Sub-14KB bundle** (fits in first TCP window)
- 🔒 **Enterprise security** (CSRF, rate limiting, CSP, input sanitization)
- 📊 **Growth tracking** (funnel analytics, UTM params, conversion events)
- ♿ **Accessible** (ARIA labels, keyboard navigation, semantic HTML)
- 📱 **Mobile-first** (responsive design, touch-friendly)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm
- Supabase account (for database)

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173`

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Analyze bundle size
npm run analyze
```

---

## 📁 Project Structure

```
superheat-landing/
├── api/                    # Vercel serverless functions
│   ├── analytics.ts        # Event tracking endpoint
│   ├── verify.ts           # Email verification
│   └── waitlist.ts         # Signup handler
├── public/
│   └── favicon.svg         # Custom flame icon
├── src/
│   ├── server/             # Backend logic (shared with API)
│   │   ├── api/
│   │   │   └── handlers.ts # Request handlers
│   │   ├── db/
│   │   │   ├── client.ts   # Supabase client
│   │   │   ├── config.ts   # Environment config
│   │   │   └── schema.sql  # Database schema
│   │   └── security/
│   │       └── middleware.ts # Security utilities
│   ├── App.tsx             # Main React component
│   ├── index.css           # Complete CSS (design system)
│   └── main.tsx            # Entry point
├── .env.example            # Environment template
├── index.html              # HTML with SEO meta
├── package.json
├── tsconfig.json
├── vercel.json             # Deployment config
└── vite.config.ts          # Build config
```

---

## 🗄️ Database Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your project URL and API keys

### 2. Run Schema Migration

```bash
# Option 1: Use Supabase Dashboard SQL Editor
# Copy contents of src/server/db/schema.sql and execute

# Option 2: Use Supabase CLI
supabase db push --db-url "postgresql://..."
```

### 3. Configure Environment

```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

---

## 🔒 Security Features

### CSRF Protection
- Server-generated tokens per session
- Constant-time comparison to prevent timing attacks
- Automatic expiry (30 min production, 1 hour dev)

### Rate Limiting
- Waitlist: 5 requests per 5 minutes per IP
- Analytics: 100 requests per minute per IP
- In-memory for edge, Redis-backed for scale

### Input Validation
- Email format and domain verification
- Canadian postal code validation
- Service area verification (London, ON)
- HTML/XSS sanitization

### Content Security Policy
```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
connect-src 'self' https://*.supabase.co;
frame-ancestors 'none';
```

---

## 📊 Analytics & Tracking

### Funnel Stages

| Stage | Trigger |
|-------|---------|
| `page_view` | Initial page load |
| `scroll_25/50/75/100` | Scroll depth milestones |
| `cta_view` | Waitlist form visible |
| `form_start` | First form interaction |
| `form_email` | Email field focused |
| `form_submit` | Form submitted |
| `form_success` | Successful signup |
| `email_verified` | Email confirmed |

### UTM Parameter Tracking

All UTM parameters are automatically captured:
- `utm_source` - Traffic source
- `utm_medium` - Marketing medium
- `utm_campaign` - Campaign name
- `utm_content` - Content variant
- `utm_term` - Search keywords
- `ref` - Referral code

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_KEY
```

### Other Platforms

The app can be deployed to any platform supporting:
- Static file hosting (for the Vite build)
- Serverless functions (for API routes)

Adapt the `api/` functions to your platform's format.

---

## 📈 Performance Targets

| Metric | Target | Actual |
|--------|--------|--------|
| First Contentful Paint | < 1.0s | TBD |
| Largest Contentful Paint | < 2.0s | TBD |
| Cumulative Layout Shift | < 0.1 | TBD |
| Total Bundle (gzipped) | < 14KB | TBD |

Run `npm run analyze` to see the actual bundle breakdown.

---

## 🎨 Design System

### Colors

| Variable | Value | Usage |
|----------|-------|-------|
| `--c-bg` | `#0d0d14` | Page background |
| `--c-bg-card` | `#1a1a2e` | Card backgrounds |
| `--c-accent` | `#f7931a` | Call-to-action, links |
| `--c-coral` | `#ff6b35` | Gradient secondary |
| `--c-text` | `#e8e8f0` | Primary text |
| `--c-text-muted` | `#9898b0` | Secondary text |

### Typography

- Font: Inter (Google Fonts)
- Weights: 400, 600, 700
- Scale: 0.75rem to 3.5rem

---

## 📝 License

Copyright © 2026 Superheat Technologies Inc. All rights reserved.

---

## 🤝 Contributing

This is a private project. Contact the team for contribution guidelines.
