# 🏛️ GENESIS STRATEGIC ADVISORY — Q1 2026 REVIEW

**From:** Strategic Advisory Board  
**To:** Genesis Heating Solutions, Founder  
**Date:** March 25, 2026  
**Classification:** Internal — Founder Eyes Only

---

## EXECUTIVE SUMMARY

You have a real product, a real arbitrage, and a real market. You have zero customers and zero funding. That's not a weakness — it's a clean sheet. Every decision you make right now compounds. Here's how to make sure it compounds in the right direction.

---

## PART I: WHAT'S ACTUALLY WORKING

Before fixing anything, acknowledge what you've built correctly:

1. **The unit economics are legitimate.** $900-$2,300 net annual yield at conservative BTC floors is defensible. Marketing at "$1,000/year" creates a trust buffer.

2. **The dual-path pricing removes the biggest objection.** $5,950 ownership for high-conviction buyers. $450 activation for skeptics. This is textbook SaaS conversion laddering applied to hardware.

3. **The website is abnormally good for a zero-budget startup.** Sub-14KB, fast, professional. This is your silent credibility engine. People will Google you after seeing a Facebook post — and when they land on that site, it doesn't look like a scam.

4. **You've correctly identified your moat.** It's not the hardware. It's the Technical Management Layer. Reliance can buy 5,000 units. They cannot build the pool sync, Lightning payouts, and automated uptime verification stack overnight.

---

## PART II: THE 7 THINGS THAT WILL KILL YOU (AND HOW TO PREVENT EACH)

### Risk 1: Cash Flow Starvation

**The Problem:** You need ~$4,550 in hardware for each Builder Path ($450) install. You're upside-down by $4,100 on Day 1. At 60/40 split, it takes 12-18 months to break even per unit.

**The Fix:**
- **The 50/50 Rule is non-negotiable.** For every Builder Path install, you MUST close one Owner Path ($5,950) install first. The $1,400 integration fee from Path A funds the hardware for Path B.
- **Never carry more than 2 units in inventory at a time.** JIT + 1 max. Cash tied up in sitting hardware is cash not earning.
- **Consider a "Founding Member" tier:** First 5 installs get $500 off the Owner Path ($5,450 instead of $5,950). In exchange, they agree to a lawn sign for 12 months and one video testimonial. This turns your first 5 customers into your ad budget.

**Financial Model:**
```
Owner Path Revenue:
  Hardware (at cost):       $4,550 → pass-through (net $0)
  Integration Fee:          $1,400 → GROSS MARGIN
  8% Mgmt Fee (annual):    $225-$335/yr → RECURRING
  
Builder Path Revenue:
  Activation Fee:           $450 → covers dispatch, partial install
  60% compute share (M1-18): ~$1,680-$2,520/yr → RECURRING  
  25% compute share (M19-36): ~$700-$1,050/yr → RECURRING
  5% mgmt fee (M37+):       ~$140-$210/yr → RECURRING
  
CAPEX per Builder unit:     -$4,100 (hardware gap)
Break-even:                 ~14 months at mid-range yields
```

### Risk 2: Bitcoin Volatility Destroying Your Promise

**The Problem:** You market "$1,000/year savings." If BTC drops to $30k, your gross compute revenue falls to ~$1,400/yr. After $1,910 in electricity, you're underwater by $510.

**The Fix:**
- **Build in a Minimum Management Fee of $15/month.** This is already in the Gold Book. Enforce it. This covers your monitoring costs even in a trough.
- **The "$1,000" promise should ALWAYS be "approximately $1,000" with a footnote.** Never guarantee a specific number. Your website already does this correctly.
- **Create a "Revenue Floor" guarantee for Owner Path:** "If the system generates less than $500 in its first 12 months, we waive the management fee for the following year." This costs you very little (8% of a small number) but creates massive trust.

**Sensitivity Table:**
```
BTC Price  | Gross Revenue | OpEx ($1,910) | Net Yield | Your 8% Fee
$30,000    | $1,400        | $1,910        | -$510     | $0 (floor)
$45,000    | $2,100        | $1,910        | $190      | $15/mo min
$60,000    | $2,800        | $1,910        | $890      | $71
$80,000    | $3,600        | $1,910        | $1,690    | $135
$100,000   | $4,200        | $1,910        | $2,290    | $183
```

### Risk 3: The "Scam" Perception

**The Problem:** You're selling a water heater that "makes money." To a suburban homeowner scrolling Facebook, this triggers every MLM/crypto scam alarm.

