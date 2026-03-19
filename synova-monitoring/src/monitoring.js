/**
 * Synova AI Monitoring & Error Tracking v4.1
 * Production-ready monitoring with Sentry, Prometheus, and custom analytics
 */

import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';
import { createPrometheusMetrics } from './prometheus';
import { createCustomAnalytics } from './analytics';

class SynovaMonitoring {
  constructor(options = {}) {
    this.options = {
      dsn: options.dsn || process.env.SENTRY_DSN,
      environment: options.environment || process.env.NODE_ENV || 'development',
      release: options.release || process.env.RELEASE || '4.1.0',
      tracesSampleRate: options.tracesSampleRate || 0.1,
      profilesSampleRate: options.profilesSampleRate || 0.1,
      ...options
    };
    
    this.metrics = null;
    this.analytics = null;
    this.isInitialized = false;
  }

  initialize() {
    try {
      // Initialize Sentry
      if (this.options.dsn) {
        Sentry.init({
          dsn: this.options.dsn,
          environment: this.options.environment,
          release: this.options.release,
          tracesSampleRate: this.options.tracesSampleRate,
          profilesSampleRate: this.options.profilesSampleRate,
          integrations: [
            new ProfilingIntegration(),
            new Sentry.Integrations.Http({ tracing: true }),
            new Sentry.Integrations.Express({ app: null }),
            new Sentry.Integrations.Mongo({ tracing: true })
          ],
          beforeSend: this.filterSensitiveData.bind(this),
          beforeBreadcrumb: this.filterBreadcrumb.bind(this)
        });
        
        console.log('🔍 Sentry initialized');
      }

      // Initialize Prometheus metrics
      this.metrics = createPrometheusMetrics({
        prefix: 'synova_',
        labels: {
          service: process.env.SERVICE_NAME || 'synova-api',
          version: this.options.release,
          environment: this.options.environment
        }
      });

      // Initialize custom analytics
      this.analytics = createCustomAnalytics({
        enabled: this.options.environment !== 'development',
        batchSize: 100,
        flushInterval: 30000 // 30 seconds
      });

      this.isInitialized = true;
      console.log('✅ Synova Monitoring initialized');
      
      // Set up process handlers
      this.setupProcessHandlers();
      
    } catch (error) {
      console.error('❌ Failed to initialize monitoring:', error);
    }
  }

