// Rate limiting middleware
import { CacheManager } from './redis.js';

// Rate limit configurations
const RATE_LIMITS = {
  // API endpoints
  'api/generate': { limit: 10, window: 60 }, // 10 requests per minute
  'api/upload': { limit: 5, window: 60 },   // 5 uploads per minute
  'api/auth/login': { limit: 5, window: 300 }, // 5 login attempts per 5 minutes
  'api/auth/verify': { limit: 100, window: 60 }, // 100 verifications per minute
  
  // Global limits
  'global': { limit: 1000, window: 60 }, // 1000 requests per minute per IP
  'user': { limit: 200, window: 60 },    // 200 requests per minute per user
};

// Generate rate limit keys
function generateRateLimitKey(type, identifier) {
  const timestamp = Math.floor(Date.now() / 1000);
  return `rate_limit:${type}:${identifier}:${timestamp}`;
}

// Hash function for consistent user identification
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

// Main rate limiting middleware
export async function rateLimit(options = {}) {
  const {
    type = 'global',
    limit = RATE_LIMITS[type]?.limit || 100,
    window = RATE_LIMITS[type]?.window || 60,
    identifierGenerator = defaultIdentifierGenerator,
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
    message = 'Too many requests, please try again later.'
  } = options;

  return async (req, res, next) => {
    try {
      // Generate identifier for rate limiting
      const identifier = await identifierGenerator(req);
      
      // Check rate limit
      const result = await CacheManager.incrementRateLimit(
        generateRateLimitKey(type, identifier),
        limit,
        window
      );

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', limit);
      res.setHeader('X-RateLimit-Remaining', result.remaining);
      res.setHeader('X-RateLimit-Reset', new Date(Date.now() + window * 1000).toISOString());

      // Check if request is allowed
      if (!result.allowed) {
        // Log rate limit violation
        console.warn(`Rate limit exceeded for ${type}: ${identifier}`);
        
        return res.status(429).json({
          error: message,
          retryAfter: window,
          limit,
          remaining: result.remaining
        });
      }

      // Track successful/failed requests if configured
      if (skipSuccessfulRequests || skipFailedRequests) {
        const originalSend = res.send;
        res.send = function(data) {
          if (skipSuccessfulRequests && res.statusCode >= 200 && res.statusCode < 300) {
            // Don't count successful requests
          } else if (skipFailedRequests && res.statusCode >= 400) {
            // Don't count failed requests
          } else {
            // Count the request
            CacheManager.incrementRateLimit(
              generateRateLimitKey(type, identifier),
              limit,
              window
            );
          }
          return originalSend.call(this, data);
        };
      }

      next();
    } catch (error) {
      console.error('Rate limiting error:', error);
      // Fail open - allow request if rate limiting fails
      next();
    }
  };
}

// Default identifier generator
async function defaultIdentifierGenerator(req) {
  // Try to get user ID from auth context
  const authHeader = req.headers.authorization;
  if (authHeader) {
    try {
      // Extract user info from JWT (simplified)
      const token = authHeader.replace('Bearer ', '');
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      return `user:${payload.userId || payload.email}`;
    } catch (error) {
      // Fall back to IP if token parsing fails
    }
  }
  
  // Use IP address as identifier
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? forwarded.split(',')[0] : req.connection.remoteAddress;
  return `ip:${ip || 'unknown'}`;
}

// Specific rate limiters for different use cases
export const apiRateLimit = rateLimit({
  type: 'global',
  limit: 1000,
  window: 60,
  message: 'API rate limit exceeded. Please try again later.'
});

export const generationRateLimit = rateLimit({
  type: 'api/generate',
  limit: 10,
  window: 60,
  message: 'Too many generation requests. Please wait before generating again.'
});

export const uploadRateLimit = rateLimit({
  type: 'api/upload',
  limit: 5,
  window: 60,
  message: 'Too many upload requests. Please wait before uploading again.'
});

export const authRateLimit = rateLimit({
  type: 'api/auth/login',
  limit: 5,
  window: 300,
  message: 'Too many login attempts. Please wait before trying again.'
});

export const userRateLimit = rateLimit({
  type: 'user',
  limit: 200,
  window: 60,
  message: 'User rate limit exceeded. Please slow down your requests.'
});

// Rate limit status endpoint
export async function getRateLimitStatus(req, res) {
  try {
    const identifier = await defaultIdentifierGenerator(req);
    const status = {};
    
    // Check current status for different rate limits
    for (const [type, config] of Object.entries(RATE_LIMITS)) {
      const key = generateRateLimitKey(type, identifier);
      const exists = await CacheManager.exists(key);
      status[type] = {
        limit: config.limit,
        window: config.window,
        active: exists
      };
    }
    
    res.json({ status });
  } catch (error) {
    console.error('Rate limit status error:', error);
    res.status(500).json({ error: 'Failed to get rate limit status' });
  }
}

// Clear rate limits (admin function)
export async function clearRateLimits(req, res) {
  try {
    // This should be protected by admin authentication
    const cleared = await CacheManager.clearPattern('rate_limit:*');
    res.json({ 
      message: `Cleared ${cleared} rate limit entries`,
      cleared
    });
  } catch (error) {
    console.error('Clear rate limits error:', error);
    res.status(500).json({ error: 'Failed to clear rate limits' });
  }
}
