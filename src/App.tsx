import { useState, useEffect } from 'preact/hooks'
import { JSX } from 'preact'
import { AdminDashboard } from './Admin'
import { track } from './lib/analytics'

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
            const isComplete = localStorage.getItem('genesis_consultation_complete');
            document.title = (document.hidden && !isComplete) ? "Genesis Heating — Book a Consultation" : oT;
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
                <a href="/" className="logo"><img src="/genesis-logo.png" alt="Genesis Heating Solutions" className="logo-img" /></a>
                <button onClick={() => sTo('consultation')} className="btn btn-primary nav-cta">Book a Consultation</button>
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
                <p className="hero-subtitle reveal reveal-active" style={{ '--delay': '0.6s' }}>We install smart water heaters that earn you money. Background computing heats your water while generating monthly credits — for homes and businesses across London, ON.</p>
                <div className="btn-row reveal reveal-active" style={{ '--delay': '0.8s' }}>
                    <button onClick={() => sTo('consultation')} className="btn btn-primary">Book a Free Consultation</button>
                </div>
            </div>
        </section>
    )
}

const Icon = ({ p }: { p: string }) => <svg className="icon-svg" viewBox="0 0 24 24" stroke-width="2" fill="none" stroke="currentColor"><path d={p} stroke-linecap="round" stroke-linejoin="round" /></svg>

const STEPS = [
    { n: 1, t: 'Professional Installation', d: 'We replace your existing tank with a high-efficiency unit. Same plumbing footprint, ESA-permitted electrical, zero renovation required. Homes and commercial properties.' },
    { n: 2, t: 'Thermal Energy Recycling', d: 'The system runs secure background computations. 98% of the heat generated is captured and transferred directly to your water — energy that data centres normally waste.' },
    { n: 3, t: 'Monthly Credits', d: 'The computations have value. We pass that value to you as a monthly CAD deposit or utility credit. Your water heater becomes an asset, not an expense.' },
]

