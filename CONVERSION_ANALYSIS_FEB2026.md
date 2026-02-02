# 📊 Conversion Analysis: Why People Might Not Be Filling Out The Form

**Audit Date:** February 1, 2026  
**Analyst:** Genesis Engineering Intelligence  
**Data Sources:** Codebase analysis, GA4 (G-6VJ1EYD4QB), Meta Pixel (1371750064632137), Admin Dashboard Metrics

---

## 🎯 Executive Summary

Based on a comprehensive analysis of your landing page code, form logic, and analytics infrastructure, I've identified **6 primary friction points** that are likely causing form abandonment. The good news: most are fixable with minimal code changes.

---

## 🚨 HIGH-PRIORITY FRICTION POINTS

### 1. **The "2026" Delay Problem** ⏰
**Location:** Hero CTA button, Waitlist header  
**The Issue:** Your primary CTA says "Join the Spring 2026 Waitlist"

```tsx
<button onClick={() => sTo('waitlist')} className="btn btn-primary">Join the Spring 2026 Waitlist</button>
```

**Why It Hurts:** People have an immediate problem (high heating bills) but you're offering a solution they can't get for *months*. This creates a cognitive barrier: "Why should I give my info now for something that won't happen until later?"

**Recommended Fix:**
```tsx
// Option A: Reframe the delay as exclusivity
<button>Get Priority Access — Spring 2026</button>

// Option B: Create urgency despite the timeline
<button>Reserve Your Spot (Limited by Postal Code)</button>
```

---

### 2. **Two-Step Form Psychology** 📋
**Location:** `WaitlistForm` component (lines 318-544)  
**The Issue:** Your form has 2 steps with a visible progress bar

**Step 1 asks for:**
- Full Name ✅
- Email ✅
- Phone ✅ ← *Considered "high friction" for a waitlist*
- Postal Code ✅

**Step 2 asks for:**
- Property Type (Home/Business)
- Monthly Heating Cost (slider)
- **Privacy consent checkbox** ← REQUIRED
- Marketing consent checkbox

**Why It Hurts:**
1. **Phone number on Step 1** is too aggressive. Industry standard for "interest" captures is email-only. Phone is for "ready-to-buy" leads.
2. **"Continue to Final Step →"** sounds like there's more work ahead. People abandon when they see multiple steps.
3. **Privacy checkbox wording:** "I agree to be contacted about installation" feels like a *commitment*, not a waitlist.

**Recommended Fixes:**
- Make phone number *optional* or move it to Step 2
- Change Step 1 button to: "Almost Done — One More Question..."
- Change privacy wording to: "I'd like to learn more about this service"

---

### 3. **Trust Signal Gap on the Form Section** 🛡️
**Location:** Waitlist section  
**The Issue:** By the time users scroll to the form, they've left behind all your trust-building "How It Works" content. The form section has no trust reinforcement.

**Currently Present:**
- "Join 132+ Londoners" ← Good social proof
- "Currently prioritizing Byron & Masonville" ← Good locality

**Missing:**
- No "Zero Obligation" or "Cancel Anytime" reassurance
- No security/privacy badge or icon
- No "Takes 30 seconds" time estimate
- No testimonial or micro-case-study near the form

**Recommended Fix:** Add a single trust line above the form:
```tsx
<p style={{fontSize: '11px', opacity: 0.5}}>
  ✓ No payment required · ✓ Takes 30 seconds · ✓ Your data stays private
</p>
```

---

### 4. **Mobile Scroll Fatigue** 📱
**Location:** Page structure  
**The Issue:** Your page has:
1. Hero (100vh)
2. Main Content Left Column (HowItWorks + Benefits)
3. Waitlist Form (Right Column)
4. Communities Section
5. FAQs
6. Footer

On **mobile**, the layout likely stacks, meaning users must scroll through *all* the "How It Works" and "Benefits" content before even seeing the form.

**Why It Hurts:** Mobile users (likely 60%+ of Facebook traffic) may never reach the form.

**Recommended Fix:**
- Add a **floating "Reserve Your Spot" button** fixed to the bottom of the screen on mobile
- Or add a secondary CTA after the "How It Works" section

---

### 5. **The "Verification Required" Error Message** ⚠️
**Location:** Form validation (line 380)  
**The Issue:** If a user forgets to check the consent box, they see: `"Verification required"`

**Why It Hurts:** "Verification" sounds like an *action* they need to take (like checking email or entering a code). It's confusing.

**Recommended Fix:** Change to: `Please confirm you'd like to be contacted.`

---

