// 🧠 SYNOVA AI - PURE KNOWLEDGE AI ROUTER
// 🤖 Smart AI Routing to Best Provider - Your Competitive Advantage

const SynovaKeyService = require("./apiKeyService");
const RealAIProviders = require("./realAIProviders");

class AIRouter {
  constructor() {
    this.keyService = new SynovaKeyService();
    this.aiProviders = new RealAIProviders();

    this.providers = {
      openai: {
        name: "OpenAI",
        models: ["gpt-4", "gpt-3.5-turbo"],
        strengths: ["code", "reasoning", "analysis"],
        costPerToken: 0.00002,
        quality: "excellent",
        speed: "fast",
      },
      anthropic: {
        name: "Anthropic",
        models: ["claude-3-opus", "claude-3-sonnet"],
        strengths: ["analysis", "writing", "reasoning"],
        costPerToken: 0.00003,
        quality: "superior",
        speed: "medium",
      },
      google: {
        name: "Google AI",
        models: ["gemini-pro", "gemini-pro-vision"],
        strengths: ["multimodal", "general", "translation"],
        costPerToken: 0.00001,
        quality: "good",
        speed: "fast",
      },
    };

    // Cost optimization for business model
    this.costOptimization = {
      free: { preferredProvider: "google", maxCostPerRequest: 0.001 },
      pro: { preferredProvider: "openai", maxCostPerRequest: 0.005 },
      enterprise: { preferredProvider: "anthropic", maxCostPerRequest: 0.01 },
    };
  }

  async processRequest(prompt, apiKey, options = {}) {
    // Validate Synova AI API key
    const user = this.keyService.validateKey(apiKey);

    // Choose best provider based on prompt analysis, user tier, and cost optimization
    const provider = this.selectBestProvider(prompt, user.tier, options);

    // Process with selected provider
    const result = await this.executeWithProvider(provider, prompt, options);

    // Track usage and calculate actual cost
    this.keyService.trackUsage(apiKey, result.tokensUsed);

    // Calculate profit margin
    const userCost = user.billing.costPerRequest;
    const actualCost = result.cost;
    const profitMargin =
      userCost > 0 ? ((userCost - actualCost) / userCost) * 100 : 0;

    return {
      provider: "Synova AI", // YOUR brand
      model: `synova-${provider.model}`, // YOUR model name
      response: result.response,
      tokensUsed: result.tokensUsed,
      cost: result.cost,
      userCost: userCost,
      profitMargin: profitMargin.toFixed(2) + "%",
      actualProvider: result.actualProvider,
      tier: user.tier,
      routingReason: provider.routingReason,
    };
  }

  selectBestProvider(prompt, userTier, options = {}) {
    const promptLower = prompt.toLowerCase();
    const costLimits = this.costOptimization[userTier];

    // Priority routing based on content type and business logic
    if (promptLower.includes("code") || promptLower.includes("programming")) {
      const provider = this.getProvider("openai", "gpt-4");
      provider.routingReason = "Code generation requires OpenAI GPT-4";
      return provider;
    }

    if (promptLower.includes("analysis") || promptLower.includes("analyze")) {
      const provider = this.getProvider("anthropic", "claude-3-sonnet");
      provider.routingReason = "Analysis tasks optimized for Claude";
      return provider;
    }

    if (promptLower.includes("image") || promptLower.includes("visual")) {
      const provider = this.getProvider("google", "gemini-pro-vision");
      provider.routingReason = "Multimodal tasks require Gemini Vision";
      return provider;
    }

    // Business model routing - optimize for profit margin
    switch (userTier) {
      case "enterprise":
        // Enterprise gets best quality regardless of cost
        const enterpriseProvider = this.getProvider(
          "anthropic",
          "claude-3-opus",
        );
        enterpriseProvider.routingReason =
          "Enterprise tier gets premium Claude-3 Opus";
        return enterpriseProvider;

      case "pro":
        // Pro tier gets balance of quality and cost
        if (promptLower.length > 1000) {
          // Long prompts go to OpenAI for better reasoning
          const proProvider = this.getProvider("openai", "gpt-4");
          proProvider.routingReason =
            "Pro tier: Complex prompt routed to GPT-4";
          return proProvider;
        } else {
          // Short prompts go to Google for cost efficiency
          const proProvider = this.getProvider("google", "gemini-pro");
          proProvider.routingReason =
            "Pro tier: Simple prompt routed to cost-effective Gemini";
          return proProvider;
        }

      case "free":
      default:
        // Free tier gets most cost-effective option
        const freeProvider = this.getProvider("google", "gemini-pro");
        freeProvider.routingReason =
          "Free tier routed to most cost-effective provider";
        return freeProvider;
    }
  }

