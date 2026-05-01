// 🧠 SYNOVA AI - PURE KNOWLEDGE API KEY SYSTEM
// 🔑 Your Own API Key System - Like Perplexity, Jasper, Copy.ai

class SynovaKeyService {
  constructor() {
    this.keys = new Map();
    this.initializeKeys();

    // Initialize database integration
    this.initDatabase();
  }

  async initDatabase() {
    try {
      // Initialize database connection
      const { init_db, db_manager } = require("../database/models");
      await init_db();
      this.db = db_manager;
      console.log("🗄️ Database initialized successfully");
    } catch (error) {
      console.log("⚠️ Database not available, using in-memory storage");
      this.db = null;
    }
  }

  initializeKeys() {
    // Generate initial Synova AI API keys with business model
    this.keys.set("sk-synova-demo-123456789", {
      user: "demo_user",
      tier: "free",
      limits: { requests: 100, tokens: 10000 },
      usage: { requests: 0, tokens: 0 },
      createdAt: new Date().toISOString(),
      billing: { monthlyRate: 0, costPerRequest: 0 },
    });

    this.keys.set("sk-synova-pro-987654321", {
      user: "premium_user",
      tier: "pro",
      limits: { requests: 10000, tokens: 1000000 },
      usage: { requests: 0, tokens: 0 },
      createdAt: new Date().toISOString(),
      billing: { monthlyRate: 29, costPerRequest: 0.0029 },
    });

    this.keys.set("sk-synova-enterprise-555666777", {
      user: "enterprise_user",
      tier: "enterprise",
      limits: { requests: 100000, tokens: 10000000 },
      usage: { requests: 0, tokens: 0 },
      createdAt: new Date().toISOString(),
      billing: { monthlyRate: 199, costPerRequest: 0.00199 },
    });
  }

  async generateKey(userId, tier = "free") {
    const keyId =
      Date.now().toString(36) + Math.random().toString(36).substr(2);
    const apiKey = `sk-synova-${tier}-${keyId}`;

    // Business model pricing tiers
    const tiers = {
      free: {
        requests: 100,
        tokens: 10000,
        monthlyRate: 0,
        costPerRequest: 0,
        description: "Free Tier - 100 requests/month",
      },
      pro: {
        requests: 10000,
        tokens: 1000000,
        monthlyRate: 29,
        costPerRequest: 0.0029,
        description: "Pro Tier - $29/month, 10K requests",
      },
      enterprise: {
        requests: 100000,
        tokens: 10000000,
        monthlyRate: 199,
        costPerRequest: 0.00199,
        description: "Enterprise - $199/month, unlimited",
      },
    };

    const tierConfig = tiers[tier];

    const keyData = {
      api_key: apiKey,
      user_id: userId,
      tier: tier,
      limits_requests: tierConfig.requests,
      limits_tokens: tierConfig.tokens,
      usage_requests: 0,
      usage_tokens: 0,
      monthly_rate: tierConfig.monthlyRate,
      cost_per_request: tierConfig.costPerRequest,
      total_cost: 0.0,
      total_revenue: tierConfig.monthlyRate,
      is_active: true,
    };

    // Store in memory (fallback)
    this.keys.set(apiKey, {
      user: userId,
      tier: tier,
      limits: { requests: tierConfig.requests, tokens: tierConfig.tokens },
      usage: { requests: 0, tokens: 0 },
      createdAt: new Date().toISOString(),
      billing: {
        monthlyRate: tierConfig.monthlyRate,
        costPerRequest: tierConfig.costPerRequest,
        description: tierConfig.description,
      },
    });

    // Store in database if available
    if (this.db) {
      try {
        await this.db.create_api_key(keyData);
        console.log(`💾 API key ${apiKey} stored in database`);
      } catch (error) {
        console.log("⚠️ Database storage failed, using memory only");
      }
    }

    return apiKey;
  }

  async validateKey(apiKey) {
    // Try database first
    if (this.db) {
      try {
        const keyData = await this.db.get_api_key(apiKey);
        if (keyData) {
          // Check limits
          if (keyData.usage_requests >= keyData.limits_requests) {
            throw new Error("Request limit exceeded");
          }
          if (keyData.usage_tokens >= keyData.limits_tokens) {
            throw new Error("Token limit exceeded");
          }
          return keyData;
        }
      } catch (error) {
        console.log("⚠️ Database validation failed, trying memory");
      }
    }

    // Fallback to memory storage
    const keyData = this.keys.get(apiKey);
    if (!keyData) {
      throw new Error("Invalid API key");
    }

    // Check if limits exceeded
    if (keyData.usage.requests >= keyData.limits.requests) {
      throw new Error("Request limit exceeded");
    }

    if (keyData.usage.tokens >= keyData.limits.tokens) {
      throw new Error("Token limit exceeded");
    }

    return keyData;
  }

