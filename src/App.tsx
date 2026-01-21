import { useState, useEffect } from 'preact/hooks'
import { JSX } from 'preact'


interface FormData {
    email: string
    name: string
    phoneNumber: string
    postalCode: string
    propertyType: 'residential' | 'commercial' | ''
    monthlyHeatingCost: number
    privacyAccepted: boolean
    marketingConsent: boolean
    website: string
}

interface FormErrors {
    email?: string
    name?: string
    postalCode?: string
    privacyAccepted?: string
    general?: string
}

// Form timing is tracked via hidden fields for bot detection





// Utility
const sTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })


const Header = () => {
    const [s, setS] = useState(false)
    useEffect(() => {
        const h = () => setS(window.scrollY > 20)
        window.addEventListener('scroll', h)
        return () => window.removeEventListener('scroll', h)
    }, [])

    return (
        <header className={`header ${s ? 's' : ''}`} role="banner">
            <div className="container header-inner">
                <a href="/" className="logo"><img src="/genesis-logo-v4.jpg" alt="Genesis" className="logo-img" /></a>
                <button onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })} className="btn btn-primary nav-cta">Join</button>
            </div>
        </header>
    )
}


const Hero = () => (
    <section className="hero" aria-labelledby="h-h">
        <div className="video-background">
            <iframe src="https://www.youtube.com/embed/T_r5TUR2cYk?autoplay=1&mute=1&loop=1&playlist=T_r5TUR2cYk&controls=0&rel=0" frameBorder="0" allow="autoplay; encrypted-media" aria-hidden="true"></iframe>
            <div className="video-overlay"></div>
        </div>
        <div className="container hero-content">
            <div className="hero-badge">
                <span className="hero-badge-dot" aria-hidden="true"></span>
                <span>Turning Energy Waste Into Wealth</span>
            </div>
            <h1 id="h-h">Warm water. <span className="text-orange">Monthly income.</span></h1>
            <p className="hero-subtitle">Stop paying for heat that just disappears. We turn your water heater into an income source.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button onClick={() => sTo('waitlist')} className="btn btn-primary btn-lg shadow-glow">Join</button>
                <a href="#how-it-works" className="btn btn-secondary btn-lg">How It Works</a>
            </div>
            <div className="hero-stats">
                <div className="stat"><b>~3.8t</b><br />CO₂/Year</div>
                <div className="stat"><b>~$900</b><br />Saved/Year</div>
                <div className="stat"><b>Liquid</b><br />Cooled</div>
            </div>
        </div>
    </section>
)


// HOW IT WORKS SECTION


// DATA CONSTANTS (Hoisted for better minification)

const Icon = ({ p }: { p: string }) => <svg className="icon-svg" viewBox="0 0 24 24"><path d={p} /></svg>

const STEPS = [
    { n: 1, t: 'Process', d: 'The unit performs computing work (Bitcoin mining).' },
    { n: 2, t: 'Capture', d: 'We capture the heat from that work to warm your water.' },
    { n: 3, t: 'Earn', d: 'You get paid for the computing. Your water bill drops.' },
]

