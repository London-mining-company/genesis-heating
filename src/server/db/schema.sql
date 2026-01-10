/**
 * Database Schema for Superheat Waitlist
 * 
 * Using Supabase PostgreSQL for:
 * - Scalable managed database
 * - Row Level Security (RLS)
 * - Real-time subscriptions
 * - Built-in auth (future)
 */

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy search

-- ===========================================
-- WAITLIST SUBSCRIBERS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS waitlist_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Core fields
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100),
  phone VARCHAR(20),
  
  -- Location (for service area validation)
  postal_code VARCHAR(10),
  city VARCHAR(100) DEFAULT 'London',
  province VARCHAR(50) DEFAULT 'Ontario',
  
  -- Property info for quotes
  property_type VARCHAR(50) CHECK (property_type IN ('residential', 'commercial', 'industrial')),
  current_heating VARCHAR(50), -- gas, electric, oil, propane
  monthly_heating_cost INTEGER, -- CAD cents
  
  -- Marketing & attribution
  referral_source VARCHAR(100),
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  utm_content VARCHAR(100),
  utm_term VARCHAR(100),
  
  -- Engagement scoring
  priority_score INTEGER DEFAULT 0,
  interested_in_beta BOOLEAN DEFAULT false,
  
  -- Consent & compliance (CASL/PIPEDA)
  marketing_consent BOOLEAN DEFAULT false,
  marketing_consent_at TIMESTAMP WITH TIME ZONE,
  privacy_accepted BOOLEAN NOT NULL DEFAULT false,
  privacy_accepted_at TIMESTAMP WITH TIME ZONE,
  
  -- Tracking
  ip_address INET,
  user_agent TEXT,
  referrer_url TEXT,
  landing_page TEXT,
  
  -- Verification
  email_verified BOOLEAN DEFAULT false,
  email_verified_at TIMESTAMP WITH TIME ZONE,
  verification_token UUID DEFAULT uuid_generate_v4(),
  verification_expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '48 hours'),
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'contacted', 'converted', 'unsubscribed')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_waitlist_email ON waitlist_subscribers(email);
CREATE INDEX idx_waitlist_status ON waitlist_subscribers(status);
CREATE INDEX idx_waitlist_postal ON waitlist_subscribers(postal_code);
CREATE INDEX idx_waitlist_created ON waitlist_subscribers(created_at DESC);
CREATE INDEX idx_waitlist_priority ON waitlist_subscribers(priority_score DESC);

-- ===========================================
-- ANALYTICS EVENTS TABLE (Privacy-First)
-- ===========================================
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Event identification
  session_id UUID NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  event_name VARCHAR(100) NOT NULL,
  
  -- Page context
  page_url TEXT,
  page_title VARCHAR(255),
  referrer_url TEXT,
  
  -- Event data (flexible JSON)
  event_data JSONB DEFAULT '{}',
  
  -- Device info (anonymized)
  device_type VARCHAR(20), -- mobile, tablet, desktop
  browser_family VARCHAR(50),
  os_family VARCHAR(50),
  screen_width INTEGER,
  screen_height INTEGER,
  
  -- Geography (IP-derived, stored as region only)
  country_code CHAR(2),
  region VARCHAR(100),
  city VARCHAR(100),
  
  -- Timing
  page_load_time INTEGER, -- ms
  time_on_page INTEGER, -- seconds
  
  -- Source attribution
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Partition by month for performance
CREATE INDEX idx_analytics_session ON analytics_events(session_id);
CREATE INDEX idx_analytics_event ON analytics_events(event_type, event_name);
CREATE INDEX idx_analytics_created ON analytics_events(created_at DESC);

-- ===========================================
-- RATE LIMITING TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  identifier VARCHAR(255) NOT NULL, -- IP or fingerprint hash
  endpoint VARCHAR(100) NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Composite unique for upsert
  UNIQUE(identifier, endpoint, window_start)
);

CREATE INDEX idx_rate_limits_lookup ON rate_limits(identifier, endpoint, window_start);

-- Auto-cleanup old rate limit records
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM rate_limits WHERE window_start < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- CONVERSION FUNNEL TRACKING
-- ===========================================
CREATE TABLE IF NOT EXISTS funnel_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  session_id UUID NOT NULL,
  subscriber_id UUID REFERENCES waitlist_subscribers(id),
  
  -- Funnel stages
  stage VARCHAR(50) NOT NULL CHECK (stage IN (
    'page_view',
    'scroll_25',
    'scroll_50', 
    'scroll_75',
    'scroll_100',
    'cta_view',
    'form_start',
    'form_email',
    'form_details',
    'form_submit',
    'form_success',
    'email_verified'
  )),
  
  -- Context
  variant VARCHAR(50), -- For A/B testing
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_funnel_session ON funnel_events(session_id);
CREATE INDEX idx_funnel_stage ON funnel_events(stage);

-- ===========================================
-- ROW LEVEL SECURITY (RLS)
-- ===========================================
ALTER TABLE waitlist_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnel_events ENABLE ROW LEVEL SECURITY;

-- Service role can do everything
CREATE POLICY "Service role full access" ON waitlist_subscribers
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON analytics_events
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON rate_limits
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON funnel_events
  FOR ALL USING (auth.role() = 'service_role');

-- ===========================================
-- USEFUL VIEWS FOR DASHBOARD
-- ===========================================
CREATE OR REPLACE VIEW waitlist_stats AS
SELECT 
  COUNT(*) as total_subscribers,
  COUNT(*) FILTER (WHERE status = 'verified') as verified_subscribers,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours') as last_24h,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as last_7d,
  COUNT(*) FILTER (WHERE property_type = 'residential') as residential,
  COUNT(*) FILTER (WHERE property_type = 'commercial') as commercial,
  AVG(monthly_heating_cost) / 100 as avg_monthly_cost_cad
FROM waitlist_subscribers
WHERE status != 'unsubscribed';

CREATE OR REPLACE VIEW conversion_funnel AS
SELECT 
  stage,
  COUNT(DISTINCT session_id) as sessions,
  COUNT(*) as events
FROM funnel_events
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY stage
ORDER BY 
  CASE stage
    WHEN 'page_view' THEN 1
    WHEN 'scroll_25' THEN 2
    WHEN 'scroll_50' THEN 3
    WHEN 'scroll_75' THEN 4
    WHEN 'scroll_100' THEN 5
    WHEN 'cta_view' THEN 6
    WHEN 'form_start' THEN 7
    WHEN 'form_email' THEN 8
    WHEN 'form_details' THEN 9
    WHEN 'form_submit' THEN 10
    WHEN 'form_success' THEN 11
    WHEN 'email_verified' THEN 12
  END;

-- ===========================================
-- TRIGGERS FOR AUTO-UPDATES
-- ===========================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_waitlist_updated_at
  BEFORE UPDATE ON waitlist_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
