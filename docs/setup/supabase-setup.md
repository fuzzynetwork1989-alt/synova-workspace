# Supabase Setup Guide for Synova AI

This guide walks through setting up Supabase with pgvector for Synova AI's RAG and memory systems.

## Prerequisites

- A Supabase account (free tier works for development)
- Supabase project URL and service keys

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Enter project name: `synova-ai`
4. Choose a database password (save it securely)
5. Select a region closest to your users
6. Click "Create new project"
7. Wait for project to be ready (2-3 minutes)

## Step 2: Get Your Credentials

1. Go to Project Settings → API
2. Copy these values to your `.env` file:
   - `SUPABASE_URL` (Project URL)
   - `SUPABASE_SERVICE_KEY` (service_role key - has full access)
   - `SUPABASE_ANON_KEY` (anon key - for client-side access)

## Step 3: Enable pgvector Extension

1. Go to SQL Editor in Supabase Dashboard
2. Create a new query
3. Run the following command:

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;
```

4. Verify it's enabled:

```sql
-- Check installed extensions
SELECT * FROM pg_extension WHERE extname = 'vector';
```

## Step 4: Run the Database Schema

1. Open `infra/database/supabase_schema.sql` from the Synova AI repo
2. Copy the entire SQL content
3. Paste it into the Supabase SQL Editor
4. Click "Run" to execute the schema

This will create:
- `tenants` table for multi-tenant support
- `users` table for user management
- `conversations` table for chat history
- `documents` table with pgvector for RAG
- `memories` table for long-term memory
- `usage_logs` table for billing
- `tool_executions` table for tool tracking
- `safety_violations` table for moderation
- All necessary indexes and RLS policies

## Step 5: Verify Setup

Run these queries to verify everything is set up correctly:

```sql
-- Check all tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check pgvector is working
SELECT vector('[1,2,3]')::vector;

-- Check vector similarity function exists
SELECT match_documents('[1,2,3]'::vector, 5);
```

## Step 6: Configure Row Level Security (Optional)

The schema includes basic RLS policies. For production, you may want to:

1. Create a custom JWT secret in Supabase:
   - Go to Authentication → Providers → JWT
   - Set your own JWT secret
   - Update `JWT_SECRET` in your `.env` to match

2. Create stricter RLS policies based on your security requirements

## Step 7: Test Connection

Create a simple Python script to test your connection:

```python
from supabase import create_client
import os

# Load from .env
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_KEY")

# Create client
client = create_client(supabase_url, supabase_key)

# Test connection
result = client.table("tenants").select("*").limit(1).execute()
print("Connection successful!", result)
```

## Troubleshooting

### pgvector extension not found
- Ensure you're on a Supabase project (not local Postgres)
- pgvector is pre-installed on Supabase, just needs to be enabled

### Permission denied errors
- Use `SUPABASE_SERVICE_KEY` for admin operations
- Use `SUPABASE_ANON_KEY` for client-side operations

### Vector similarity search not working
- Verify the `match_documents` function was created
- Check that documents have embeddings stored in the `embedding` column

## Next Steps

- Configure Stripe for billing
- Set up Redis for short-term memory
- Configure LLM provider API keys
- Start the API server
