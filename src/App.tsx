import { useState, useCallback, useEffect } from 'preact/hooks'
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
                    <img src="/genesis-logo.jpg" alt="Genesis Heating Solutions" className="genesis-pulse" style={{ height: '48px', objectFit: 'contain' }} />
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
            <div className="container hero-content">
                <div className="hero-badge">
                    <span className="hero-badge-dot" aria-hidden="true"></span>
                    <span>Launching Spring 2026 in London, Ontario</span>
                </div>

                <h1 id="hero-heading">
                    The Furnace That <span className="text-gradient">Pays You.</span>
                </h1>

                <p className="hero-subtitle">
                    It calculates. It heats. It saves. Genesis turns high-performance computing
                    into free hot water for your home.
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button onClick={scrollToForm} className="btn btn-primary btn-lg">
                        Get on the List
                    </button>
                    <a href="#how-it-works" className="btn btn-secondary btn-lg">
                        See the Magic
                    </a>
                </div>

                <div className="hero-stats">
                    <div className="stat">
                        <div className="stat-value">$2,400</div>
                        <div className="stat-label">Avg. Annual Savings</div>
                    </div>
                    <div className="stat">
                        <div className="stat-value">Zero</div>
                        <div className="stat-label">Installation Cost*</div>
                    </div>
                    <div className="stat">
                        <div className="stat-value">24/7</div>
                        <div className="stat-label">Passive Income</div>
                    </div>
                </div>
            </div>
        </section>
    )
}

