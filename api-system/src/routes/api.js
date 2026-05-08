import express from 'express';
import { KeyGenerator } from '../utils/keyGenerator.js';
import { AuthMiddleware } from '../middleware/auth.js';

/**
 * API routes for key management
 * Similar to OpenAI/Anthropic API structure
 */
export function createAPIRoutes(database) {
  const router = express.Router();
  const auth = new AuthMiddleware(database);

  /**
   * Generate new API key
   * POST /api/v1/keys
   */
  router.post('/keys', async (req, res) => {
    try {
      const { name, permissions = [], rateLimit = 1000, expiresIn } = req.body;

      if (!name) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Name is required'
        });
      }

      // Generate new API key
      const keyData = KeyGenerator.generateApiKey();
      const hashedKey = KeyGenerator.hashApiKey(keyData.key);
      
      // Calculate expiration
      let expiresAt = null;
      if (expiresIn) {
        const expirationMs = KeyGenerator.parseExpiration(expiresIn) * 1000;
        expiresAt = new Date(Date.now() + expirationMs).toISOString();
      }

      // Create user if not exists (for demo)
      const userId = req.user?.userId || 'demo-user';

      // Save to database
      const createdKey = await database.createKey({
        keyId: keyData.keyId,
        name,
        apiKeyHash: hashedKey,
        prefix: keyData.prefix,
        userId,
        permissions,
        rateLimit,
        expiresAt
      });

      // Return response with actual key (only shown once)
      res.status(201).json({
        success: true,
        data: {
          id: createdKey.id,
          keyId: createdKey.key_id,
          name: createdKey.name,
          apiKey: keyData.key, // Only shown on creation
          prefix: createdKey.prefix,
          permissions: createdKey.permissions,
          rateLimit: createdKey.rate_limit,
          createdAt: createdKey.created_at,
          expiresAt: createdKey.expires_at,
          userId: createdKey.user_id
        }
      });
    } catch (error) {
      console.error('Key creation error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to create API key'
      });
    }
  });

  /**
   * List API keys
   * GET /api/v1/keys
   */
  router.get('/keys', auth.validateApiKey, async (req, res) => {
    try {
      const { limit = 50, offset = 0 } = req.query;
      const userId = req.apiKey.userId;

      const keys = await database.listKeys(userId, parseInt(limit), parseInt(offset));

      res.json({
        success: true,
        data: keys,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: keys.length
        }
      });
    } catch (error) {
      console.error('List keys error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to list API keys'
      });
    }
  });

  /**
   * Get specific API key
   * GET /api/v1/keys/:keyId
   */
  router.get('/keys/:keyId', auth.validateApiKey, async (req, res) => {
    try {
      const { keyId } = req.params;
      const userId = req.apiKey.userId;

      const key = await database.getKeyById(keyId);

      if (!key || key.user_id !== userId) {
        return res.status(404).json({
          error: 'Not found',
          message: 'API key not found'
        });
      }

      // Don't expose hash
      delete key.api_key_hash;

      res.json({
        success: true,
        data: key
      });
    } catch (error) {
      console.error('Get key error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to get API key'
      });
    }
  });

  /**
   * Update API key
   * PATCH /api/v1/keys/:keyId
   */
  router.patch('/keys/:keyId', auth.validateApiKey, async (req, res) => {
    try {
      const { keyId } = req.params;
      const { name, permissions, rateLimit, isActive, expiresAt } = req.body;
      const userId = req.apiKey.userId;

      // Check if key exists and belongs to user
      const existingKey = await database.getKeyById(keyId);
      if (!existingKey || existingKey.user_id !== userId) {
        return res.status(404).json({
          error: 'Not found',
          message: 'API key not found'
        });
      }

      // Update key
      const updates = {};
      if (name !== undefined) updates.name = name;
      if (permissions !== undefined) updates.permissions = permissions;
      if (rateLimit !== undefined) updates.rate_limit = rateLimit;
      if (isActive !== undefined) updates.is_active = isActive;
      if (expiresAt !== undefined) updates.expires_at = expiresAt;

      const updatedKey = await database.updateKey(keyId, updates);

      // Don't expose hash
      delete updatedKey.api_key_hash;

      res.json({
        success: true,
        data: updatedKey
      });
    } catch (error) {
      console.error('Update key error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to update API key'
      });
    }
  });

  /**
   * Delete API key
   * DELETE /api/v1/keys/:keyId
   */
  router.delete('/keys/:keyId', auth.validateApiKey, async (req, res) => {
    try {
      const { keyId } = req.params;
      const userId = req.apiKey.userId;

      // Check if key exists and belongs to user
      const existingKey = await database.getKeyById(keyId);
      if (!existingKey || existingKey.user_id !== userId) {
        return res.status(404).json({
          error: 'Not found',
          message: 'API key not found'
        });
      }

      const deleted = await database.deleteKey(keyId);

      if (deleted) {
        res.json({
          success: true,
          message: 'API key deleted successfully'
        });
      } else {
        res.status(500).json({
          error: 'Internal server error',
          message: 'Failed to delete API key'
        });
      }
    } catch (error) {
      console.error('Delete key error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to delete API key'
      });
    }
  });

  /**
   * Validate API key
   * POST /api/v1/auth/validate
   */
  router.post('/auth/validate', auth.validateApiKey, async (req, res) => {
    try {
      const rateLimit = await database.checkRateLimit(req.apiKey.keyId, 60000, req.apiKey.rateLimit);

      res.json({
        success: true,
        data: {
          keyId: req.apiKey.keyId,
          name: req.apiKey.name,
          permissions: req.apiKey.permissions,
          rateLimit: {
            limit: req.apiKey.rateLimit,
            remaining: rateLimit.remaining,
            resetTime: rateLimit.resetTime
          }
        }
      });
    } catch (error) {
      console.error('Validation error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to validate API key'
      });
    }
  });

  /**
   * Get usage statistics
   * GET /api/v1/analytics
   */
  router.get('/analytics', auth.validateApiKey, async (req, res) => {
    try {
      const { timeRange = '24h' } = req.query;
      const keyId = req.apiKey.keyId;

      const stats = await database.getUsageStats(keyId, timeRange);

      res.json({
        success: true,
        data: {
          timeRange,
          totalRequests: stats.total_requests || 0,
          averageResponseTime: Math.round(stats.avg_response_time || 0),
          minResponseTime: stats.min_response_time || 0,
          maxResponseTime: stats.max_response_time || 0,
          totalRequestSize: stats.total_request_size || 0,
          totalResponseSize: stats.total_response_size || 0,
          errorCount: stats.error_count || 0,
          successRate: stats.total_requests > 0 
            ? ((stats.total_requests - stats.error_count) / stats.total_requests * 100).toFixed(2)
            : 100
        }
      });
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to get analytics'
      });
    }
  });

  /**
   * Generate batch keys
   * POST /api/v1/keys/batch
   */
  router.post('/keys/batch', auth.validateApiKey, async (req, res) => {
    try {
      const { count = 5, namePrefix = 'Batch Key', permissions = [], rateLimit = 1000, expiresIn } = req.body;

      if (count > 50) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Cannot generate more than 50 keys at once'
        });
      }

      const userId = req.apiKey.userId;
      const createdKeys = [];

      // Calculate expiration
      let expiresAt = null;
      if (expiresIn) {
        const expirationMs = KeyGenerator.parseExpiration(expiresIn) * 1000;
        expiresAt = new Date(Date.now() + expirationMs).toISOString();
      }

      for (let i = 0; i < count; i++) {
        const keyData = KeyGenerator.generateApiKey();
        const hashedKey = KeyGenerator.hashApiKey(keyData.key);

        const createdKey = await database.createKey({
          keyId: keyData.keyId,
          name: `${namePrefix} ${i + 1}`,
          apiKeyHash: hashedKey,
          prefix: keyData.prefix,
          userId,
          permissions,
          rateLimit,
          expiresAt
        });

        createdKeys.push({
          id: createdKey.id,
          keyId: createdKey.key_id,
          name: createdKey.name,
          apiKey: keyData.key, // Only shown on creation
          prefix: createdKey.prefix,
          permissions: createdKey.permissions,
          rateLimit: createdKey.rate_limit,
          createdAt: createdKey.created_at,
          expiresAt: createdKey.expires_at
        });
      }

      res.status(201).json({
        success: true,
        data: {
          keys: createdKeys,
          count: createdKeys.length
        }
      });
    } catch (error) {
      console.error('Batch key creation error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to create batch API keys'
      });
    }
  });

  return router;
}
