-- Create AI Response Feedback Tables for Reinforcement Learning
-- This script aligns with the existing Supabase vector database setup

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- AI Response Feedback Table
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

-- Create index for vector similarity search on feedback
CREATE INDEX ON ai_response_feedback USING ivfflat (embedding vector_l2_ops) WITH (lists = 100);

-- Create tables for reinforcement learning datasets
CREATE TABLE ai_training_datasets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  agent_type VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Junction table to connect feedback to datasets
CREATE TABLE ai_dataset_feedback (
  dataset_id UUID REFERENCES ai_training_datasets(id) ON DELETE CASCADE,
  feedback_id UUID REFERENCES ai_response_feedback(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  added_by UUID NOT NULL,
  PRIMARY KEY (dataset_id, feedback_id)
);

-- Function to search feedback semantically
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
  RETURN QUERY
  WITH query_embedding AS (
    -- Generate embedding using pg_embedding
    SELECT pg_embedding(query_text) AS embedding
  )
  SELECT 
    f.id,
    f.feedback_text,
    f.corrected_response,
    f.agent_type,
    f.user_role,
    f.was_helpful,
    1 - (f.embedding <-> (SELECT embedding FROM query_embedding)) AS similarity,
    f.metadata
  FROM ai_response_feedback f
  WHERE 
    f.embedding IS NOT NULL
    AND (agent_type_filter IS NULL OR f.agent_type = agent_type_filter)
    AND (user_role_filter IS NULL OR f.user_role = user_role_filter)
    AND (helpful_filter IS NULL OR f.was_helpful = helpful_filter)
  ORDER BY f.embedding <-> (SELECT embedding FROM query_embedding)
  LIMIT match_count;
END;
$$;

-- Function to generate embeddings for feedback
CREATE OR REPLACE FUNCTION generate_feedback_embedding() 
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only generate embedding if there's feedback text
  IF NEW.feedback_text IS NOT NULL AND LENGTH(NEW.feedback_text) > 0 THEN
    UPDATE ai_response_feedback
    SET embedding = pg_embedding(feedback_text)
    WHERE id = NEW.id AND embedding IS NULL;
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger to automatically generate embeddings for feedback
CREATE TRIGGER generate_feedback_embedding_trigger
AFTER INSERT OR UPDATE OF feedback_text ON ai_response_feedback
FOR EACH ROW
EXECUTE FUNCTION generate_feedback_embedding();

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_ai_feedback_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at on feedback update
CREATE TRIGGER update_ai_feedback_updated_at_trigger
BEFORE UPDATE ON ai_response_feedback
FOR EACH ROW
EXECUTE FUNCTION update_ai_feedback_updated_at();

-- Enable RLS (Row Level Security)
ALTER TABLE ai_response_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_training_datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_dataset_feedback ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting feedback (any authenticated user can submit feedback)
CREATE POLICY "Users can insert their own feedback" 
  ON ai_response_feedback FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy for viewing feedback (only user who created it or staff/admin/expert can view)
CREATE POLICY "Users can view own feedback" 
  ON ai_response_feedback FOR SELECT 
  USING (auth.uid() = user_id OR 
        auth.jwt() ->> 'role' IN ('admin', 'staff', 'expert'));

-- Create policy for updating feedback (only staff/admin/expert can update)
CREATE POLICY "Only staff, admin, or experts can update feedback" 
  ON ai_response_feedback FOR UPDATE 
  USING (auth.jwt() ->> 'role' IN ('admin', 'staff', 'expert'))
  WITH CHECK (auth.jwt() ->> 'role' IN ('admin', 'staff', 'expert'));

-- Dataset policies
CREATE POLICY "Admin and experts can manage datasets"
  ON ai_training_datasets
  USING (auth.jwt() ->> 'role' IN ('admin', 'expert'))
  WITH CHECK (auth.jwt() ->> 'role' IN ('admin', 'expert'));

CREATE POLICY "Staff can view datasets"
  ON ai_training_datasets FOR SELECT
  USING (auth.jwt() ->> 'role' IN ('admin', 'staff', 'expert'));

-- Dataset feedback junction policies
CREATE POLICY "Admin and experts can manage dataset feedback"
  ON ai_dataset_feedback
  USING (auth.jwt() ->> 'role' IN ('admin', 'expert'))
  WITH CHECK (auth.jwt() ->> 'role' IN ('admin', 'expert'));

CREATE POLICY "Staff can view dataset feedback"
  ON ai_dataset_feedback FOR SELECT
  USING (auth.jwt() ->> 'role' IN ('admin', 'staff', 'expert'));

-- Comment on tables and columns for documentation
COMMENT ON TABLE ai_response_feedback IS 'Stores user feedback on AI responses for reinforcement learning';
COMMENT ON TABLE ai_training_datasets IS 'Collections of feedback for training specific AI models';
COMMENT ON TABLE ai_dataset_feedback IS 'Maps feedback items to training datasets';

-- Create indexes for efficient querying
CREATE INDEX ai_feedback_query_idx ON ai_response_feedback(query_id);
CREATE INDEX ai_feedback_agent_idx ON ai_response_feedback(agent_type);
CREATE INDEX ai_feedback_user_role_idx ON ai_response_feedback(user_role);
CREATE INDEX ai_feedback_created_at_idx ON ai_response_feedback(created_at);
CREATE INDEX ai_feedback_validated_idx ON ai_response_feedback(is_validated);

-- Insert sample datasets
INSERT INTO ai_training_datasets (name, description, agent_type)
VALUES 
('Dental Consultant Improvement', 'Dataset for improving the AI dental consultant responses', 'consultant'),
('Code Assistant Refinement', 'Feedback for enhancing dental code and billing assistance', 'coding'),
('Treatment Planning Validation', 'Expert-validated treatment planning suggestions', 'treatment'),
('Lab Case Management', 'Feedback for lab case management and tracking', 'lab');