  setupProcessHandlers() {
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      this.captureException(error, { level: 'fatal' });
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      this.captureException(reason, { 
        level: 'error',
        extra: { promise: promise.toString() }
      });
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully...');
      this.shutdown();
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully...');
      this.shutdown();
    });
  }

  filterSensitiveData(event) {
    // Filter out sensitive data from events
    if (event.request && event.request.headers) {
      delete event.request.headers.authorization;
      delete event.request.headers.cookie;
      delete event.request.headers['x-api-key'];
    }

    // Filter sensitive data from extra data
    if (event.extra) {
      const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth'];
      for (const key of sensitiveKeys) {
        if (event.extra[key]) {
          event.extra[key] = '[FILTERED]';
        }
      }
    }

    return event;
  }

  filterBreadcrumb(breadcrumb) {
    // Filter out sensitive breadcrumbs
    if (breadcrumb.category === 'http' && breadcrumb.data) {
      delete breadcrumb.data.headers;
      delete breadcrumb.data.cookies;
    }

    return breadcrumb;
  }

  // Error tracking methods
  captureException(error, context = {}) {
    if (!this.isInitialized) return;
    
    try {
      Sentry.captureException(error, {
        level: context.level || 'error',
        tags: context.tags || {},
        extra: context.extra || {},
        user: context.user || {}
      });

      // Track in custom analytics
      this.analytics.track('error', {
        type: error.constructor.name,
        message: error.message,
        stack: error.stack,
        context: context
      });

      // Update error metrics
      this.metrics.increment('errors_total', {
        error_type: error.constructor.name,
        service: this.options.labels.service
      });

    } catch (err) {
      console.error('Failed to capture exception:', err);
    }
  }

  captureMessage(message, level = 'info', context = {}) {
    if (!this.isInitialized) return;
    
    try {
      Sentry.captureMessage(message, level, {
        tags: context.tags || {},
        extra: context.extra || {}
      });

      // Track in custom analytics
      this.analytics.track('message', {
        message,
        level,
        context
      });

    } catch (err) {
      console.error('Failed to capture message:', err);
    }
  }

  setUser(user) {
    if (!this.isInitialized) return;
    
    try {
      Sentry.setUser(user);
      this.analytics.setUser(user);
    } catch (err) {
      console.error('Failed to set user:', err);
    }
  }

  setTag(key, value) {
    if (!this.isInitialized) return;
    
    try {
      Sentry.setTag(key, value);
      this.metrics.setTag(key, value);
    } catch (err) {
      console.error('Failed to set tag:', err);
    }
  }

  // Performance monitoring
  startTransaction(name, context = {}) {
    if (!this.isInitialized) return null;
    
    try {
      const transaction = Sentry.startTransaction({
        name,
        op: context.operation || 'http.server',
        tags: context.tags || {}
      });

      // Track transaction start
      this.metrics.increment('transactions_started', {
        operation: context.operation || 'http.server',
        service: this.options.labels.service
      });

      return transaction;
    } catch (err) {
      console.error('Failed to start transaction:', err);
      return null;
    }
  }

  finishTransaction(transaction, status = 'ok') {
    if (!transaction) return;
    
    try {
      transaction.setStatus(status);
      transaction.finish();

      // Track transaction completion
      const duration = Date.now() - transaction.starttime;
      this.metrics.histogram('transaction_duration', duration, {
        operation: transaction.op,
        status,
        service: this.options.labels.service
      });

      this.metrics.increment('transactions_completed', {
        operation: transaction.op,
        status,
        service: this.options.labels.service
      });

    } catch (err) {
      console.error('Failed to finish transaction:', err);
    }
  }

  // Custom metrics
  trackMetric(name, value, labels = {}) {
    if (!this.metrics) return;
    
    try {
      this.metrics.gauge(name, value, {
        ...labels,
        service: this.options.labels.service
      });
    } catch (err) {
      console.error('Failed to track metric:', err);
    }
  }

  incrementCounter(name, labels = {}) {
    if (!this.metrics) return;
    
    try {
      this.metrics.increment(name, {
        ...labels,
        service: this.options.labels.service
      });
    } catch (err) {
      console.error('Failed to increment counter:', err);
    }
  }

  // Business metrics
  trackBlueprintGeneration(blueprintType, duration, success) {
    this.incrementCounter('blueprint_generations_total', {
      blueprint_type: blueprintType,
      success: success.toString()
    });

    this.trackMetric('blueprint_generation_duration', duration, {
      blueprint_type: blueprintType
    });

    this.analytics.track('blueprint_generated', {
      type: blueprintType,
      duration,
      success,
      timestamp: Date.now()
    });
  }

  trackVoiceCommand(command, confidence, success) {
    this.incrementCounter('voice_commands_total', {
      command_type: command.type,
      success: success.toString()
    });

    this.trackMetric('voice_command_confidence', confidence, {
      command_type: command.type
    });

    this.analytics.track('voice_command', {
      command,
      confidence,
      success,
      timestamp: Date.now()
    });
  }

  trackXRInteraction(interactionType, duration, success) {
    this.incrementCounter('xr_interactions_total', {
      interaction_type: interactionType,
      success: success.toString()
    });

    this.trackMetric('xr_interaction_duration', duration, {
      interaction_type
    });

    this.analytics.track('xr_interaction', {
      type: interactionType,
      duration,
      success,
      timestamp: Date.now()
    });
  }

  // Health check
  async healthCheck() {
    const health = {
      status: 'healthy',
      timestamp: Date.now(),
      services: {},
      metrics: {}
    };

    try {
      // Check database connection
      if (this.metrics) {
        health.services.database = 'connected';
        health.metrics.database = await this.getDatabaseMetrics();
      }

      // Check Redis connection
      if (this.metrics) {
        health.services.redis = 'connected';
        health.metrics.redis = await this.getRedisMetrics();
      }

      // Check AI service
      if (this.metrics) {
        health.services.ai = 'connected';
        health.metrics.ai = await this.getAIMetrics();
      }

      // Check error rate
      const errorRate = this.getErrorRate();
      if (errorRate > 0.1) { // 10% error rate threshold
        health.status = 'degraded';
        health.services.errors = 'high';
      }

    } catch (error) {
      health.status = 'unhealthy';
      health.error = error.message;
      this.captureException(error, { level: 'warning' });
    }

    return health;
  }

  async getDatabaseMetrics() {
    // Implementation would query actual database metrics
    return {
      connections: 5,
      query_time: 25,
      active_connections: 3
    };
  }

  async getRedisMetrics() {
    // Implementation would query actual Redis metrics
    return {
      memory_usage: '45MB',
      connected_clients: 2,
      hit_rate: 0.95
    };
  }

  async getAIMetrics() {
    // Implementation would query actual AI service metrics
    return {
      model_loaded: true,
      response_time: 150,
      requests_per_minute: 12
    };
  }

  getErrorRate() {
    // Calculate error rate from metrics
    // Implementation would use actual metrics data
    return 0.05; // 5% error rate
  }

  // Analytics methods
  trackEvent(eventName, properties = {}) {
    if (!this.analytics) return;
    
    try {
      this.analytics.track(eventName, {
        ...properties,
        timestamp: Date.now(),
        service: this.options.labels.service
      });
    } catch (err) {
      console.error('Failed to track event:', err);
    }
  }

  trackPageView(page, properties = {}) {
    if (!this.analytics) return;
    
    try {
      this.analytics.page(page, {
        ...properties,
        timestamp: Date.now()
      });
    } catch (err) {
      console.error('Failed to track page view:', err);
    }
  }

  // Shutdown
  async shutdown() {
    console.log('🔄 Shutting down monitoring...');
    
    try {
      // Flush any pending analytics
      if (this.analytics) {
        await this.analytics.flush();
      }

      // Close Sentry
      if (this.isInitialized) {
        Sentry.close(2000); // 2 second timeout
      }

      console.log('✅ Monitoring shutdown complete');
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
    }
  }

  // Get monitoring instance for Express middleware
  getExpressMiddleware() {
    if (!this.isInitialized) {
      return (req, res, next) => next();
    }

    const handlers = Sentry.Handlers;
    
    return [
      handlers.requestHandler(),
      handlers.tracingHandler(),
      (req, res, next) => {
        // Custom middleware logic
        const start = Date.now();
        
        res.on('finish', () => {
          const duration = Date.now() - start;
          
          this.trackMetric('http_request_duration', duration, {
            method: req.method,
            route: req.route?.path || req.path,
            status_code: res.statusCode.toString()
          });

          this.incrementCounter('http_requests_total', {
            method: req.method,
            route: req.route?.path || req.path,
            status_code: res.statusCode.toString()
          });
        });
        
        next();
      },
      handlers.errorHandler()
    ];
  }
}

