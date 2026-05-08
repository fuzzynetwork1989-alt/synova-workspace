import { KeyGenerator } from '../utils/keyGenerator.js';

/**
 * Authentication middleware for API requests
 * Validates API keys and JWT tokens
 */
export class AuthMiddleware {
  constructor(database) {
    this.db = database;
  }

  /**
   * Middleware to validate API key
   */
  async validateApiKey(req, res, next) {
    try {
      const apiKey = this.extractApiKey(req);
      
      if (!apiKey) {
        return res.status(401).json({
          error: 'Missing API key',
          message: 'API key is required in Authorization header or query parameter'
        });
      }

      // Validate key format
      if (!KeyGenerator.isValidKeyFormat(apiKey)) {
        return res.status(401).json({
          error: 'Invalid API key format',
          message: 'API key format is invalid'
        });
      }

      // Check if key exists in database
      const keyData = await this.db.getKeyByHash(KeyGenerator.hashApiKey(apiKey));
      
      if (!keyData) {
        return res.status(401).json({
          error: 'Invalid API key',
          message: 'API key not found or revoked'
        });
      }

      // Check if key is active
      if (!keyData.is_active) {
        return res.status(401).json({
          error: 'API key deactivated',
          message: 'API key has been deactivated'
        });
      }

      // Check expiration
      if (keyData.expires_at && new Date(keyData.expires_at) < new Date()) {
        return res.status(401).json({
          error: 'API key expired',
          message: 'API key has expired'
        });
      }

      // Attach key data to request
      req.apiKey = {
        id: keyData.id,
        keyId: keyData.key_id,
        name: keyData.name,
        permissions: keyData.permissions || [],
        rateLimit: keyData.rate_limit || 1000,
        userId: keyData.user_id
      };

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({
        error: 'Authentication error',
        message: 'Failed to validate API key'
      });
    }
  }

  /**
   * Middleware to validate JWT token
   */
  async validateJWT(req, res, next) {
    try {
      const token = this.extractToken(req);
      
      if (!token) {
        return res.status(401).json({
          error: 'Missing token',
          message: 'JWT token is required'
        });
      }

      // Get JWT secret from environment
      const jwtSecret = process.env.JWT_SECRET || 'default-secret-change-in-production';
      
      // Validate JWT
      const validation = KeyGenerator.validateJWT(token, jwtSecret);
      
      if (!validation.valid) {
        return res.status(401).json({
          error: 'Invalid token',
          message: validation.error
        });
      }

      // Get key data from database
      const keyData = await this.db.getKeyById(validation.payload.keyId);
      
      if (!keyData || !keyData.is_active) {
        return res.status(401).json({
          error: 'Invalid token',
          message: 'Associated API key not found or deactivated'
        });
      }

      // Attach user data to request
      req.user = {
        keyId: validation.payload.keyId,
        userId: keyData.user_id,
        permissions: keyData.permissions || []
      };

      next();
    } catch (error) {
      console.error('JWT validation error:', error);
      return res.status(500).json({
        error: 'Token validation error',
        message: 'Failed to validate JWT token'
      });
    }
  }

  /**
   * Middleware for admin authentication
   */
  async requireAdmin(req, res, next) {
    try {
      if (!req.user || !req.user.permissions.includes('admin')) {
        return res.status(403).json({
          error: 'Access denied',
          message: 'Admin permissions required'
        });
      }
      next();
    } catch (error) {
      return res.status(500).json({
        error: 'Authorization error',
        message: 'Failed to check admin permissions'
      });
    }
  }

  /**
   * Extract API key from request
   */
  extractApiKey(req) {
    // Try Authorization header first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Try API-Key header
    const apiKeyHeader = req.headers['api-key'];
    if (apiKeyHeader) {
      return apiKeyHeader;
    }

    // Try query parameter
    if (req.query.api_key) {
      return req.query.api_key;
    }

    return null;
  }

  /**
   * Extract JWT token from request
   */
  extractToken(req) {
    // Try Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Try query parameter
    if (req.query.token) {
      return req.query.token;
    }

    // Try cookie
    if (req.cookies && req.cookies.token) {
      return req.cookies.token;
    }

    return null;
  }

  /**
   * Generate API key response
   */
  generateKeyResponse(keyData, includeSecret = false) {
    const response = {
      id: keyData.id,
      keyId: keyData.key_id,
      name: keyData.name,
      prefix: keyData.prefix,
      createdAt: keyData.created_at,
      expiresAt: keyData.expires_at,
      isActive: keyData.is_active,
      permissions: keyData.permissions || [],
      rateLimit: keyData.rate_limit || 1000,
      usageCount: keyData.usage_count || 0,
      lastUsedAt: keyData.last_used_at,
      userId: keyData.user_id
    };

    if (includeSecret && keyData.api_key) {
      response.apiKey = keyData.api_key;
    }

    return response;
  }

  /**
   * Rate limiting middleware
   */
  rateLimiter(windowMs = 60000, maxRequests = 100) {
    const requests = new Map();

    return (req, res, next) => {
      const keyId = req.apiKey?.keyId || req.ip;
      const now = Date.now();
      const windowStart = now - windowMs;

      // Clean old entries
      if (requests.has(keyId)) {
        const keyRequests = requests.get(keyId);
        const validRequests = keyRequests.filter(time => time > windowStart);
        requests.set(keyId, validRequests);
      } else {
        requests.set(keyId, []);
      }

      const keyRequests = requests.get(keyId);
      
      if (keyRequests.length >= maxRequests) {
        return res.status(429).json({
          error: 'Rate limit exceeded',
          message: `Too many requests. Maximum ${maxRequests} requests per ${windowMs/1000} seconds.`,
          retryAfter: Math.ceil(windowMs / 1000)
        });
      }

      keyRequests.push(now);
      next();
    };
  }

  /**
   * Permission-based access control
   */
  requirePermission(permission) {
    return (req, res, next) => {
      const userPermissions = req.user?.permissions || req.apiKey?.permissions || [];
      
      if (!userPermissions.includes(permission)) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          message: `Permission '${permission}' required`
        });
      }

      next();
    };
  }
}
