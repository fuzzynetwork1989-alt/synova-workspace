/**
 * SYNOVA NEXUS Model Router
 * Intelligent context-aware model selection and routing
 */

class NexusModelRouter {
  constructor(config) {
    this.config = config;
    this.primaryModel = config.models.primary;
    this.fallbacks = config.models.fallbacks;
    this.routingStrategy = config.routing.strategy;
    this.currentLoad = {};
    this.modelHealth = {};
    this.initializeModelHealth();
  }

  initializeModelHealth() {
    // Initialize health status for all models
    this.modelHealth[this.primaryModel.name] = {
      healthy: true,
      lastCheck: Date.now(),
      responseTime: 0,
      errorRate: 0
    };

    this.fallbacks.forEach(fallback => {
      this.modelHealth[fallback.name] = {
        healthy: true,
        lastCheck: Date.now(),
        responseTime: 0,
        errorRate: 0
      };
    });
  }

  /**
   * Select optimal model based on context and requirements
   */
  async selectModel(context) {
    const candidates = this.getCandidateModels(context);
    const selected = await this.evaluateCandidates(candidates, context);
    
    return selected;
  }

  /**
   * Get candidate models based on context conditions
   */
  getCandidateModels(context) {
    const candidates = [this.primaryModel];
    
    // Add fallback models that match context conditions
    this.fallbacks.forEach(fallback => {
      if (this.matchesConditions(fallback.conditions, context)) {
        candidates.push(fallback);
      }
    });

    return candidates;
  }

  /**
   * Check if context matches model conditions
   */
  matchesConditions(conditions, context) {
    return conditions.some(condition => {
      switch (condition) {
        case 'creative':
          return context.taskType === 'creative' || context.featureRequirements?.includes('creativity');
        case 'multilingual':
          return context.languageRequirements?.length > 1;
        case 'low-resources':
          return context.resourceConstraints === 'low';
        case 'advanced-creative':
          return context.taskType === 'creative' && context.complexity === 'complex';
        case 'emotional-intelligence':
          return context.featureRequirements?.includes('emotional-intelligence');
        case 'neural-resonance':
          return context.featureRequirements?.includes('neural-resonance');
        case 'logical-reasoning':
          return context.taskType === 'analytical' || context.taskType === 'computational';
        case 'computational':
          return context.taskType === 'computational' || context.featureRequirements?.includes('code-generation');
        case 'code-generation':
          return context.featureRequirements?.includes('code-generation');
        case 'enterprise':
          return context.featureRequirements?.includes('enterprise') || context.complexity === 'complex';
        case 'complex-systems':
          return context.complexity === 'complex' && context.taskType === 'enterprise';
        case 'advanced-features':
          return context.featureRequirements?.length > 3;
        default:
          return false;
      }
    });
  }

  /**
   * Evaluate candidates and select optimal model
   */
  async evaluateCandidates(candidates, context) {
    const scored = await Promise.all(
      candidates.map(async candidate => ({
        model: candidate,
        score: await this.calculateScore(candidate, context)
      }))
    );

    // Sort by score (highest first) and return the best healthy model
    scored.sort((a, b) => b.score - a.score);
    
    for (const { model } of scored) {
      if (this.modelHealth[model.name]?.healthy) {
        return model;
      }
    }

    // If no healthy models, return primary model as last resort
    return this.primaryModel;
  }

  /**
   * Calculate model score based on context and performance
   */
  async calculateScore(model, context) {
    let score = 0;

    // Base score for model type
    if (model.name === this.primaryModel.name) {
      score += 100; // Primary model gets highest base score
    } else {
      score += 50; // Fallbacks get lower base score
    }

    // Context matching score
    if (model.conditions) {
      score += this.calculateContextScore(model.conditions, context) * 20;
    }

    // Resource constraints score
    score += this.calculateResourceScore(model, context) * 15;

    // Performance score
    score += this.calculatePerformanceScore(model) * 10;

    // Load balancing score
    score += this.calculateLoadScore(model) * 5;

    return score;
  }

