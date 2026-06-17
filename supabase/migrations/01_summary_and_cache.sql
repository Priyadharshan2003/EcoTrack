-- Aggregated summary table
CREATE TABLE IF NOT EXISTS carbon_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  total_co2 NUMERIC DEFAULT 0,
  weekly_avg NUMERIC DEFAULT 0,
  monthly_avg NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- AI insights cache
CREATE TABLE IF NOT EXISTS ai_insights_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  insights JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_carbon_summary_user_id ON carbon_summary(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_cache_user_id ON ai_insights_cache(user_id);
-- Assuming a carbon_actions table exists based on the plan, let's create the index
CREATE INDEX IF NOT EXISTS idx_carbon_actions_user_date ON carbon_actions(user_id, logged_at);
