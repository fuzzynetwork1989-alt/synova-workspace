/**
 * Synova AI Monitoring Server v4.1
 * Express server for monitoring service with health endpoints
 */

const express = require('express');
const cors = require('cors');
const SynovaMonitoring = require('./monitoring.js');

const app = express();
const PORT = process.env.PORT || 3002;

// Initialize monitoring
const monitoring = new SynovaMonitoring({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'production',
  release: '4.1.0'
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    service: 'Synova Monitoring v4.1',
    status: 'active',
    endpoints: {
      '/health': 'GET - Health check endpoint',
      '/metrics': 'GET - Prometheus metrics',
      '/status': 'GET - Detailed monitoring status'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Synova Monitoring v4.1',
    timestamp: new Date().toISOString(),
    monitoring: monitoring.isInitialized ? 'active' : 'inactive'
  });
});

app.get('/metrics', async (req, res) => {
  try {
    // This would return Prometheus metrics
    res.set('Content-Type', 'text/plain');
    res.send('# HELP synova_monitoring_status Status of Synova monitoring\n# TYPE synova_monitoring_status gauge\nsynova_monitoring_status 1\n');
  } catch (error) {
    res.status(500).json({ error: 'Failed to get metrics' });
  }
});

app.get('/status', (req, res) => {
  res.json({
    service: 'Synova Monitoring v4.1',
    status: 'active',
    initialized: monitoring.isInitialized,
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString()
  });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\ud83d\udcca Synova Monitoring v4.1 running on port ${PORT}`);
    console.log('\ud83d\udc9f Health endpoint: http://localhost:' + PORT + '/health');
    console.log('\ud83d\udcc8 Metrics endpoint: http://localhost:' + PORT + '/metrics');
  });
}

module.exports = app;
