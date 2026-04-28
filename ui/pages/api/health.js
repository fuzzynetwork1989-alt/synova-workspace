export default function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      allowedMethods: ['GET']
    })
  }

  try {
    // Check database connection (if applicable)
    const dbStatus = 'connected' // This would be dynamic in a real app
    
    // Check critical services
    const services = {
      api: 'healthy',
      database: dbStatus,
      auth: 'healthy',
      storage: 'healthy'
    }

    // Calculate overall health
    const allHealthy = Object.values(services).every(status => status === 'healthy')
    const healthStatus = allHealthy ? 'healthy' : 'degraded'

    const healthData = {
      status: healthStatus,
      timestamp: new Date().toISOString(),
      service: 'synova-ui',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services,
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        percentage: Math.round((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100)
      }
    }

    // Return appropriate status code
    const statusCode = healthStatus === 'healthy' ? 200 : 503
    return res.status(statusCode).json(healthData)

  } catch (error) {
    console.error('Health check failed:', error)
    return res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'synova-ui',
      error: error.message
    })
  }
}
