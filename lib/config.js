// Environment-specific configuration management
import { z } from 'zod';

// Configuration schema validation
const configSchema = z.object({
  // Environment
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  
  // API Configuration
  API_URL: z.string().url(),
  RAILWAY_API_URL: z.string().url().optional(),
  
  // Redis Configuration
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),
  
  // Database Configuration
  DATABASE_URL: z.string().url().optional(),
  
  // CDN Configuration
  CDN_URL: z.string().url().optional(),
  ASSET_PREFIX: z.string().optional(),
  
  // Authentication
  JWT_SECRET: z.string().min(32),
  SESSION_SECRET: z.string().min(32),
  
  // Rate Limiting
  RATE_LIMIT_GLOBAL: z.number().default(1000),
  RATE_LIMIT_GENERATION: z.number().default(10),
  RATE_LIMIT_UPLOAD: z.number().default(5),
  
  // Feature Flags
  ENABLE_CACHE: z.boolean().default(true),
  ENABLE_RATE_LIMITING: z.boolean().default(true),
  ENABLE_CDN: z.boolean().default(false),
  
  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  
  // External Services
  SENTRY_DSN: z.string().url().optional(),
  
  // Performance
  CACHE_TTL_API: z.number().default(300),
  CACHE_TTL_GENERATION: z.number().default(3600),
  CACHE_TTL_UPLOAD: z.number().default(86400),
});

// Environment-specific defaults
const environmentDefaults = {
  development: {
    NODE_ENV: 'development',
    API_URL: 'http://localhost:3000/api',
    REDIS_HOST: 'localhost',
    LOG_LEVEL: 'debug',
    ENABLE_CACHE: false,
    ENABLE_RATE_LIMITING: false,
    ENABLE_CDN: false,
  },
  staging: {
    NODE_ENV: 'staging',
    API_URL: 'https://staging-api.synova.ai',
    REDIS_HOST: 'staging-redis.synova.ai',
    LOG_LEVEL: 'info',
    ENABLE_CACHE: true,
    ENABLE_RATE_LIMITING: true,
    ENABLE_CDN: true,
    CDN_URL: 'https://staging-cdn.synova.ai',
  },
  production: {
    NODE_ENV: 'production',
    API_URL: 'https://api.synova.ai',
    REDIS_HOST: 'production-redis.synova.ai',
    LOG_LEVEL: 'warn',
    ENABLE_CACHE: true,
    ENABLE_RATE_LIMITING: true,
    ENABLE_CDN: true,
    CDN_URL: 'https://cdn.synova.ai',
  },
};

// Load and validate configuration
function loadConfig() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const defaults = environmentDefaults[nodeEnv] || environmentDefaults.development;
  
  // Merge environment variables with defaults
  const rawConfig = {
    ...defaults,
    ...Object.fromEntries(
      Object.entries(process.env).filter(([key]) => key.startsWith('NEXT_PUBLIC_') || !key.startsWith('NEXT_PUBLIC_'))
    ),
  };
  
  // Clean up NEXT_PUBLIC_ prefixes for non-public config
  const cleanedConfig = Object.fromEntries(
    Object.entries(rawConfig).map(([key, value]) => [
      key.replace('NEXT_PUBLIC_', ''),
      value
    ])
  );
  
  // Validate configuration
  try {
    const config = configSchema.parse(cleanedConfig);
    return config;
  } catch (error) {
    console.error('Configuration validation failed:', error);
    throw new Error(`Invalid configuration: ${error.message}`);
  }
}

// Export validated configuration
export const config = loadConfig();

// Environment-specific helpers
export const isDevelopment = config.NODE_ENV === 'development';
export const isStaging = config.NODE_ENV === 'staging';
export const isProduction = config.NODE_ENV === 'production';

// Configuration getters
export function getRedisConfig() {
  return {
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    password: config.REDIS_PASSWORD,
  };
}

export function getRateLimitConfig() {
  return {
    global: config.RATE_LIMIT_GLOBAL,
    generation: config.RATE_LIMIT_GENERATION,
    upload: config.RATE_LIMIT_UPLOAD,
  };
}

export function getCacheConfig() {
  return {
    enabled: config.ENABLE_CACHE,
    ttl: {
      api: config.CACHE_TTL_API,
      generation: config.CACHE_TTL_GENERATION,
      upload: config.CACHE_TTL_UPLOAD,
    },
  };
}

export function getCdnConfig() {
  return {
    enabled: config.ENABLE_CDN,
    url: config.CDN_URL,
    assetPrefix: config.ASSET_PREFIX,
  };
}

export function getAuthConfig() {
  return {
    jwtSecret: config.JWT_SECRET,
    sessionSecret: config.SESSION_SECRET,
  };
}

// Configuration status endpoint
export function getConfigStatus() {
  return {
    environment: config.NODE_ENV,
    features: {
      cache: config.ENABLE_CACHE,
      rateLimiting: config.ENABLE_RATE_LIMITING,
      cdn: config.ENABLE_CDN,
    },
    services: {
      redis: !!config.REDIS_HOST,
      database: !!config.DATABASE_URL,
      sentry: !!config.SENTRY_DSN,
    },
    rateLimits: getRateLimitConfig(),
    cache: getCacheConfig(),
  };
}

// Hot reload configuration in development
if (isDevelopment) {
  console.log('Configuration loaded:', getConfigStatus());
}
