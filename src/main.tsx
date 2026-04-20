import { render } from 'preact'
import { injectSpeedInsights } from '@vercel/speed-insights'
import App from './App'
import './index.css'

// Initialize analytics session
const initSession = () => {
    if (typeof window === 'undefined') return

    // Generate session ID if not exists
    let sessionId = sessionStorage.getItem('sh_sid')
    if (!sessionId) {
        sessionId = window.crypto.randomUUID()
        sessionStorage.setItem('sh_sid', sessionId)
    }

    // Parse UTM params
    const params = new URLSearchParams(window.location.search)
    const utmData = {
        source: params.get('utm_source'),
        medium: params.get('utm_medium'),
        campaign: params.get('utm_campaign'),
        content: params.get('utm_content'),
        term: params.get('utm_term'),
        ref: params.get('ref'),
    }

    // Store for form submission
    if (Object.values(utmData).some(v => v)) {
        sessionStorage.setItem('sh_utm', JSON.stringify(utmData))
    }
}

initSession()

// Initialize Vercel Speed Insights
injectSpeedInsights()

render(<App />, document.getElementById('root')!)
