-- DentalHub v10 Production Database Setup
-- Run this script in your Supabase SQL Editor to set up all required tables and functions

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- Core tables from schema.sql
-- Prospects table
CREATE TABLE IF NOT EXISTS prospects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  lead_source TEXT,
  interest_level TEXT,
  notes TEXT,
  next_appointment TIMESTAMP,
  last_contact TIMESTAMP,
  assignee_id UUID REFERENCES profiles(id),
  location_id UUID REFERENCES locations(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  campaign_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  twilio_number_pool TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Junction table for prospects and campaigns
CREATE TABLE IF NOT EXISTS prospect_campaigns (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active',
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(prospect_id, campaign_id)
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Junction table for prospects and tags
CREATE TABLE IF NOT EXISTS prospect_tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(prospect_id, tag_id)
);

-- AI Feedback Tables from ai_feedback_schema.sql
-- AI Feedback Table
CREATE TABLE IF NOT EXISTS ai_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  response_id TEXT NOT NULL,
  agent_type TEXT NOT NULL,
  user_role TEXT NOT NULL,
  feedback_context TEXT NOT NULL,
  model_version TEXT,
  feedback_type TEXT NOT NULL,
  was_helpful BOOLEAN,
  feedback_text TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_validated BOOLEAN DEFAULT false,
  is_processed BOOLEAN DEFAULT false,
  ai_improvement_score NUMERIC,
  validated_by UUID,
  validation_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- AI Response Table
CREATE TABLE IF NOT EXISTS ai_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  response_id TEXT UNIQUE NOT NULL,
  agent_type TEXT NOT NULL,
  user_role TEXT NOT NULL,
  prompt TEXT NOT NULL, 
  response TEXT NOT NULL,
  prompt_embedding vector(1536),  -- For semantic search
  response_embedding vector(1536), -- For semantic search
  model_version TEXT NOT NULL,
  context_info JSONB,
  tokens_used INTEGER,
  duration_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- AI Improvement Records
CREATE TABLE IF NOT EXISTS ai_improvements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_version TEXT NOT NULL,
  agent_type TEXT NOT NULL,
  improvement_description TEXT NOT NULL,
  base_dataset_id UUID,
  feedback_count INTEGER NOT NULL,
  before_helpful_rate NUMERIC NOT NULL,
  after_helpful_rate NUMERIC NOT NULL,
  deployed_at TIMESTAMP WITH TIME ZONE,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- AI Training Datasets
CREATE TABLE IF NOT EXISTS ai_training_datasets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  agent_type TEXT NOT NULL,
  feedback_context TEXT,
  response_count INTEGER NOT NULL DEFAULT 0,
  feedback_count INTEGER NOT NULL DEFAULT 0,
  positive_examples INTEGER NOT NULL DEFAULT 0,
  negative_examples INTEGER NOT NULL DEFAULT 0,
  metadata JSONB,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- AI Response Feedback Table (from migration)
CREATE TABLE IF NOT EXISTS ai_response_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  query_id UUID NOT NULL,
  response_id UUID NOT NULL,
  user_id UUID NOT NULL,
  user_role VARCHAR(50) NOT NULL,    -- 'patient', 'staff', 'dentist', 'expert'
  agent_type VARCHAR(50) NOT NULL,   -- 'consultant', 'coding', 'treatment', 'lab'
  was_helpful BOOLEAN,
  helpfulness_rating SMALLINT,       -- optional 1-5 scale
  feedback_type VARCHAR(50) NOT NULL,-- 'thumbs', 'rating', 'correction', 'comment'
  feedback_text TEXT,
  corrected_response TEXT,
  embedding VECTOR(384),             -- For semantic search of feedback content
  metadata JSONB DEFAULT '{}'::JSONB,-- Additional metadata about the feedback
  model_version VARCHAR(100),
  is_validated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Junction table to connect feedback to datasets (from migration)
CREATE TABLE IF NOT EXISTS ai_dataset_feedback (
  dataset_id UUID REFERENCES ai_training_datasets(id) ON DELETE CASCADE,
  feedback_id UUID REFERENCES ai_response_feedback(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  added_by UUID NOT NULL,
  PRIMARY KEY (dataset_id, feedback_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_feedback_response_id ON ai_feedback(response_id);
CREATE INDEX IF NOT EXISTS idx_ai_feedback_agent_type ON ai_feedback(agent_type);
CREATE INDEX IF NOT EXISTS idx_ai_feedback_user_role ON ai_feedback(user_role);
CREATE INDEX IF NOT EXISTS idx_ai_feedback_context ON ai_feedback(feedback_context);
CREATE INDEX IF NOT EXISTS idx_ai_feedback_is_validated ON ai_feedback(is_validated);
CREATE INDEX IF NOT EXISTS idx_ai_responses_agent_type ON ai_responses(agent_type);
CREATE INDEX IF NOT EXISTS idx_prospects_status ON prospects(status);
CREATE INDEX IF NOT EXISTS idx_prospects_assignee ON prospects(assignee_id);
CREATE INDEX IF NOT EXISTS idx_prospects_location ON prospects(location_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_type ON campaigns(campaign_type);
CREATE INDEX ON ai_response_feedback USING ivfflat (embedding vector_l2_ops) WITH (lists = 100);

-- Set up Row Level Security (RLS)
ALTER TABLE ai_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_improvements ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_training_datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospect_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospect_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_response_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_dataset_feedback ENABLE ROW LEVEL SECURITY;

-- Policies for ai_feedback
CREATE POLICY "Anyone can insert feedback" ON ai_feedback
  FOR INSERT WITH CHECK (true);
  
CREATE POLICY "Authenticated users can view all feedback" ON ai_feedback
  FOR SELECT USING (auth.role() = 'authenticated');
  
CREATE POLICY "Only admins can update feedback" ON ai_feedback
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE auth.email() IN (
        SELECT email FROM admin_users
      )
    )
  );

-- Policies for prospects
CREATE POLICY "Authenticated users can view prospects" ON prospects
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert prospects" ON prospects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update prospects they are assigned to" ON prospects
  FOR UPDATE USING (
    auth.uid() = assignee_id OR
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE auth.email() IN (
        SELECT email FROM admin_users
      )
    )
  );

-- Policies for campaigns
CREATE POLICY "Authenticated users can view campaigns" ON campaigns
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert campaigns" ON campaigns
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update campaigns they created" ON campaigns
  FOR UPDATE USING (
    auth.uid() = created_by OR
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE auth.email() IN (
        SELECT email FROM admin_users
      )
    )
  );

-- Function to search feedback semantically (from migration)
CREATE OR REPLACE FUNCTION search_feedback(
  query_text TEXT, 
  agent_type_filter TEXT DEFAULT NULL,
  user_role_filter TEXT DEFAULT NULL,
  helpful_filter BOOLEAN DEFAULT NULL,
  match_count INT DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  feedback_text TEXT,
  corrected_response TEXT,
  agent_type VARCHAR(50),
  user_role VARCHAR(50),
  was_helpful BOOLEAN,
  similarity FLOAT,
  metadata JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
  -- This is a placeholder for the actual implementation
  -- The actual implementation would use vector similarity search
  RETURN QUERY
  SELECT 
    f.id,
    f.feedback_text,
    f.corrected_response,
    f.agent_type,
    f.user_role,
    f.was_helpful,
    0.0::FLOAT as similarity,
    f.metadata
  FROM 
    ai_response_feedback f
  WHERE
    (agent_type_filter IS NULL OR f.agent_type = agent_type_filter) AND
    (user_role_filter IS NULL OR f.user_role = user_role_filter) AND
    (helpful_filter IS NULL OR f.was_helpful = helpful_filter)
  LIMIT match_count;
END;
$$;

-- Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_users (
  email TEXT PRIMARY KEY,
  added_by UUID,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial admin user (replace with actual admin email)
INSERT INTO admin_users (email) 
VALUES ('admin@dentalhub.com')
ON CONFLICT (email) DO NOTHING;