  /**
   * Calculate context matching score
   */
  calculateContextScore(conditions, context) {
    let matches = 0;
    const totalConditions = conditions.length;

    conditions.forEach(condition => {
      if (this.matchesConditions([condition], context)) {
        matches++;
      }
    });

    return matches / totalConditions;
  }

  /**
   * Calculate resource compatibility score
   */
  calculateResourceScore(model, context) {
    const resourceMap = {
      'low': { 'high': 0.2, 'moderate': 0.5, 'low': 1.0 },
      'moderate': { 'high': 0.5, 'moderate': 0.8, 'low': 0.7 },
      'high': { 'high': 1.0, 'moderate': 0.6, 'low': 0.3 }
    };

    const modelResourceLevel = this.getResourceLevel(model);
    const contextResourceLevel = context.resourceConstraints || 'moderate';

    return resourceMap[modelResourceLevel]?.[contextResourceLevel] || 0.5;
  }

  /**
   * Get resource level for model
   */
  getResourceLevel(model) {
    if (model.size && model.size.includes('GB')) {
      const size = parseInt(model.size);
      if (size <= 10) return 'low';
      if (size <= 30) return 'moderate';
      return 'high';
    }
    return 'moderate';
  }

  /**
   * Calculate performance score based on health metrics
   */
  calculatePerformanceScore(model) {
    const health = this.modelHealth[model.name];
    if (!health) return 0.5;

    // Factor in response time and error rate
    const responseTimeScore = Math.max(0, 1 - (health.responseTime / 5000)); // 5s max
    const errorRateScore = Math.max(0, 1 - health.errorRate);

    return (responseTimeScore + errorRateScore) / 2;
  }

  /**
   * Calculate load balancing score
   */
  calculateLoadScore(model) {
    const load = this.currentLoad[model.name] || 0;
    return Math.max(0, 1 - (load / 100)); // Normalize to 0-1
  }

  /**
   * Update model health metrics
   */
  updateModelHealth(modelName, responseTime, success) {
    if (!this.modelHealth[modelName]) return;

    const health = this.modelHealth[modelName];
    health.lastCheck = Date.now();
    health.responseTime = health.responseTime * 0.8 + responseTime * 0.2; // Exponential moving average

    if (success) {
      health.errorRate = health.errorRate * 0.9; // Decay error rate
    } else {
      health.errorRate = Math.min(1.0, health.errorRate * 1.1 + 0.1); // Increase error rate
    }

    // Mark as unhealthy if error rate is too high
    health.healthy = health.errorRate < 0.5;
  }

  /**
   * Update model load
   */
  updateModelLoad(modelName, delta) {
    this.currentLoad[modelName] = Math.max(0, (this.currentLoad[modelName] || 0) + delta);
  }

  /**
   * Get model configuration
   */
  getModelConfig(modelName) {
    if (this.primaryModel.name === modelName) {
      return this.primaryModel;
    }
    
    return this.fallbacks.find(f => f.name === modelName);
  }

  /**
   * Health check for all models
   */
  async healthCheck() {
    const results = {};

    for (const modelName of Object.keys(this.modelHealth)) {
      try {
        const startTime = Date.now();
        // Simple health check - in production, this would be an actual model call
        await this.pingModel(modelName);
        const responseTime = Date.now() - startTime;
        
        this.updateModelHealth(modelName, responseTime, true);
        results[modelName] = { healthy: true, responseTime };
      } catch (error) {
        this.updateModelHealth(modelName, 5000, false);
        results[modelName] = { healthy: false, error: error.message };
      }
    }

    return results;
  }

  /**
   * Ping model for health check
   */
  async pingModel(modelName) {
    // In production, this would make an actual call to the model
    // For now, simulate with a timeout
    return new Promise((resolve) => {
      setTimeout(resolve, Math.random() * 1000 + 100);
    });
  }

  /**
   * Get routing statistics
   */
  getStats() {
    return {
      primaryModel: this.primaryModel.name,
      fallbackModels: this.fallbacks.map(f => f.name),
      modelHealth: this.modelHealth,
      currentLoad: this.currentLoad,
      routingStrategy: this.routingStrategy
    };
  }
}

module.exports = NexusModelRouter;
