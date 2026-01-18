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
    postalCode?: string
    privacyAccepted?: string
    general?: string
}

// Form timing is tracked via hidden fields for bot detection





// TRACKING UTILITIES

const trackEvent = (_: string, __?: any) => { }

const trackFunnel = (_: string) => { }


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
                <a href="/" className="logo"><img src="/genesis-logo-v4.jpg" alt="Genesis Heating Solutions" className="logo-img" /></a>
                <button onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })} className="btn btn-primary nav-cta">Join</button>
            </div>
        </header>
    )
}


const Hero = () => {
    const s = () => {
        document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
        trackEvent('c', { l: 'h' })
    }

    return (
        <section className="hero" aria-labelledby="hero-heading">
            {/* Background Video Layer */}
            <div className="video-background">
                <iframe
                    src="https://www.youtube.com/embed/T_r5TUR2cYk?autoplay=1&mute=1&loop=1&playlist=T_r5TUR2cYk&controls=0&rel=0"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title="Background Video"
                ></iframe>
                <div className="video-overlay"></div>
            </div>

            <div className="container hero-content">
                <div className="hero-badge">
                    <span className="hero-badge-dot" aria-hidden="true"></span>
                    <span>Launching Spring 2026 in London, Ontario</span>
                </div>

                <h1 id="hero-heading">
                    The future of home heating <span className="text-orange">makes you money</span>
                </h1>

                <p className="hero-subtitle">
                    Genesis heats your water and your wallet. Join the 2026 rollout in London.
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button onClick={s} className="btn btn-primary btn-lg">
                        Join Waitlist — Free Consult
                    </button>
                    <a href="#how-it-works" className="btn btn-secondary btn-lg">
                        See How It Works
                    </a>
                </div>

                <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--c-text-dim)' }}>
                    Powered by <a href="https://www.superheat.xyz/h1" target="_blank" rel="noopener" className="text-orange">Superheat</a> technology
                </p>

                <div className="hero-stats">
                    <div className="stat">
                        <div className="stat-value">53%</div>
                        <div className="stat-label">Energy Offset</div>
                    </div>
                    <div className="stat">
                        <div className="stat-value">$1,318</div>
                        <div className="stat-label">Annual Benefit</div>
                    </div>
                    <div className="stat">
                        <div className="stat-value">5.3 Tons</div>
                        <div className="stat-label">Annual CO2 Offset</div>
                    </div>
                </div>
            </div>
        </section>
    )
}


// HOW IT WORKS SECTION


// DATA CONSTANTS (Hoisted for better minification)

const Icon = ({ p }: { p: string }) => <svg className="icon-svg" viewBox="0 0 24 24"><path d={p} /></svg>

const STEPS = [
    { n: 1, t: 'Compute', d: 'Advanced processors perform high-value computing.' },
    { n: 2, t: 'Thermal Capture', d: 'Heat is redirected to your water tank.' },
    { n: 3, t: 'Value Return', d: 'Earn rewards in your preferred format.' },
]

