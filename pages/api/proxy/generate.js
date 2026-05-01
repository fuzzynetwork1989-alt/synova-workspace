// AI generation proxy endpoint with caching and rate limiting
import { CacheManager } from '../../../lib/redis.js';
import { generationRateLimit } from '../../../lib/rateLimit.js';
import crypto from 'crypto';

const API_URL = 'https://synova-core-api-production-65d1.up.railway.app';

// Generate hash for prompt caching
function generatePromptHash(prompt) {
  return crypto.createHash('sha256').update(prompt).toString('hex').substring(0, 16);
}

export default async function handler(req, res) {
  // Apply rate limiting
  await generationRateLimit(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { prompt } = req.body;
    
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    try {
      // Check cache for identical prompts
      const promptHash = generatePromptHash(prompt);
      const cached = await CacheManager.getCachedGeneration(promptHash);
      
      if (cached) {
        console.log(' Generate proxy: cache hit for prompt hash:', promptHash);
        return res.status(200).json({
          ...cached,
          cached: true,
          timestamp: new Date().toISOString()
        });
      }

      console.log(' Generate proxy: cache miss, generating new response');
      const response = await fetch(`${API_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Cache the generation result
      await CacheManager.cacheGeneration(promptHash, data, 3600); // Cache for 1 hour
      
      console.log(' Generate proxy success:', data);
      return res.status(200).json({
        ...data,
        cached: false,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error(' Generate proxy error:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: error.message 
      });
    }
  });
}
