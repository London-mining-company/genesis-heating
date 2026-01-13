import { useState, useEffect } from 'preact/hooks'
import { JSX } from 'preact'


interface FormData {
    email: string
    name: string
    postalCode: string
    propertyType: 'residential' | 'commercial' | ''
    monthlyHeatingCost: number
    privacyAccepted: boolean
    marketingConsent: boolean
    // Honeypot field for bot detection (should stay empty)
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

const trackEvent = (eventName: string, data?: Record<string, unknown>) => {
    const sessionId = sessionStorage.getItem('sh_sid')
    if (!sessionId) return

    // Queue for batch sending in production
    const event = {
        sessionId,
        eventType: 'user_action',
        eventName,
        pageUrl: window.location.href,
        eventData: data,
        timestamp: Date.now(),
    }

    // In production, this would POST to /api/analytics
    console.debug('[Analytics]', event)
}

const trackFunnel = (stage: string) => {
    const sessionId = sessionStorage.getItem('sh_sid')
    if (!sessionId) return

    // In production, POST to /api/funnel
    console.debug('[Funnel]', { sessionId, stage })
}


// HEADER COMPONENT

const Header = () => (
    <header className="header" role="banner">
        <div className="container header-inner">
            <a href="/" className="logo"><img src="/genesis-logo-final.png" alt="Genesis" className="logo-img" style={{ mixBlendMode: 'screen' }} /></a>
            <button onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })} className="btn btn-primary nav-cta">Join</button>
        </div>
    </header>
)


// HERO SECTION

const Hero = () => {
    const scrollToForm = () => {
        document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
        trackEvent('cta_click', { location: 'hero' })
    }

    return (
        <section className="hero" aria-labelledby="hero-heading">
            {/* Background Video Layer */}
            <div className="video-background">
                <iframe
                    src="https://www.youtube.com/embed/T_r5TUR2cYk?autoplay=1&mute=1&loop=1&playlist=T_r5TUR2cYk&controls=0&showinfo=0&autohide=1&modestbranding=1&rel=0"
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
                    Reclaim wasted energy. Genesis heats your water and your wallet.
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button onClick={scrollToForm} className="btn btn-primary btn-lg">
                        The Heater That Pays You Back
                    </button>
                    <a href="#how-it-works" className="btn btn-secondary btn-lg">
                        See How it Works
                    </a>
                </div>

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
                        <div className="stat-value">Ontario</div>
                        <div className="stat-label">Energy Benchmarks</div>
                    </div>
                </div>
            </div>
        </section>
    )
}


// HOW IT WORKS SECTION


// DATA CONSTANTS (Hoisted for better minification)

const STEPS = [
    { n: 1, t: 'Enterprise Compute', d: 'Processors perform secure computing using standard electricity.' },
    { n: 2, t: 'Thermal Capture', d: 'Waste heat is captured and injected into your water tank.' },
    { n: 3, t: 'Value Return', d: 'Computing value offsets your home energy costs directly.' },
]

const BENEFITS = [
    { i: '⚡', t: 'Peak Efficiency', d: 'Save 53% on heating vs traditional electric systems.' },
    { i: '📱', t: 'Smart Monitoring', d: 'Track rewards and performance from any device.' },
    { i: '🔇', t: 'Silent Operation', d: 'Liquid-cooled and quieter than a standard refrigerator.' },
    { i: '🍃', t: 'Sustainability', d: 'Recycle compute energy to offset 5.3t of CO2 yearly.' },
]

const FAQS = [
    { q: 'Heat source?', a: 'Bitcoin mining byproduct. [Details](https://www.superheat.xyz/technology)' },
    { q: 'Why BTC?', a: 'Secure & predictable returns plus heat. [Stats](https://mempool.space)' },
    { q: 'Cost?', a: '$0 down revenue share or purchase. Standard install.' },
    { q: 'Scale?', a: 'Scalable for home or business use.' },
    { q: 'Brand?', a: 'Superheat tech. [Specs](https://www.superheat.xyz/h1)' },
    { q: 'Silent?', a: 'Liquid-cooled, quieter than a fridge.' },
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
                        <div className="benefit-icon" aria-hidden="true">{b.i}</div>
                        <h4>{b.t}</h4>
                        <p>{b.d}</p>
                    </article>
                ))}
            </div>
        </div>
    </section>
)


// INFOGRAPHIC SECTION

const Icon = ({ p }: { p: string }) => <svg className="icon-svg" viewBox="0 0 24 24"><path d={p} /></svg>

