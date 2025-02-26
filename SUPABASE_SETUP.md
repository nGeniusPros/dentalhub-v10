# Supabase Vector Database Setup

This document provides instructions for setting up the Supabase vector database required for the AI agent system.

## Prerequisites

- A Supabase project with access to the SQL editor
- Admin access to run SQL commands

## Setup Steps

Follow these steps to set up your Supabase database for vector similarity search:

### 1. Enable the pgvector Extension

Run the following SQL command in the Supabase SQL editor to enable the pgvector extension:

```sql
-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;
```

### 2. Create Knowledge Base Tables

Create the tables needed for the knowledge base system:

```sql
-- Create a table for knowledge base items
CREATE TABLE knowledge_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  embedding VECTOR(384), -- Dimensions for pg_embedding
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create a table for knowledge bundles
CREATE TABLE knowledge_bundles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index for faster similarity searches
CREATE INDEX ON knowledge_base USING ivfflat (embedding vector_l2_ops);
```

### 3. Create Database Functions

Create the necessary functions for vector similarity search and embedding generation:

```sql
-- Create function for vector similarity search
CREATE OR REPLACE FUNCTION search_knowledge_base(query_text TEXT, match_count INT)
RETURNS TABLE (
  id UUID,
  content TEXT,
  similarity FLOAT,
  metadata JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH query_embedding AS (
    -- Generate embedding directly in PostgreSQL
    SELECT pg_embedding(query_text) AS embedding
  )
  SELECT 
    kb.id,
    kb.content,
    1 - (kb.embedding <-> (SELECT embedding FROM query_embedding)) AS similarity,
    kb.metadata
  FROM knowledge_base kb
  WHERE kb.embedding IS NOT NULL
  ORDER BY kb.embedding <-> (SELECT embedding FROM query_embedding)
  LIMIT match_count;
END;
$$;

-- Create function to generate embeddings for new entries
CREATE OR REPLACE FUNCTION generate_embeddings() 
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE knowledge_base
  SET embedding = pg_embedding(content)
  WHERE id = NEW.id AND embedding IS NULL;
  RETURN NEW;
END;
$$;

-- Create trigger to automatically generate embeddings
CREATE TRIGGER generate_embeddings_trigger
AFTER INSERT ON knowledge_base
FOR EACH ROW
EXECUTE FUNCTION generate_embeddings();
```

### 4. Create Function for Agent-Specific Search

This function allows searching for knowledge accessible only to specific agents:

```sql
-- Create function for agent-specific knowledge search
CREATE OR REPLACE FUNCTION search_knowledge_for_agent(
  query_text TEXT, 
  agent_id TEXT, 
  match_count INT
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  similarity FLOAT,
  metadata JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH query_embedding AS (
    -- Generate embedding directly in PostgreSQL
    SELECT pg_embedding(query_text) AS embedding
  )
  SELECT 
    kb.id,
    kb.content,
    1 - (kb.embedding <-> (SELECT embedding FROM query_embedding)) AS similarity,
    kb.metadata
  FROM knowledge_base kb
  WHERE 
    kb.embedding IS NOT NULL AND
    (
      -- Entry is accessible to all agents (no agents specified)
      (kb.metadata->>'agents') IS NULL OR
      (kb.metadata->>'agents') = '[]' OR
      -- Entry is accessible to this specific agent
      kb.metadata->'agents' @> concat('[', '"', agent_id, '"', ']')::jsonb
    )
  ORDER BY kb.embedding <-> (SELECT embedding FROM query_embedding)
  LIMIT match_count;
END;
$$;
```

### 5. Insert Sample Knowledge

Add some initial knowledge to test the system:

