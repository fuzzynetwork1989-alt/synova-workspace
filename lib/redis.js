// Redis caching utility
import Redis from 'ioredis';

let redis = null;

// Initialize Redis connection
export async function initRedis() {
  if (redis) return redis;

  try {
    redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    // Test connection
    await redis.ping();
    console.log('Redis connected successfully');
    
    return redis;
  } catch (error) {
    console.error('Redis connection failed:', error);
    return null;
  }
}

// Cache helper functions
export class CacheManager {
  static async get(key) {
    try {
      const client = await initRedis();
      if (!client) return null;
      
      const value = await client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  static async set(key, value, ttl = 3600) {
    try {
      const client = await initRedis();
      if (!client) return false;
      
      await client.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  static async del(key) {
    try {
      const client = await initRedis();
      if (!client) return false;
      
      await client.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  static async exists(key) {
    try {
      const client = await initRedis();
      if (!client) return false;
      
      const result = await client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  // Cache API responses
  static async cacheApiResponse(endpoint, data, ttl = 300) {
    const key = `api:${endpoint}`;
    return await this.set(key, data, ttl);
  }

  static async getCachedApiResponse(endpoint) {
    const key = `api:${endpoint}`;
    return await this.get(key);
  }

  // Cache user sessions
  static async cacheUserSession(userId, sessionData, ttl = 86400) {
    const key = `session:${userId}`;
    return await this.set(key, sessionData, ttl);
  }

  static async getUserSession(userId) {
    const key = `session:${userId}`;
    return await this.get(key);
  }

  // Cache generation results
  static async cacheGeneration(promptHash, result, ttl = 3600) {
    const key = `generation:${promptHash}`;
    return await this.set(key, result, ttl);
  }

  static async getCachedGeneration(promptHash) {
    const key = `generation:${promptHash}`;
    return await this.get(key);
  }

  // Rate limiting
  static async incrementRateLimit(key, limit, window) {
    try {
      const client = await initRedis();
      if (!client) return { allowed: true, remaining: limit };

      const current = await client.incr(key);
      
      if (current === 1) {
        await client.expire(key, window);
      }

      const allowed = current <= limit;
      const remaining = Math.max(0, limit - current);

      return { allowed, remaining, current };
    } catch (error) {
      console.error('Rate limit error:', error);
      return { allowed: true, remaining: limit };
    }
  }

  // Clear cache patterns
  static async clearPattern(pattern) {
    try {
      const client = await initRedis();
      if (!client) return false;

      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(...keys);
      }
      
      return keys.length;
    } catch (error) {
      console.error('Cache clear pattern error:', error);
      return 0;
    }
  }

  // Health check
  static async healthCheck() {
    try {
      const client = await initRedis();
      if (!client) return { status: 'disconnected' };

      await client.ping();
      const info = await client.info('memory');
      
      return {
        status: 'connected',
        memory: info
      };
    } catch (error) {
      return { status: 'error', error: error.message };
    }
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  if (redis) {
    await redis.quit();
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  if (redis) {
    await redis.quit();
  }
  process.exit(0);
});
