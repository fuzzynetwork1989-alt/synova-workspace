-- Supabase Database Schema for Synova AI
-- Run this in Supabase SQL Editor to set up all required tables

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Tenants table
CREATE TABLE IF NOT EXISTS tenants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tier TEXT DEFAULT 'starter' CHECK (tier IN ('starter', 'pro', 'enterprise')),
    tokens_used_this_month INTEGER DEFAULT 0,
    monthly_token_limit INTEGER DEFAULT 100000,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'owner')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
    title TEXT,
    mode TEXT DEFAULT 'chat' CHECK (mode IN ('chat', 'supanova', 'deep_research', 'rag', 'autopilot')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table (for RAG)
CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    content TEXT NOT NULL,
    embedding vector(1536),
    metadata JSONB DEFAULT '{}',
    chunk_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create vector similarity search function
CREATE OR REPLACE FUNCTION match_documents(
    query_embedding vector(1536),
    match_count INTEGER DEFAULT 5,
    tenant_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
    id TEXT,
    tenant_id TEXT,
    filename TEXT,
    content TEXT,
    metadata JSONB,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.id,
        d.tenant_id,
        d.filename,
        d.content,
        d.metadata,
        1 - (d.embedding <=> query_embedding) as similarity
    FROM documents d
    WHERE 
        (tenant_filter IS NULL OR d.tenant_id = tenant_filter)
        AND d.embedding IS NOT NULL
    ORDER BY d.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- Memories table (long-term memory)
CREATE TABLE IF NOT EXISTS memories (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    importance FLOAT DEFAULT 0.5,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage logs table
CREATE TABLE IF NOT EXISTS usage_logs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    provider TEXT NOT NULL,
    model TEXT NOT NULL,
    tokens_in INTEGER DEFAULT 0,
    tokens_out INTEGER DEFAULT 0,
    cost_usd FLOAT DEFAULT 0.0,
    endpoint TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tool executions table
CREATE TABLE IF NOT EXISTS tool_executions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    tool_name TEXT NOT NULL,
    parameters JSONB DEFAULT '{}',
    result JSONB DEFAULT '{}',
    success BOOLEAN DEFAULT TRUE,
    execution_time_seconds FLOAT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safety violations table
CREATE TABLE IF NOT EXISTS safety_violations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    violation_type TEXT NOT NULL,
    content TEXT,
    action_taken TEXT CHECK (action_taken IN ('allow', 'warn', 'block', 'flag')),
    score FLOAT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_documents_tenant ON documents(tenant_id);
CREATE INDEX IF NOT EXISTS idx_documents_embedding ON documents USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_memories_user ON memories(user_id);
CREATE INDEX IF NOT EXISTS idx_memories_importance ON memories(importance DESC);
CREATE INDEX IF NOT EXISTS idx_usage_logs_tenant ON usage_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created ON usage_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tool_executions_tenant ON tool_executions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_safety_violations_tenant ON safety_violations(tenant_id);

-- Row Level Security (RLS)
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_violations ENABLE ROW LEVEL SECURITY;

-- RLS Policies (simplified - in production, use proper JWT-based policies)
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (true);
CREATE POLICY "Tenants can view own data" ON tenants FOR SELECT USING (true);
CREATE POLICY "Documents are tenant-scoped" ON documents FOR ALL USING (tenant_id IN (SELECT tenant_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Memories are user-scoped" ON memories FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Usage logs are tenant-scoped" ON usage_logs FOR SELECT USING (tenant_id IN (SELECT tenant_id FROM users WHERE id = auth.uid()));

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_memories_updated_at BEFORE UPDATE ON memories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
