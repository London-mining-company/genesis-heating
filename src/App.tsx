import { useState, useEffect } from 'preact/hooks'
import { JSX } from 'preact'

// ============================================
// TYPES
// ============================================
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




// ============================================
// TRACKING UTILITIES
// ============================================
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

// ============================================
// HEADER COMPONENT
// ============================================
const Header = () => {
    const scrollToForm = () => {
        document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
        trackEvent('cta_click', { location: 'header' })
    }

    return (
        <header className="header" role="banner">
            <div className="container header-inner">
                <a href="/" className="logo" aria-label="Genesis Heating Solutions Home">
                    <img src="/genesis-logo-final.png" alt="Genesis Heating Solutions" className="genesis-pulse logo-img" style={{ mixBlendMode: 'screen' }} />
                </a>
                <button onClick={scrollToForm} className="btn btn-primary nav-cta">
                    Join Waitlist
                </button>
            </div>
        </header>
    )
}

// ============================================
// HERO SECTION
// ============================================
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
                    This is what the future of <span className="text-gradient">home heating feels like.</span>
                </h1>

                <p className="hero-subtitle">
                    Reclaim wasted energy. Turn it into lasting financial returns.<br />
                    <span style={{ opacity: 0.8, fontSize: '0.9em' }}>The others just heat water. Genesis heats water and your wallet.</span>
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
                        <div className="stat-value">53%+</div>
                        <div className="stat-label">Savings vs Traditional</div>
                    </div>
                    <div className="stat">
                        <div className="stat-value">$1,000+</div>
                        <div className="stat-label">Annual Revenue Per Device</div>
                    </div>
                    <div className="stat">
                        <div className="stat-value">5.3t</div>
                        <div className="stat-label">CO2 Reduced Per Year</div>
                    </div>
                </div>
            </div>
        </section>
    )
}

// ============================================
// HOW IT WORKS SECTION
// ============================================
// ============================================
// DATA CONSTANTS (Hoisted for better minification)
// ============================================
const STEPS = [
    { n: 1, t: 'Enterprise Compute', d: 'Genesis draws standard electricity to power enterprise-grade processors performing decentralized computing tasks.' },
    { n: 2, t: 'Thermal Capture', d: 'The byproduct heat from high-performance computing is captured and injected directly into your water tank.' },
    { n: 3, t: 'Value Return', d: 'The digital value generated by the processors effectively pays for the energy used—water heating that pays you back.' },
]

const BENEFITS = [
    { i: '⚡', t: 'Peak Efficiency', d: 'Save 53%+ on heating costs compared to standard electric water heaters.' },
    { i: '📱', t: 'Smart Connectivity', d: 'Real-time performance monitoring and reward tracking from any device.' },
    { i: '🔇', t: 'Silent Operation', d: 'Engineered for living spaces. Liquid-cooled and quieter than your refrigerator.' },
    { i: '🍃', t: 'Sustainability', d: 'Offset up to 5.3 tonnes of CO2 annually by recycling compute energy.' },
]

const FAQS = [
    { q: 'How does Genesis generate enough heat?', a: 'Byproduct heat from enterprise computing is captured for your home. Value generated offsets the appliance and utility costs.' },
    { q: 'What are the upfront costs?', a: '$0 down with revenue sharing, or purchase/lease. Installed exactly like a high-end water heater.' },
    { q: 'Is it for commercial properties?', a: 'Yes, often with even greater savings due to higher thermal demands.' },
    { q: 'What if it breaks?', a: '10-year warranty. 24/7 remote monitoring and rapid dispatched service.' },
    { q: 'What technology is this?', a: 'Silicon-based systems powered by the Superheat ecosystem. See Superheat H1 documentation.' },
    { q: 'How does it work without "crypto"?', a: 'It\'s an electric furnace using chips to generate heat. The chips create value that pays the bills. Pure thermodynamics.' },
]

const CALC_STEPS = [1, 10, 50, 100]

// ============================================
// HOW IT WORKS SECTION
// ============================================
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

// ============================================
// BENEFITS SECTION
// ============================================
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