**The Fix:**
- **The ESA permit is your trust weapon.** Every install is inspected by the Electrical Safety Authority. No scam operation submits to government inspection. Say this loudly and repeatedly.
- **The $5,950 Owner Path is your credibility anchor.** It proves you're not running a Ponzi. You're selling real hardware at transparent cost. The existence of a "buy it outright" option makes the "zero-down" option feel legitimate.
- **Never, ever use the word "passive income."** That phrase is radioactive. Use "utility credit" or "monthly offset."
- **Testimonials beat specs.** Your first customer's video saying "I saved $80 this month" is worth more than every technical spec on your site combined.

**Language Guide:**
```
NEVER SAY:              ALWAYS SAY:
Passive income          Utility credit / monthly offset
Investment              Upgrade / installation
Returns                 Credits / savings
Mining                  Background computing / data processing
Crypto                  Computational rewards
Free money              Reduced heating costs
```

### Risk 4: Single-Contractor Dependency

**The Problem:** If your one HVAC contractor gets sick, has a dispute, or takes a better job, your entire installation pipeline stops.

**The Fix:**
- **Have 2 certified contractors on the manifest by Spring.** Even if one is a backup you rarely use, the redundancy is critical.
- **The Contractor Work Order must be standardized and documented.** Any licensed HVAC tech should be able to follow your install manifest cold. Photo validation, thermal testing, network latency check — all documented in the SOP.
- **Pay contractors within 7 days of completed install validation.** Fast payment = loyal contractors.

### Risk 5: Superheat Dependency

**The Problem:** You're building a business on one hardware manufacturer's product. If Superheat raises prices, changes licensing terms, or goes under, you're exposed.

