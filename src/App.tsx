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

const Hero = () => (
    <section className="hero" aria-labelledby="hero-h">
        <div className="hero-video">
            <video autoPlay muted loop playsInline poster="/genesis-brand.jpg">
                <source src="https://resources.superheat.xyz/website-videos/Herobg.mp4" type="video/mp4" />
            </video>
            <div className="video-overlay"></div>
        </div>
        <div className="container hero-content" style={{ zIndex: 10 }}>
            <h1 id="hero-h" className="reveal reveal-active">Heating that makes <span className="text-orange">cents.</span></h1>
            <p className="hero-subtitle reveal reveal-active">You get hot water; the system earns credits. It’s a direct response to rising utility costs.</p>
            <div className="btn-row reveal reveal-active">
                <button onClick={() => sTo('waitlist')} className="btn btn-primary">Join the Waitlist</button>
            </div>
        </div>
    </section>
)

const Icon = ({ p }: { p: string }) => <svg className="icon-svg" viewBox="0 0 24 24" stroke-width="2" fill="none" stroke="currentColor"><path d={p} stroke-linecap="round" stroke-linejoin="round" /></svg>

const STEPS = [
    { n: 1, t: 'The Swap', d: 'We replace your electric tank with a computing heater. It fits the same space and uses the same plumbing.' },
    { n: 2, t: 'The Work', d: 'The unit processes data to generate constant thermal energy. You are using the same watt of power twice.' },
    { n: 3, t: 'The Credit', d: 'Data processing earns monthly credits. These are applied directly to your account to offset your utility bill.' },
]

const BENEFITS = [
    { i: 'M13 2L3 14h9l-1 8 10-12h-9', t: 'Licensed Service', d: 'Properly installed by local London HVAC techs. Fully insured and code-compliant.' },
    { i: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z', t: 'Zero Maintenance', d: 'No change to your routine. Same hot water, just a lower effective cost.' },
    { i: 'M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6', t: 'Utility Hedge', d: 'As rates climb, your credits scale. It’s a practical buffer against inflation.' },
    { i: 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z', t: 'Local Support', d: 'We’re in London. If you need service, we’re around the corner. Simple.' },
]

const FAQS = [
    { q: 'What is this?', a: 'A Superheat unit. It heats water by processing data. One watt of power performs two tasks simultaneously.' },
    { q: 'How do I earn?', a: 'The unit works 24/7. We track the output and apply a monthly credit to your account. It’s that simple.' },
    { q: 'Is it loud?', a: 'It sounds like a quiet desk fan. Usually installed in a basement or utility room where it won’t be noticed.' },
    { q: 'My internet?', a: 'We run a dedicated line. It stays separate from your home network and uses minimal bandwidth.' },
    { q: 'Who installs it?', a: 'Licensed London HVAC professionals. We handle the permits, the wiring, and the plumbing.' },
    { q: 'Is it secure?', a: 'Yes. The system processes mathematical computations only. It has zero access to your personal data.' },
]

const HowItWorks = () => (
    <div className="reveal">
        <header className="section-header" style={{ textAlign: 'left', margin: '0 0 1.5rem' }}>
            <h2 style={{ fontSize: '2rem' }}>How.</h2>
        </header>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
            {STEPS.map(s => (
                <article key={s.n} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ background: 'var(--g-accent)', color: 'white', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '900', flexShrink: 0, marginTop: '2px' }}>{s.n}</div>
                    <div>
                        <h4 style={{ fontSize: '0.9rem', marginBottom: '0.125rem' }}>{s.t}</h4>
                        <p className="text-dim" style={{ fontSize: '13px', lineHeight: '1.4' }}>{s.d}</p>
                    </div>
                </article>
            ))}
        </div>
    </div>
)

const Benefits = () => (
    <div className="reveal">
        <header className="section-header" style={{ textAlign: 'left', margin: '0 0 1.5rem' }}>
            <h2 style={{ fontSize: '2rem' }}>Why.</h2>
        </header>
        <div className="grid" style={{ gridTemplateColumns: '1fr', gap: '0.75rem' }}>
            {BENEFITS.map(b => (
                <article key={b.t} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Icon p={b.i} />
                    <div>
                        <h4 style={{ fontSize: '0.9rem' }}>{b.t}</h4>
                        <p className="text-dim" style={{ fontSize: '13px' }}>{b.d}</p>
                    </div>
                </article>
            ))}
        </div>
    </div>
)

