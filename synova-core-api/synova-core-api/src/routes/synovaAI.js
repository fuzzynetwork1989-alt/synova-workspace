// 🧠 SYNOVA AI - PURE KNOWLEDGE API ROUTES
// 🔑 Your Own API Key System - Like Perplexity, Jasper, Copy.ai

const express = require("express");
const AIRouter = require("../services/aiRouter");
const router = express.Router();

const aiRouter = new AIRouter();

// Main Synova AI endpoint - your own API key system
router.post("/api/v1/synova-ai", async (req, res) => {
  try {
    const { prompt, apiKey, options = {} } = req.body;

    if (!prompt || !apiKey) {
      return res.status(400).json({
        error: "Prompt and API key are required",
        code: "MISSING_PARAMS",
        message: "Both prompt and apiKey must be provided",
      });
    }

    // Process with YOUR Synova AI system
    const result = await aiRouter.processRequest(prompt, apiKey, options);

    res.json({
      success: true,
      provider: "Synova AI", // YOUR brand
      model: result.model, // YOUR model name
      response: result.response,
      tokensUsed: result.tokensUsed,
      cost: result.cost,
      userCost: result.userCost,
      profitMargin: result.profitMargin,
      actualProvider: result.actualProvider,
      tier: result.tier,
      routingReason: result.routingReason,
      timestamp: new Date().toISOString(),
      businessModel:
        "Users pay YOU → You use providers → You keep profit margin",
    });
  } catch (error) {
    console.error("Synova AI API Error:", error);

    res.status(400).json({
      success: false,
      error: error.message,
      code: "API_ERROR",
      timestamp: new Date().toISOString(),
    });
  }
});

// Generate Synova AI API keys - your business model
router.post("/api/v1/generate-key", async (req, res) => {
  try {
    const { userId, tier = "free" } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: "User ID is required",
        code: "MISSING_USER_ID",
        message: "userId must be provided to generate API key",
      });
    }

    const apiKey = await aiRouter.generateKey(userId, tier);
    const billingInfo = aiRouter.keyService.getBillingInfo(apiKey);

    res.json({
      success: true,
      apiKey: apiKey,
      tier: tier,
      billing: billingInfo,
      message: "Synova AI API key generated successfully",
      businessModel: {
        description: billingInfo.description,
        monthlyRate: billingInfo.monthlyRate,
        costPerRequest: billingInfo.costPerRequest,
        profitMargin: "You set the pricing, we handle the routing",
      },
    });
  } catch (error) {
    console.error("Key Generation Error:", error);

    res.status(400).json({
      success: false,
      error: error.message,
      code: "KEY_GENERATION_ERROR",
      timestamp: new Date().toISOString(),
    });
  }
});

// Get API key information
router.get("/api/v1/key-info/:apiKey", async (req, res) => {
  try {
    const { apiKey } = req.params;
    const keyInfo = aiRouter.getKeyInfo(apiKey);

    if (!keyInfo) {
      return res.status(404).json({
        error: "API key not found",
        code: "KEY_NOT_FOUND",
      });
    }

    res.json({
      success: true,
      keyInfo: keyInfo,
    });
  } catch (error) {
    console.error("Key Info Error:", error);

    res.status(400).json({
      success: false,
      error: error.message,
      code: "KEY_INFO_ERROR",
    });
  }
});

// List user's API keys
router.get("/api/v1/keys/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const keys = aiRouter.listUserKeys(userId);

    res.json({
      success: true,
      keys: keys,
      count: keys.length,
    });
  } catch (error) {
    console.error("List Keys Error:", error);

    res.status(400).json({
      success: false,
      error: error.message,
      code: "LIST_KEYS_ERROR",
    });
  }
});

// Synova AI status and capabilities - your competitive advantage
router.get("/api/v1/status", async (req, res) => {
  const businessMetrics = aiRouter.getBusinessMetrics();
  const routingStats = aiRouter.getRoutingStats();
  const providerComparison = aiRouter.compareProviders();

  res.json({
    success: true,
    service: "Synova AI",
    version: "1.0.0",
    status: "operational",
    businessModel: "API Key Service with Smart AI Routing",
    competitiveAdvantage:
      "Single API key for multiple AI providers with intelligent routing",
    capabilities: [
      "Intelligent AI routing",
      "Multi-provider support",
      "Cost optimization",
      "API key management",
      "Usage tracking",
      "Tier-based access",
      "Profit margin optimization",
      "Business analytics",
    ],
    providers: ["OpenAI", "Anthropic", "Google AI"],
    tiers: [
      {
        name: "free",
        price: "$0",
        requests: 100,
        description: "Free Tier - 100 requests/month",
      },
      {
        name: "pro",
        price: "$29",
        requests: 10000,
        description: "Pro Tier - $29/month, 10K requests",
      },
      {
        name: "enterprise",
        price: "$199",
        requests: 100000,
        description: "Enterprise - $199/month, unlimited",
      },
    ],
    businessMetrics: businessMetrics,
    routingStats: routingStats,
    providerComparison: providerComparison,
    revenueModel: {
      userPays: "Direct subscription or per-request",
      yourCost: "Provider API costs (OpenAI, Anthropic, Google)",
      profitMargin: "You keep the difference",
      example: {
        userPays: "$29/month",
        yourCost: "$15/month",
        profit: "$14/month (48% margin)",
      },
    },
    timestamp: new Date().toISOString(),
  });
});

// Business analytics endpoint
router.get("/api/v1/analytics", async (req, res) => {
  try {
    const totalRevenue = aiRouter.getTotalRevenue();
    const revenueByTier = aiRouter.getRevenueByTier();
    const businessMetrics = aiRouter.getBusinessMetrics();

    res.json({
      success: true,
      analytics: {
        totalRevenue: totalRevenue,
        revenueByTier: revenueByTier,
        metrics: businessMetrics,
        profitMarginAnalysis: {
          free: "0% (free tier)",
          pro: "48% typical margin",
          enterprise: "60% typical margin",
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(400).json({
      success: false,
      error: error.message,
      code: "ANALYTICS_ERROR",
    });
  }
});

// Provider comparison endpoint
router.get("/api/v1/providers", async (req, res) => {
  try {
    const providers = aiRouter.compareProviders();
    const routingStats = aiRouter.getRoutingStats();

    res.json({
      success: true,
      providers: providers,
      routingStats: routingStats,
      competitiveAdvantage: {
        vsOpenAI:
          "Synova AI: Multiple providers + smart routing vs OpenAI: Only OpenAI",
        vsAnthropic:
          "Synova AI: Multiple providers + cost optimization vs Anthropic: Only Anthropic",
        vsGoogle:
          "Synova AI: Multiple providers + tier-based routing vs Google: Only Google",
        yourAdvantage:
          "Single API key, intelligent routing, cost optimization, unified billing",
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Providers Error:", error);
    res.status(400).json({
      success: false,
      error: error.message,
      code: "PROVIDERS_ERROR",
    });
  }
});

module.exports = router;