// ============================================
// INFOGRAPHIC SECTION
// ============================================
const Infographic = () => (
    <section className="section infographic-section" style={{ background: 'var(--c-bg)' }}>
        <div className="container">
            <header className="section-header">
                <h2>The 2-Year Break-Even Path</h2>
                <p>Designed for rapid return on investment and 53%+ energy savings.</p>
            </header>
            <div className="infographic-container">
                <div className="info-card">
                    <div className="info-icon">💎</div>
                    <h4>Investment</h4>
                    <div className="info-value">$2k</div>
                    <p>One-time cost</p>
                </div>
                <div className="info-arrow">→</div>
                <div className="info-card featured">
                    <div className="info-icon">⚡</div>
                    <h4>Earnings</h4>
                    <div className="info-value">$1k+</div>
                    <p>Annual revenue</p>
                </div>
                <div className="info-arrow">→</div>
                <div className="info-card">
                    <div className="info-icon">🏆</div>
                    <h4>Break-Even</h4>
                    <div className="info-value">~2 Yrs</div>
                    <p>Pure profit after</p>
                </div>
            </div>
            <div className="info-footnote">*Based on 80% recapture and network benchmarks.</div>
        </div>
    </section>
)

// ============================================
// SAVINGS CALCULATOR
// ============================================
const SavingsCalculator = () => {
    const [idx, setIdx] = useState(0)
    const units = CALC_STEPS[idx]

    return (
        <section className="section calculator-section">
            <div className="container">
                <header className="section-header">
                    <h2>Opportunity Calculator</h2>
                    <p>Genesis Heating turns decentralized compute byproduct into tangible household wealth.</p>
                </header>
                <div className="calculator-card">
                    <div className="calculator-grid">
                        <div className="calc-stat-card">
                            <div className="calc-stat-value text-gradient">53%+</div>
                            <div className="calc-stat-label">Savings vs Traditional</div>
                        </div>
                        <div className="calc-stat-card">
                            <div className="calc-stat-value">${(units * 1000).toLocaleString()}</div>
                            <div className="calc-stat-label">Est. Yearly Earnings</div>
                        </div>
                        <div className="calc-stat-card">
                            <div className="calc-stat-value">~2 Yrs</div>
                            <div className="calc-stat-label">Est. Break-Even</div>
                        </div>
                    </div>
                    <div className="slider-container" style={{ marginTop: '3rem' }}>
                        <div className="slider-label">
                            <span>Number of Devices</span>
                            <span style={{ fontWeight: 600, color: 'var(--c-accent)' }}>{units} {units === 1 ? 'Unit' : 'Units'}</span>
                        </div>
                        <input type="range" className="slider" min="0" max="3" step="1" value={idx} onChange={e => setIdx(+e.currentTarget.value)} />
                        <div className="slider-label text-muted"><span>1 Unit</span><span>10</span><span>50</span><span>100 Units</span></div>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--c-text-muted)', textAlign: 'center', marginTop: '2rem' }}>
                        *Earnings based on network difficulty. Investment of ${(units * 2000).toLocaleString()} applies for {units} {units === 1 ? 'unit' : 'units'}.
                    </p>
                </div>
            </div>
        </section>
    )
}

// ============================================
// WAITLIST FORM
// ============================================
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

        if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address'
        }

        if (formData.postalCode && !validatePostalCode(formData.postalCode)) {
            newErrors.postalCode = 'Please enter a valid Canadian postal code'
        }

        if (!formData.privacyAccepted) {
            newErrors.privacyAccepted = 'Please accept the privacy policy'
        }

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

// ============================================
// FAQ SECTION
// ============================================
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
                                <p className="faq-answer-content">{f.a}</p>
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
                    <img src="/genesis-logo-final.png" alt="Genesis Logo" style={{ height: '64px', opacity: 0.9, mixBlendMode: 'screen' }} />
                </div>

                <nav className="footer-links" aria-label="Footer navigation">
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/terms">Terms of Service</a>
                    <a href="mailto:hello@Genesis Heating.ca">Contact</a>
                </nav>

                <p className="footer-copyright">
                    © {currentYear} Genesis Heating Solutions. London, Ontario, Canada
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