const Infographic = () => (
    <section className="section reveal">
        <div className="container">
            <header className="section-header">
                <h2>Facts.</h2>
                <p>Standard electric tank vs. a Superheat unit in a typical 3-bedroom home.</p>
                <p style={{ fontSize: '11px', opacity: 0.5, marginTop: '0.5rem' }}>Genesis is the authorized installer and service provider of Superheat technology.</p>
            </header>
            <div className="infographic-container">
                <div className="info-card reveal">
                    <Icon p="M12 2L2 7l10 5 10-5zM2 17l10 5 10-5" />
                    <p className="calc-label">Thermal Energy</p>
                    <div className="info-value">24/7</div>
                    <p className="text-dim">Constant Heat</p>
                </div>
                <div className="info-arrow">→</div>
                <div className="info-card featured reveal">
                    <Icon p="M13 2L3 14h9l-1 8 10-12h-9" />
                    <p className="calc-label">Annual Credit</p>
                    <div className="info-value">$1,000</div>
                    <p className="text-dim">per Superheat Unit</p>
                </div>
                <div className="info-arrow">→</div>
                <div className="info-card reveal">
                    <Icon p="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" />
                    <p className="calc-label">Bill Offset</p>
                    <div className="info-value">High</div>
                    <p className="text-dim">Inflation Buffer</p>
                </div>
            </div>
        </div>
    </section>
)

const TIME_STEPS = [1, 3, 5, 10]
const SavingsCalculator = () => {
    const [idx, setIdx] = useState(0)
    const years = TIME_STEPS[idx]
    const totalBenefit = years * 1000

    return (
        <div className="reveal">
            <div className="calculator-card" style={{ width: '100%', padding: '2.5rem' }}>
                <header className="section-header" style={{ textAlign: 'left', margin: '0 0 2rem' }}>
                    <h2 style={{ fontSize: '2.25rem' }}>Projection.</h2>
                </header>
                <div className="calc-stats" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div>
                        <div className="calc-val" style={{ fontSize: '2rem' }}>${totalBenefit.toLocaleString()}</div>
                        <div className="calc-label">Credit / Unit</div>
                    </div>
                    <div>
                        <div className="calc-val" style={{ fontSize: '2rem' }}>{(years * 4.2).toFixed(1)}t</div>
                        <div className="calc-label">CO2 Mitigated</div>
                    </div>
                </div>
                <div style={{ marginTop: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '12px' }}>
                        <span className="text-dim">Horizon</span>
                        <span className="text-orange">{years} Years</span>
                    </div>
                    <input type="range" className="slider" min="0" max="3" step="1" value={idx} onChange={e => setIdx(+e.currentTarget.value)} />
                </div>
            </div>
        </div>
    )
}

const Communities = () => (
    <section className="reveal" style={{ marginTop: '2rem', borderTop: '1px solid var(--c-border)', paddingTop: '2rem' }}>
        <p className="calc-label" style={{ textAlign: 'left', marginBottom: '1.5rem', opacity: 0.5 }}>Active Sectors: London, Ontario</p>
        <div className="communities-grid" style={{ justifyContent: 'flex-start', gap: '2rem', marginBottom: '1rem' }}>
            {['Byron', 'Wortley Village', 'Masonville', 'Oakridge', 'Old North'].map(c => (
                <span key={c} className="community-name" style={{ fontSize: '13px', opacity: 0.7, fontWeight: 600 }}>{c}</span>
            ))}
        </div>
        <p className="text-dim" style={{ fontSize: '11px', opacity: 0.4 }}>Clusters with higher registration density receive earlier installation scheduling.</p>
    </section>
)

