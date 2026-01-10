# 🚀 Ready to Ship: Genesis Heating Landing Page

**Product:** Genesis Heating Solutions (Steve Jobs Edition)
**Status:** Gold Master
**Date:** January 10, 2026

---

## 📦 What's Included

1.  **Frontend**: Preact (11KB), Story-driven design, Mobile-first.
2.  **Backend**: Vercel Serverless Functions (`/api/waitlist`, `/api/analytics`, `/api/verify`).
3.  **Security**: Honeypot, Rate Limiting, CSP, Email Validation.
4.  **Integrations**: Hooks for Slack, Zapier, HubSpot.

---

## 🛠️ Deployment Instructions

### Option 1: Vercel (Recommended)

1.  **Push to GitHub:**
    Run these commands in your terminal:
    ```bash
    git add .
    git commit -m "feat: launch superheat landing page"
    git push origin main
    ```

2.  **Import to Vercel:**
    - Go to [vercel.com/new](https://vercel.com/new)
    - Select your GitHub repository
    - Framework Preset: **Vite** (Should detect automatically)
    - **Environment Variables**: Copy contents from `.env.local` to Vercel Project Settings.

3.  **Deploy**: Click "Deploy". Your site will be live in seconds.

### Option 2: Manual / Docker

1.  **Build:**
    ```bash
    npm run build
    ```
2.  **Serve:**
    Serve the `dist` folder as a static site.
    *Note: API endpoints in `api/` require a Node.js serverless environment (Vercel/Netlify) to function.*

---

## 🔑 Key Configuration

Ensure these variables are set in your production environment:

- `SUPABASE_URL` / `SUPABASE_KEY`: Database connection.
- `RESEND_API_KEY`: For sending "Welcome to the List" emails.
- `APP_SECRET`: For signing session tokens.

---

## 🧪 Final Verification

After deployment, perform these checks:

1.  **Load Speed**: Page should load instantly.
2.  **Waitlist Form**: Submit a test email. Check if it appears in Supabase.
3.  **Bot Trap**: Try submitting with the hidden `Website` field filled (using dev tools). It should fail silently.

**"It just works."**
