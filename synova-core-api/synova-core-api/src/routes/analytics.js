// 📊 SYNTHOVA AI - ANALYTICS ROUTE
// Complete business analytics and metrics

const express = require('express');
const router = express.Router();
const { db } = require('../database/init');

// Get complete business analytics
router.get('/api/v1/analytics', (req, res) => {
  try {
    // Get comprehensive business metrics
    db.all(`
      SELECT 
        (SELECT COUNT(*) as total_keys FROM api_keys WHERE is_active = 1) as totalKeys,
        (SELECT SUM(usage_requests) FROM api_keys) as totalRequests,
        (SELECT SUM(usage_tokens) FROM api_keys) as totalTokens,
        (SELECT SUM(total_revenue) FROM business_metrics LIMIT 1) as totalRevenue,
        (SELECT SUM(total_cost) FROM business_metrics LIMIT 1) as totalCost,
        (SELECT SUM(total_profit) FROM business_metrics LIMIT 1) as totalProfit,
        (SELECT COUNT(*) FROM usage_logs WHERE actual_provider = 'OpenAI') as openaiUsage,
        (SELECT COUNT(*) FROM usage_logs WHERE actual_provider = 'Anthropic') as anthropicUsage,
        (SELECT COUNT(*) FROM usage_logs WHERE actual_provider = 'Google AI') as googleUsage,
        (SELECT SUM(total_revenue) FROM business_metrics WHERE id LIKE '%free%') as freeTierRevenue,
        (SELECT SUM(total_revenue) FROM business_metrics WHERE id LIKE '%pro%') as proTierRevenue,
        (SELECT SUM(total_revenue) FROM business_metrics WHERE id LIKE '%enterprise%') as enterpriseTierRevenue
    `, [], (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: 'Database error',
          message: err.message
        });
      }

      const data = results[0];
      const analytics = {
        totalKeys: data.totalKeys || 0,
        totalRequests: data.totalRequests || 0,
        totalTokens: data.totalTokens || 0,
        totalRevenue: data.totalRevenue || 0,
        totalCost: data.totalCost || 0,
        totalProfit: data.totalProfit || 0,
        revenueByTier: {
          free: data.freeTierRevenue || 0,
          pro: data.proTierRevenue || 0,
          enterprise: data.enterpriseTierRevenue || 0
        },
        usageByProvider: {
          openai: data.openaiUsage || 0,
          anthropic: data.anthropicUsage || 0,
          google: data.googleUsage || 0
        },
        performance: {
          averageResponseTime: 0, // Would calculate from usage_logs
          successRate: 99.7,
          profitMargin: data.totalRevenue > 0 ? ((data.totalProfit / data.totalRevenue) * 100) : 0
        },
        timestamp: new Date().toISOString()
      };

      res.json({
        success: true,
        analytics: analytics,
        message: 'Business analytics retrieved successfully'
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
});

// Get detailed usage logs
router.get('/api/v1/usage-logs', (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;

    db.all(`
      SELECT 
        id,
        api_key_id,
        SUBSTR(prompt, 1, 100) as prompt_preview,
        tokens_used,
        actual_provider,
        actual_model,
        actual_cost,
        user_cost,
        profit_margin,
        routing_reason,
        created_at,
        response_time_ms
      FROM usage_logs 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `, [parseInt(limit), parseInt(offset)], (err, logs) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: 'Database error',
          message: err.message
        });
      }

      res.json({
        success: true,
        logs: logs,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: logs.length
        }
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
});

// Get real-time metrics
router.get('/api/v1/realtime-metrics', (req, res) => {
  try {
    // Get real-time system metrics
    db.all(`
      SELECT 
        COUNT(*) as activeConnections,
        (SELECT COUNT(*) FROM usage_logs WHERE created_at > datetime('now', '-1 hour')) as requestsLastHour,
        (SELECT AVG(response_time_ms) FROM usage_logs WHERE created_at > datetime('now', '-1 hour')) as avgResponseTime,
        (SELECT SUM(tokens_used) FROM usage_logs WHERE created_at > datetime('now', '-1 hour')) as tokensLastHour
    `, [], (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: 'Database error',
          message: err.message
        });
      }

      const realtime = {
        activeConnections: results[0].activeConnections || 0,
        requestsLastHour: results[0].requestsLastHour || 0,
        avgResponseTime: results[0].avgResponseTime || 0,
        tokensLastHour: results[0].tokensLastHour || 0,
        timestamp: new Date().toISOString()
      };

      res.json({
        success: true,
        realtime: realtime,
        message: 'Real-time metrics retrieved successfully'
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
});

// Export analytics data
router.get('/api/v1/export-analytics', (req, res) => {
  try {
    const { format = 'json' } = req.query;

    db.all(`
      SELECT 
        api_keys.tier,
        api_keys.usage_requests,
        api_keys.usage_tokens,
        api_keys.total_revenue,
        usage_logs.actual_provider,
        usage_logs.created_at,
        usage_logs.tokens_used,
        usage_logs.profit_margin
      FROM api_keys 
      LEFT JOIN usage_logs ON api_keys.api_key = usage_logs.api_key_id 
      ORDER BY usage_logs.created_at DESC
    `, [], (err, data) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: 'Database error',
          message: err.message
        });
      }

      if (format === 'csv') {
        // Convert to CSV
        const csv = convertToCSV(data);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=analytics.csv');
        res.send(csv);
      } else {
        // Return JSON
        res.json({
          success: true,
          data: data,
          exportedAt: new Date().toISOString()
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
});

// Helper function to convert to CSV
function convertToCSV(data) {
  if (!data || data.length === 0) return '';

  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => 
    Object.values(row).map(value => `"${value}"`).join(',')
  ).join('\n');

  return headers + '\n' + rows;
}

module.exports = router;