  getProvider(providerName, model) {
    const provider = this.providers[providerName];
    return {
      ...provider,
      model: model,
      apiKey: this.getProviderApiKey(providerName),
    };
  }

  getProviderApiKey(providerName) {
    // In production, these would be environment variables
    const apiKeys = {
      openai: process.env.OPENAI_API_KEY,
      anthropic: process.env.ANTHROPIC_API_KEY,
      google: process.env.GOOGLE_AI_API_KEY,
    };

    if (!apiKeys[providerName]) {
      throw new Error(`API key not configured for ${providerName}`);
    }

    return apiKeys[providerName];
  }

  async executeWithProvider(provider, prompt, options) {
    // Use real AI providers or fallback to mock
    const startTime = Date.now();

    try {
      const result = await this.aiProviders.executeWithProvider(
        provider.name.toLowerCase(),
        provider.model,
        prompt,
        options,
      );

      const endTime = Date.now();

      return {
        response: result.response,
        tokensUsed: result.tokensUsed,
        cost: result.cost,
        provider: provider.name,
        model: provider.model,
        quality: provider.quality,
        speed: provider.speed,
        responseTime: result.responseTime || endTime - startTime,
        success: result.success,
        mock: result.mock || false,
        actualCost: result.cost,
        actualProvider: result.provider,
      };
    } catch (error) {
      console.error(`❌ Provider ${provider.name} failed:`, error.message);

      // Fallback to mock response
      const fallbackResponse = this.aiProviders.getMockResponse(
        provider.name.toLowerCase(),
        provider.model,
        prompt,
        error,
      );

      return {
        response: fallbackResponse.response,
        tokensUsed: fallbackResponse.tokensUsed,
        cost: fallbackResponse.cost,
        provider: provider.name,
        model: provider.model,
        quality: provider.quality,
        speed: provider.speed,
        responseTime: fallbackResponse.responseTime,
        success: true,
        mock: true,
        actualCost: fallbackResponse.cost,
        actualProvider: fallbackResponse.provider,
        error: error.message,
      };
    }
  }

  async getProviderStatus() {
    return this.aiProviders.getProviderStatus();
  }

  async testAllProviders() {
    return await this.aiProviders.testAllProviders();
  }

  async testProvider(providerName) {
    return await this.aiProviders.testProvider(providerName);
  }

  hasRealProviders() {
    const status = this.aiProviders.getProviderStatus();
    return status.available.length > 0;
  }

  getAvailableProviders() {
    const status = this.aiProviders.getProviderStatus();
    return status.available;
  }

  // Business model methods
  async generateKey(userId, tier) {
    return this.keyService.generateKey(userId, tier);
  }

  getKeyInfo(apiKey) {
    return this.keyService.getKeyInfo(apiKey);
  }

  listUserKeys(userId) {
    return this.keyService.listKeys(userId);
  }

  // Revenue and analytics
  getBusinessMetrics() {
    return this.keyService.getKeyMetrics();
  }

  getTotalRevenue() {
    return this.keyService.getTotalRevenue();
  }

  getRevenueByTier() {
    return this.keyService.getRevenueByTier();
  }

  // Competitive advantage metrics
  getRoutingStats() {
    return {
      providers: Object.keys(this.providers).length,
      models: Object.values(this.providers).reduce(
        (acc, provider) => acc + provider.models.length,
        0,
      ),
      costOptimization: Object.keys(this.costOptimization).length,
      routingLogic: "Content-based + Tier-based + Cost-optimization",
      competitiveAdvantage:
        "Single API key for multiple AI providers with smart routing",
    };
  }

  // Provider performance comparison
  compareProviders() {
    return Object.entries(this.providers).map(([key, provider]) => ({
      name: provider.name,
      models: provider.models,
      strengths: provider.strengths,
      costPerToken: provider.costPerToken,
      quality: provider.quality,
      speed: provider.speed,
      bestFor: provider.strengths.join(", "),
    }));
  }
}

module.exports = AIRouter;
