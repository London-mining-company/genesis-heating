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
                <button onClick={() => sTo('waitlist')} className="btn btn-primary nav-cta">Reserve Your Spot</button>
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
            <p className="hero-subtitle reveal reveal-active">Get the same hot water you expect—while the system earns credits that offset your utility bill.</p>
            <div className="btn-row reveal reveal-active">
                <button onClick={() => sTo('waitlist')} className="btn btn-primary">Join the Waitlist</button>
            </div>
        </div>
    </section>
)

const Icon = ({ p }: { p: string }) => <svg className="icon-svg" viewBox="0 0 24 24" stroke-width="2" fill="none" stroke="currentColor"><path d={p} stroke-linecap="round" stroke-linejoin="round" /></svg>

const STEPS = [
    { n: 1, t: 'Simple Swap', d: 'We install a Superheat H1 unit. Same space, same plumbing—no renovation required.' },
    { n: 2, t: 'Double Duty', d: 'The unit processes high-value computing tasks. Heat generated warms your water—one watt, two purposes.' },
    { n: 3, t: 'Flexible Payout', d: 'Earn monthly. Cash out via cheque or keep it in Bitcoin. Your choice, your control.' },
]

const BENEFITS = [
    { i: 'M13 2L3 14h9l-1 8 10-12h-9', t: 'Licensed & Insured', d: 'Installed by local London HVAC professionals. Fully code-compliant.' },
    { i: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z', t: 'Zero Hassle', d: 'Your hot water stays the same. Your costs drop.' },
    { i: 'M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6', t: 'Inflation Buffer', d: 'As Ontario rates climb, your credits scale with them.' },
    { i: 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z', t: 'Local Team', d: 'Genesis Heating Solutions is based in London. Around the corner.' },
]

const FAQS = [
    { q: 'What is the Superheat H1?', a: 'A water heater that earns. It uses advanced processors to perform computing tasks - capturing the heat they produce to warm your water. One watt, two purposes.' },
    { q: 'Who is Genesis Heating Solutions?', a: 'A London-based team with deep roots in HVAC and Bitcoin mining. We bring decades of combined experience to help homeowners turn wasted heat into value - professionally installed, locally supported.' },
    { q: 'What is included in your service?', a: 'Everything. We handle the complex parts: mining pool configuration, wallet setup assistance, professional HVAC installation, permits, and ongoing support. You just enjoy lower heating costs.' },
    { q: 'How do earnings work?', a: 'The H1 runs 24/7, processing compute workloads. Most customers choose cash-only credits (no Bitcoin exposure). Your monthly credits grow over time as you stay with the program. We handle all the complex mining management - you just see lower utility bills.' },
    { q: 'What does it cost?', a: 'We offer flexible options - including zero upfront cost. Instead of a big install bill, many customers prefer to share a portion of monthly mining rewards in exchange for our ongoing management. Pricing varies by property type and is discussed during your free consultation.' },
    { q: 'Why Genesis instead of DIY?', a: 'This is not plug-and-play. Mining pool optimization, electrical requirements, and HVAC integration require professional expertise. We have licensed installers and years of mining experience - so you do not have to figure it out alone.' },
    { q: 'What happens next?', a: 'Join the waitlist now. In Spring 2026, we will reach out to schedule a free consultation - no pressure, just a conversation to see if the system makes sense for your home.' },
    { q: 'Is it loud?', a: 'About as loud as a quiet desk fan. Most units go in basements or utility rooms.' },
    { q: 'Will it affect my internet?', a: 'No. We install a dedicated connection that stays separate from your home network.' },
    { q: 'Is my data safe?', a: 'Completely. The H1 processes mathematical computations only - it has zero access to your personal information.' },
]

const HowItWorks = () => (
    <div className="reveal">
        <header className="section-header" style={{ textAlign: 'left', margin: '0 0 1.5rem' }}>
            <h2 style={{ fontSize: '2rem' }}>How It Works</h2>
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
            <h2 style={{ fontSize: '2rem' }}>Why It Matters</h2>
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
                <h2>The Numbers</h2>
                <p>Standard electric tank vs. a Superheat H1 in a typical 3-bedroom home.</p>
                <p style={{ fontSize: '11px', opacity: 0.5, marginTop: '0.5rem' }}>Genesis Heating Solutions is the authorized installer of Superheat technology in Ontario.</p>
            </header>
            <div className="infographic-container">
                <div className="info-card reveal">
                    <Icon p="M12 2L2 7l10 5 10-5zM2 17l10 5 10-5" />
                    <p className="calc-label">Hot Water</p>
                    <div className="info-value">24/7</div>
                    <p className="text-dim">Same as before</p>
                </div>
                <div className="info-arrow">→</div>
                <div className="info-card featured reveal">
                    <Icon p="M13 2L3 14h9l-1 8 10-12h-9" />
                    <p className="calc-label">Annual Earnings</p>
                    <div className="info-value">~$1,500</div>
                    <p className="text-dim">per unit (CAD)</p>
                </div>
                <div className="info-arrow">→</div>
                <div className="info-card reveal">
                    <Icon p="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" />
                    <p className="calc-label">Net Effect</p>
                    <div className="info-value">Lower</div>
                    <p className="text-dim">Effective heating cost</p>
                </div>
            </div>
        </div>
    </section>
)

const TIME_STEPS = [1, 3, 5, 10]
const SavingsCalculator = () => {
    const [idx, setIdx] = useState(0)
    const years = TIME_STEPS[idx]
    const totalBenefit = years * 1500

    return (
        <div className="reveal">
            <div className="calculator-card" style={{ width: '100%', padding: '2.5rem' }}>
                <header className="section-header" style={{ textAlign: 'left', margin: '0 0 2rem' }}>
                    <h2 style={{ fontSize: '2.25rem' }}>Estimated Savings</h2>
                </header>
                <div className="calc-stats" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div>
                        <div className="calc-val" style={{ fontSize: '2rem' }}>${totalBenefit.toLocaleString()}</div>
                        <div className="calc-label">Cumulative Earnings</div>
                    </div>
                    <div>
                        <div className="calc-val" style={{ fontSize: '2rem' }}>{(years * 4.2).toFixed(1)}t</div>
                        <div className="calc-label">CO₂ Offset</div>
                    </div>
                </div>
                <div style={{ marginTop: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '12px' }}>
                        <span className="text-dim">Time Horizon</span>
                        <span className="text-orange">{years} Year{years > 1 ? 's' : ''}</span>
                    </div>
                    <input type="range" className="slider" min="0" max="3" step="1" value={idx} onChange={e => setIdx(+e.currentTarget.value)} />
                </div>
            </div>
        </div>
    )
}

const Communities = () => (
    <section className="reveal communities-section">
        <h3 className="communities-title">Now Serving — London, Ontario</h3>
        <div className="communities-grid">
            {['Byron', 'Wortley Village', 'Masonville', 'Oakridge', 'Old North'].map(c => (
                <span key={c} className="community-chip">{c}</span>
            ))}
        </div>
        <p className="communities-note">Neighbourhoods with more signups get priority scheduling.</p>
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
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>✓</div>
            <h2 style={{ marginBottom: '1rem' }}>You are on the list.</h2>
            <p className="text-dim" style={{ marginBottom: '2rem' }}>A technician will reach out in Spring 2026 to discuss your home and walk through next steps. No obligation - just a conversation.</p>
            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '24px', border: '1px solid var(--c-border)' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '0.5rem' }}>The Neighbourhood Effect</p>
                <p className="text-dim" style={{ fontSize: '12px' }}>Every unit installed contributes to stronger local community pools. More neighbours = better grassroots economics for the whole street.</p>
            </div>
        </div>
    )

    return (
        <div id="waitlist">
            <header className="section-header" style={{ textAlign: 'left', margin: '0 0 1.5rem' }}>
                <h2 style={{ fontSize: '2rem' }}>Join the Waitlist</h2>
                <p className="text-dim" style={{ fontSize: '14px', marginTop: '0.5rem' }}>Spring 2026 installations are filling fast.</p>
            </header>
            <div className="form-progress" style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem' }}>
                <div style={{ height: '2px', flex: 1, background: 'var(--c-accent)', borderRadius: '1px' }}></div>
                <div style={{ height: '2px', flex: 1, background: step === 2 ? 'var(--c-accent)' : 'var(--c-border-strong)', borderRadius: '1px', transition: 'var(--t-base)' }}></div>
            </div>
            <form className="form-card" onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 'none' }}>
                <div style={{ display: 'none' }}><input name="website" value={formData.website} onChange={handleChange} /></div>
                {errors.general && <p className="text-orange" style={{ fontSize: '12px', marginBottom: '1rem', textAlign: 'center' }}>{errors.general}</p>}

                {step === 1 ? (
                    <div className="reveal reveal-active">
                        <div className="form-group">
                            <label className="calc-label">Full Name</label>
                            <div className="form-input-wrapper">
                                <input name="name" className="form-input" placeholder="Your full name" value={formData.name} onChange={handleChange} />
                            </div>
                            {errors.name && <p className="text-orange" style={{ fontSize: '10px', marginTop: '0.5rem' }}>{errors.name}</p>}
                        </div>
                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <label className="calc-label">Email</label>
                            <div className="form-input-wrapper">
                                <input name="email" type="email" className="form-input" placeholder="you@example.com" value={formData.email} onChange={handleChange} />
                            </div>
                            {errors.email && <p className="text-orange" style={{ fontSize: '10px', marginTop: '0.5rem' }}>{errors.email}</p>}
                        </div>
                        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                            <div className="form-group">
                                <label className="calc-label">Phone</label>
                                <div className="form-input-wrapper">
                                    <input name="phoneNumber" className="form-input" placeholder="(519) 555-0123" value={formData.phoneNumber} onChange={handleChange} />
                                </div>
                                {errors.phoneNumber && <p className="text-orange" style={{ fontSize: '10px', marginTop: '0.5rem' }}>{errors.phoneNumber}</p>}
                            </div>
                            <div className="form-group">
                                <label className="calc-label">Postal Code</label>
                                <div className="form-input-wrapper">
                                    <input name="postalCode" className="form-input" placeholder="N6A 1A1" value={formData.postalCode} onChange={handleChange} />
                                </div>
                                {errors.postalCode && <p className="text-orange" style={{ fontSize: '10px', marginTop: '0.5rem' }}>{errors.postalCode}</p>}
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
                                    <svg style={{ width: '28px', height: '28px', marginBottom: '8px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                    Home
                                </div>
                                <div onClick={() => setFormData(v => ({ ...v, propertyType: 'commercial' }))} className={`prop-type-card ${formData.propertyType === 'commercial' ? 'active' : ''}`}>
                                    <svg style={{ width: '28px', height: '28px', marginBottom: '8px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                    Business
                                </div>
                            </div>
                        </div>
                        <div className="form-group" style={{ marginTop: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <label className="calc-label">Monthly Heating Cost (Approx.)</label>
                                <span className="text-orange" style={{ fontSize: '14px', fontWeight: '700' }}>${formData.monthlyHeatingCost}</span>
                            </div>
                            <input type="range" name="monthlyHeatingCost" className="slider" min="50" max="1000" step="10" value={formData.monthlyHeatingCost} onChange={handleChange} />
                        </div>
                        <div className="form-group" style={{ marginTop: '2.5rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <input type="checkbox" name="privacyAccepted" checked={formData.privacyAccepted} onChange={handleChange} style={{ width: '20px', height: '20px', marginTop: '2px', cursor: 'pointer', appearance: 'auto' }} />
                                <span style={{ fontSize: '13px', lineHeight: '1.5' }} className="text-dim">I agree to be contacted by Genesis Heating Solutions about installation.</span>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <input type="checkbox" name="marketingConsent" checked={formData.marketingConsent} onChange={handleChange} style={{ width: '20px', height: '20px', marginTop: '2px', cursor: 'pointer', appearance: 'auto' }} />
                                <span style={{ fontSize: '13px', lineHeight: '1.5' }} className="text-dim">Send me updates and offers</span>
                            </div>
                            {errors.privacyAccepted && <p className="text-orange" style={{ fontSize: '10px', marginTop: '0.75rem' }}>{errors.privacyAccepted}</p>}
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '2.5rem' }} disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Reserve My Spot'}</button>
                        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '11px', opacity: 0.5 }}>Priority scheduling for neighbourhoods with more signups.</p>
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
            <nav className="footer-links" style={{ marginBottom: '2.5rem' }}>
                <a href="/privacy.html">Privacy</a>
                <a href="/terms.html">Terms</a>
                <a href="mailto:genesisheatingsolutions@gmail.com">Contact Us</a>
            </nav>
            <div className="footer-social">
                <a href="https://www.facebook.com/profile.php?id=61586813584409" target="_blank" rel="noopener" aria-label="Facebook">
                    <svg style={{ width: 24, height: 24 }} viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
                </a>
            </div>
            <p className="footer-copy">© {new Date().getFullYear()} GENESIS HEATING SOLUTIONS. LICENSED ONTARIO HVAC PARTNER.</p>
            <a href="https://superheat.xyz" target="_blank" rel="noopener" className="footer-superheat">Powered by Superheat Technology</a>
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