  async trackUsage(apiKey, tokens, costData = {}) {
    // Update database if available
    if (this.db) {
      try {
        await this.db.update_api_key_usage(apiKey, tokens, costData);

        // Log usage
        const usageLog = {
          api_key_id: apiKey,
          prompt: costData.prompt || "Unknown",
          response: costData.response || "Generated",
          tokens_used: tokens,
          actual_provider: costData.actualProvider || "Unknown",
          actual_model: costData.actualModel || "Unknown",
          actual_cost: costData.actualCost || 0,
          user_cost: costData.userCost || 0,
          profit_margin: costData.profitMargin || 0,
          routing_reason: costData.routingReason || "Default",
          response_time_ms: costData.responseTimeMs || null,
        };
        await this.db.log_usage(usageLog);
        console.log(`💾 Usage tracked for ${apiKey}`);
        return;
      } catch (error) {
        console.log("⚠️ Database tracking failed, using memory");
      }
    }

    // Fallback to memory storage
    const keyData = this.keys.get(apiKey);
    if (keyData) {
      keyData.usage.requests += 1;
      keyData.usage.tokens += tokens;

      // Track billing
      keyData.billing.totalCost =
        keyData.usage.requests * keyData.billing.costPerRequest;
      keyData.billing.lastUsed = new Date().toISOString();
    }
  }

  // Business model methods
  calculateRevenue(apiKey) {
    const keyData = this.keys.get(apiKey);
    if (!keyData) return 0;

    return (
      keyData.billing.monthlyRate +
      keyData.usage.requests * keyData.billing.costPerRequest
    );
  }

  getBillingInfo(apiKey) {
    const keyData = this.keys.get(apiKey);
    if (!keyData) return null;

    return {
      tier: keyData.tier,
      monthlyRate: keyData.billing.monthlyRate,
      costPerRequest: keyData.billing.costPerRequest,
      currentUsage: keyData.usage.requests,
      currentCost: this.calculateRevenue(apiKey),
      description: keyData.billing.description,
    };
  }

  async getKeyInfo(apiKey) {
    // Try database first
    if (this.db) {
      try {
        const keyData = await this.db.get_api_key(apiKey);
        if (keyData) {
          return {
            user: keyData.user_id,
            tier: keyData.tier,
            usage: keyData.usage,
            limits: keyData.limits,
            billing: keyData.billing,
            remaining: keyData.remaining,
            revenue: this.calculateRevenue(apiKey),
          };
        }
      } catch (error) {
        console.log("⚠️ Database lookup failed, trying memory");
      }
    }

    // Fallback to memory storage
    const keyData = this.keys.get(apiKey);
    if (!keyData) {
      return null;
    }

    return {
      user: keyData.user,
      tier: keyData.tier,
      usage: keyData.usage,
      limits: keyData.limits,
      billing: keyData.billing,
      remaining: {
        requests: keyData.limits.requests - keyData.usage.requests,
        tokens: keyData.limits.tokens - keyData.usage.tokens,
      },
      revenue: this.calculateRevenue(apiKey),
    };
  }

  listKeys(userId) {
    const userKeys = [];
    for (const [key, data] of this.keys) {
      if (data.user === userId) {
        userKeys.push({
          key: key,
          tier: data.tier,
          usage: data.usage,
          limits: data.limits,
          billing: data.billing,
          revenue: this.calculateRevenue(key),
          createdAt: data.createdAt,
        });
      }
    }
    return userKeys;
  }

  // Business analytics with database integration
  async getBusinessMetrics() {
    // Try database first
    if (this.db) {
      try {
        const dbMetrics = await this.db.get_business_metrics();
        return dbMetrics;
      } catch (error) {
        console.log("⚠️ Database metrics failed, calculating from memory");
      }
    }

    // Fallback to memory calculation
    const metrics = {
      totalKeys: this.keys.size,
      totalRequests: 0,
      totalTokens: 0,
      totalRevenue: 0,
      keysByTier: { free: 0, pro: 0, enterprise: 0 },
    };

    for (const [key, data] of this.keys) {
      metrics.totalRequests += data.usage.requests;
      metrics.totalTokens += data.usage.tokens;
      metrics.totalRevenue += this.calculateRevenue(key);
      metrics.keysByTier[data.tier] += 1;
    }

    return metrics;
  }

  async getTotalRevenue() {
    const metrics = await this.getBusinessMetrics();
    return metrics.totalRevenue;
  }

  async getRevenueByTier() {
    const metrics = await this.getBusinessMetrics();
    return metrics.revenueByTier || { free: 0, pro: 0, enterprise: 0 };
  }

  async getKeyMetrics() {
    const metrics = {
      totalKeys: this.keys.size,
      totalRequests: 0,
      totalTokens: 0,
      totalRevenue: 0,
      keysByTier: { free: 0, pro: 0, enterprise: 0 },
    };

    for (const [key, data] of this.keys) {
      metrics.totalRequests += data.usage.requests;
      metrics.totalTokens += data.usage.tokens;
      metrics.totalRevenue += this.calculateRevenue(key);
      metrics.keysByTier[data.tier] += 1;
    }

    return metrics;
  }
}

module.exports = SynovaKeyService;
