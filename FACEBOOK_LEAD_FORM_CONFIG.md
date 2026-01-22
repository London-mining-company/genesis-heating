# 📋 Facebook Instant Form Configuration: "Genesis Waitlist"

Use this clinical, high-trust configuration when setting up your **Facebook Lead Form** in the Ads Manager. This emulates the logic of the `genesisheatingsolutions.ca` site and aligns with our Airtable CRM schema.

---

## 🏗️ 1. Form Type
**Choice:** More Volume (Fastest for the user)

---

## 👋 2. Intro (The "Greeting")
*Matches the Hero of the site.*

**Headline:** Heating that makes cents. 🇨🇦
**Layout:** List
**Bullet Points:**
- Get high-efficiency hot water.
- Earn monthly computational rewards.
- Professional local installation in London, ON.
- Zero technical knowledge required.

---

## ❓ 3. Questions
*Aligns with our Airtable data schema.*

### **Custom Question #1 (Multiple Choice)**
**Question:** Property Profile
**Options:**
- Home (Residential)
- Business (Commercial)

### **Custom Question #2 (Short Answer)**
**Question:** Approximate Monthly Heating Cost ($)
**Purpose:** Helps our technicians prep your ROI calculation before the call.

### **Prefill Questions (User Information)**
*Note: Facebook fills these automatically.*
- **Full Name** (full_name)
- **Email Address** (email)
- **Phone Number** (phone)
- **Postal Code** (postal_code)

---

## 🔒 4. Privacy Policy
**Link URL:** https://www.genesisheatingsolutions.ca/privacy.html
**Link Text:** Privacy Policy

---

## 🏁 5. Completion (The "Thank You" Screen)
**Headline:** You are in the queue.
**Description:** 
A Genesis technician will reach out in Spring 2026 to discuss your home’s eligibility and walk through next steps. 

Every unit installed contributes to stronger local community pools in London. More neighbours = better economics for the whole street.

**CTA Button:** View Website
**CTA Link:** https://www.genesisheatingsolutions.ca

---

## ⚙️ 6. Mapping for Airtable (CRM Setup)
If you are using Zapier or a direct integration to Airtable, map the Facebook fields like this:

| Facebook Field | Airtable Field |
| :--- | :--- |
| Full Name | `name` |
| Email | `email` |
| Phone Number | `phoneNumber` |
| Postal Code | `postalCode` |
| Property Profile | `propertyType` (Map 'Home' to 'home', 'Business' to 'business') |
| Monthly Heating Cost | `monthlyHeatingCost` |
| Form Name (Fixed) | `source` (Value: `facebook_ads_v1`) |
