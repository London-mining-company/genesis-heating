import { useState, useEffect } from 'preact/hooks'
import { JSX } from 'preact'

// ----------------------------------------------------------------------------

interface FormData {
    email: string; name: string; phoneNumber: string; postalCode: string;
    propertyType: 'residential' | 'commercial' | '';
    monthlyHeatingCost: number; privacyAccepted: boolean;
    marketingConsent: boolean; website: string;
}

interface FormErrors { [key: string]: string | undefined }

const sTo = (i: string) => document.getElementById(i)?.scrollIntoView({ behavior: 'smooth' })

const useGenesisEngine = () => {
    useEffect(() => {
        const root = document.documentElement;
        const hS = () => root.style.setProperty('--sy', `${window.scrollY}px`);
        const hR = new IntersectionObserver((es) => {
            es.forEach(e => { if (e.isIntersecting) e.target.classList.add('reveal-active') });
        }, { threshold: 0.1 });

        window.addEventListener('scroll', hS, { passive: true });
        document.querySelectorAll('.reveal').forEach(el => hR.observe(el));
        hS();

        return () => {
            window.removeEventListener('scroll', hS);
            hR.disconnect();
        };
    }, []);
}

const useJoinedCount = (s = 142) => {
    const [c, setC] = useState(s);
    useEffect(() => {
        const start = 1768435200000; // Jan 21, 2026
        const growth = Math.floor(Math.max(0, Date.now() - start) / (1000 * 60 * 360));
        setC(s + growth);
    }, [s]);
    return [c, () => setC(v => v + 1)] as const;
}

const Header = () => {
    const [s, setS] = useState(false)
    useEffect(() => {
        const h = () => setS(window.scrollY > 20)
        window.addEventListener('scroll', h, { passive: true })
        return () => window.removeEventListener('scroll', h)
    }, [])

    return (
        <header className={`header ${s ? 's' : ''}`} role="banner">
            <div className="container header-inner">
                <a href="/" className="logo"><img src="/genesis-logo-v4.jpg" alt="Genesis Heating Solutions" className="logo-img" /></a>
                <button onClick={() => sTo('waitlist')} className="btn btn-primary nav-cta">Join the Waitlist</button>
            </div>
        </header>
    )
}

const Hero = ({ count }: { count: number }) => (
    <section className="hero" aria-labelledby="hero-h">
        <div className="hero-video">
            <video autoPlay muted loop playsInline poster="/genesis-brand.jpg">
                <source src="https://resources.superheat.xyz/website-videos/Herobg.mp4" type="video/mp4" />
            </video>
            <div className="video-overlay"></div>
        </div>
        <div className="container hero-content">
            <div className="apple-badge reveal reveal-active">
                <span className="hero-badge-dot pulse"></span>
                <span>Forest City Pilot · Spring 2026</span>
                <span style={{ opacity: 0.3 }}>|</span>
                <span className="text-dim">{count}+ Leads</span>
            </div>
            <h1 id="hero-h" className="reveal reveal-active">Hot water that <span className="text-orange">pays for itself.</span></h1>
            <p className="hero-subtitle reveal reveal-active">We install advanced heating systems that process data to generate thermal energy. This efficiently heats your water while offsetting your utility costs.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }} className="reveal reveal-active">
                <button onClick={() => sTo('waitlist')} className="btn btn-primary">Check Eligibility</button>
                <button onClick={() => sTo('how-it-works')} className="btn btn-secondary">See How</button>
            </div>
            <div className="grid reveal reveal-active hero-stats-grid">
                <div><h3 className="text-orange">~4.2t</h3><p className="text-dim">CO2 Offsets</p></div>
                <div><h3 className="text-orange">$1,380+</h3><p className="text-dim">Yrly Value</p></div>
                <div><h3 className="text-orange">~80%</h3><p className="text-dim">Bill Drop</p></div>
            </div>
            <p className="reveal reveal-active" style={{ fontSize: 'var(--f-size-xs)', color: 'var(--c-text-dim)', marginTop: '2rem', fontStyle: 'italic' }}>
                Priority for Byron, Wortley, and Oakridge homes.
            </p>
        </div>
    </section>
)

const Icon = ({ p }: { p: string }) => <svg className="icon-svg" viewBox="0 0 24 24"><path d={p} /></svg>

const STEPS = [
    { n: 1, t: 'The Tech', d: 'We install a specialized server that generates heat while processing secure transactions. It integrates seamlessly as a premium water heater.' },
    { n: 2, t: 'The Efficiency', d: 'Your water is heated by the thermal energy produced during computation. This allows you to utilize the same electricity for two purposes.' },
    { n: 3, t: 'The Return', d: 'The system earns revenue for the data it processes. These credits are applied to your account, significantly lowering your monthly costs.' },
]

