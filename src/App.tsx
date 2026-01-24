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
        const oT = document.title;
        const hS = () => root.style.setProperty('--sy', `${window.scrollY}px`);
        const hV = () => {
            const isComplete = localStorage.getItem('genesis_waitlist_complete');
            document.title = (document.hidden && !isComplete) ? "Waitlist Position: Pending..." : oT;
        };
        const hR = new IntersectionObserver((es) => {
            es.forEach(e => { if (e.isIntersecting) e.target.classList.add('reveal-active') });
        }, { threshold: 0.1 });

        window.addEventListener('scroll', hS, { passive: true });
        window.addEventListener('visibilitychange', hV);
        document.querySelectorAll('.reveal').forEach(el => hR.observe(el));
        hS();

        return () => {
            window.removeEventListener('scroll', hS);
            window.removeEventListener('visibilitychange', hV);
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

const Hero = () => {
    const [playing, setPlaying] = useState(false)
    return (
        <section className="hero" aria-labelledby="hero-h" style={{ background: 'transparent' }}>
            <div className={`hero-video ${playing ? 'playing' : ''}`}>
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    onPlay={() => setPlaying(true)}
                    onLoadedData={() => setPlaying(true)}
                    preload="auto"
                >
                    <source src="https://resources.superheat.xyz/website-videos/Hero_1222.mp4" type="video/mp4" />
                </video>
                <div className="video-overlay"></div>
            </div>
            <div className="container hero-content">
                <h1 id="hero-h" className="reveal reveal-active" style={{ '--delay': '0.4s' }}>Heating that makes <span className="text-orange">cents.</span></h1>
                <p className="hero-subtitle reveal reveal-active" style={{ '--delay': '0.6s' }}>We upgrade your property with a high-performance thermal recovery system that recycles energy from specialized computing to generate monthly utility credits for your home or business.</p>
                <div className="btn-row reveal reveal-active" style={{ '--delay': '0.8s' }}>
                    <button onClick={() => sTo('waitlist')} className="btn btn-primary">Join the Waitlist</button>
                </div>
            </div>
        </section>
    )
}

const Icon = ({ p }: { p: string }) => <svg className="icon-svg" viewBox="0 0 24 24" stroke-width="2" fill="none" stroke="currentColor"><path d={p} stroke-linecap="round" stroke-linejoin="round" /></svg>

const STEPS = [
    { n: 1, t: 'Standard Integration', d: 'We replace your old tank with a professional-grade Superheat unit. It fits your current plumbing footprint perfectly with zero renovation or lifestyle changes required.' },
    { n: 2, t: 'Thermal Energy Recycling', d: 'The system performs high-density background computations to heat your water with near-total efficiency, recycling energy that is usually wasted.' },
    { n: 3, t: 'Automated Property Value', d: 'While the system works, it generates a continuous stream of primary utility value. You receive this as a monthly credit or CAD payout, turning an expense into an asset.' },
]

const BENEFITS = [
    { i: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z', t: 'Built-in Efficiency', d: 'Works quietly in the background while you go about your day. Automated utility value, powered by your property.' },
    { i: 'M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-2.34c3.48-.3 6-3.24 6-6.66V4H4v4c0 3.42 2.52 6.36 6 6.66Z', t: 'Superior Performance', d: 'Industrial-grade heat exchange delivers constant hot water for your household. 24 gal/hour recovery rated.' },
    { i: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', t: 'Managed For You', d: 'We handle setup and maintenance. You enjoy energy savings and monthly value—entirely hands-off.' },
    { i: 'M12 2c-4 0-7 3-7 7 0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z', t: 'London Expertise', d: 'Based in London, ON. Local onsite integration and proactive monitoring for absolute peace of mind.' },
]

const FAQS = [
    { q: 'Is this just a standard water heater replacement?', a: 'The Superheat H1 is a professional-grade thermal recovery system. It functions exactly like a premium smart heater, but it uses repurposed energy from specialized computing to maintain your hot water at industrial efficiency—essentially heating your home with energy that would otherwise be wasted.' },
    { q: 'Are you actually a local London company?', a: 'Yes. We are a local team based here in London, Ontario. We handle everything from the initial professional integration to onsite monitoring and long-term maintenance, ensuring you always have a local point of contact for your property.' },
    { q: 'How do the monthly credits actually get to me?', a: 'As the hardware performs its background tasks, it generates computational value. We convert that value into monthly credits or CAD cheques to offset your energy bills. You get the reliable hot water you need and a lower net utility cost automatically.' },
    { q: 'What is the catch? What is the system actually doing inside?', a: 'The system runs high-performance computations as part of the Bitcoin network. This process generates significant heat, which we capture with 98% efficiency to heat your water. You benefit from the energy recycling without having to manage any technical complexities.' },
    { q: 'How big is the unit? Will it fit in my utility room?', a: 'Absolutely. The unit is designed to fit the exact same footprint as a standard 50-gallon tank. It runs as quietly as a desktop fan and is professionally integrated to ensure your home environment remains undisturbed.' },
    { q: 'Is my home network or privacy at risk?', a: 'Never. Your privacy is paramount. The computing system is entirely isolated from your personal home network and only performs mathematical calculations. We have zero access to your personal files, browsing history, or home data.' },
    { q: "What's the process for getting one installed by Spring?", a: 'Join our waitlist now. We are currently prioritizing neighborhoods like Byron and Masonville for our Spring 2026 launch. Once you are on the list, we will reach out in a few months for a no-pressure consultation to walk through the specifics for your property.' },
]

const HowItWorks = () => (
    <div className="reveal">
        <header className="section-header" style={{ textAlign: 'left', marginBottom: 'var(--s-20)' }}>
            <h2>How it works?</h2>
        </header>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-8)' }}>
            {STEPS.map(s => (
                <article key={s.n} className="card" style={{ padding: '0.85rem 1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{
                        background: 'var(--g-accent)', color: 'white',
                        width: '24px', height: '24px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '10px', fontWeight: '900', flexShrink: 0
                    }}>{s.n}</div>
                    <div>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '2px' }}>{s.t}</h4>
                        <p className="text-dim" style={{ fontSize: '12px', lineHeight: '1.4' }}>{s.d}</p>
                    </div>
                </article>
            ))}
        </div>
    </div>
)