const BENEFITS = [
    { i: 'M13 2L3 14h9l-1 8 10-12h-9', t: 'Income Source', d: 'This water heater pays you. Standard ones just cost you.' },
    { i: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z', t: 'Dual Purpose', d: 'Use the same electricity twice: once for work, once for heat.' },
    { i: 'M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6', t: 'Silent', d: 'Liquid-cooled means no fan noise. Just quiet efficiency.' },
    { i: 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z', t: 'Network', d: 'Join a local network of efficiently headed homes.' },
]

const FAQS = [
    { q: 'What is "Dual Purpose"?', a: 'Traditional heaters just burn energy to make heat. Superheat units use energy to process data (generating revenue) and use the heat from that processor to warm your water. We don\'t waste the byproduct.' },
    { q: 'Is this just a normal water heater?', a: 'It installs like one and acts like one (reliable hot water), but it\'s built with computer servers inside. That\'s how it earns money.' },
    { q: 'How much money can I make?', a: 'Homeowners typically see up to $1,000/year in combined savings and earnings. It turns a bill you have to pay into money in your pocket.' },
    { q: 'Commercial & Hotels?', a: 'If you manage many units (like a hotel), you can control them all from one dashboard. It turns a major expense line item into a revenue stream. [Learn more](https://superheat.xyz)' },
    { q: 'Is it noisy?', a: 'No. It\'s liquid cooled, meaning no loud fans. It runs silent.' },
    { q: 'Why Bitcoin?', a: 'Bitcoin mining is the most efficient way to convert electricity into money and heat simultaneously, 24/7. It ensures your heat is always subsidized by revenue.' },
]



// HOW IT WORKS SECTION

const HowItWorks = () => (
    <section id="how-it-works" className="section how-it-works" aria-labelledby="hiw-heading">
        <div className="container">
            <header className="section-header">
                <h2 id="hiw-heading">How It Works</h2>
                <p>Superheat tech. Genesis installs.</p>
            </header>
            <div className="steps-grid">
                {STEPS.map(s => (
                    <article key={s.n} className="step-card">
                        <div className="step-number" aria-hidden="true">{s.n}</div>
                        <h3>{s.t}</h3>
                        <p>{s.d}</p>
                    </article>
                ))}
            </div>
        </div>
    </section>
)


// BENEFITS SECTION

const Benefits = () => (
    <section className="section" aria-labelledby="benefits-heading">
        <div className="container">
            <header className="section-header">
                <h2 id="benefits-heading">Why Genesis?</h2>
                <p>Local expertise. Real savings. Cleaner energy.</p>
            </header>
            <div className="benefits-grid">
                {BENEFITS.map(b => (
                    <article key={b.t} className="benefit-card">
                        <div className="benefit-icon" aria-hidden="true"><Icon p={b.i} /></div>
                        <h4>{b.t}</h4>
                        <p>{b.d}</p>
                    </article>
                ))}
            </div>
        </div>
    </section>
)


// INFOGRAPHIC SECTION

const Infographic = () => (
    <section className="section infographic-section" style={{ background: 'var(--c-bg)' }}>
        <div className="container">
            <header className="section-header">
                <h2>The 2-Year Path</h2>
                <p>Designed for rapid ROI and 53% energy savings.</p>
            </header>
            <div className="infographic-container">
                <div className="info-card">
                    <Icon p="M12 2L2 7l10 5 10-5zM2 17l10 5 10-5" />
                    <h4>Investment</h4>
                    <div className="info-value">$2k</div>
                    <p>Acquisition</p>
                </div>
                <div className="info-arrow">→</div>
                <div className="info-card featured">
                    <Icon p="M13 2L3 14h9l-1 8 10-12h-9" />
                    <h4>Benefit</h4>
                    <div className="info-value">$1.3k+</div>
                    <p>Annual savings</p>
                </div>
                <div className="info-arrow">→</div>
                <div className="info-card">
                    <Icon p="M8 21h8M12 17V21M7 4h10M17 4v7a5 5 0 01-10 0V4" />
                    <h4>Return</h4>
                    <div className="info-value">~2 Yrs</div>
                    <p>Full break-even</p>
                </div>
            </div>
            <div className="info-footnote">*Ontario 2025 rates. See footer.</div>
        </div>
    </section>
)


// SAVINGS CALCULATOR

const TIME_STEPS = [1, 3, 5, 10]
const SavingsCalculator = () => {
    const [idx, setIdx] = useState(0)
    const years = TIME_STEPS[idx]

    // London 2025 calculation: 
    // Avg London electricity bill (kWh) x savings coefficient + mining reward
    const totalBenefit = years * 1318

    return (
        <section className="section calculator-section">
            <div className="container">
                <header className="section-header">
                    <h2>Prospective Savings</h2>
                    <p>10-year impact based on London rates.</p>
                </header>
                <div className="calculator-card">
                    <div className="calculator-grid">
                        <div className="calc-stat-card">
                            <div className="calc-stat-value text-orange">${totalBenefit.toLocaleString()}</div>
                            <div className="calc-stat-label">Total Benefit</div>
                        </div>
                        <div className="calc-stat-card">
                            <div className="calc-stat-value">${(years * 318).toLocaleString()}</div>
                            <div className="calc-stat-label">Offset</div>
                        </div>
                        <div className="calc-stat-card">
                            <div className="calc-stat-value">{(years * 5.3).toFixed(1)}t</div>
                            <div className="calc-stat-label">CO2 Saved</div>
                        </div>
                    </div>
                    <div className="slider-container" style={{ marginTop: '3rem' }}>
                        <div className="slider-label">
                            <span>Timeline</span>
                            <span style={{ fontWeight: 600, color: 'var(--c-accent)' }}>{years}y</span>
                        </div>
                        <input type="range" className="slider" min="0" max="3" step="1" value={idx} onChange={e => setIdx(+e.currentTarget.value)} />
                        <div className="slider-label text-muted"><span>1y</span><span>3</span><span>5</span><span>10y</span></div>
                    </div>
                    <p style={{ fontSize: '10px', color: 'var(--c-text-muted)', textAlign: 'center', marginTop: '1.5rem' }}>
                        *Target $1,318/yr value. See footer.
                    </p>
                </div>
            </div>
        </section>
    )
}


// WAITLIST FORM - Multi-Step High-Conversion Wizard

const WaitlistForm = () => {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState<FormData>({
        email: '',
        name: '',
        phoneNumber: '',
        postalCode: '',
        propertyType: '',
        monthlyHeatingCost: 200,
        privacyAccepted: false,
        marketingConsent: false,
        website: '',
    })

    const [errors, setErrors] = useState<FormErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    useEffect(() => {
        // Load persisted data
        const saved = localStorage.getItem('genesis_form_draft')
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                setFormData(prev => ({ ...prev, ...parsed }))
            } catch (e) {
                console.warn('Failed to load form draft')
            }
        }
    }, [])

    useEffect(() => {
        // Save draft on change
        localStorage.setItem('genesis_form_draft', JSON.stringify(formData))
    }, [formData])

    const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    const validatePostalCode = (code: string): boolean => !code || /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(code)

    const handleChange = (e: JSX.TargetedEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.currentTarget
        const { name, value, type } = target
        const checked = (target as HTMLInputElement).checked

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))

        // Clear error on valid input
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }))
        }
    }



    const handleNextStep = () => {
        // Validate Step 1 before proceeding
        const newErrors: FormErrors = {}
        if (!formData.name.trim()) newErrors.email = 'Please enter your name' // using email slot for simplicity
        if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email'

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setStep(2)
    }

    const handleSubmit = async (e: JSX.TargetedEvent<HTMLFormElement>) => {
        e.preventDefault()

        const newErrors: FormErrors = {}
        if (!formData.privacyAccepted) newErrors.privacyAccepted = 'Required to proceed'
        if (formData.postalCode && !validatePostalCode(formData.postalCode)) newErrors.postalCode = 'Invalid format'

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, sid: sessionStorage.getItem('sh_sid') })
            })

            const resTxt = await response.text();
            let data;

            try {
                data = JSON.parse(resTxt)
            } catch {
                // Detection for dev error (Vite returning HTML instead of JSON)
                if (resTxt.includes('<!DOCTYPE html>') || response.status === 404) {
                    throw new Error('API server not found. If developing locally, please use "vercel dev" instead of "npm run dev" to enable waitlist functions.')
                }
                data = { error: { message: `Server error (${response.status})` } }
            }

            if (!response.ok) {
                throw new Error(data.error?.message || `Submission failed (${response.status})`)
            }

            localStorage.removeItem('genesis_form_draft') // Clear on success
            setIsSuccess(true)
        } catch (err) {
            console.error('Submission error:', err)
            setErrors(prev => ({
                ...prev,
                general: err instanceof Error ? err.message : 'Something went wrong. Please try again.'
            }))
        } finally {
            setIsSubmitting(false)
        }
    }

    // ====== SUCCESS STATE ======
    if (isSuccess) {
        return (
            <section id="waitlist" className="section waitlist-section" aria-labelledby="waitlist-heading">
                <div className="container">
                    <div className="form-card fade-in" style={{ textAlign: 'center', padding: 'var(--s-12)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--s-4)' }}>🎉</div>
                        <h3 style={{ fontSize: 'var(--f-size-2xl)', marginBottom: 'var(--s-4)' }}>You're on the List!</h3>
                        <p style={{ color: 'var(--c-text-muted)', marginBottom: 'var(--s-6)', maxWidth: '400px', margin: '0 auto var(--s-6)' }}>
                            Thanks, {formData.name || 'friend'}. We'll be in touch for 2026.
                        </p>
                        <div style={{
                            display: 'inline-block',
                            padding: 'var(--s-4) var(--s-6)',
                            background: 'rgba(255, 85, 0, 0.1)',
                            borderRadius: 'var(--r-lg)',
                            border: '1px solid rgba(255, 85, 0, 0.3)',
                        }}>
                            <span style={{ color: 'var(--c-accent)', fontWeight: 600 }}>Early Access Priority</span>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    // ====== FORM UI ======
    return (
        <section id="waitlist" className="section waitlist-section" aria-labelledby="waitlist-heading">
            <div className="container">
                <header className="section-header">
                    <h2 id="waitlist-heading">Join the Waitlist</h2>
                    <p>Be first in line for zero-cost heating in London, Ontario.</p>
                </header>

                {/* Progress Bar */}
                <div style={{ maxWidth: '500px', margin: '0 auto var(--s-6)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--s-2)', fontSize: 'var(--f-size-sm)', color: 'var(--c-text-muted)' }}>
                        <span style={{ color: step >= 1 ? 'var(--c-accent)' : undefined }}>1. Your Info</span>
                        <span style={{ color: step >= 2 ? 'var(--c-accent)' : undefined }}>2. Property Details</span>
                    </div>
                    <div style={{ height: '4px', background: 'var(--c-border)', borderRadius: 'var(--r-full)', overflow: 'hidden' }}>
                        <div style={{
                            width: step === 1 ? '50%' : '100%',
                            height: '100%',
                            background: 'var(--g-accent)',
                            transition: 'width 0.4s ease',
                        }} />
                    </div>
                </div>

                <form className="form-card" onSubmit={handleSubmit} noValidate>
                    {/* Honeypot */}
                    <div style={{ opacity: 0, position: 'absolute', top: 0, left: 0, height: 0, overflow: 'hidden', zIndex: -1 }}>
                        <input type="text" name="website" value={formData.website} onChange={handleChange} tabIndex={-1} autoComplete="off" />
                    </div>

                    {errors.general && (
                        <div style={{
                            background: 'rgba(255, 50, 50, 0.1)',
                            border: '1px solid #ff4444',
                            color: '#ff4444',
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            fontSize: '14px'
                        }}>
                            {errors.general}
                        </div>
                    )}

                    {/* ===== STEP 1: Basic Info ===== */}
                    <div style={{ display: step === 1 ? 'block' : 'none' }}>
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">Full Name *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className={`form-input ${errors.name ? 'error' : ''}`}
                                placeholder="John Smith"
                                value={formData.name}
                                onChange={handleChange}
                                autoComplete="name"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email *</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className={`form-input ${errors.email ? 'error' : ''}`}
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                            />
                            {errors.email && <p className="form-error">{errors.email}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="phoneNumber" className="form-label">Phone (Optional)</label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                className="form-input"
                                placeholder="(519) 000-0000"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                autoComplete="tel"
                            />
                        </div>

                        <button type="button" onClick={handleNextStep} className="btn btn-primary btn-lg form-submit">
                            Continue →
                        </button>
                    </div>

                    {/* ===== STEP 2: Property Details ===== */}
                    <div style={{ display: step === 2 ? 'block' : 'none' }}>
                        <button type="button" onClick={() => setStep(1)} style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--c-text-muted)',
                            fontSize: 'var(--f-size-sm)',
                            cursor: 'pointer',
                            marginBottom: 'var(--s-4)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--s-1)',
                        }}>
                            ← Back
                        </button>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="postalCode" className="form-label">Postal Code</label>
                                <input
                                    type="text"
                                    id="postalCode"
                                    name="postalCode"
                                    className={`form-input ${errors.postalCode ? 'error' : ''}`}
                                    placeholder="N6A 1A1"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    autoComplete="postal-code"
                                />
                                {errors.postalCode && <p className="form-error">{errors.postalCode}</p>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="propertyType" className="form-label">Property Type</label>
                                <select
                                    id="propertyType"
                                    name="propertyType"
                                    className="form-input"
                                    value={formData.propertyType}
                                    onChange={handleChange}
                                >
                                    <option value="">Select</option>
                                    <option value="residential">Home</option>
                                    <option value="commercial">Business</option>
                                </select>
                            </div>
                        </div>

                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                id="marketingConsent"
                                name="marketingConsent"
                                className="checkbox"
                                checked={formData.marketingConsent}
                                onChange={handleChange}
                            />
                            <label htmlFor="marketingConsent" className="checkbox-label">
                                Send me updates & offers.
                            </label>
                        </div>

                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                id="privacyAccepted"
                                name="privacyAccepted"
                                className={`checkbox ${errors.privacyAccepted ? 'error' : ''}`}
                                checked={formData.privacyAccepted}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="privacyAccepted" className="checkbox-label">
                                I agree to the <a href="/privacy">Privacy Policy</a>. *
                            </label>
                        </div>
                        {errors.privacyAccepted && <p className="form-error" style={{ marginTop: '-0.5rem', marginBottom: '1rem' }}>{errors.privacyAccepted}</p>}

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg form-submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                        </button>

                        <p style={{ marginTop: 'var(--s-4)', fontSize: 'var(--f-size-xs)', color: 'var(--c-text-dim)', textAlign: 'center' }}>
                            🔒 Your information is secure and will never be shared.
                        </p>
                    </div>
                </form>
            </div>
        </section>
    )
}


