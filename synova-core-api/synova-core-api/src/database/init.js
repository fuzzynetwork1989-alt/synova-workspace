// 🗄️ SYNTHOVA AI - DATABASE INITIALIZATION
// Complete database setup for production-ready system

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', '..', 'synova_ai.db');
const db = new sqlite3.Database(dbPath);

// Initialize database with all tables
db.serialize(() => {
  // API Keys table
  db.run(`
    CREATE TABLE IF NOT EXISTS api_keys (
      id TEXT PRIMARY KEY,
      api_key TEXT UNIQUE NOT NULL,
      user_id TEXT NOT NULL,
      tier TEXT NOT NULL DEFAULT 'free',
      limits_requests INTEGER NOT NULL DEFAULT 100,
      limits_tokens INTEGER NOT NULL DEFAULT 10000,
      usage_requests INTEGER NOT NULL DEFAULT 0,
      usage_tokens INTEGER NOT NULL DEFAULT 0,
      monthly_rate REAL NOT NULL DEFAULT 0,
      cost_per_request REAL NOT NULL DEFAULT 0,
      total_cost REAL NOT NULL DEFAULT 0,
      total_revenue REAL NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_used DATETIME,
      is_active BOOLEAN DEFAULT 1
    )
  `, (err) => {
    if (err) {
      console.error('❌ Error creating api_keys table:', err);
    } else {
      console.log('✅ API Keys table created');
    }
  });

  // Usage Logs table
  db.run(`
    CREATE TABLE IF NOT EXISTS usage_logs (
      id TEXT PRIMARY KEY,
      api_key_id TEXT NOT NULL,
      prompt TEXT NOT NULL,
      response TEXT,
      tokens_used INTEGER NOT NULL DEFAULT 0,
      actual_provider TEXT NOT NULL,
      actual_model TEXT NOT NULL,
      actual_cost REAL NOT NULL DEFAULT 0,
      user_cost REAL NOT NULL DEFAULT 0,
      profit_margin REAL NOT NULL DEFAULT 0,
      routing_reason TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      response_time_ms INTEGER
    )
  `, (err) => {
    if (err) {
      console.error('❌ Error creating usage_logs table:', err);
    } else {
      console.log('✅ Usage Logs table created');
    }
  });

  // Business Metrics table
  db.run(`
    CREATE TABLE IF NOT EXISTS business_metrics (
      id TEXT PRIMARY KEY,
      total_revenue REAL NOT NULL DEFAULT 0,
      total_cost REAL NOT NULL DEFAULT 0,
      total_profit REAL NOT NULL DEFAULT 0,
      total_requests INTEGER NOT NULL DEFAULT 0,
      total_tokens INTEGER NOT NULL DEFAULT 0,
      free_tier_revenue REAL NOT NULL DEFAULT 0,
      pro_tier_revenue REAL NOT NULL DEFAULT 0,
      enterprise_tier_revenue REAL NOT NULL DEFAULT 0,
      openai_usage INTEGER NOT NULL DEFAULT 0,
      anthropic_usage INTEGER NOT NULL DEFAULT 0,
      google_usage INTEGER NOT NULL DEFAULT 0,
      period_start DATETIME DEFAULT CURRENT_TIMESTAMP,
      period_end DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('❌ Error creating business_metrics table:', err);
    } else {
      console.log('✅ Business Metrics table created');
    }
  });

  // Pure Knowledge Logs table
  db.run(`
    CREATE TABLE IF NOT EXISTS pure_knowledge_logs (
      id TEXT PRIMARY KEY,
      operation_type TEXT NOT NULL,
      operation_data TEXT,
      result TEXT,
      success BOOLEAN NOT NULL DEFAULT 1,
      error_message TEXT,
      processing_time_ms INTEGER,
      innovation_score REAL,
      optimization_level TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      user_id TEXT
    )
  `, (err) => {
    if (err) {
      console.error('❌ Error creating pure_knowledge_logs table:', err);
    } else {
      console.log('✅ Pure Knowledge Logs table created');
    }
  });

  // Seed initial data
  const metricsId = 'metrics_' + Date.now();
  db.run(`
    INSERT OR IGNORE INTO business_metrics 
    (id, total_revenue, total_cost, total_profit, period_start, period_end)
    VALUES (?, 0, 0, 0, datetime('now'), datetime('now'))
  `, [metricsId], (err) => {
    if (err) {
      console.error('❌ Error seeding business metrics:', err);
    } else {
      console.log('✅ Business metrics seeded');
    }
  });

  // Create indexes for performance
  db.run('CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(api_key)', (err) => {
    if (!err) console.log('✅ Created index on api_keys.api_key');
  });

  db.run('CREATE INDEX IF NOT EXISTS idx_usage_logs_api_key ON usage_logs(api_key_id)', (err) => {
    if (!err) console.log('✅ Created index on usage_logs.api_key_id');
  });

  db.run('CREATE INDEX IF NOT EXISTS idx_usage_logs_created ON usage_logs(created_at)', (err) => {
    if (!err) console.log('✅ Created index on usage_logs.created_at');
  });

  console.log('🗄️ Database initialization complete');
});

module.exports = { db, dbPath };
