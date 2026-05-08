import logger from '../utils/logger.js';

/**
 * Advanced rate limiting middleware
 * Sliding window rate limiting with Redis/memory fallback
 */

export class RateLimiter {
  constructor(options = {}) {
    this.windowMs = options.windowMs || 60000; // 1 minute default
    this.maxRequests = options.maxRequests || 100;
    this.storage = new Map(); // In-memory storage
    this.message = options.message || 'Too many requests';
  }

  /**
   * Rate limiting middleware
   */
  middleware() {
    return (req, res, next) => {
      const key = this.getKey(req);
      const now = Date.now();
      const windowStart = now - this.windowMs;

      // Clean old entries
      this.cleanup(windowStart);

      // Get current requests
      if (!this.storage.has(key)) {
        this.storage.set(key, []);
      }

      const requests = this.storage.get(key);
      
      // Filter to current window
      const validRequests = requests.filter(timestamp => timestamp > windowStart);
      this.storage.set(key, validRequests);

      // Check limit
      if (validRequests.length >= this.maxRequests) {
        const resetTime = Math.ceil((windowStart + this.windowMs - now) / 1000);
        
        res.set('X-RateLimit-Limit', this.maxRequests);
        res.set('X-RateLimit-Remaining', 0);
        res.set('X-RateLimit-Reset', resetTime);
        
        return res.status(429).json({
          success: false,
          error: this.message,
          retryAfter: resetTime,
          timestamp: new Date().toISOString()
        });
      }

      // Add current request
      validRequests.push(now);
      this.storage.set(key, validRequests);

      // Set rate limit headers
      res.set('X-RateLimit-Limit', this.maxRequests);
      res.set('X-RateLimit-Remaining', Math.max(0, this.maxRequests - validRequests.length));
      res.set('X-RateLimit-Reset', Math.ceil((windowStart + this.windowMs) / 1000));

      req.rateLimit = {
        limit: this.maxRequests,
        remaining: Math.max(0, this.maxRequests - validRequests.length),
        resetTime: Math.ceil((windowStart + this.windowMs) / 1000)
      };

      next();
    };
  }

  /**
   * Get key for rate limiting
   */
  getKey(req) {
    // Try API key first
    if (req.apiKey?.keyId) {
      return `key:${req.apiKey.keyId}`;
    }

    // Fall back to IP
    return `ip:${req.ip || req.connection.remoteAddress}`;
  }

  /**
   * Clean up old entries
   */
  cleanup(cutoffTime) {
    for (const [key, requests] of this.storage.entries()) {
      const validRequests = requests.filter(timestamp => timestamp > cutoffTime);
      
      if (validRequests.length === 0) {
        this.storage.delete(key);
      } else if (validRequests.length !== requests.length) {
        this.storage.set(key, validRequests);
      }
    }
  }

  /**
   * Get rate limit info for a key
   */
  getInfo(key) {
    if (!this.storage.has(key)) {
      return {
        limit: this.maxRequests,
        remaining: this.maxRequests,
        resetTime: Math.ceil((Date.now() + this.windowMs) / 1000)
      };
    }

    const now = Date.now();
    const windowStart = now - this.windowMs;
    const requests = this.storage.get(key);
    const validRequests = requests.filter(timestamp => timestamp > windowStart);

    return {
      limit: this.maxRequests,
      remaining: Math.max(0, this.maxRequests - validRequests.length),
      resetTime: Math.ceil((windowStart + this.windowMs) / 1000),
      requests: validRequests.length
    };
  }

  /**
   * Reset rate limit for a key
   */
  reset(key) {
    this.storage.delete(key);
  }

  /**
   * Get all rate limit info (for admin)
   */
  getAllInfo() {
    const info = {};
    for (const [key, requests] of this.storage.entries()) {
      const now = Date.now();
      const windowStart = now - this.windowMs;
      const validRequests = requests.filter(timestamp => timestamp > windowStart);
      
      info[key] = {
        limit: this.maxRequests,
        remaining: Math.max(0, this.maxRequests - validRequests.length),
        requests: validRequests.length,
        lastRequest: requests[requests.length - 1] || null
      };
    }
    return info;
  }
}

export default RateLimiter;