// FAQ SECTION

const FAQ = () => {
    const [openIdx, setOpenIdx] = useState<number | null>(null)

    return (
        <section className="section">
            <div className="container">
                <header className="section-header"><h2>Frequently Asked Questions</h2></header>
                <div className="faq-list">
                    {FAQS.map((f, i) => (
                        <div key={i} className={`faq-item ${openIdx === i ? 'open' : ''}`}>
                            <button className="faq-question" onClick={() => setOpenIdx(openIdx === i ? null : i)}>
                                <span>{f.q}</span>
                                <span className="faq-icon">+</span>
                            </button>
                            <div className="faq-answer">
                                <p className="faq-answer-content" dangerouslySetInnerHTML={{ __html: f.a.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-orange">$1</a>') }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

const Foot = () => (
    <footer className="footer section">
        <div className="container" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '10px', color: 'var(--c-text-dim)', textAlign: 'left', marginBottom: '1rem' }}>
                *Savings vary. Fluctuates with rates & yields. Local Red-Seal only.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginBottom: '1rem' }}>
                <a href="https://www.facebook.com/profile.php?id=61586536350637" target="_blank" rel="noopener" aria-label="FB">
                    <svg style={{ width: 24, height: 24 }} viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
                </a>
            </div>
            <nav className="footer-links" style={{ marginBottom: '1rem' }}>
                <a href="/privacy.html">Privacy</a>
                <a href="/terms.html">Terms</a>
                <a href="mailto:genesisheatingsolutions@gmail.com">Contact</a>
            </nav>
            <p style={{ fontSize: '12px' }}>© {new Date().getFullYear()} Genesis Heating</p>
        </div>
    </footer>
)




export default function App() {
    return (
        <>
            <Header />
            <main>
                <Hero />
                <HowItWorks />
                <Infographic />
                <Benefits />
                <SavingsCalculator />
                <WaitlistForm />
                <FAQ />
            </main>
            <Foot />
        </>
    )
}