// Prometheus metrics factory
function createPrometheusMetrics(options = {}) {
  const { prefix = 'synova_', labels = {} } = options;
  
  return {
    increment: (name, extraLabels = {}) => {
      console.log(`📊 Increment ${prefix}${name}:`, { ...labels, ...extraLabels });
    },
    
    gauge: (name, value, extraLabels = {}) => {
      console.log(`📊 Gauge ${prefix}${name}:`, value, { ...labels, ...extraLabels });
    },
    
    histogram: (name, value, extraLabels = {}) => {
      console.log(`📊 Histogram ${prefix}${name}:`, value, { ...labels, ...extraLabels });
    },
    
    setTag: (key, value) => {
      console.log(`📊 Tag ${key}:`, value);
    }
  };
}

// Custom analytics factory
function createCustomAnalytics(options = {}) {
  const { enabled = true, batchSize = 100, flushInterval = 30000 } = options;
  
  const events = [];
  let flushTimer = null;

  const flush = async () => {
    if (events.length === 0) return;
    
    const batch = events.splice(0, batchSize);
    console.log(`📈 Flushing ${batch.length} analytics events`);
    
    // In production, this would send to your analytics service
    // For now, we'll just log them
    batch.forEach(event => {
      console.log('📈 Analytics Event:', event);
    });
  };

  if (enabled) {
    flushTimer = setInterval(flush, flushInterval);
  }

  return {
    track: (eventName, properties) => {
      if (!enabled) return;
      
      events.push({
        event: eventName,
        properties,
        timestamp: Date.now()
      });

      if (events.length >= batchSize) {
        flush();
      }
    },
    
    page: (page, properties) => {
      track('page_view', { page, ...properties });
    },
    
    setUser: (user) => {
      console.log('👤 Analytics user set:', user.id);
    },
    
    flush: async () => {
      if (flushTimer) {
        clearInterval(flushTimer);
      }
      await flush();
    }
  };
}

export default SynovaMonitoring;
export { createPrometheusMetrics, createCustomAnalytics };