const Infographic = () => (
    <section className="section infographic-section" style={{ background: 'var(--c-bg)' }}>
        <div className="container">
            <header className="section-header">
                <h2>The 2-Year Break-Even Path</h2>
                <p>Designed for rapid return on investment and 53% energy savings.</p>
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
            <div className="info-footnote">*Based on Ontario electricity rates ($600/yr base) and 53% savings.</div>
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
                    <p>Projected financial impact for Ontario homes over the next decade.</p>
                </header>
                <div className="calculator-card">
                    <div className="calculator-grid">
                        <div className="calc-stat-card">
                            <div className="calc-stat-value text-orange">${totalBenefit.toLocaleString()}</div>
                            <div className="calc-stat-label">Total Financial Benefit</div>
                        </div>
                        <div className="calc-stat-card">
                            <div className="calc-stat-value">${(years * 318).toLocaleString()}</div>
                            <div className="calc-stat-label">Direct Energy Savings</div>
                        </div>
                        <div className="calc-stat-card">
                            <div className="calc-stat-value">{(years * 5.3).toFixed(1)}t</div>
                            <div className="calc-stat-label">Est. CO2 Reduced</div>
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
                        *Projection based on $600/yr Ontario base electric cost, 53% efficiency offset, and $1,000/yr compute revenue.
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
        postalCode: '',
        propertyType: '',
        monthlyHeatingCost: 200,
        privacyAccepted: false,
        marketingConsent: false,
        website: '', // Honeypot field
    })

    const [errors, setErrors] = useState<FormErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    useEffect(() => {
        trackFunnel('form_view')
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
            trackEvent('form_error', { errors: Object.keys(newErrors) })
            return
        }

        setIsSubmitting(true)
        trackFunnel('form_submit')

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
                    sessionId: sessionStorage.getItem('sh_sid'),
                    t: Date.now()
                })
            })

            const data = await response.json()

            if (!response.ok) {
                if (data.error?.field) {
                    setErrors(prev => ({ ...prev, [data.error.field]: data.error.message }))
                    return
                }
                throw new Error(data.error?.message || 'Submission failed')
            }

            setIsSuccess(true)
            trackFunnel('form_success')
            trackEvent('waitlist_signup', {
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
                            <div className="success-icon">✓</div>
                            <h3>You're on the list!</h3>
                            <p>
                                We'll email you when Genesis launches in Spring 2026.
                                Keep an eye on your inbox for exclusive early-bird offers.
                            </p>
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
                        Be among the first in London, Ontario to experience zero-cost heating.
                        Early subscribers get priority installation and exclusive pricing.
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
                        <label htmlFor="email" className="form-label">Email Address *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className={`form-input ${errors.email ? 'error' : ''}`}
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            onFocus={() => trackFunnel('form_email_focus')}
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
                            <option value="">Select property type</option>
                            <option value="residential">Residential Home</option>
                            <option value="commercial">Commercial Building</option>
                        </select>
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
                            Send me updates about Genesis, including launch news and exclusive offers.
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
                            I agree to the <a href="/privacy">Privacy Policy</a> and understand my data will be processed in accordance with Canadian privacy laws (PIPEDA). *
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
    const currentYear = new Date().getFullYear()

    return (
        <footer className="footer" role="contentinfo">
            <div className="container footer-content">
                <div className="footer-logo">
                    <img src="/genesis-logo-final.png" alt="Genesis Logo" style={{ height: '48px', mixBlendMode: 'screen' }} />
                </div>

                <div className="footer-social-rails" style={{ display: 'flex', gap: '1rem', margin: '1rem 0' }}>
                    <a href="#" className="text-muted" title="X (Twitter)">Twitter</a>
                    <a href="#" className="text-muted" title="Instagram">Instagram</a>
                    <a href="#" className="text-muted" title="LinkedIn">LinkedIn</a>
                </div>

                <nav className="footer-links">
                    <a href="/privacy">Privacy</a>
                    <a href="/terms">Terms</a>
                    <a href="mailto:hello@genesisheating.ca">Contact</a>
                </nav>

                <p className="footer-copyright">
                    © {currentYear} Genesis Heating Solutions.
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
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            )

            const thresholds = [25, 50, 75, 100]
            for (const threshold of thresholds) {
                if (scrollPercent >= threshold && maxScroll < threshold) {
                    trackFunnel(`scroll_${threshold}`)
                    maxScroll = threshold
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