const BENEFITS = [
    { i: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', t: 'Immediate ROI', d: 'Whether applying for CCA Class 43.1 tax write-offs or dropping residential hydro bills, the system produces guaranteed thermal value from day one.' },
    { i: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', t: 'Proactive Monitoring', d: 'We remotely manage the unit\'s computational uptime 24/7. If performance drops, our local engineers know before you do.' },
    { i: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', t: 'Seamless Integration', d: 'Fits the exact same mechanical footprint as a standard 50-gallon tank. Professional ESA-certified electrical & HVAC installation is included.' },
    { i: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z', t: 'Local London Partner', d: 'We aren\'t an overseas tech startup. We\'re a local infrastructure company providing hands-on installation and maintenance exclusively in London, ON.' },
]

const COMMERCIAL_TARGETS = [
    { i: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', t: 'Restaurants & Breweries', d: 'Constant dishwashing and boiler usage. Target Richmond Row, Dundas, and local BIA districts for maximum impact.' },
    { i: 'M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5', t: 'Salons & Spas', d: 'Continuous, high-volume hot water demand all day. Massive utility savings potential. CCA Class 43.1 eligible.' },
    { i: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', t: 'Boutique Hotels & Motels', d: 'Significant daily guest hot water usage. Multiple units can offset large utility profiles and scale with occupancy.' },
    { i: 'M13 10V3L4 14h7v7l9-11h-7z', t: 'Gyms & Athletics', d: 'Peak shower hours create huge gas bills. We offset the primary heating load and stabilize operating expenses.' },
    { i: 'M3 12l2-2m0 0l7-7 7 7', t: 'Multi-Unit Residential', d: 'Property managers looking to reduce NOI. Fleet scalable. 100% tax deductible in Year 1.' },
]

const FAQS = [
    { q: 'Is this just a standard water heater replacement?', a: 'It replaces your existing tank and heats water to the same spec. The difference: the unit runs secure background computations, and 98% of the heat from that processing warms your water. You get reliable hot water plus a monthly credit.' },
    { q: 'Do you work with businesses?', a: 'Yes. Restaurants, salons, gyms, laundromats, and commercial properties with high hot water demand are ideal. The unit may qualify for 100% immediate expensing (CCA Class 43.1) and a 30% Clean Technology Investment Tax Credit. Your accountant will want to look at this.' },
    { q: 'Are you actually a local London company?', a: 'Yes. We are based right here in London, Ontario. We handle the professional installation, ESA electrical permitting, onsite monitoring, and ongoing maintenance. We are the only licensed installer for this technology in the region.' },
    { q: 'How do the monthly credits work?', a: 'The system earns computational rewards. We convert those to CAD and pass them to you as a monthly deposit or utility credit. You never touch the technical side \u2014 we manage everything remotely.' },
    { q: 'What is the system actually doing?', a: 'It runs high-density mathematical computations. This process creates significant heat \u2014 which standard data centres waste into the atmosphere. We capture that heat and use it to warm your water. Same watt, two jobs.' },
    { q: 'Is my network or privacy at risk?', a: 'Never. The computing system runs on an isolated connection, completely separate from your personal network. It only performs mathematical calculations. We have zero access to your personal data.' },
    { q: 'How do I get started?', a: 'Book a free 15-minute consultation through the form on this page. We will walk you through the specifics for your property, the pricing options, and the installation timeline. No obligation.' },
]

const HowItWorks = () => (
    <div className="reveal">
        <header className="section-header" style={{ textAlign: 'left', marginBottom: 'var(--s-20)' }}>
            <h2 style={{ fontSize: '2rem' }}>How it Works</h2>
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
            <h2>Why Us?</h2>
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
    const [mode, setMode] = useState<'home' | 'business'>('business')

    return (
        <section className="section reveal">
            <div className="container">

                <header className="section-header" style={{ textAlign: 'center', marginBottom: 'var(--s-48)' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>One Watt, Two Purposes.</h2>
                    <p style={{ fontSize: '1.125rem', lineHeight: '1.7', color: 'var(--c-text-dim)', maxWidth: '800px', margin: '0 auto var(--s-32)' }}>
                        Our system repurposes a single watt of power to do two jobs: running secure background processing and capturing 98% of the heat it creates to warm your water.
                        Homes save on utility bills. Businesses can write off the entire unit and earn monthly credits.
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--s-8)', justifyContent: 'center' }}>
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
                        <p className="calc-label">{mode === 'home' ? 'Asset Yield' : 'Compute Output'}</p>
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
                        <h4>{mode === 'home' ? 'Fits Your Existing Setup' : 'Tax-Advantaged Infrastructure'}</h4>
                        <p>
                            {mode === 'home'
                                ? 'Same footprint as your current tank. 50-gallon capacity with industrial-grade recovery rates. We handle the energy management in the background. Zero learning curve.'
                                : 'The unit may qualify for 100% immediate expensing under CCA Class 43.1 and a 30% refundable Clean Technology Investment Tax Credit. Multiple units per location. Your accountant will want to see the numbers.'}
                        </p>
                    </div>
                    <div className="feature-card" style={{ borderColor: 'var(--c-accent)' }}>
                        <h4>{mode === 'home' ? 'Fully Managed by Genesis' : 'Managed Fleet Operations'}</h4>
                        <p>
                            {mode === 'home'
                                ? 'Professional HVAC installation, ESA electrical permitting, and 24/7 remote monitoring \u2014 all handled by our London team. You get the savings without opening a manual.'
                                : 'We handle installation, ESA permitting, uptime monitoring, and monthly credit distribution for your entire fleet. One point of contact for all units across your properties.'}
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
                <button onClick={() => sTo('consultation')} className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--s-32)', padding: 'var(--s-16)' }}>Book a Free Consultation&nbsp;→</button>
            </div>
        </div>
    )
}

const IdealBusinesses = () => (
    <section className="section reveal" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--c-border)', borderBottom: '1px solid var(--c-border)', marginTop: 'var(--s-section)' }}>
        <div className="container">
            <header className="section-header" style={{ textAlign: 'center', marginBottom: 'var(--s-48)' }}>
                <h2 style={{ fontSize: '2rem', letterSpacing: '-0.02em', marginBottom: '1rem' }}>Built for Business.</h2>
                <p style={{ fontSize: '1.125rem', color: 'var(--c-text-dim)', maxWidth: '600px', margin: '0 auto' }}>
                    If your business runs on hot water, you are leaving money on the table. We set up local enterprises with thermal recycling systems designed for high-demand infrastructure right here in London, ON.
                </p>
            </header>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--s-16)' }}>
                {COMMERCIAL_TARGETS.map(b => (
                    <article key={b.t} className="card" style={{ padding: 'var(--s-24)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--c-surface)', border: '1px solid var(--c-border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg className="icon-svg" style={{ width: '20px', height: '20px', color: 'var(--c-text)' }} viewBox="0 0 24 24" strokeWidth="1.5" fill="none" stroke="currentColor"><path d={b.i} strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>{b.t}</h4>
                            <p className="text-dim" style={{ fontSize: '13px', lineHeight: '1.5' }}>{b.d}</p>
                        </div>
                    </article>
                ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 'var(--s-32)' }}>
                <p style={{ fontSize: '13px', color: 'var(--c-text-dim)' }}>Curious how many units your space needs? <button onClick={() => sTo('consultation')} style={{ color: 'var(--c-text)', textDecoration: 'underline', fontWeight: 600 }}>We're happy to run the numbers.</button></p>
            </div>
        </div>
    </section>
)

const Communities = () => (
    <section className="reveal communities-section" style={{ padding: 'var(--s-32) var(--s-24)' }}>
        <h3 className="communities-title" style={{ marginBottom: 'var(--s-20)', fontSize: '1rem' }}>Now Serving</h3>
        <div className="communities-grid" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--s-8)' }}>
            {[
                'Byron', 'Masonville', 'Sunningdale', 'Wortley Village', 'Highland', 'Old North', 'Oakridge'
            ].map((c, i) => (
                <div key={c} style={{ position: 'relative' }}>
                    <div className="community-chip" style={{ fontSize: '0.8rem', padding: '0.625rem 1.25rem', fontWeight: 700, color: '#fff' }}>
                        {c}
                    </div>
                    {i < 3 && <span style={{ position: 'absolute', top: '-6px', right: '-10px', background: 'var(--c-accent)', color: 'white', fontSize: '7px', fontWeight: '900', padding: '2px 5px', borderRadius: '3px', textTransform: 'uppercase', boxShadow: '0 2px 4px rgba(255,92,0,0.3)', zIndex: 2 }}>Active</span>}
                </div>
            ))}
        </div>
        <p className="communities-note" style={{ marginTop: 'var(--s-16)', fontSize: '0.75rem', opacity: 0.6 }}>Homes and businesses. Scheduling by postal code density. New to the area — ask us anything.</p>
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
        // Track form section viewed
        track('form_section_viewed', { device: window.innerWidth < 768 ? 'mobile' : 'desktop' })

        // Check if user already signed up (prevent duplicates on reload)
        if (localStorage.getItem('genesis_consultation_complete')) {
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
        // Phone is now optional - removed required validation
        if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code required'
        if (!formData.propertyType) newErrors.general = 'Property profile required'
        if (!formData.privacyAccepted) newErrors.privacyAccepted = 'Please confirm you\'d like to be contacted'
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
                source: 'website_consultation'
            }
            const res = await fetch('/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
            const r = await res.json().catch(() => ({ success: false }))
            if (!r.success) { setErrors(v => ({ ...v, general: r.error?.message || 'Synchronization failed' })); return; }
            localStorage.removeItem('genesis_form_draft')
            localStorage.setItem('genesis_consultation_complete', 'true')

            // Track Analytics Events
            if (typeof window !== 'undefined') {
                // GA4 Lead Event
                if ((window as any).gtag) {
                    (window as any).gtag('event', 'generate_lead', {
                        'event_category': 'Consultation',
                        'event_label': body.property_type
                    });
                }
                // Facebook Lead Event
                if ((window as any).fbq) {
                    (window as any).fbq('track', 'Lead', {
                        content_name: 'Consultation Request',
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
            <h2 className="reveal reveal-active" style={{ marginBottom: 'var(--s-12)', fontSize: '1.75rem' }}>We'll Be in Touch.</h2>
            <p className="reveal reveal-active" style={{ marginBottom: 'var(--s-32)', fontSize: '14px', animationDelay: '0.1s', color: 'rgba(255,255,255,0.7)' }}>Expect a follow-up within 48 hours to schedule your consultation. No obligation.</p>
            <div className="reveal reveal-active" style={{ padding: '1.5rem', background: 'rgba(255,92,0,0.08)', borderRadius: '20px', border: '1px solid rgba(255,92,0,0.2)', animationDelay: '0.2s', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                    <div style={{ padding: '3px', background: 'var(--c-accent)', borderRadius: '4px' }}>
                        <svg style={{ width: '10px', height: '10px' }} fill="white" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: '800', color: '#fff' }}>Know a Business Owner?</p>
                </div>
                <p style={{ fontSize: '13px', lineHeight: '1.6', color: 'rgba(255,255,255,0.8)', marginBottom: '1rem' }}>Restaurants, salons, and gyms with high hot water usage are ideal. Referrals that convert earn you a <strong style={{ color: '#fff' }}>$250 credit</strong> toward your own system.</p>
                <a href={`whatsapp://send?text=Hey — I just found Genesis Heating Solutions in London. They install smart water heaters that earn monthly credits while heating your water. Worth a look if you have a business with high hot water usage: ${window.location.origin}`} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '12px', textAlign: 'center', display: 'block' }}>Share via WhatsApp</a>
            </div>
        </div>
    )


    return (
        <div id="consultation">
            <header className="section-header" style={{ textAlign: 'left', marginBottom: 'var(--s-16)' }}>
                <h2 style={{ fontSize: '1.5rem' }}>Book a Free Consultation</h2>
                <p className="text-dim" style={{ fontSize: '12px', marginTop: 'var(--s-4)' }}>Now serving <span className="text-orange" style={{ fontWeight: 700 }}>homes and businesses</span> across London, ON.</p>
                <p style={{ fontSize: '11px', opacity: 0.5, marginTop: 'var(--s-8)' }}>✓ No payment required • ✓ 30 seconds • ✓ Your data stays private</p>
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
                                <label htmlFor="genesis-phone" className="calc-label">Phone <span style={{ opacity: 0.5, fontWeight: 400 }}>(optional)</span></label>
                                <input id="genesis-phone" name="phoneNumber" type="tel" autoComplete="tel" className={`form-input ${errors.phoneNumber ? 'error' : ''}`} placeholder="(519) 555-0123" value={formData.phoneNumber} onChange={handleChange} />
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
                            // Phone no longer required
                            if (!formData.postalCode) e.postalCode = 'Required';
                            if (Object.keys(e).length > 0) { setErrors(e); return; }
                            track('form_step_1_completed', { hasPhone: !!formData.phoneNumber })
                            setStep(2);
                        }} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.75rem 1.5rem' }}>Almost Done — One More Question...</button>
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
                                <label htmlFor="genesis-cost" className="calc-label" style={{ marginBottom: 0 }}>Monthly Heating Cost <span style={{ opacity: 0.5, fontWeight: 400 }}>(helps estimate your savings)</span></label>
                                <span className="text-orange" style={{ fontSize: '13px', fontWeight: '700' }}>${formData.monthlyHeatingCost}{formData.monthlyHeatingCost >= 3000 ? '+' : ''}</span>
                            </div>
                            <input id="genesis-cost" type="range" name="monthlyHeatingCost" className="slider" min="50" max="3000" step="50" value={formData.monthlyHeatingCost} onChange={handleChange} style={{ marginTop: '0.5rem' }} />
                        </div>
                        <div className="form-group" style={{ marginTop: '1.25rem' }}>
                            <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center', marginBottom: '0.625rem' }}>
                                <input id="genesis-privacy" type="checkbox" name="privacyAccepted" checked={formData.privacyAccepted} onChange={handleChange} style={{ width: '16px', height: '16px', flexShrink: 0, cursor: 'pointer', accentColor: 'var(--c-accent)' }} />
                                <label htmlFor="genesis-privacy" style={{ fontSize: '12px', lineHeight: '1.4', color: 'rgba(255,255,255,0.85)', cursor: 'pointer' }}>I'd like to learn more about this service <span style={{ opacity: 0.6 }}>(no obligation)</span></label>
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
                                    Submitting...
                                </span>
                            ) : 'Request Consultation'}
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
            <div className="footer-stamp">
                <img src="/genesis-logo.png" alt="Genesis Stamp" className="footer-stamp-img" />
            </div>
        </div>
    </footer>
)

export default function App() {
    useGenesisEngine();

    // SIMPLE ADMIN ROUTER
    const [isAdmin, setIsAdmin] = useState(false);
    const [token, setToken] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const adminToken = params.get('admin');
        // Accept the key regardless of case, and allow 'secure' as a shortcut
        if (adminToken && (adminToken.toLowerCase() === 'zomaya-genesis-2026-secure'.toLowerCase())) {
            setIsAdmin(true);
            setToken(adminToken);
        }
    }, []);

    if (isAdmin) {
        return <AdminDashboard token={token} />;
    }

    return (
        <>
            <Header />
            <main>
                <Hero />
                <div className="container split-grid" style={{ marginBottom: 'var(--s-32)', paddingTop: 'var(--s-64)' }}>
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
                <IdealBusinesses />
                <div className="container savings-split" style={{ alignItems: 'center', marginTop: 'var(--s-section)', marginBottom: 'var(--s-section)' }}>
                    <Benefits />
                    <SavingsCalculator />
                </div>
                <FAQ />
            </main>
            <Foot />
        </>
    )
}