const WaitlistForm = () => {
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
        if (!formData.name.trim()) newErrors.name = 'Name field required'
        if (!formData.email.trim()) newErrors.email = 'Email required'
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone required'
        if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code required'
        if (!formData.propertyType) newErrors.general = 'Property profile required'
        if (!formData.privacyAccepted) newErrors.privacyAccepted = 'Verification required'
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
        setIsSubmitting(true)
        try {
            const body = {
                ...formData,
                full_name: formData.name,
                phone: formData.phoneNumber,
                postal_code: formData.postalCode,
                property_type: formData.propertyType === 'commercial' ? 'business' : 'home',
                monthly_heating_cost: Number(formData.monthlyHeatingCost),
                consent: formData.marketingConsent ? 'yes' : 'no',
                source: 'website_final_v9'
            }
            const res = await fetch('/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
            const r = await res.json().catch(() => ({ success: false }))
            if (!r.success) { setErrors(v => ({ ...v, general: r.error?.message || 'Synchronization failed' })); return; }
            localStorage.removeItem('genesis_form_draft')
            setIsSuccess(true);
        } catch (err) { setErrors(v => ({ ...v, general: 'Uplink synchronization error' })) } finally { setIsSubmitting(false) }
    }

    if (isSuccess) return (
        <div className="form-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>👋</div>
            <h2 style={{ marginBottom: '1rem' }}>You’re on the list.</h2>
            <p className="text-dim" style={{ marginBottom: '2rem' }}>We've received your details. A local technician will be in touch to discuss your home.</p>
            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '24px', border: '1px solid var(--c-border)' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '0.5rem' }}>The Network Effect</p>
                <p className="text-dim" style={{ fontSize: '12px' }}>Refer a neighbor to accelerate local deployment. Community growth unlocks unique rewards and speeds up the rollout.</p>
            </div>
        </div>
    )

    return (
        <div id="waitlist">
            <header className="section-header" style={{ textAlign: 'left', margin: '0 0 1.5rem' }}>
                <h2 style={{ fontSize: '2rem' }}>Join.</h2>
            </header>
            <div className="form-progress" style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem' }}>
                <div style={{ height: '2px', flex: 1, background: 'var(--c-accent)', borderRadius: '1px' }}></div>
                <div style={{ height: '2px', flex: 1, background: step === 2 ? 'var(--c-accent)' : 'var(--c-border-strong)', borderRadius: '1px', transition: 'var(--t-base)' }}></div>
            </div>
            <form className="form-card" onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 'none' }}>
                <div style={{ display: 'none' }}><input name="website" value={formData.website} onChange={handleChange} /></div>

                {step === 1 ? (
                    <div className="reveal reveal-active">
                        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="calc-label">Name</label>
                                <div className="form-input-wrapper">
                                    <input name="name" className="form-input" placeholder="Name" value={formData.name} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="calc-label">Phone</label>
                                <div className="form-input-wrapper">
                                    <input name="phoneNumber" className="form-input" placeholder="Phone" value={formData.phoneNumber} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <label className="calc-label">Email</label>
                            <div className="form-input-wrapper">
                                <input name="email" type="email" className="form-input" placeholder="Email" value={formData.email} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <label className="calc-label">Postal Code</label>
                            <div className="form-input-wrapper">
                                <input name="postalCode" className="form-input" placeholder="Postal Code" value={formData.postalCode} onChange={handleChange} />
                            </div>
                        </div>
                        <button type="button" onClick={() => setStep(2)} className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>Continue →</button>
                    </div>
                ) : (
                    <div className="reveal reveal-active">
                        <div className="form-group">
                            <label className="calc-label">Property Type</label>
                            <div className="prop-type-grid">
                                <div onClick={() => setFormData(v => ({ ...v, propertyType: 'residential' }))} className={`prop-type-card ${formData.propertyType === 'residential' ? 'active' : ''}`}>
                                    <svg style={{ width: '20px', height: '20px', marginBottom: '8px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                    Home
                                </div>
                                <div onClick={() => setFormData(v => ({ ...v, propertyType: 'commercial' }))} className={`prop-type-card ${formData.propertyType === 'commercial' ? 'active' : ''}`}>
                                    <svg style={{ width: '20px', height: '20px', marginBottom: '8px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                    Business
                                </div>
                            </div>
                        </div>
                        <div className="form-group" style={{ marginTop: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <label className="calc-label">Monthly Heating Cost</label>
                                <span className="text-orange" style={{ fontSize: '14px', fontWeight: '700' }}>${formData.monthlyHeatingCost}</span>
                            </div>
                            <input type="range" name="monthlyHeatingCost" className="slider" min="50" max="1000" step="10" value={formData.monthlyHeatingCost} onChange={handleChange} />
                        </div>
                        <div className="form-group" style={{ marginTop: '2.5rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <input type="checkbox" name="privacyAccepted" checked={formData.privacyAccepted} onChange={handleChange} style={{ width: '20px', height: '20px', marginTop: '2px', cursor: 'pointer', appearance: 'auto' }} />
                                <span style={{ fontSize: '13px', lineHeight: '1.5' }} className="text-dim">I agree to be contacted about Superheat installation.</span>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <input type="checkbox" name="marketingConsent" checked={formData.marketingConsent} onChange={handleChange} style={{ width: '20px', height: '20px', marginTop: '2px', cursor: 'pointer', appearance: 'auto' }} />
                                <span style={{ fontSize: '13px', lineHeight: '1.5' }} className="text-dim">Marketing Consent</span>
                            </div>
                            {errors.privacyAccepted && <p className="text-orange" style={{ fontSize: '10px', marginTop: '0.75rem' }}>{errors.privacyAccepted}</p>}
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '2.5rem' }} disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Join the Waitlist'}</button>
                        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '11px', opacity: 0.5 }}>Network priority is given to connected neighborhood clusters.</p>
                        <button type="button" onClick={() => setStep(1)} style={{ width: '100%', marginTop: '1.5rem', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }} className="text-dim">← Back</button>
                    </div>
                )}
            </form>
        </div>
    )
}

const FAQ = () => {
    const [openIdx, setOpenIdx] = useState<number | null>(null)
    return (
        <section className="section reveal">
            <div className="container" style={{ maxWidth: '840px' }}>
                <header className="section-header"><h2>Questions.</h2></header>
                <div className="faq-list">
                    {FAQS.map((f, i) => (
                        <div key={i} className={`faq-item ${openIdx === i ? 'open' : ''}`}>
                            <button className="faq-question" onClick={() => setOpenIdx(openIdx === i ? null : i)}>
                                <span>{f.q}</span>
                                <span className="text-orange" style={{ fontSize: '1.5rem', transform: openIdx === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>{openIdx === i ? '−' : '+'}</span>
                            </button>
                            <div className="faq-answer">
                                <p className="text-dim" style={{ paddingBottom: '2.5rem', fontSize: '1.125rem' }}>{f.a}</p>
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
        <div className="container">
            <nav className="footer-links" style={{ marginBottom: '3.5rem' }}>
                <a href="/privacy.html">Privacy</a>
                <a href="/terms.html">Terms</a>
                <a href="mailto:genesisheatingsolutions@gmail.com">Uplink</a>
                <a href="https://superheat.xyz" target="_blank" rel="noopener" style={{ color: 'var(--c-accent)' }}>Tech by Superheat</a>
            </nav>
            <div className="footer-social">
                <a href="https://www.facebook.com/profile.php?id=61586813584409" target="_blank" rel="noopener" aria-label="Facebook">
                    <svg style={{ width: 24, height: 24 }} viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
                </a>
            </div>
            <p className="footer-copy">© {new Date().getFullYear()} GENESIS HEATING SOLUTIONS. LICENSED ONTARIO HVAC INFRASTRUCTURE PARTNER.</p>
        </div>
    </footer>
)

export default function App() {
    useGenesisEngine();
    return (
        <>
            <Header />
            <main>
                <Hero />
                <div className="container split-grid">
                    <div className="reveal">
                        <div style={{ marginBottom: '4rem' }}>
                            <HowItWorks />
                        </div>
                        <Communities />
                    </div>
                    <div className="reveal sticky-form" style={{ position: 'sticky', top: '120px' }}>
                        <WaitlistForm />
                    </div>
                </div>
                <Infographic />
                <div className="container savings-split">
                    <Benefits />
                    <SavingsCalculator />
                </div>
                <FAQ />
            </main>
            <Foot />
        </>
    )
}
