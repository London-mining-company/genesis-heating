import { useState, useEffect } from 'preact/hooks'

interface Metrics {
    overview: {
        totalLeads: number;
        newLeads7d: number;
        highValueLeads: number;
        growthRate: number;
    };
    trends: {
        daily: [string, number][];
    };
    insights: {
        geographicDensity: [string, number][];
        propertyMix: { residential: number; business: number };
        attribution: Record<string, number>;
        pathAnalysis: { ownerPotential: number; builderPotential: number };
        financialPotential: {
            totalStatedCost: number;
            estimatedMRR: number;
            portfolioYield36: number;
            avgLeadValue: number;
            cacLtvRatio: string;
        };
    };
    lastSync: string;
}

export const AdminDashboard = ({ token }: { token: string }) => {
    const [data, setData] = useState<Metrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`/api/admin/metrics?token=${token}`)
            .then(async res => {
                if (!res.ok) {
                    const body = await res.text();
                    try {
                        const json = JSON.parse(body);
                        throw new Error(json.error?.message || `${res.status}`);
                    } catch {
                        throw new Error(`${res.status}: ${body.slice(0, 100)}`);
                    }
                }
                return res.json();
            })
            .then(json => {
                if (json.success) setData(json.data);
                else setError(json.error?.message || 'Failed to load metrics');
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [token]);

    if (loading) return <div className="admin-loading">Initializing Genesis Command Intelligence...</div>;

    if (error) return (
        <div className="admin-error" style={{ textAlign: 'center', padding: 'var(--s-48)' }}>
            <h2 style={{ color: 'var(--c-accent)', marginBottom: '1rem' }}>⚠️ Intelligence Link Failure</h2>
            <p style={{ opacity: 0.7, maxWidth: '500px', margin: '0 auto', fontSize: '14px' }}>
                {error.includes('401') ? 'Authentication Error: The APP_SECRET on the server does not match your link.' :
                    error.includes('fetch') ? 'Network Error: Cannot reach the Genesis API. Check your internet or deployment status.' :
                        `Internal Error: ${error}`}
            </p>
            <div style={{ marginTop: '2rem' }}>
                <a href="/" className="btn-outline">Back to Public Site</a>
                <button onClick={() => window.location.reload()} className="btn-primary" style={{ marginLeft: '1rem', padding: '10px 20px' }}>Retry Connection</button>
            </div>
        </div>
    );

    if (!data) return null;

    return (
        <div className="admin-dashboard reveal-active">
            <header className="admin-header">
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h1>Genesis <span className="text-orange">Command Intelligence</span></h1>
                        <p className="text-dim">Business Intelligence v2.5 • Pilot Rollout • {new Date(data.lastSync).toLocaleTimeString()}</p>
                    </div>
                    <div className="status-badge">Strategy Locked: Gold Book v1.1</div>
                </div>
            </header>

            <main className="container">
                {/* CORE KPI LAYER */}
                <div className="metrics-grid">
                    <MetricCard
                        title="Total Active Pipeline"
                        value={data.overview.totalLeads}
                        sub={`${data.overview.highValueLeads} A-Class Scorers`}
                        trend={`+${data.overview.growthRate.toFixed(1)}% velocity`}
                    />
                    <MetricCard
                        title="36-Month Portfolio"
                        value={`$${Math.round(data.insights.financialPotential.portfolioYield36 / 1000)}K`}
                        sub="Projected Yield Recovery"
                        trend={`LTV/CAC: ${data.insights.financialPotential.cacLtvRatio}x`}
                    />
                    <MetricCard
                        title="Daily Velocity"
                        value={data.trends.daily[0]?.[1] || 0}
                        sub="Leads captured today"
                        trend="Market Sentiment: High"
                    />
                </div>

                <div className="admin-row">
                    {/* DAILY TREND CHART */}
                    <div className="admin-card">
                        <h3>14-Day Lead Velocity</h3>
                        <div className="chart-container" style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '4px', paddingTop: '24px' }}>
                            {data.trends.daily.map(([date, count]) => (
                                <div key={date} className="chart-bar-group" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div className="chart-bar" style={{
                                        width: '100%',
                                        height: `${(count / (Math.max(...data.trends.daily.map(d => d[1])) || 1)) * 100}%`,
                                        background: date === new Date().toISOString().split('T')[0] ? 'var(--c-accent)' : 'rgba(255,255,255,0.1)',
                                        borderRadius: '2px',
                                        minHeight: count > 0 ? '4px' : '0'
                                    }}></div>
                                    <span style={{ fontSize: '8px', opacity: 0.3, marginTop: '8px', transform: 'rotate(-45deg)' }}>{date.slice(5)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* PATH STRATEGY */}
                    <div className="admin-card">
                        <h3>Sales Path Distribution (Gold Book)</h3>
                        <div className="path-viz" style={{ marginTop: '24px' }}>
                            <div className="path-item">
                                <div className="path-meta">
                                    <span className="label">Path A: The Owner ($6.5K CAPEX)</span>
                                    <span className="val">{data.insights.pathAnalysis.ownerPotential} Potential</span>
                                </div>
                                <div className="path-bar-bg"><div className="path-bar-fill" style={{ width: `${(data.insights.pathAnalysis.ownerPotential / data.overview.totalLeads) * 100}%`, background: '#00ffcc' }}></div></div>
                            </div>
                            <div className="path-item" style={{ marginTop: '24px' }}>
                                <div className="path-meta">
                                    <span className="label">Path B: The Builder ($500 ACTV)</span>
                                    <span className="val">{data.insights.pathAnalysis.builderPotential} Potential</span>
                                </div>
                                <div className="path-bar-bg"><div className="path-bar-fill" style={{ width: `${(data.insights.pathAnalysis.builderPotential / data.overview.totalLeads) * 100}%` }}></div></div>
                            </div>
                        </div>
                        <p className="text-dim" style={{ fontSize: '11px', marginTop: '32px' }}>*Path suggested by inferred disposable utility budget from heating cost data.</p>
                    </div>
                </div>

                <div className="admin-row" style={{ marginTop: 'var(--s-24)' }}>
                    {/* GEOGRAPHIC CLUSTERS */}
                    <div className="admin-card">
                        <h3>Geographic Asset Clustors (London, ON)</h3>
                        <div className="density-list" style={{ marginTop: '16px' }}>
                            {data.insights.geographicDensity.map(([pc, count]) => (
                                <div key={pc} className="density-item">
                                    <span className="pc">{pc}</span>
                                    <div className="bar-bg" style={{ height: '4px' }}>
                                        <div className="bar-fill" style={{ width: `${(count / data.overview.totalLeads) * 100}%` }}></div>
                                    </div>
                                    <span className="count">{count}</span>
                                    {count >= 5 ? <span className="trigger-pill" style={{ background: '#00ffcc', color: '#000' }}>CRITICAL MASS</span> : count >= 3 ? <span className="trigger-pill">READY</span> : null}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* MARKETING EFFICIENCY */}
                    <div className="admin-card">
                        <h3>Channel Attribution Efficiency</h3>
                        <div className="attribution-grid" style={{ marginTop: '16px' }}>
                            {Object.entries(data.insights.attribution).map(([source, count]) => (
                                <div key={source} className="attr-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', marginBottom: '8px' }}>
                                    <span style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '11px' }}>{source}</span>
                                    <span style={{ fontWeight: 900 }}>{count} <span style={{ opacity: 0.5, fontWeight: 400 }}>({((count / data.overview.totalLeads) * 100).toFixed(0)}%)</span></span>
                                </div>
                            ))}
                        </div>
                        <div className="intelligence-insight" style={{ marginTop: '24px', borderTop: '1px solid var(--c-border)', paddingTop: '16px' }}>
                            <p style={{ fontSize: '13px', lineHeight: '1.6' }}>🎯 <strong>Intelligence Note:</strong> {data.insights.propertyMix.business > data.overview.totalLeads * 0.2 ? 'Higher than average B2B interest detected. Focus on LinkedIn / Direct Outreach.' : 'B2C dominant. Continue Facebook Local Group seeding in ' + data.insights.geographicDensity[0]?.[0]}.</p>
                        </div>
                    </div>
                </div>
            </main>

            <style>{`
                .admin-dashboard { padding: var(--s-80) 0; min-height: 100vh; background: #000; }
                .admin-header { margin-bottom: var(--s-48); border-bottom: 1px solid var(--c-border); padding-bottom: var(--s-24); }
                .admin-header h1 { font-size: 2.5rem; margin-bottom: var(--s-8); }
                .metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--s-24); margin-bottom: var(--s-48); }
                .metric-card { background: var(--c-surface); border: 1px solid var(--c-border); padding: var(--s-32); border-radius: 20px; text-align: left; }
                .metric-card h4 { color: var(--c-text-dim); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: var(--s-16); }
                .metric-card .val { font-size: 3rem; font-weight: 900; margin-bottom: var(--s-8); color: #fff; }
                .metric-card .sub { font-size: 0.875rem; color: var(--c-accent); font-weight: 700; }
                .metric-card .trend { font-size: 0.75rem; color: var(--c-text-dim); margin-top: 4px; }
                .admin-dashboard { padding: var(--s-80) 0; min-height: 100vh; background: #000; color: #fff; }
                .admin-header { margin-bottom: var(--s-48); border-bottom: 1px solid var(--c-border); padding-bottom: var(--s-24); }
                .admin-header h1 { font-size: 2.5rem; margin-bottom: var(--s-8); }
                .status-badge { background: rgba(0, 255, 204, 0.1); color: #00ffcc; border: 1px solid #00ffcc; padding: 4px 12px; border-radius: 99px; font-size: 10px; text-transform: uppercase; font-weight: 800; letter-spacing: 0.1em; }
                .metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--s-24); margin-bottom: var(--s-48); }
                .metric-card { background: var(--c-surface); border: 1px solid var(--c-border); padding: var(--s-32); border-radius: 20px; text-align: left; transition: transform 0.3s ease; }
                .metric-card:hover { transform: translateY(-4px); border-color: var(--c-border-strong); }
                .metric-card h4 { color: rgba(255,255,255,0.4); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: var(--s-16); }
                .metric-card .val { font-size: 3rem; font-weight: 900; margin-bottom: var(--s-8); color: #fff; }
                .metric-card .sub { font-size: 0.875rem; color: var(--c-accent); font-weight: 700; }
                .metric-card .trend { font-size: 0.75rem; color: rgba(255,255,255,0.3); margin-top: 4px; }
                .admin-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--s-24); }
                .admin-card { background: var(--c-surface); border: 1px solid var(--c-border); padding: var(--s-32); border-radius: 20px; }
                .admin-card h3 { margin-bottom: var(--s-24); font-size: 1.1rem; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.7; }
                .path-meta { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px; }
                .path-bar-bg { height: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden; }
                .path-bar-fill { height: 100%; border-radius: 4px; transition: width 1s ease; background: var(--c-accent); }
                .density-item { display: flex; align-items: center; gap: var(--s-16); margin-bottom: var(--s-16); }
                .density-item .pc { font-family: monospace; font-weight: 700; width: 40px; }
                .density-item .bar-bg { flex: 1; height: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden; }
                .density-item .bar-fill { height: 100%; background: var(--c-accent); border-radius: 4px; }
                .density-item .count { font-weight: 900; width: 24px; text-align: right; }
                .trigger-pill { font-size: 8px; font-weight: 900; background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; margin-left: 8px; }
                .admin-loading { height: 100vh; display: flex; alignItems: center; justifyContent: center; color: var(--c-accent); font-weight: 700; background: #000; letter-spacing: 0.2em; }
                .admin-error { height: 100vh; display: flex; alignItems: center; justifyContent: center; color: #ff3b30; font-weight: 700; background: #000; }
                @media (max-width: 1024px) {
                    .metrics-grid, .admin-row { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
};

const MetricCard = ({ title, value, sub, trend }: any) => (
    <div className="metric-card">
        <h4>{title}</h4>
        <div className="val">{value}</div>
        <div className="sub">{sub}</div>
        <div className="trend">{trend}</div>
    </div>
);
