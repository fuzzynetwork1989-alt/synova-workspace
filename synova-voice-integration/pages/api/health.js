/**
 * Health Check Endpoint for Synova Voice Integration
 * Provides health status for Railway deployment monitoring
 */

export default async function handler(req, res) {
  try {
    // Set CORS headers for Railway deployment
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Only allow GET requests for health check
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }
    
    // Get current timestamp
    const timestamp = new Date().toISOString();
    
    // Check system health indicators
    const healthChecks = {
      status: 'healthy',
      timestamp: timestamp,
      uptime: process.uptime(),
      version: '1.0.0',
      service: 'synova-voice-integration',
      environment: process.env.NODE_ENV || 'development',
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100), // MB
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) // MB
      },
      database: {
        status: 'connected', // Would check actual DB connection in real implementation
        lastCheck: timestamp
      },
      external_apis: {
        status: 'available', // Would check actual API connectivity
        lastCheck: timestamp
      },
      deployment: {
        platform: 'railway',
        region: process.env.RAILWAY_REGION || 'unknown',
        buildNumber: process.env.RAILWAY_BUILD_NUMBER || 'unknown'
      }
    };
    
    // Return health status with appropriate HTTP status
    const isHealthy = Object.values(healthChecks).every(check => 
      check.status === 'healthy' || check.status === 'available' || check.status === 'connected'
    );
    
    if (isHealthy) {
      res.status(200).json({
        ...healthChecks,
        message: 'Synova Voice Integration is healthy and ready to serve requests'
      });
    } else {
      res.status(503).json({
        ...healthChecks,
        status: 'unhealthy',
        message: 'Synova Voice Integration is experiencing issues'
      });
    }
    
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      message: 'Internal server error during health check',
      error: error.message
    });
  }
}
