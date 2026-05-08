import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Database manager for API key system
 * Handles SQLite database operations
 */
export class Database {
  constructor(dbPath = null) {
    this.dbPath = dbPath || path.join(__dirname, '../../data/api_keys.db');
    this.db = null;
  }

  /**
   * Initialize database connection and create tables
   */
  async initialize() {
    try {
      this.db = new Database(this.dbPath);

      await this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  /**
   * Create all necessary tables
   */
  async createTables() {
    // API keys table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS api_keys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key_id TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        api_key_hash TEXT UNIQUE NOT NULL,
        prefix TEXT NOT NULL,
        user_id TEXT NOT NULL,
        permissions TEXT DEFAULT '[]',
        rate_limit INTEGER DEFAULT 1000,
        is_active BOOLEAN DEFAULT 1,
        expires_at DATETIME NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_used_at DATETIME NULL,
        usage_count INTEGER DEFAULT 0
      )
    `);

    // Usage tracking table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS usage_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key_id TEXT NOT NULL,
        endpoint TEXT NOT NULL,
        method TEXT NOT NULL,
        status_code INTEGER NOT NULL,
        response_time_ms INTEGER,
        request_size INTEGER,
        response_size INTEGER,
        ip_address TEXT,
        user_agent TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (key_id) REFERENCES api_keys(key_id)
      )
    `);

    // Users table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        is_admin BOOLEAN DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Rate limiting table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS rate_limits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key_id TEXT NOT NULL,
        window_start DATETIME NOT NULL,
        request_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (key_id) REFERENCES api_keys(key_id),
        UNIQUE(key_id, window_start)
      )
    `);

    // Create indexes for better performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_api_keys_key_id ON api_keys(key_id);
      CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
      CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(api_key_hash);
      CREATE INDEX IF NOT EXISTS idx_usage_logs_key_id ON usage_logs(key_id);
      CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON usage_logs(created_at);
      CREATE INDEX IF NOT EXISTS idx_rate_limits_key_id ON rate_limits(key_id);
    `);
  }

  /**
   * Create a new API key
   */
  async createKey(keyData) {
    const {
      keyId,
      name,
      apiKeyHash,
      prefix,
      userId,
      permissions = [],
      rateLimit = 1000,
      expiresAt = null
    } = keyData;

    const result = this.db.run(
      `INSERT INTO api_keys (key_id, name, api_key_hash, prefix, user_id, permissions, rate_limit, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        keyId,
        name,
        apiKeyHash,
        prefix,
        userId,
        JSON.stringify(permissions),
        rateLimit,
        expiresAt
      ]
    );

    return this.getKeyById(keyId);
  }

  /**
   * Get API key by ID
   */
  async getKeyById(keyId) {
    const row = this.db.prepare('SELECT * FROM api_keys WHERE key_id = ?').get(keyId);

    if (row) {
      row.permissions = JSON.parse(row.permissions || '[]');
    }
    return row;
  }

  /**
   * Get API key by hash
   */
  async getKeyByHash(hash) {
    const row = this.db.prepare('SELECT * FROM api_keys WHERE api_key_hash = ?').get(hash);

    if (row) {
      row.permissions = JSON.parse(row.permissions || '[]');
    }
    return row;
  }

  /**
   * List all API keys for a user
   */
  async listKeys(userId, limit = 50, offset = 0) {
    const rows = this.db.prepare('SELECT * FROM api_keys WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?').all(userId, limit, offset);

    return rows.map(row => {
      row.permissions = JSON.parse(row.permissions || '[]');
      delete row.api_key_hash; // Don't expose hash
      return row;
    });
  }

  /**
   * Update API key
   */
  async updateKey(keyId, updates) {
    const fields = [];
    const values = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (key === 'permissions') {
        fields.push(`${key} = ?`);
        values.push(JSON.stringify(value));
      } else {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(keyId);

    this.db.run(
      `UPDATE api_keys SET ${fields.join(', ')} WHERE key_id = ?`,
      values
    );

    return this.getKeyById(keyId);
  }

  /**
   * Delete API key
   */
  async deleteKey(keyId) {
    const result = this.db.run(
      'DELETE FROM api_keys WHERE key_id = ?',
      [keyId]
    );

    return result.changes > 0;
  }

  /**
   * Log API usage
   */
  async logUsage(usageData) {
    const {
      keyId,
      endpoint,
      method,
      statusCode,
      responseTimeMs,
      requestSize,
      responseSize,
      ipAddress,
      userAgent
    } = usageData;

    this.db.run(
      `INSERT INTO usage_logs (key_id, endpoint, method, status_code, response_time_ms, request_size, response_size, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        keyId,
        endpoint,
        method,
        statusCode,
        responseTimeMs,
        requestSize,
        responseSize,
        ipAddress,
        userAgent
      ]
    );

    // Update usage count and last used timestamp
    this.db.run(
      'UPDATE api_keys SET usage_count = usage_count + 1, last_used_at = CURRENT_TIMESTAMP WHERE key_id = ?',
      [keyId]
    );
  }

  /**
   * Get usage statistics
   */
  async getUsageStats(keyId, timeRange = '24h') {
    let timeFilter = '';
    const now = new Date();

    switch (timeRange) {
      case '1h':
        timeFilter = `AND created_at >= datetime('${now.toISOString()}', '-1 hour')`;
        break;
      case '24h':
        timeFilter = `AND created_at >= datetime('${now.toISOString()}', '-24 hours')`;
        break;
      case '7d':
        timeFilter = `AND created_at >= datetime('${now.toISOString()}', '-7 days')`;
        break;
      case '30d':
        timeFilter = `AND created_at >= datetime('${now.toISOString()}', '-30 days')`;
        break;
    }

    const stats = this.db.prepare(`
      SELECT
        COUNT(*) as total_requests,
        AVG(response_time_ms) as avg_response_time,
        MIN(response_time_ms) as min_response_time,
        MAX(response_time_ms) as max_response_time,
        SUM(request_size) as total_request_size,
        SUM(response_size) as total_response_size,
        COUNT(CASE WHEN status_code >= 400 THEN 1 END) as error_count
       FROM usage_logs
       WHERE key_id = ? ${timeFilter}`).get(keyId);

    return stats || {
      total_requests: 0,
      avg_response_time: 0,
      min_response_time: 0,
      max_response_time: 0,
      total_request_size: 0,
      total_response_size: 0,
      error_count: 0
    };
  }

  /**
   * Check rate limit
   */
  async checkRateLimit(keyId, windowMs = 60000, maxRequests = 1000) {
    const windowStart = new Date(Date.now() - windowMs).toISOString();

    const result = this.db.prepare('SELECT COUNT(*) as count FROM usage_logs WHERE key_id = ? AND created_at >= ?').get(keyId, windowStart);

    return {
      count: result.count,
      remaining: Math.max(0, maxRequests - result.count),
      resetTime: new Date(Date.now() + windowMs).toISOString()
    };
  }

  /**
   * Create user
   */
  async createUser(userData) {
    const { id, email, name, passwordHash, isAdmin = false } = userData;

    this.db.run(
      'INSERT INTO users (id, email, name, password_hash, is_admin) VALUES (?, ?, ?, ?, ?)',
      [id, email, name, passwordHash, isAdmin]
    );

    return this.getUserById(id);
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    return this.db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email) {
    return this.db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  }

  /**
   * Close database connection
   */
  async close() {
    if (this.db) {
      this.db.close();
    }
  }
}
