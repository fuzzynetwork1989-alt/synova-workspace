// Configuration manager for runtime config updates
import { config } from './config.js';

class ConfigManager {
  constructor() {
    this.config = { ...config };
    this.listeners = [];
  }

  // Subscribe to configuration changes
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify listeners of configuration changes
  notify(change) {
    this.listeners.forEach(listener => listener(change));
  }

  // Update configuration at runtime
  updateConfig(updates) {
    const oldConfig = { ...this.config };
    this.config = { ...this.config, ...updates };
    
    this.notify({
      type: 'config_updated',
      oldConfig,
      newConfig: this.config,
      updates
    });
    
    return this.config;
  }

  // Get current configuration
  getConfig() {
    return this.config;
  }

  // Get feature flag status
  isFeatureEnabled(feature) {
    return this.config[`ENABLE_${feature.toUpperCase()}`] || false;
  }

  // Get rate limit for specific type
  getRateLimit(type) {
    return this.config[`RATE_LIMIT_${type.toUpperCase()}`] || 100;
  }

  // Get cache TTL for specific type
  getCacheTTL(type) {
    return this.config[`CACHE_TTL_${type.toUpperCase()}`] || 300;
  }

  // Environment helpers
  isDevelopment() {
    return this.config.NODE_ENV === 'development';
  }

  isStaging() {
    return this.config.NODE_ENV === 'staging';
  }

  isProduction() {
    return this.config.NODE_ENV === 'production';
  }

  // Service availability checks
  isRedisAvailable() {
    return !!this.config.REDIS_HOST;
  }

  isDatabaseAvailable() {
    return !!this.config.DATABASE_URL;
  }

  isSentryAvailable() {
    return !!this.config.SENTRY_DSN;
  }

  // Get service URLs
  getServiceUrl(service) {
    const urls = {
      api: this.config.API_URL,
      railway: this.config.RAILWAY_API_URL,
      cdn: this.config.CDN_URL,
    };
    return urls[service];
  }

  // Get authentication secrets
  getAuthSecrets() {
    return {
      jwt: this.config.JWT_SECRET,
      session: this.config.SESSION_SECRET,
    };
  }

  // Validate configuration
  validate() {
    const errors = [];

    // Validate required secrets in production
    if (this.isProduction()) {
      if (!this.config.JWT_SECRET || this.config.JWT_SECRET.length < 32) {
        errors.push('JWT_SECRET must be at least 32 characters in production');
      }
      if (!this.config.SESSION_SECRET || this.config.SESSION_SECRET.length < 32) {
        errors.push('SESSION_SECRET must be at least 32 characters in production');
      }
    }

    // Validate URLs
    try {
      new URL(this.config.API_URL);
    } catch (error) {
      errors.push('Invalid API_URL format');
    }

    if (this.config.CDN_URL) {
      try {
        new URL(this.config.CDN_URL);
      } catch (error) {
        errors.push('Invalid CDN_URL format');
      }
    }

    // Validate Redis configuration
    if (this.isRedisAvailable()) {
      if (!this.config.REDIS_PORT || this.config.REDIS_PORT < 1 || this.config.REDIS_PORT > 65535) {
        errors.push('Invalid REDIS_PORT (must be 1-65535)');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // Get configuration summary
  getSummary() {
    return {
      environment: this.config.NODE_ENV,
      features: {
        cache: this.isFeatureEnabled('cache'),
        rateLimiting: this.isFeatureEnabled('rateLimiting'),
        cdn: this.isFeatureEnabled('cdn'),
      },
      services: {
        redis: this.isRedisAvailable(),
        database: this.isDatabaseAvailable(),
        sentry: this.isSentryAvailable(),
      },
      urls: {
        api: this.getServiceUrl('api'),
        railway: this.getServiceUrl('railway'),
        cdn: this.getServiceUrl('cdn'),
      },
      rateLimits: {
        global: this.getRateLimit('global'),
        generation: this.getRateLimit('generation'),
        upload: this.getRateLimit('upload'),
      },
      cacheTtls: {
        api: this.getCacheTTL('api'),
        generation: this.getCacheTTL('generation'),
        upload: this.getCacheTTL('upload'),
      },
    };
  }
}

// Export singleton instance
export const configManager = new ConfigManager();

// Export class for testing
export { ConfigManager };
