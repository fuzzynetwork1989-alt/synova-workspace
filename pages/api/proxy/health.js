// Health check proxy endpoint with caching and rate limiting
import { CacheManager } from '../../../lib/redis.js';
import { apiRateLimit } from '../../../lib/rateLimit.js';

const API_URL = 'https://synova-core-api-production-65d1.up.railway.app';
const CACHE_KEY = 'api:health';
const CACHE_TTL = 30; // 30 seconds

export default async function handler(req, res) {
  // Apply rate limiting
  await apiRateLimit(req, res, async () => {
    try {
      // Try to get cached response first
      const cached = await CacheManager.getCachedApiResponse(CACHE_KEY);
      if (cached) {
        console.log(' Health proxy: cache hit');
        return res.status(200).json(cached);
      }

      console.log(' Health proxy: cache miss, fetching from API');
      const response = await fetch(`${API_URL}/health`);
      const data = await response.json();
      
      // Cache the response
      await CacheManager.cacheApiResponse(CACHE_KEY, data, CACHE_TTL);
      
      console.log(' Health proxy success:', data);
      return res.status(200).json(data);
    } catch (error) {
      console.error(' Health proxy error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
}
