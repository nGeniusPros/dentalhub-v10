-- AI Feedback Schema for DentalHub
-- Run this in your Supabase SQL Editor

-- Enable the vector extension for embedding-based search
CREATE EXTENSION IF NOT EXISTS vector;

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

-- AI Response Table (Optional - for storing actual responses)
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_feedback_response_id ON ai_feedback(response_id);
CREATE INDEX IF NOT EXISTS idx_ai_feedback_agent_type ON ai_feedback(agent_type);
CREATE INDEX IF NOT EXISTS idx_ai_feedback_user_role ON ai_feedback(user_role);
CREATE INDEX IF NOT EXISTS idx_ai_feedback_context ON ai_feedback(feedback_context);
CREATE INDEX IF NOT EXISTS idx_ai_feedback_is_validated ON ai_feedback(is_validated);
CREATE INDEX IF NOT EXISTS idx_ai_responses_agent_type ON ai_responses(agent_type);

-- Set up Row Level Security (RLS)
ALTER TABLE ai_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_improvements ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_training_datasets ENABLE ROW LEVEL SECURITY;

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
        SELECT email FROM users WHERE role = 'admin'
      )
    )
  );

-- Views for analytics
CREATE OR REPLACE VIEW feedback_stats AS
SELECT
  COUNT(*) as total,
  SUM(CASE WHEN was_helpful = true THEN 1 ELSE 0 END) as helpful,
  SUM(CASE WHEN was_helpful = false THEN 1 ELSE 0 END) as unhelpful,
  SUM(CASE WHEN is_validated = true THEN 1 ELSE 0 END) as validated,
  CASE WHEN COUNT(*) > 0 
    THEN ROUND((SUM(CASE WHEN was_helpful = true THEN 1 ELSE 0 END)::numeric / COUNT(*)::numeric) * 100, 2)
    ELSE 0
  END as helpful_rate
FROM ai_feedback;

-- Function to get feedback by agent type
CREATE OR REPLACE FUNCTION get_feedback_by_agent(
  start_date TIMESTAMP WITH TIME ZONE DEFAULT (now() - INTERVAL '30 days'),
  end_date TIMESTAMP WITH TIME ZONE DEFAULT now()
) 
RETURNS TABLE (
  agent_type TEXT,
  total BIGINT,
  helpful BIGINT,
  unhelpful BIGINT,
  helpful_rate NUMERIC
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.agent_type,
    COUNT(*) as total,
    SUM(CASE WHEN was_helpful = true THEN 1 ELSE 0 END) as helpful,
    SUM(CASE WHEN was_helpful = false THEN 1 ELSE 0 END) as unhelpful,
    CASE WHEN COUNT(*) > 0 
      THEN ROUND((SUM(CASE WHEN was_helpful = true THEN 1 ELSE 0 END)::numeric / COUNT(*)::numeric) * 100, 2)
      ELSE 0
    END as helpful_rate
  FROM 
    ai_feedback f
  WHERE
    f.created_at BETWEEN start_date AND end_date
  GROUP BY 
    f.agent_type
  ORDER BY 
    total DESC;
END;
$$;

-- Function to get feedback by context
CREATE OR REPLACE FUNCTION get_feedback_by_context(
  start_date TIMESTAMP WITH TIME ZONE DEFAULT (now() - INTERVAL '30 days'),
  end_date TIMESTAMP WITH TIME ZONE DEFAULT now()
) 
RETURNS TABLE (
  feedback_context TEXT,
  total BIGINT,
  helpful BIGINT,
  unhelpful BIGINT,
  helpful_rate NUMERIC
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.feedback_context,
    COUNT(*) as total,
    SUM(CASE WHEN was_helpful = true THEN 1 ELSE 0 END) as helpful,
    SUM(CASE WHEN was_helpful = false THEN 1 ELSE 0 END) as unhelpful,
    CASE WHEN COUNT(*) > 0 
      THEN ROUND((SUM(CASE WHEN was_helpful = true THEN 1 ELSE 0 END)::numeric / COUNT(*)::numeric) * 100, 2)
      ELSE 0
    END as helpful_rate
  FROM 
    ai_feedback f
  WHERE
    f.created_at BETWEEN start_date AND end_date
  GROUP BY 
    f.feedback_context
  ORDER BY 
    total DESC;
END;
$$;