```sql
-- Insert sample knowledge
INSERT INTO knowledge_base (content, metadata)
VALUES 
('Improving hygiene production requires implementing consistent periodontal protocols and ensuring all patients receive appropriate care based on their condition. Setting daily production goals for hygienists and tracking them can help optimize department performance.', 
  '{"title": "Hygiene Production Optimization", "category": "hygiene", "agents": ["data-analysis", "recommendation"]}'),
  
('Lab case management best practices include tracking all cases digitally, setting up automated alerts for cases nearing due dates, and conducting weekly reviews of all pending cases. This helps prevent missed deadlines and improves patient satisfaction.', 
  '{"title": "Lab Case Management", "category": "lab", "agents": ["lab-case-manager"]}'),
  
('Key performance indicators for dental practices should include doctor production per hour, hygiene production per hour, case acceptance rate, and production-to-goal metrics. These KPIs provide insights into practice health and areas for improvement.', 
  '{"title": "Dental Practice KPIs", "category": "metrics", "agents": ["data-analysis"]}'),
  
('Reducing no-shows and last-minute cancellations requires a consistent confirmation protocol, proper scheduling techniques, and emphasizing the value of appointments to patients. Implementing a small reservation fee for appointments can also be effective.', 
  '{"title": "Reducing No-Shows", "category": "scheduling", "agents": ["recommendation"]}'),
  
('Effective recall systems should include multi-channel communication (text, email, phone), pre-appointment value messaging, and hygiene re-care scheduling before patients leave the office. This helps maintain a healthy patient flow and consistent production.', 
  '{"title": "Recall System Best Practices", "category": "patient-retention", "agents": ["recommendation"]}'),
  
('Treatment acceptance rates can be improved by using visual aids during treatment presentation, clearly communicating the benefits rather than technical details, offering appropriate financing options, and following up on unscheduled treatment plans.', 
  '{"title": "Improving Case Acceptance", "category": "production", "agents": ["recommendation"]}');

-- Insert sample bundles
INSERT INTO knowledge_bundles (name, description)
VALUES 
('Practice Growth', 'Knowledge related to growing your dental practice'),
('Patient Experience', 'Knowledge related to improving patient experience'),
('Production Optimization', 'Knowledge related to optimizing production and revenue');
```

### 6. Generate Embeddings

The trigger will automatically generate embeddings for new entries, but for the initial data:

```sql
-- Generate embeddings for existing content
UPDATE knowledge_base 
SET embedding = pg_embedding(content)
WHERE embedding IS NULL;
```

## Testing the Setup

You can test the vector search functionality with these SQL queries:

```sql
-- Test the general search function
SELECT * FROM search_knowledge_base('How can I improve hygiene production?', 2);

-- Test the agent-specific search function
SELECT * FROM search_knowledge_for_agent('How can I improve hygiene production?', 'recommendation', 2);
```

## Using the Knowledge Base Manager

The application includes a knowledge base manager component that allows you to:

1. Add new knowledge entries with titles, content, and categories
2. Create and manage knowledge bundles
3. Assign knowledge entries to specific agents
4. Browse and search existing entries

To access the Knowledge Base Manager, navigate to the Knowledge Base page in the application.

## Updating the DeepSeekClient

The DeepSeekClient in src/ai/deep-seek/deepSeekUtils.ts is configured to use the search_knowledge_base function. If you want to use agent-specific knowledge retrieval, modify the queryEmbeddings method to call search_knowledge_for_agent instead, passing the agent ID.

## API Reference for Knowledge Base Functions

| Function | Description | Parameters |
|----------|-------------|------------|
| search_knowledge_base | Searches all knowledge entries | query_text: The search query<br>match_count: Number of results to return |
| search_knowledge_for_agent | Searches knowledge available to a specific agent | query_text: The search query<br>agent_id: The ID of the agent<br>match_count: Number of results to return |
| generate_embeddings | Generates embeddings for knowledge entries | (Triggered automatically on insert) |

## Maintenance Tips

1. Regularly review and update knowledge entries to keep information current
2. Create logical bundles to organize related knowledge
3. Be strategic about agent assignments - only assign entries to relevant agents
4. Add detailed metadata to make entries more discoverable