### 6. **Monthly Heating Cost Slider — "Why Do They Need This?"** 💰
**Location:** Step 2 (line 512-517)  
**The Issue:** You ask users their monthly heating cost with no explanation of *why*.

```tsx
<label htmlFor="genesis-cost" className="calc-label">Monthly Heating Cost</label>
```

**Why It Hurts:** Users may wonder:
- "Are they going to upsell me based on how much I spend?"
- "I don't know my exact cost... should I just guess?"
- "This feels invasive."

**Recommended Fix:** Add context:
```tsx
<label>
  Monthly Heating Cost <span style={{opacity: 0.5, fontWeight: 400}}>(helps us estimate your savings)</span>
</label>
```

---

## 📈 DATA YOU SHOULD BE TRACKING (BUT MIGHT NOT BE)

Based on your `analytics.ts` module, you have the infrastructure for:
- Funnel events (`analytics.funnel()`)
- Custom tracking (`analytics.track()`)

**But I don't see these events being fired in `WaitlistForm`:**

| Event | When to Fire | Why It Matters |
|-------|--------------|----------------|
| `form_step_1_viewed` | When waitlist section scrolls into view | Measures intent |
| `form_step_1_started` | First keystroke in any Step 1 field | Measures engagement |
| `form_step_1_completed` | "Continue" button clicked successfully | Funnel progression |
| `form_step_2_viewed` | Step 2 renders | Funnel progression |
| `form_step_2_abandoned` | User clicks "Back" or navigates away | Abandonment cause |
| `form_submitted` | Successful submission | Conversion |

**Quick Win:** Add this to your form component:
```tsx
// At the start of Step 1
useEffect(() => {
    if (step === 1) track('form_step_1_viewed', { time: Date.now() })
}, [])

// When moving to Step 2
onClick={() => {
    // ... validation
    track('form_step_1_completed', { email_provided: !!formData.email })
    setStep(2)
}}
```

---

## 🔍 GOOGLE ANALYTICS 4 CHECK

Your GA4 is set up (G-6VJ1EYD4QB). To diagnose the funnel:

1. Go to **GA4 > Reports > Engagement > Events**
2. Look for these default events:
   - `page_view` (should have data)
   - `scroll` (if users are scrolling to the form)
   - `generate_lead` (fired on form success — lines 402-409)

3. If `page_view` is high but `generate_lead` is near zero, the problem is **on the page itself**.
4. If `page_view` is *also* low, the problem is **upstream** (Facebook ads not getting clicks).

**Action:** Check your GA4 dashboard for Event Count over the last 30 days.

---

## 🔍 META PIXEL CHECK

Your Facebook Pixel (1371750064632137) is tracking:
- `PageView` (line 99)
- `Lead` (line 411-416, fires on form success)

**To diagnose:**
1. Go to **Meta Events Manager > Overview**
2. Check the ratio of `PageView` to `Lead`
3. Industry average for lead gen forms is 2-5% conversion. If you're below 1%, the page friction is the issue.

---

## 🛠️ IMMEDIATE ACTION ITEMS (COPY-PASTE READY)

### A. Add Trust Line Above Form
```tsx
// In WaitlistForm, above the <form> tag
<p style={{fontSize: '11px', opacity: 0.5, textAlign: 'center', marginBottom: 'var(--s-12)'}}>
  ✓ No payment required • ✓ 30 seconds • ✓ Your data stays private
</p>
```

### B. Soften Privacy Checkbox Wording
```tsx
// Line 521
<label htmlFor="genesis-privacy" style={{ fontSize: '12px' }}>
  I'd like to learn more about this service (no obligation)
</label>
```

### C. Add Savings Context to Slider
```tsx
// Line 513
<label htmlFor="genesis-cost" className="calc-label">
  Monthly Heating Cost <span style={{opacity: 0.5, fontWeight: 400}}>(helps estimate your savings)</span>
</label>
```

### D. Track Form Funnel
```tsx
// Add import at top
import { track } from './lib/analytics'

// In WaitlistForm useEffect
useEffect(() => {
    track('form_section_viewed', { leadCount, device: window.innerWidth < 768 ? 'mobile' : 'desktop' })
}, [])
```

---

## 📊 NEXT STEPS

1. **Check GA4** for PageView vs Generate_Lead ratio
2. **Check Meta Events Manager** for PageView vs Lead ratio
3. **Run the Admin Dashboard** (`/admin?token=YOUR_SECRET`) to see if leads are even hitting Airtable
4. **Implement the trust line and soft wording changes** (low effort, high impact)
5. **Consider A/B testing** the phone field (required vs optional)

---

*Report generated by Genesis Engineering Intelligence. For implementation support, ping the thread.*