const BENEFITS = [
    { i: 'M13 2L3 14h9l-1 8 10-12h-9', t: 'Professional Install', d: 'Installed by licensed London tradespeople. We ensure full compliance with all local safety codes and regulations.' },
    { i: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z', t: 'Set & Forget', d: 'The system operates autonomously. There are no trading accounts to manage—just reliable hot water.' },
    { i: 'M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6', t: 'Electric Efficiency', d: 'A cost-effective alternative to natural gas. Reduce your carbon footprint without the high operational costs of standard electric tanks.' },
    { i: 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z', t: 'Quiet Operation', d: 'Designed for residential use. the unit runs quietly in your utility room, comparable to a standard modern appliance.' },
]

const FAQS = [
    { q: 'How does the revenue model work?', a: 'The system generates value by processing secure global data. We share this revenue with you to directly offset the cost of the electricity used for heating.' },
    { q: 'Do I need cryptocurrency experience?', a: 'No. The system handles all computing tasks automatically. You simply receive the financial benefit as a recurring bill credit or direct payout.' },
    { q: 'What about internet outages?', a: 'Your hot water supply is uninterrupted. The unit features standard electric backup elements to ensure consistent performance regardless of network status.' },
    { q: 'Who provides support?', a: 'We are a local London team. We manage the hardware warranty and provide full service for both the plumbing and the technology.' },
    { q: 'Is it loud?', a: 'The unit operates at a volume similar to a dishwasher. It uses internal fans to move heat efficiently but is engineered for residential basements.' },
    { q: 'Why is this a pilot program?', a: 'We are rolling out installations in specific London neighbourhoods to ensure quality control. This allows us to closely monitor performance and support our initial users.' },
]

const HowItWorks = () => (
    <section id="how-it-works" className="section reveal">
        <div className="container">
            <header className="section-header">
                <h2>Built to be forgotten.</h2>
                <p>We install these systems to sit quietly in your basement and work for you, 24/7.</p>
            </header>
            <div className="grid">
                {STEPS.map(s => (
                    <article key={s.n} className="card reveal">
                        <div className="step-number" style={{ background: 'var(--g-accent)', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', marginBottom: '1.5rem' }}>{s.n}</div>
                        <h3>{s.t}</h3>
                        <p className="text-dim">{s.d}</p>
                    </article>
                ))}
            </div>
        </div>
    </section>
)

const Benefits = () => (
    <section className="section reveal">
        <div className="container">
            <header className="section-header">
                <h2>Practical innovation.</h2>
                <p>Small steps toward a zero-cost utility bill.</p>
            </header>
            <div className="grid">
                {BENEFITS.map(b => (
                    <article key={b.t} className="card reveal">
                        <Icon p={b.i} />
                        <h4>{b.t}</h4>
                        <p className="text-dim">{b.d}</p>
                    </article>
                ))}
            </div>
        </div>
    </section>
)

const Infographic = () => (
    <section className="section reveal">
        <div className="container">
            <header className="section-header">
                <h2>Just the numbers.</h2>
                <p>No fluff—just a clear look at how the system pays for itself.</p>
            </header>
            <div className="infographic-container">
                <div className="info-card reveal">
                    <Icon p="M12 2L2 7l10 5 10-5zM2 17l10 5 10-5" />
                    <h4>Investment</h4>
                    <div className="info-value">$2k</div>
                    <p className="text-dim">Acquisition Cost</p>
                </div>
                <div className="info-arrow">→</div>
                <div className="info-card featured reveal">
                    <Icon p="M13 2L3 14h9l-1 8 10-12h-9" />
                    <h4>Annual Value</h4>
                    <div className="info-value">$1.3k+</div>
                    <p className="text-dim">Utility Offset</p>
                </div>
                <div className="info-arrow">→</div>
                <div className="info-card reveal">
                    <Icon p="M8 21h8M12 17V21M7 4h10M17 4v7a5 5 0 01-10 0V4" />
                    <h4>Payback</h4>
                    <div className="info-value">~2 Yrs</div>
                    <p className="text-dim">Full Break-even</p>
                </div>
            </div>
            <p className="text-dim" style={{ textAlign: 'center', marginTop: '3rem', fontSize: '10px' }}>*Estimates based on London Hydro residential rates (2025).</p>
        </div>
    </section>
)

const TIME_STEPS = [1, 3, 5, 10]
const SavingsCalculator = () => {
    const [idx, setIdx] = useState(0)
    const years = TIME_STEPS[idx]
    const totalBenefit = years * 1318

    return (
        <section className="section reveal">
            <div className="container" style={{ maxWidth: '900px' }}>
                <header className="section-header">
                    <h2>Local Impact.</h2>
                    <p>A 10-year projection based on London Hydro rates.</p>
                </header>
                <div className="calculator-card">
                    <div className="calc-stats">
                        <div>
                            <div className="calc-val text-orange">${totalBenefit.toLocaleString()}</div>
                            <div className="calc-label">Total Benefit</div>
                        </div>
                        <div>
                            <div className="calc-val">${(years * 318).toLocaleString()}</div>
                            <div className="calc-label">Offset</div>
                        </div>
                        <div>
                            <div className="calc-val">{(years * 5.3).toFixed(1)}t</div>
                            <div className="calc-label">CO2 Saved</div>
                        </div>
                    </div>
                    <div style={{ marginTop: '3rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontWeight: 600 }}>
                            <span>Timeline</span>
                            <span className="text-orange">{years} Years</span>
                        </div>
                        <input type="range" className="slider" min="0" max="3" step="1" value={idx} onChange={e => setIdx(+e.currentTarget.value)} />
                    </div>
                    <p style={{ fontSize: '10px', color: 'var(--c-text-muted)', textAlign: 'center', marginTop: '1.5rem' }}>
                        *Projected value based on London Hydro 2025 rates + BTC Network Difficulty models.
                    </p>
                </div>
            </div>
        </section>
    )
}

const Communities = () => (
    <section className="section reveal" style={{ borderTop: '1px solid var(--c-border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
            <p className="text-dim" style={{ fontSize: 'var(--f-size-xs)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Expanding across the Forest City
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--s-4) var(--s-8)', opacity: 0.6 }}>
                {['Byron', 'Wortley Village', 'Masonville', 'Oakridge', 'White Hills', 'Old North'].map(c => (
                    <span key={c} style={{ fontSize: 'var(--f-size-lg)', fontWeight: 600 }}>{c}</span>
                ))}
            </div>
        </div>
    </section>
)

const WaitlistForm = ({ onIncr }: { onIncr: () => void }) => {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState<FormData & { utm_source?: string; utm_medium?: string; utm_campaign?: string; referrer?: string }>({
        email: '', name: '', phoneNumber: '', postalCode: '', propertyType: '', monthlyHeatingCost: 200, privacyAccepted: false, marketingConsent: false, website: '',
    })

    const [errors, setErrors] = useState<FormErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    useEffect(() => {
        const p = new URLSearchParams(window.location.search);
        const saved = localStorage.getItem('genesis_form_draft');
        let initial = {
            utm_source: p.get('utm_source') || undefined,
            utm_medium: p.get('utm_medium') || undefined,
            utm_campaign: p.get('utm_campaign') || undefined,
            referrer: document.referrer || undefined
        };
        if (saved) {
            try {
                const s = JSON.parse(saved);
                initial = { ...initial, ...s };
                if (s.savedStep) setStep(s.savedStep);
            } catch (e) { }
        }
        setFormData(v => ({ ...v, ...initial }));
    }, []);

    useEffect(() => {
        localStorage.setItem('genesis_form_draft', JSON.stringify({ ...formData, savedStep: step }))
    }, [formData, step])

    const handleChange = (e: JSX.TargetedEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.currentTarget
        const checked = (e.currentTarget as HTMLInputElement).checked
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }))
    }

    const handleSubmit = async (e: JSX.TargetedEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (formData.website) return;
        const newErrors: FormErrors = {}
        if (!formData.name.trim()) newErrors.name = 'Name required'
        if (!formData.propertyType) newErrors.general = 'Select property'
        if (!formData.privacyAccepted) newErrors.privacyAccepted = 'Required'
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
        setIsSubmitting(true)
        try {
            const body = { ...formData, full_name: formData.name, property_type: formData.propertyType === 'commercial' ? 'business' : 'home', consent: formData.marketingConsent ? 'yes' : 'no', source: 'website_v5' }
            const res = await fetch('/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
            const r = await res.json().catch(() => ({ success: false }))
            if (!r.success) { setErrors(v => ({ ...v, general: r.error?.message || 'Failed' })); return; }
            localStorage.removeItem('genesis_form_draft')
            setIsSuccess(true); onIncr();
        } catch (err) { setErrors(v => ({ ...v, general: 'Error' })) } finally { setIsSubmitting(false) }
    }

    if (isSuccess) return (
        <section id="waitlist" className="section reveal reveal-active">
            <div className="container">
                <div className="form-card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
                    <h3 style={{ marginBottom: '1rem' }}>You're on the list.</h3>
                    <p className="text-dim">Welcome to the future of home energy. We'll reach out as we begin the 2026 London installations.</p>
                    <button className="btn btn-primary" style={{ marginTop: '2.5rem', width: '100%' }} disabled>Join confirmed</button>
                </div>
            </div>
        </section>
    )

    return (
        <section id="waitlist" className="section reveal">
            <div className="container">
                <header className="section-header">
                    <h2>Interested?</h2>
                    <p>Join the Forest City Pilot. Installations scheduling for Spring 2026.</p>
                </header>
                <form className="form-card" onSubmit={handleSubmit}>
                    <div style={{ display: 'none' }}><input name="website" value={formData.website} onChange={handleChange} /></div>

                    {step === 1 ? (
                        <div className="reveal reveal-active">
                            <div className="form-group">
                                <label className="calc-label">Full Name</label>
                                <input name="name" className="form-input" placeholder="Name" value={formData.name} onChange={handleChange} />
                                {errors.name && <p className="text-orange" style={{ fontSize: '12px' }}>{errors.name}</p>}
                            </div>
                            <div className="form-group">
                                <label className="calc-label">Email</label>
                                <input name="email" type="email" className="form-input" placeholder="you@domain.com" value={formData.email} onChange={handleChange} />
                            </div>
                            <button type="button" onClick={() => setStep(2)} className="btn btn-primary" style={{ width: '100%' }}>Next Step →</button>
                        </div>
                    ) : (
                        <div className="reveal reveal-active">
                            <div className="form-group">
                                <label className="calc-label">Property Type</label>
                                <div className="prop-type-grid">
                                    <div onClick={() => setFormData(v => ({ ...v, propertyType: 'residential' }))} className={`prop-type-card ${formData.propertyType === 'residential' ? 'active' : ''}`}>🏠 Home</div>
                                    <div onClick={() => setFormData(v => ({ ...v, propertyType: 'commercial' }))} className={`prop-type-card ${formData.propertyType === 'commercial' ? 'active' : ''}`}>🏢 Business</div>
                                </div>
                            </div>
                            <div className="form-group" style={{ marginTop: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                    <input type="checkbox" name="privacyAccepted" checked={formData.privacyAccepted} onChange={handleChange} style={{ width: '20px', height: '20px' }} />
                                    <span style={{ fontSize: '13px' }} className="text-dim">I agree to the privacy terms</span>
                                </div>
                                {errors.privacyAccepted && <p className="text-orange" style={{ fontSize: '12px' }}>Required</p>}
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }} disabled={isSubmitting}>{isSubmitting ? 'Sending...' : 'Join the Waitlist'}</button>
                            <button type="button" onClick={() => setStep(1)} style={{ width: '100%', marginTop: '1rem', fontSize: '12px' }} className="text-dim">← Change Contact Info</button>
                        </div>
                    )}
                </form>
            </div>
        </section>
    )
}

const FAQ = () => {
    const [openIdx, setOpenIdx] = useState<number | null>(null)
    return (
        <section className="section reveal">
            <div className="container">
                <header className="section-header"><h2>Frequently Asked Questions</h2></header>
                <div className="faq-list">
                    {FAQS.map((f, i) => (
                        <div key={i} className={`faq-item ${openIdx === i ? 'open' : ''}`}>
                            <button className="faq-question" onClick={() => setOpenIdx(openIdx === i ? null : i)}>
                                <span>{f.q}</span>
                                <span className="text-orange">{openIdx === i ? '−' : '+'}</span>
                            </button>
                            <div className="faq-answer">
                                <p className="text-dim" style={{ paddingBottom: '1.5rem' }}>{f.a}</p>
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
            <p style={{ fontSize: '10px', color: 'var(--c-text-dim)', textAlign: 'left', marginBottom: '2rem' }}>
                *Savings vary. Fluctuates with rates & yields. Local Red-Seal only.
            </p>
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '2rem' }}>
                <a href="https://www.facebook.com/profile.php?id=61586813584409" target="_blank" rel="noopener" aria-label="Facebook">
                    <svg style={{ width: 24, height: 24 }} viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
                </a>
            </div>
            <nav className="footer-links" style={{ marginBottom: '2rem' }}>
                <a href="/privacy.html">Privacy</a>
                <a href="/terms.html">Terms</a>
                <a href="mailto:genesisheatingsolutions@gmail.com">Contact</a>
                <a href="https://superheat.xyz" target="_blank" rel="noopener" style={{ color: 'var(--c-accent)' }}>Tech by Superheat</a>
            </nav>
            <p className="text-dim" style={{ fontSize: '12px' }}>© {new Date().getFullYear()} Genesis Heating Solutions. Licensed London Installer.</p>
        </div>
    </footer>
)

export default function App() {
    useGenesisEngine();
    const [count, incr] = useJoinedCount();
    return (
        <>
            <Header />
            <main>
                <Hero count={count} />
                <HowItWorks />
                <Infographic />
                <Benefits />
                <Communities />
                <SavingsCalculator />
                <WaitlistForm onIncr={incr} />
                <FAQ />
            </main>
            <Foot />
        </>
    )
}