// ============================================
// HOW IT WORKS SECTION
// ============================================
const HowItWorks = () => {
    const steps = [
        {
            number: 1,
            title: 'We Install',
            description: 'Our certified pros replace your old tank with a Genesis unit in one day. White-glove service, zero mess.',
        },
        {
            number: 2,
            title: 'It Computes',
            description: 'The unit processes secure blockchain transactions. This generates massive amounts of heat—heat you used to pay for.',
        },
        {
            number: 3,
            title: 'You Profit',
            description: 'The heat warms your water. The computing pays the bills. You get a hot shower and a $0 statement.',
        },
    ]

    return (
        <section id="how-it-works" className="section how-it-works" aria-labelledby="hiw-heading">
            <div className="container">
                <header className="section-header">
                    <h2 id="hiw-heading">Advanced Physics. Simple Savings.</h2>
                    <p>
                        We’ve combined a data center with a water heater. It's not magic, it's engineering.
                    </p>
                </header>

                <div className="steps-grid">
                    {steps.map((step) => (
                        <article key={step.number} className="step-card">
                            <div className="step-number" aria-hidden="true">{step.number}</div>
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}

// ============================================
// BENEFITS SECTION
// ============================================
const Benefits = () => {
    const benefits = [
        {
            icon: '💰',
            title: 'The Heater That Pays You',
            description: 'Why burn money? Genesis turns electricity into Bitcoin mining rewards, offsetting your costs 100%.',
        },
        {
            icon: '🤫',
            title: 'Whisper Quiet',
            description: 'Engineered for silence. No roaring fans, just the quiet hum of innovation working in your basement.',
        },
        {
            icon: '🛡️',
            title: 'Industrial Grade',
            description: 'Built with the same resilient tech used in Tier 4 data centers. Designed to last decades, not years.',
        },
        {
            icon: '🤝',
            title: '10-Year Warranty',
            description: 'Complete coverage on parts and labor. Your investment is fully protected.',
        },
    ]

    return (
        <section className="section" aria-labelledby="benefits-heading">
            <div className="container">
                <header className="section-header">
                    <h2 id="benefits-heading">Why Choose Genesis?</h2>
                    <p>
                        Join hundreds of London homeowners who are already on the path to energy independence.
                    </p>
                </header>

                <div className="benefits-grid">
                    {benefits.map((benefit) => (
                        <article key={benefit.title} className="benefit-card">
                            <div className="benefit-icon" aria-hidden="true">{benefit.icon}</div>
                            <h4>{benefit.title}</h4>
                            <p>{benefit.description}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}

// ============================================
// SAVINGS CALCULATOR
// ============================================
const SavingsCalculator = () => {
    const [monthlyCost, setMonthlyCost] = useState(200)
    const annualSavings = monthlyCost * 12

    const handleChange = useCallback((e: JSX.TargetedEvent<HTMLInputElement>) => {
        const target = e.currentTarget
        setMonthlyCost(Number(target.value))
        trackEvent('calculator_change', { monthlyCost: Number(target.value) })
    }, [])

    return (
        <section className="section calculator-section" aria-labelledby="calc-heading">
            <div className="container">
                <header className="section-header">
                    <h2 id="calc-heading">Calculate Your Savings</h2>
                    <p>See how much you could save by switching to Genesis.</p>
                </header>

                <div className="calculator-card">
                    <div className="calculator-result">
                        <div className="savings-amount">${annualSavings.toLocaleString()}</div>
                        <div className="savings-label">Estimated Annual Savings</div>
                    </div>

                    <div className="slider-container">
                        <div className="slider-label">
                            <span>Current Monthly Heating Cost</span>
                            <span style={{ fontWeight: 600, color: 'var(--c-accent)' }}>${monthlyCost}</span>
                        </div>
                        <input
                            type="range"
                            className="slider"
                            min="50"
                            max="500"
                            step="10"
                            value={monthlyCost}
                            onChange={handleChange}
                            aria-label="Monthly heating cost"
                        />
                        <div className="slider-label text-muted">
                            <span>$50/mo</span>
                            <span>$500/mo</span>
                        </div>
                    </div>

                    <p style={{ fontSize: 'var(--f-size-sm)', color: 'var(--c-text-muted)', textAlign: 'center' }}>
                        *Savings based on average Genesis performance. Your results may vary based on usage patterns.
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
                    // Add UTM/timing data if available
                    formLoadTime: Date.now(), // Simplified timing for now
                    submitTime: Date.now()
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
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const faqs = [
        {
            question: 'How does Genesis generate enough heat to be free?',
            answer: 'Our advanced heating units operate continuously, producing consistent heat as a byproduct of their operation. This heat is captured and used for your water and home heating. The value generated offsets your energy costs entirely—and often produces a surplus.',
        },
        {
            question: 'What are the upfront costs?',
            answer: 'We offer flexible options including $0 down with revenue sharing, or purchase/lease options. During our launch period, early adopters will receive exclusive pricing and priority installation. Our team will help you choose the best option for your situation.',
        },
        {
            question: 'Is this available for commercial properties?',
            answer: 'Absolutely! Commercial properties often see even greater savings due to higher hot water and heating demands. We offer custom solutions for businesses of all sizes, from small offices to large industrial facilities.',
        },
        {
            question: 'What happens if something breaks?',
            answer: 'Our 10-year warranty covers all parts and labor. We monitor your system 24/7 and often fix issues remotely before you even notice them. If on-site service is needed, our technicians are dispatched within 24 hours at no cost to you.',
        },
        {
            question: 'Is this only available in London, Ontario?',
            answer: 'We\'re launching in London and surrounding areas (including St. Thomas, Strathroy, and Woodstock) in Spring 2026. Join the waitlist and we\'ll notify you when we expand to your area.',
        },
        {
            question: 'Do I need any technical knowledge?',
            answer: 'Not at all. Our white-glove service means we handle everything—installation, configuration, monitoring, and maintenance. You just enjoy free hot water and a warm home.',
        },
    ]

    const toggleFaq = (index: number) => {
        const newIndex = openIndex === index ? null : index
        setOpenIndex(newIndex)
        if (newIndex !== null) {
            trackEvent('faq_open', { question: faqs[index].question })
        }
    }

    return (
        <section className="section" aria-labelledby="faq-heading">
            <div className="container">
                <header className="section-header">
                    <h2 id="faq-heading">Frequently Asked Questions</h2>
                </header>

                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
                            <button
                                className="faq-question"
                                onClick={() => toggleFaq(index)}
                                aria-expanded={openIndex === index}
                                aria-controls={`faq-answer-${index}`}
                            >
                                <span>{faq.question}</span>
                                <span className="faq-icon" aria-hidden="true">+</span>
                            </button>
                            <div id={`faq-answer-${index}`} className="faq-answer" role="region">
                                <p className="faq-answer-content">{faq.answer}</p>
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
                    <img src="/genesis-logo.jpg" alt="Genesis Logo" style={{ height: '32px', filter: 'grayscale(1)', opacity: 0.8 }} />
                    <span>Genesis Heating</span>
                </div>

                <nav className="footer-links" aria-label="Footer navigation">
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/terms">Terms of Service</a>
                    <a href="mailto:hello@superheat.ca">Contact</a>
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
                <Benefits />
                <SavingsCalculator />
                <WaitlistForm />
                <FAQ />
            </main>
            <Footer />
        </>
    )
}