const Benefits = () => (
    <div className="reveal">
        <header className="section-header" style={{ textAlign: 'left', marginBottom: 'var(--s-20)' }}>
            <h2>Why Genesis?</h2>
        </header>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-8)' }}>
            {BENEFITS.map(b => (
                <article key={b.t} className="card" style={{ padding: '0.85rem 1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        background: 'rgba(255,92,0,0.1)', border: '1px solid rgba(255,92,0,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                        <svg className="icon-svg" style={{ width: '18px', height: '18px', color: 'var(--c-accent)', margin: 0 }} viewBox="0 0 24 24" stroke-width="2.5" fill="none" stroke="currentColor">
                            <path d={b.i} stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                    <div>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '2px' }}>{b.t}</h4>
                        <p className="text-dim" style={{ fontSize: '12px', lineHeight: '1.4' }}>{b.d}</p>
                    </div>
                </article>
            ))}
        </div>
    </div>
)

const Infographic = () => {
    const [mode, setMode] = useState<'home' | 'business'>('home')

    return (
        <section className="section reveal">
            <div className="container">
                <header className="section-header">
                    <h2>One Watt, Two Purposes.</h2>
                    <p>Genesis Heating Solutions provides professional onsite integration of next-gen thermal units—hot water heaters that repurpose energy to generate primary value, creating a sustainable recovery stream for your property.</p>
                    <div style={{ display: 'flex', gap: 'var(--s-8)', justifyContent: 'center', marginTop: 'var(--s-24)' }}>
                        <button
                            onClick={() => setMode('home')}
                            className={mode === 'home' ? 'prop-type-card active' : 'prop-type-card'}
                            style={{ padding: '0.5rem 1.25rem', fontSize: '13px', cursor: 'pointer' }}
                        >
                            For Your Home
                        </button>
                        <button
                            onClick={() => setMode('business')}
                            className={mode === 'business' ? 'prop-type-card active' : 'prop-type-card'}
                            style={{ padding: '0.5rem 1.25rem', fontSize: '13px', cursor: 'pointer' }}
                        >
                            For Your Business
                        </button>
                    </div>
                </header>
                <div className="infographic-container">
                    <div className="info-card reveal" style={{ flex: 1 }}>
                        <Icon p="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <p className="calc-label">{mode === 'home' ? 'Value Recovery' : 'Compute Power'}</p>
                        <div className="info-value" style={{ minHeight: '3.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {mode === 'home' ? '~$1,000' : '120 TH/s'}
                        </div>
                        <p className="text-dim" style={{ fontSize: '0.75rem' }}>{mode === 'home' ? 'Estimated annual recovery' : 'High-density output per unit'}</p>
                    </div>
                    <div className="info-arrow">→</div>
                    <div className="info-card reveal" style={{ flex: 1 }}>
                        <Icon p="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                        <p className="calc-label">{mode === 'home' ? 'Utility Savings' : 'Thermal Efficiency'}</p>
                        <div className="info-value" style={{ minHeight: '3.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {mode === 'home' ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 0.9 }}>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 600, opacity: 0.5, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Up to</span>
                                    <span>80%</span>
                                </div>
                            ) : '98%'}
                        </div>
                        <p className="text-dim" style={{ fontSize: '0.75rem' }}>{mode === 'home' ? 'Targeted heating offset' : 'Heat capture recovery rate'}</p>
                    </div>
                    <div className="info-arrow">→</div>
                    <div className="info-card featured reveal" style={{ flex: 1 }}>
                        <Icon p="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                        <p className="calc-label">{mode === 'home' ? 'Performance' : 'Energy Impact'}</p>
                        <div className="info-value" style={{ minHeight: '3.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {mode === 'home' ? '24 g/h' : '4.2t'}
                        </div>
                        <p className="text-dim" style={{ fontSize: '0.75rem' }}>{mode === 'home' ? 'Heats 24 gal from 20°C to 60°C in <2.5h' : 'Annual carbon offset per unit'}</p>
                    </div>
                </div>
                <div className="feature-grid">
                    <div className="feature-card">
                        <h4>{mode === 'home' ? 'Uncompromised Experience' : 'Asset Optimization'}</h4>
                        <p>
                            {mode === 'home'
                                ? 'The H1 unit fits the same footprint as your current tank. You get 50 gallons of capacity with industrial-grade recovery rates—all while we handle the internal energy management in the background. Zero learning curve, just lower heating bills forever!'
                                : 'For property managers and owners, the Superheat fleet model leverages massive thermal capture across mid-to-large buildings. We turn your mechanical rooms into decentralized assets that pay for your building’s hot water energy.'}
                        </p>
                    </div>
                    <div className="feature-card" style={{ borderColor: 'var(--c-accent)' }}>
                        <h4>{mode === 'home' ? 'The Genesis Heating Solutions Advantage' : 'ESG-Driven Infrastructure'}</h4>
                        <p>
                            {mode === 'home'
                                ? 'Most specialized tech requires deep knowledge. We provide a complete, professional installation and hands-free management here in London, ON. From seamless HVAC integration to proactive monitoring, we make your savings visible without you ever having to open a manual.'
                                : 'Enhance your building infrastructure with energy-dense thermal capture. We achieve 98% thermal recovery with carbon-neutral heating, managed locally by our London team to ensure constant operational uptime and mechanical reliability.'}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

const TIME_STEPS = [1, 3, 5, 10]
const SavingsCalculator = () => {
    const [idx, setIdx] = useState(0)
    const years = TIME_STEPS[idx]

    return (
        <div className="reveal">
            <div className="calculator-card" style={{ width: '100%', padding: 'var(--s-40)' }}>
                <header className="section-header" style={{ textAlign: 'left', marginBottom: 'var(--s-32)' }}>
                    <h2>Sustainability.</h2>
                </header>
                <div className="calc-stats" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--s-16)', marginBottom: 'var(--s-32)' }}>
                    <div>
                        <div className="calc-val" style={{ fontSize: '1.75rem' }}>{years} yr</div>
                        <div className="calc-label">Planning Horizon</div>
                    </div>
                    <div>
                        <div className="calc-val" style={{ fontSize: '1.75rem' }}>{(years * 4.2).toFixed(1)}t</div>
                        <div className="calc-label">CO2 Carbon Saved</div>
                    </div>
                    <div>
                        <div className="calc-val" style={{ fontSize: '1.75rem' }}>${(years * 1000).toLocaleString()}</div>
                        <div className="calc-label">Estimated Net Earnings</div>
                    </div>
                </div>
                <div style={{ padding: 'var(--s-24)', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', marginBottom: 'var(--s-32)' }}>
                    <p className="text-dim" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                        Reclaim 98% of the thermal exhaust from high-value computation and recycle it as a primary heat source for your property with near-total efficiency.
                    </p>
                </div>
                <div style={{ marginTop: 'var(--s-32)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--s-16)', fontSize: '12px' }}>
                        <label htmlFor="genesis-horizon" className="text-dim" style={{ cursor: 'pointer' }}>Consultation Roadmap</label>
                        <span className="text-orange">{years} Year{years > 1 ? 's' : ''} Projection</span>
                    </div>
                    <input id="genesis-horizon" type="range" className="slider" min="0" max="3" step="1" value={idx} onChange={e => setIdx(+e.currentTarget.value)} />
                </div>
                <button onClick={() => sTo('waitlist')} className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--s-32)', padding: 'var(--s-16)' }}>Book a consultation for Spring 2026!&nbsp;→</button>
            </div>
        </div>
    )
}

const Communities = () => (
    <section className="reveal communities-section" style={{ padding: 'var(--s-32) var(--s-24)' }}>
        <h3 className="communities-title" style={{ marginBottom: 'var(--s-20)', fontSize: '1rem' }}>Upcoming Communities</h3>
        <div className="communities-grid" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--s-8)' }}>
            {[
                'Byron', 'Masonville', 'Sunningdale', 'Wortley Village', 'Hunt Club', 'Highland', 'Old North', 'Oakridge', 'Ambleside'
            ].map((c, i) => (
                <div key={c} style={{ position: 'relative' }}>
                    <div className="community-chip" style={{ fontSize: '0.8rem', padding: '0.625rem 1.25rem', fontWeight: 700, color: '#fff' }}>
                        {c}
                    </div>
                    {i < 3 && <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'var(--c-accent)', color: 'white', fontSize: '7px', fontWeight: '900', padding: '2px 5px', borderRadius: '3px', textTransform: 'uppercase', boxShadow: '0 2px 4px rgba(255,92,0,0.3)', zIndex: 2 }}>Priority</span>}
                </div>
            ))}
        </div>
        <p className="communities-note" style={{ marginTop: 'var(--s-16)', fontSize: '0.75rem', opacity: 0.6 }}>Phase 1 rollout scheduled by postal code density and local demand.</p>
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
    const [leadCount, setLeadCount] = useState(132)

    useEffect(() => {
        // Fetch real-time lead count
        fetch('/api/waitlist').then(res => res.json()).then(data => {
            if (data.count) setLeadCount(data.count);
        }).catch(() => { });

        // Check if user already signed up (prevent duplicates on reload)
        if (localStorage.getItem('genesis_waitlist_complete')) {
            setIsSuccess(true);
            return;
        }

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
                source: 'website_final_v10'
            }
            const res = await fetch('/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
            const r = await res.json().catch(() => ({ success: false }))
            if (!r.success) { setErrors(v => ({ ...v, general: r.error?.message || 'Synchronization failed' })); return; }
            localStorage.removeItem('genesis_form_draft')
            localStorage.setItem('genesis_waitlist_complete', 'true')

            // Track Analytics Events
            if (typeof window !== 'undefined') {
                // GA4 Lead Event
                if ((window as any).gtag) {
                    (window as any).gtag('event', 'generate_lead', {
                        'event_category': 'Waitlist',
                        'event_label': body.property_type
                    });
                }
                // Facebook Lead Event
                if ((window as any).fbq) {
                    (window as any).fbq('track', 'Lead', {
                        content_name: 'Waitlist Signup',
                        content_category: 'Leads'
                    });
                }
            }

            setIsSuccess(true);

        } catch (err) { setErrors(v => ({ ...v, general: 'Uplink synchronization error' })) } finally { setIsSubmitting(false) }
    }

    if (isSuccess) return (
        <div className="form-card" style={{ textAlign: 'center', padding: 'var(--s-48) var(--s-32)' }}>
            <div className="success-icon" style={{ fontSize: '3rem', marginBottom: 'var(--s-16)' }}>✓</div>
            <h2 className="reveal reveal-active" style={{ marginBottom: 'var(--s-12)', fontSize: '1.75rem' }}>You're In.</h2>
            <p className="reveal reveal-active" style={{ marginBottom: 'var(--s-32)', fontSize: '14px', animationDelay: '0.1s', color: 'rgba(255,255,255,0.7)' }}>We'll reach out in Spring 2026 to schedule your consultation. No obligation.</p>
            <div className="reveal reveal-active" style={{ padding: '1.5rem', background: 'rgba(255,92,0,0.08)', borderRadius: '20px', border: '1px solid rgba(255,92,0,0.2)', animationDelay: '0.2s', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                    <div style={{ padding: '3px', background: 'var(--c-accent)', borderRadius: '4px' }}>
                        <svg style={{ width: '10px', height: '10px' }} fill="white" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: '800', color: '#fff' }}>Refer a Neighbour</p>
                </div>
                <p style={{ fontSize: '13px', lineHeight: '1.6', color: 'rgba(255,255,255,0.8)', marginBottom: '1rem' }}>Know someone who'd benefit? Referrals get <strong style={{ color: '#fff' }}>free installation</strong> for a limited time. More neighbours = greater collective energy credits.</p>
                <a href={`whatsapp://send?text=Hey! I just found this local London company, Genesis Heating, that installs water heaters that actually lower your bills through energy recycling. I just joined their waitlist for Spring 2026. Check it out: ${window.location.origin}`} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '12px', textAlign: 'center', display: 'block' }}>Share via WhatsApp</a>
            </div>
        </div>
    )


    return (
        <div id="waitlist">
            <header className="section-header" style={{ textAlign: 'left', marginBottom: 'var(--s-16)' }}>
                <h2 style={{ fontSize: '1.5rem' }}>Join {leadCount}+ Londoners</h2>
                <p className="text-dim" style={{ fontSize: '12px', marginTop: 'var(--s-4)' }}>Currently prioritizing <span className="text-orange" style={{ fontWeight: 700 }}>Byron</span> & Masonville for Phase 1.</p>
            </header>
            <div className="form-progress" style={{ display: 'flex', gap: 'var(--s-4)', marginBottom: 'var(--s-16)' }}>
                <div style={{ height: '2px', flex: 1, background: 'var(--c-accent)', borderRadius: '1px' }}></div>
                <div style={{ height: '2px', flex: 1, background: step === 2 ? 'var(--c-accent)' : 'var(--c-border-strong)', borderRadius: '1px', transition: 'var(--t-base)' }}></div>
            </div>
            <form className="form-card" onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 'none' }}>
                <div style={{ display: 'none' }} aria-hidden="true">
                    <input name="website" value={formData.website} onChange={handleChange} tabIndex={-1} />
                </div>
                {errors.general && <p className="text-orange" style={{ fontSize: '12px', marginBottom: '1rem', textAlign: 'center' }}>{errors.general}</p>}

                {step === 1 ? (
                    <div className="reveal reveal-active">
                        <div className="form-group">
                            <label htmlFor="genesis-name" className="calc-label">Full Name <span style={{ color: 'var(--c-accent)' }}>*</span></label>
                            <input id="genesis-name" name="name" autoComplete="name" className={`form-input ${errors.name ? 'error' : ''}`} placeholder="Your full name" value={formData.name} onChange={handleChange} required aria-required="true" />
                            {errors.name && <p className="text-orange" style={{ fontSize: '10px', marginTop: '0.375rem' }}>{errors.name}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="genesis-email" className="calc-label">Email <span style={{ color: 'var(--c-accent)' }}>*</span></label>
                            <input id="genesis-email" name="email" type="email" autoComplete="email" className={`form-input ${errors.email ? 'error' : ''}`} placeholder="you@example.com" value={formData.email} onChange={handleChange} required aria-required="true" />
                            {errors.email && <p className="text-orange" style={{ fontSize: '10px', marginTop: '0.375rem' }}>{errors.email}</p>}
                        </div>
                        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <div className="form-group">
                                <label htmlFor="genesis-phone" className="calc-label">Phone <span style={{ color: 'var(--c-accent)' }}>*</span></label>
                                <input id="genesis-phone" name="phoneNumber" type="tel" autoComplete="tel" className={`form-input ${errors.phoneNumber ? 'error' : ''}`} placeholder="(519) 555-0123" value={formData.phoneNumber} onChange={handleChange} required aria-required="true" />
                                {errors.phoneNumber && <p className="text-orange" style={{ fontSize: '10px', marginTop: '0.375rem' }}>{errors.phoneNumber}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="genesis-postal" className="calc-label">Postal Code <span style={{ color: 'var(--c-accent)' }}>*</span></label>
                                <input id="genesis-postal" name="postalCode" autoComplete="postal-code" className={`form-input ${errors.postalCode ? 'error' : ''}`} placeholder="N6A 1A1" value={formData.postalCode} onChange={handleChange} required aria-required="true" />
                                {errors.postalCode && <p className="text-orange" style={{ fontSize: '10px', marginTop: '0.375rem' }}>{errors.postalCode}</p>}
                            </div>
                        </div>
                        <button type="button" onClick={() => {
                            const e: FormErrors = {};
                            if (!formData.name) e.name = 'Required';
                            if (!formData.email) e.email = 'Required';
                            if (!formData.phoneNumber) e.phoneNumber = 'Required';
                            if (!formData.postalCode) e.postalCode = 'Required';
                            if (Object.keys(e).length > 0) { setErrors(e); return; }
                            setStep(2);
                        }} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.75rem 1.5rem' }}>Continue to Final Step →</button>
                    </div>

                ) : (
                    <div className="reveal reveal-active">
                        <div className="form-group">
                            <label htmlFor="genesis-prop-type" className="calc-label">Property Type <span style={{ color: 'var(--c-accent)' }}>*</span></label>
                            <input id="genesis-prop-type" type="hidden" name="propertyType" value={formData.propertyType} required />
                            <div className={`prop-type-grid ${errors.general && !formData.propertyType ? 'error-ring' : ''}`} role="radiogroup" aria-labelledby="genesis-prop-type">
                                <button type="button" onClick={() => { setFormData(v => ({ ...v, propertyType: 'residential' })); setErrors(v => ({ ...v, general: undefined })); }} className={`prop-type-card ${formData.propertyType === 'residential' ? 'active' : ''}`} role="radio" aria-checked={formData.propertyType === 'residential'}>
                                    <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                    Home
                                </button>
                                <button type="button" onClick={() => { setFormData(v => ({ ...v, propertyType: 'commercial' })); setErrors(v => ({ ...v, general: undefined })); }} className={`prop-type-card ${formData.propertyType === 'commercial' ? 'active' : ''}`} role="radio" aria-checked={formData.propertyType === 'commercial'}>
                                    <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                    Business
                                </button>
                            </div>
                            {errors.general && !formData.propertyType && <p className="text-orange" style={{ fontSize: '10px', marginTop: '0.375rem' }}>Property profile required</p>}
                        </div>
                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label htmlFor="genesis-cost" className="calc-label" style={{ marginBottom: 0 }}>Monthly Heating Cost</label>
                                <span className="text-orange" style={{ fontSize: '13px', fontWeight: '700' }}>${formData.monthlyHeatingCost}</span>
                            </div>
                            <input id="genesis-cost" type="range" name="monthlyHeatingCost" className="slider" min="50" max="1000" step="10" value={formData.monthlyHeatingCost} onChange={handleChange} style={{ marginTop: '0.5rem' }} />
                        </div>
                        <div className="form-group" style={{ marginTop: '1.25rem' }}>
                            <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center', marginBottom: '0.625rem' }}>
                                <input id="genesis-privacy" type="checkbox" name="privacyAccepted" checked={formData.privacyAccepted} onChange={handleChange} style={{ width: '16px', height: '16px', flexShrink: 0, cursor: 'pointer', accentColor: 'var(--c-accent)' }} />
                                <label htmlFor="genesis-privacy" style={{ fontSize: '12px', lineHeight: '1.4', color: 'rgba(255,255,255,0.85)', cursor: 'pointer' }}>I agree to be contacted about installation.</label>
                            </div>
                            <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
                                <input id="genesis-marketing" type="checkbox" name="marketingConsent" checked={formData.marketingConsent} onChange={handleChange} style={{ width: '16px', height: '16px', flexShrink: 0, cursor: 'pointer', accentColor: 'var(--c-accent)' }} />
                                <label htmlFor="genesis-marketing" style={{ fontSize: '12px', lineHeight: '1.4', color: 'rgba(255,255,255,0.85)', cursor: 'pointer' }}>Send me updates and offers</label>
                            </div>
                            {errors.privacyAccepted && <p className="text-orange" style={{ fontSize: '10px', marginTop: '0.375rem' }}>{errors.privacyAccepted}</p>}
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.25rem', padding: '0.875rem 1.5rem', opacity: isSubmitting ? 0.7 : 1 }} disabled={isSubmitting}>
                            {isSubmitting ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <svg className="animate-spin" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="31.4 31.4" /></svg>
                                    Securing Spot...
                                </span>
                            ) : 'Reserve Your Spot'}
                        </button>
                        <button type="button" onClick={() => setStep(1)} style={{ width: '100%', marginTop: '0.75rem', padding: '0.625rem', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'rgba(255,255,255,0.7)', background: 'transparent', cursor: 'pointer' }}>← Back to Step 1</button>

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
                                <p className="text-dim" style={{ paddingBottom: 'var(--s-40)', fontSize: '1.125rem' }}>{f.a}</p>
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
            <nav className="footer-links" style={{ marginBottom: 'var(--s-40)' }}>
                <a href="/privacy.html">Privacy</a>
                <a href="/terms.html">Terms</a>
                <a href="mailto:genesisheatingsolutions@gmail.com">Contact Us</a>
            </nav>
            <div className="footer-social" style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--s-32)' }}>
                <a href="https://www.facebook.com/profile.php?id=61586813584409" target="_blank" rel="noopener" aria-label="Facebook" style={{ color: 'white', opacity: 0.8, transition: 'opacity 0.2s' }}>
                    <svg style={{ width: 24, height: 24 }} viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
                </a>
            </div>
            <p className="footer-copy">© {new Date().getFullYear()} GENESIS HEATING SOLUTIONS. LICENSED ONTARIO HVAC PARTNER.</p>
            <div style={{ marginTop: 'var(--s-32)', display: 'flex', flexDirection: 'column', gap: 'var(--s-12)', alignItems: 'center', opacity: 0.6, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <a href="https://resources.superheat.xyz/brand-resources/Superheat-H1-Product-Introduction.pdf" target="_blank" rel="noopener" style={{ borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '2px', color: 'white' }}>Superheat H1 - Technical Overview (PDF)</a>
                <a href="https://superheat.xyz" target="_blank" rel="noopener" style={{ color: 'rgba(255,255,255,0.7)' }}>Powered by Superheat Technology</a>
            </div>
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
                <div className="container split-grid" style={{ marginBottom: 'var(--s-32)' }}>
                    <div className="reveal">
                        <div style={{ marginBottom: 'var(--s-20)' }}>
                            <HowItWorks />
                        </div>
                        <Communities />
                    </div>
                    <div className="reveal sticky-form" style={{ position: 'sticky', top: 'var(--s-128)' }}>
                        <WaitlistForm />
                    </div>
                </div>
                <Infographic />
                <div className="container savings-split" style={{ alignItems: 'center', marginTop: 'calc(var(--s-section) * -1)', marginBottom: 'var(--s-section)' }}>
                    <Benefits />
                    <SavingsCalculator />
                </div>
                <FAQ />
            </main>
            <Foot />
        </>
    )
}
