// Configuration management API endpoint
import { configManager } from '../../lib/configManager.js';

export default async function handler(req, res) {
  try {
    const method = req.method;
    
    switch (method) {
      case 'GET':
        // Get current configuration
        const summary = configManager.getSummary();
        const validation = configManager.validate();
        
        res.status(200).json({
          config: summary,
          validation,
          timestamp: new Date().toISOString(),
        });
        break;
        
      case 'POST':
        // Update configuration (admin only)
        // In production, this should be protected by authentication
        const updates = req.body;
        
        // Validate updates
        const allowedUpdates = [
          'ENABLE_CACHE',
          'ENABLE_RATE_LIMITING',
          'ENABLE_CDN',
          'RATE_LIMIT_GLOBAL',
          'RATE_LIMIT_GENERATION',
          'RATE_LIMIT_UPLOAD',
          'CACHE_TTL_API',
          'CACHE_TTL_GENERATION',
          'CACHE_TTL_UPLOAD',
          'LOG_LEVEL',
        ];
        
        const filteredUpdates = {};
        for (const [key, value] of Object.entries(updates)) {
          if (allowedUpdates.includes(key)) {
            filteredUpdates[key] = value;
          }
        }
        
        const updatedConfig = configManager.updateConfig(filteredUpdates);
        
        res.status(200).json({
          message: 'Configuration updated successfully',
          config: updatedConfig.getSummary(),
          updates: filteredUpdates,
          timestamp: new Date().toISOString(),
        });
        break;
        
      case 'DELETE':
        // Reset configuration to defaults (admin only)
        const defaults = {
          ENABLE_CACHE: configManager.isProduction(),
          ENABLE_RATE_LIMITING: configManager.isProduction(),
          ENABLE_CDN: configManager.isProduction(),
        };
        
        const resetConfig = configManager.updateConfig(defaults);
        
        res.status(200).json({
          message: 'Configuration reset to defaults',
          config: resetConfig.getSummary(),
          timestamp: new Date().toISOString(),
        });
        break;
        
      default:
        res.setHeader('Allow', 'GET, POST, DELETE');
        res.status(405).json({ error: 'Method not allowed' });
        break;
    }
  } catch (error) {
    console.error('Config API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