**The Fix:**
- **Position Genesis as "compute-agnostic."** The Gold Book already has this. Make it real. Research at least one alternative thermal computing unit (even if you don't currently sell it).
- **Your brand is Genesis, not Superheat.** (Already locked in the SKILL.md.) Customers should feel loyal to YOUR service, not to a hardware manufacturer they've never heard of.
- **Negotiate a written reseller agreement.** Even a simple email exchange confirming your pricing, territory, and terms protects you.

### Risk 6: Scaling Without Diluting Quality

**The Problem:** You're a one-person operation. At 10 installs, you're stretched. At 50, you're broken.

**The Fix — The "1+1000" Model:**
- **YOU do:** Consultations, brand, strategy, and closing.
- **CONTRACTORS do:** Physical installs (standardized SOP).
- **AUTOMATION does:** Lead capture, monitoring, reward payouts, scheduling.
- **The Admin Dashboard (already built):** Use it. Geographic density, lead scoring, path distribution — all the data you need to prioritize is already on your `/admin` route.

**Scaling Stage Gates:**
```
Stage 1 (0-10 installs):   You + 1 contractor. Manual everything.
Stage 2 (10-30 installs):  You + 2 contractors. Airtable automations.
Stage 3 (30-100 installs): Hire 1 ops person. Systemize consults.
Stage 4 (100+):            Regional expansion or acquisition conversations.
```

### Risk 7: Regulatory Ambush

**The Problem:** Ontario energy regulations could change. Municipal bylaws could target "data processing" in residential zones. CRA could reclassify compute rewards as business income (they should, and you should be advising customers on this).

**The Fix:**
- **Every customer gets a 1-page tax advisory:** "The compute credits generated by your system may be considered taxable income. We recommend discussing this with your accountant. Genesis Heating Solutions does not provide tax advice." This protects you legally and builds trust.
- **Track the Ontario Energy Board (OEB) regulatory calendar.** If ULO rates change, your model changes. Build in a quarterly review.
- **Municipal zoning:** A water heater that runs computations is still a water heater. No separate permit class exists in London. But if one ever does, your ESA compliance gives you standing.

---

## PART III: MARGIN PROTECTION FRAMEWORK

### The Genesis P&L (Per Unit, Annual)

```
OWNER PATH (Year 1):
  Revenue:
    Integration Fee:        $1,400.00
    8% Mgmt Fee:            $71-$183/yr (market dependent)
  COGS:
    Hardware (pass-through): $0 (customer pays)
    Contractor labor:        -$900
    ESA Permit:              -$150
    Technical setup:         -$350 (your time)
  ─────────────────────────
  Gross Margin (Year 1):    $71-$183 + ($1,400 - $1,400) = $71-$183
  Gross Margin (Year 2+):   $71-$183/yr (pure recurring)
  
BUILDER PATH (Year 1):
  Revenue:
    Activation Fee:          $450.00
    60% Compute Share:       $1,680-$2,520/yr
  COGS:
    Hardware:                -$4,550
    Contractor labor:        -$900
    ESA Permit:              -$150
    Electricity subsidy:     $0 (customer pays their hydro)
  ─────────────────────────
  Gross Margin (Year 1):    -$3,470 to -$2,630 (investment year)
  Gross Margin (Year 2):    +$1,680-$2,520 (60% share)
  Cumulative Break-even:    ~Month 14-18
```

### The Key Metric: Blended CAC

```
Current CAC (Facebook organic):  ~$0 (your time only)
Target CAC (at scale):           <$250/customer
Maximum Allowable CAC:           $500 (above this, Path A margins erode)

Rule: If CAC > $250, stop paid ads and double down on 
neighbourhood referrals. Your best marketing channel is a 
satisfied customer with a lawn sign.
```

### Margin Protection Rules

1. **Never discount the Integration Fee below $1,200.** That's your operating cash.
2. **Never offer more than 92% customer share on Owner Path.** The 8% covers your monitoring infrastructure.
3. **The $15/month Minimum Management Fee is your floor.** It guarantees you $180/year per unit regardless of market conditions. At 100 units, that's $18,000/year of guaranteed revenue.
4. **Electricity is ALWAYS the customer's expense.** Never subsidize hydro. The moment you take on electricity cost, you take on unlimited downside risk.

---

## PART IV: THE AUTOMATION STACK (PROFESSIONALIZED)

### Current State
```
Lead Capture:  Website waitlist → Airtable (via API)
               Facebook Lead Form → Airtable (via Make.com)
Analytics:     GA4 + Meta Pixel + Custom analytics.ts
Monitoring:    Admin Dashboard (/admin)
Content:       Manual (Genesis Lead Engine SKILL.md)
```

### Target State (Zero Budget)
```
Lead Capture:  Same + Facebook Group engagement → Manual DM → Airtable
Scheduling:    Meta Business Suite (1 week of posts scheduled every Sunday)
Lead Scoring:  Airtable formula: High Value = Monthly Cost > $150 + Byron/Masonville
Nurture:       Airtable automation → Email template on new lead (Make.com)
Content:       Weekly SKILL.md invocation → 4 posts + 1 render + 1 group post
Reporting:     Weekly GA4 screenshot → /admin dashboard review
```

### The Sunday Automation Ritual (30 minutes/week)

```
Every Sunday morning:
1. Open this conversation. Ask: "Generate this week's Genesis content."
2. Copy posts into Meta Business Suite. Schedule Mon/Wed/Fri/Sun.
3. Copy 1 group post. Post from personal account to 1 local group.
4. Check Airtable for new leads. Send DM to any from this week.
5. Check /admin dashboard for geographic density changes.
6. Screenshot GA4 event counts. Note PageView vs generate_lead ratio.
Done. Back to your day.
```

---

## PART V: THE NEXT 90 DAYS (MARCH 25 - JUNE 25, 2026)

### Month 1 (Now - April 25)
- [ ] Close first 2 consultations (use DM nurture scripts)
- [ ] Secure 2nd HVAC contractor for backup
- [ ] Get written reseller confirmation from Superheat
- [ ] Generate 4 weeks of content (via SKILL.md)
- [ ] Create "Founding Member" offer ($500 off + lawn sign)
- [ ] Prepare 1-page tax advisory for customers

### Month 2 (April 25 - May 25)
- [ ] First physical install (Lighthouse #1)
- [ ] Film 60-second install time-lapse on phone
- [ ] Get first customer testimonial (even 2 sentences)
- [ ] Post first "real install" photo to Facebook page
- [ ] Begin Phase 1 neighbourhood signage

### Month 3 (May 25 - June 25)
- [ ] 3-5 total installs operational
- [ ] First month of compute data from live units
- [ ] Post real yield numbers (redacted customer name)
- [ ] Begin conversation with 2nd neighbourhood (Old North)
- [ ] Review: Is CAC < $250? If yes, consider $50/month Meta Ads.

---

## PART VI: THE ONE THING THAT WILL MAKE OR BREAK YOU

Everything above is important. But here's the single insight that separates the businesses that make it from the ones that don't:

**Your first customer is not a customer. They are proof.**

The first person who installs a Genesis system and posts on Facebook: "I saved $87 this month on my water heating bill" — that one post, from a real person, in a real London neighbourhood — is worth more than every AI render, every ad, every spec sheet, and every strategy document in this repository combined.

Every single thing you do between now and that moment is just getting to that moment.

Move fast. Stay honest. Get the first install done.

---

**[ADVISORY SEALED]**  
**Genesis Heating Solutions | March 2026**