const BENEFITS = [
    { i: 'M13 2L3 14h9l-1 8 10-12h-9', t: 'Peak Efficiency', d: '53% savings vs electric tanks.' },
    { i: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z', t: 'Live Tracking', d: 'Performance tracking on all devices.' },
    { i: 'M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6', t: 'Silent Design', d: 'Quiet as a fridge. Liquid-cooled.' },
    { i: 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z', t: 'Sustainability', d: 'Offsets 5.3t of CO2 yearly.' },
]

const FAQS = [
    { q: 'What is this?', a: 'A smart water heater that heats your water and earns you money. [Learn more](https://www.superheat.xyz/h1)' },
    { q: 'How does it work?', a: 'Processors generate heat while computing. We capture that for your water.' },
    { q: 'Will this lower my bills?', a: 'Yes. The system earns revenue that offsets power usage, providing hot water for much less.' },
    { q: 'Is it loud?', a: 'No. Liquid-cooled, quieter than a fridge, and stays cool to the touch.' },
    { q: 'What are the upfront costs?', a: '$0-down sharing or purchase options. It’s professional HVAC using [Superheat tech](https://www.superheat.xyz/h1).' },
    { q: 'Will it fit my home?', a: 'If you use electric heating, likely yes. We do a free local consult to confirm.' },
    { q: 'When will you contact me?', a: 'We begin consultations Spring 2026. Early signups get priority scheduling.' },
]


// HOW IT WORKS SECTION

const HowItWorks = () => (
    <section id="how-it-works" className="section how-it-works" aria-labelledby="hiw-heading">
        <div className="container">
            <header className="section-header">
                <h2 id="hiw-heading">Advanced Physics. Simple Savings.</h2>
                <p>We’ve combined a data center with a water heater. It's not magic, it's engineering.</p>
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
                <h2 id="benefits-heading">Why Choose Genesis?</h2>
                <p>Join hundreds of London homeowners who are already on the path to energy independence.</p>
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
            <div className="info-footnote">*Ontario rates ($600/yr base) and 53% savings.</div>
        </div>
    </section>
)


// SAVINGS CALCULATOR

const TIME_STEPS = [1, 3, 5, 10]
const SavingsCalculator = () => {
    const [idx, setIdx] = useState(0)
    const years = TIME_STEPS[idx]
    const totalBenefit = years * 1318

    return (
        <section className="section calculator-section">
            <div className="container">
                <header className="section-header">
                    <h2>Savings Trajectory</h2>
                    <p>10-year financial impact for London homes.</p>
                </header>
                <div className="calculator-card">
                    <div className="calculator-grid">
                        <div className="calc-stat-card">
                            <div className="calc-stat-value text-orange">${totalBenefit.toLocaleString()}</div>
                            <div className="calc-stat-label">Total Benefit</div>
                        </div>
                        <div className="calc-stat-card">
                            <div className="calc-stat-value">${(years * 318).toLocaleString()}</div>
                            <div className="calc-stat-label">Energy Savings</div>
                        </div>
                        <div className="calc-stat-card">
                            <div className="calc-stat-value">{(years * 5.3).toFixed(1)}t</div>
                            <div className="calc-stat-label">CO2 Saved</div>
                        </div>
                    </div>
                    <div className="slider-container" style={{ marginTop: '3rem' }}>
                        <div className="slider-label">
                            <span>Time Horizon</span>
                            <span style={{ fontWeight: 600, color: 'var(--c-accent)' }}>{years} {years === 1 ? 'Year' : 'Years'}</span>
                        </div>
                        <input type="range" className="slider" min="0" max="3" step="1" value={idx} onChange={e => setIdx(+e.currentTarget.value)} />
                        <div className="slider-label text-muted"><span>1 Year</span><span>3</span><span>5</span><span>10 Years</span></div>
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--c-text-muted)', textAlign: 'center', marginTop: '2rem' }}>
                        *Ontario rates ($600/yr base), 53% efficiency, and $1k compute revenue.
                    </p>
                </div>
            </div>
        </section>
    )
}


// WAITLIST FORM

const WaitlistForm = () => {
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
        trackFunnel('0')
    }, [])

    const validateEmail = (email: string): boolean => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const validatePostalCode = (code: string): boolean => {
        if (!code) return true // Optional field
        return /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(code)
    }

    const handleChange = (e: JSX.TargetedEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.currentTarget
        const { name, value, type } = target
        const checked = (target as HTMLInputElement).checked

        setFormData((prev: FormData) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))

        // Clear error on change
        if (errors[name as keyof FormErrors]) {
            setErrors((prev: FormErrors) => ({ ...prev, [name]: undefined }))
        }
    }

    const handleSubmit = async (e: JSX.TargetedEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Validate
        const newErrors: FormErrors = {}

        if (!validateEmail(formData.email)) newErrors.email = 'Required'
        if (formData.postalCode && !validatePostalCode(formData.postalCode)) newErrors.postalCode = 'Invalid'
        if (!formData.privacyAccepted) newErrors.privacyAccepted = 'Required'

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            trackEvent('er', { k: Object.keys(newErrors) })
            return
        }

        setIsSubmitting(true)
        trackFunnel('1')

        try {
            // Real API submission
            const response = await fetch('/api/waitlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session-ID': sessionStorage.getItem('sh_sid') || 'unknown'
                },
                body: JSON.stringify({
                    ...formData,
                    sid: sessionStorage.getItem('sh_sid')
                })
            })

            let data;
            try {
                data = await response.json()
            } catch (jsonErr) {
                console.error('JSON parse error:', jsonErr)
                data = { error: { message: 'The server returned an invalid response. Please try again or contact support.' } }
            }

            if (!response.ok) {
                if (data.error?.field) {
                    setErrors(prev => ({ ...prev, [data.error.field]: data.error.message }))
                    return
                }
                throw new Error(data.error?.message || 'Submission failed')
            }

            setIsSuccess(true)
            trackFunnel('2')
            trackEvent('s', {
                propertyType: formData.propertyType,
                monthlyHeatingCost: formData.monthlyHeatingCost,
            })
        } catch (err) {
            setErrors(prev => ({
                ...prev,
                general: err instanceof Error ? err.message : 'Something went wrong. Please try again.'
            }))
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <section id="waitlist" className="section waitlist-section" aria-labelledby="waitlist-heading">
                <div className="container">
                    <div className="form-card fade-in">
                        <div className="success-message">
                            <h3>Entry Confirmed</h3>
                            <p style={{ margin: '1rem' }}>Joined. We'll email you for local scheduling.</p>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section id="waitlist" className="section waitlist-section" aria-labelledby="waitlist-heading">
            <div className="container">
                <header className="section-header">
                    <h2 id="waitlist-heading">Join the Waitlist</h2>
                    <p>
                        Join the London waitlist for zero-cost heating.
                        Early signups get priority.
                    </p>
                </header>

                <form className="form-card" onSubmit={handleSubmit} noValidate>
                    {/* Honeypot Field - Hidden from humans, visible to bots */}
                    <div style={{ opacity: 0, position: 'absolute', top: 0, left: 0, height: 0, w: 0, overflow: 'hidden', zIndex: -1 }}>
                        <label htmlFor="website">Website</label>
                        <input
                            type="text"
                            id="website"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            tabIndex={-1}
                            autoComplete="off"
                        />
                    </div>
                    {errors.general && (
                        <div className="form-error-banner" style={{
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
                            onFocus={() => trackFunnel('3')}
                            required
                            autoComplete="email"
                        />
                        {errors.email && <p className="form-error">{errors.email}</p>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-input"
                                placeholder="John Smith"
                                value={formData.name}
                                onChange={handleChange}
                                autoComplete="name"
                            />
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
                    </div>

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
                                <option value="">Select type</option>
                                <option value="residential">Residential</option>
                                <option value="commercial">Commercial</option>
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
                            Send me updates, launch news, and exclusive offers.
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
                            I agree to the <a href="/privacy">Privacy Policy</a> (PIPEDA compliant). *
                        </label>
                    </div>
                    {errors.privacyAccepted && <p className="form-error">{errors.privacyAccepted}</p>}

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg form-submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner" aria-hidden="true"></span>
                                <span>Joining...</span>
                            </>
                        ) : (
                            'Join the Waitlist'
                        )}
                    </button>

                    <p style={{ marginTop: 'var(--s-4)', fontSize: 'var(--f-size-xs)', color: 'var(--c-text-dim)', textAlign: 'center' }}>
                        🔒 Your information is secure and will never be shared.
                    </p>
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

// ============================================
// FOOTER
// ============================================
const Footer = () => {

    return (
        <footer className="footer" role="contentinfo">
            <div className="container footer-content">
                <div className="footer-logo">
                    <img src="/genesis-logo-v4.jpg" alt="Genesis Heating Solutions" style={{ height: '64px' }} />
                </div>

                <div className="footer-social-rails" style={{ display: 'flex', gap: '1rem', margin: '1rem 0' }}>
                    <a href="#" className="text-muted">X</a>
                    <a href="#" className="text-muted">IG</a>
                    <a href="#" className="text-muted">LI</a>
                </div>

                <nav className="footer-links">
                    <a href="/privacy">Privacy</a>
                    <a href="/terms">Terms</a>
                    <a href="mailto:hello@genesisheating.ca">Contact</a>
                </nav>

                <p className="footer-copyright">
                    © {new Date().getFullYear()} Genesis Heating Solutions.
                </p>
            </div>
        </footer>
    )
}

// ============================================
// MAIN APP
// ============================================
export default function App() {
    useEffect(() => {
        // Track page view on mount
        trackFunnel('page_view')

        // Track scroll depth
        let maxScroll = 0
        const handleScroll = () => {
            const s = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
            for (const t of [25, 50, 75, 100]) {
                if (s >= t && maxScroll < t) {
                    trackFunnel(`p${t}`)
                    maxScroll = t
                }
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

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
            <Footer />
        </>
    )
}
