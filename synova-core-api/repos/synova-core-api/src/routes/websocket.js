// 🌐 SYNTHOVA AI - WEBSOCKET ROUTE
// Real-time updates and live communication

const express = require('express');
const router = express.Router();
const WebSocketService = require('../services/websocketService');

// Initialize WebSocket service
const wsService = new WebSocketService();

// WebSocket connection endpoint
router.get('/ws', (req, res) => {
  res.json({
    success: true,
    message: 'WebSocket server is running',
    endpoint: 'ws://localhost:8001/ws',
    status: 'active'
  });
});

// Broadcast system metrics
router.post('/api/v1/broadcast-metrics', (req, res) => {
  try {
    const { metrics } = req.body;
    
    // Broadcast to all connected clients
    wsService.broadcastToAll({
      type: 'metrics_update',
      data: metrics,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Metrics broadcasted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Broadcast failed',
      message: error.message
    });
  }
});

// Send notification to specific user
router.post('/api/v1/send-notification', (req, res) => {
  try {
    const { userId, message, type = 'info' } = req.body;
    
    // Send to specific user room
    wsService.broadcastToRoom(`user_${userId}`, {
      type: 'notification',
      data: {
        userId,
        message,
        type,
        timestamp: new Date().toISOString()
      }
    });

    res.json({
      success: true,
      message: 'Notification sent successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Notification failed',
      message: error.message
    });
  }
});

// Get WebSocket statistics
router.get('/api/v1/websocket-stats', (req, res) => {
  try {
    const stats = wsService.getStatistics();
    
    res.json({
      success: true,
      stats: stats,
      message: 'WebSocket statistics retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get WebSocket stats',
      message: error.message
    });
  }
});

// Initialize WebSocket server (will be called from main.js)
router.initializeWebSocket = (server) => {
  wsService.initialize(server);
  console.log('✅ WebSocket routes initialized');
};

module.exports = router;
