// 🌐 SYNOVA AI - WEBSOCKET SERVICE
// Real-time updates for business metrics and AI responses

const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

class WebSocketService {
  constructor() {
    this.wss = null;
    this.clients = new Map(); // Map of client_id -> client info
    this.rooms = new Map(); // Map of room_name -> Set of client_ids
    this.metricsInterval = null;
  }

  initialize(server) {
    this.wss = new WebSocket.Server({ 
      server,
      path: '/ws'
    });

    this.wss.on('connection', (ws, request) => {
      this.handleConnection(ws, request);
    });

    // Start metrics broadcasting
    this.startMetricsBroadcast();
    
    console.log('🌐 WebSocket server initialized');
  }

  handleConnection(ws, request) {
    const clientId = this.generateClientId();
    const clientInfo = {
      id: clientId,
      ws: ws,
      connected: new Date(),
      authenticated: false,
      userId: null,
      apiKey: null,
      tier: null,
      rooms: new Set()
    };

    this.clients.set(clientId, clientInfo);

    ws.on('message', (message) => {
      this.handleMessage(clientId, message);
    });

    ws.on('close', () => {
      this.handleDisconnection(clientId);
    });

    ws.on('error', (error) => {
      console.error(`WebSocket error for client ${clientId}:`, error);
    });

    // Send welcome message
    this.sendToClient(clientId, {
      type: 'welcome',
      clientId: clientId,
      message: 'Connected to Synova AI WebSocket',
      timestamp: new Date().toISOString()
    });
  }

  handleMessage(clientId, message) {
    const clientInfo = this.clients.get(clientId);
    if (!clientInfo) return;

    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'authenticate':
          this.handleAuthentication(clientId, data);
          break;
        case 'subscribe':
          this.handleSubscription(clientId, data);
          break;
        case 'unsubscribe':
          this.handleUnsubscription(clientId, data);
          break;
        case 'ping':
          this.sendToClient(clientId, { type: 'pong', timestamp: new Date().toISOString() });
          break;
        default:
          this.sendToClient(clientId, {
            type: 'error',
            message: `Unknown message type: ${data.type}`,
            timestamp: new Date().toISOString()
          });
      }
    } catch (error) {
      this.sendToClient(clientId, {
        type: 'error',
        message: 'Invalid JSON message',
        timestamp: new Date().toISOString()
      });
    }
  }

  handleAuthentication(clientId, data) {
    const clientInfo = this.clients.get(clientId);
    if (!clientInfo) return;

    try {
      // Verify API key
      const { apiKey } = data;
      if (!apiKey) {
        this.sendToClient(clientId, {
          type: 'auth_error',
          message: 'API key required',
          timestamp: new Date().toISOString()
        });
        return;
      }

      // Validate API key (this would integrate with your API key service)
      // For now, we'll do basic validation
      if (apiKey.startsWith('sk-synova-')) {
        clientInfo.authenticated = true;
        clientInfo.apiKey = apiKey;
        
        // Extract tier from API key
        const parts = apiKey.split('-');
        clientInfo.tier = parts[1] || 'free';
        
        this.sendToClient(clientId, {
          type: 'authenticated',
          tier: clientInfo.tier,
          message: 'Authentication successful',
          timestamp: new Date().toISOString()
        });

        // Auto-subscribe to tier-specific rooms
        this.subscribeToRoom(clientId, `tier_${clientInfo.tier}`);
        this.subscribeToRoom(clientId, 'global_metrics');
      } else {
        this.sendToClient(clientId, {
          type: 'auth_error',
          message: 'Invalid API key format',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      this.sendToClient(clientId, {
        type: 'auth_error',
        message: 'Authentication failed',
        timestamp: new Date().toISOString()
      });
    }
  }

  handleSubscription(clientId, data) {
    const clientInfo = this.clients.get(clientId);
    if (!clientInfo || !clientInfo.authenticated) {
      this.sendToClient(clientId, {
        type: 'error',
        message: 'Authentication required for subscriptions',
        timestamp: new Date().toISOString()
      });
      return;
    }

    const { room } = data;
    if (!room) {
      this.sendToClient(clientId, {
        type: 'error',
        message: 'Room name required',
        timestamp: new Date().toISOString()
      });
      return;
    }

    this.subscribeToRoom(clientId, room);
  }

  handleUnsubscription(clientId, data) {
    const clientInfo = this.clients.get(clientId);
    if (!clientInfo) return;

    const { room } = data;
    if (!room) return;

    this.unsubscribeFromRoom(clientId, room);
  }

  subscribeToRoom(clientId, roomName) {
    const clientInfo = this.clients.get(clientId);
    if (!clientInfo) return;

    if (!this.rooms.has(roomName)) {
      this.rooms.set(roomName, new Set());
    }

    this.rooms.get(roomName).add(clientId);
    clientInfo.rooms.add(roomName);

    this.sendToClient(clientId, {
      type: 'subscribed',
      room: roomName,
      message: `Subscribed to room: ${roomName}`,
      timestamp: new Date().toISOString()
    });
  }

  unsubscribeFromRoom(clientId, roomName) {
    const clientInfo = this.clients.get(clientId);
    if (!clientInfo) return;

    const room = this.rooms.get(roomName);
    if (room) {
      room.delete(clientId);
      if (room.size === 0) {
        this.rooms.delete(roomName);
      }
    }

    clientInfo.rooms.delete(roomName);

    this.sendToClient(clientId, {
      type: 'unsubscribed',
      room: roomName,
      message: `Unsubscribed from room: ${roomName}`,
      timestamp: new Date().toISOString()
    });
  }

  handleDisconnection(clientId) {
    const clientInfo = this.clients.get(clientId);
    if (!clientInfo) return;

    // Remove from all rooms
    clientInfo.rooms.forEach(roomName => {
      const room = this.rooms.get(roomName);
      if (room) {
        room.delete(clientId);
        if (room.size === 0) {
          this.rooms.delete(roomName);
        }
      }
    });

    // Remove client
    this.clients.delete(clientId);
    
    console.log(`Client ${clientId} disconnected`);
  }

  sendToClient(clientId, data) {
    const clientInfo = this.clients.get(clientId);
    if (!clientInfo || clientInfo.ws.readyState !== WebSocket.OPEN) {
      return false;
    }

    try {
      clientInfo.ws.send(JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Failed to send to client ${clientId}:`, error);
      return false;
    }
  }

  broadcastToRoom(roomName, data) {
    const room = this.rooms.get(roomName);
    if (!room) return 0;

    let sentCount = 0;
    room.forEach(clientId => {
      if (this.sendToClient(clientId, data)) {
        sentCount++;
      }
    });

    return sentCount;
  }

  broadcastToAll(data) {
    let sentCount = 0;
    this.clients.forEach((clientInfo, clientId) => {
      if (this.sendToClient(clientId, data)) {
        sentCount++;
      }
    });

    return sentCount;
  }

  // Business metrics broadcasting
  startMetricsBroadcast() {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }

    this.metricsInterval = setInterval(async () => {
      await this.broadcastMetrics();
    }, 5000); // Broadcast every 5 seconds
  }

  async broadcastMetrics() {
    try {
      // Get business metrics from your API key service
      // This would integrate with your existing metrics system
      const mockMetrics = {
        totalRevenue: 1250.50,
        totalRequests: 342,
        totalProfit: 625.25,
        activeKeys: 15,
        providersStatus: {
          openai: 'active',
          anthropic: 'active',
          google: 'active'
        },
        performance: {
          avgResponseTime: 1.2,
          successRate: 99.7,
          profitMargin: 48.5
        },
        timestamp: new Date().toISOString()
      };

      this.broadcastToRoom('global_metrics', {
        type: 'metrics_update',
        data: mockMetrics,
        timestamp: new Date().toISOString()
      });

      // Broadcast tier-specific metrics
      this.broadcastToRoom('tier_pro', {
        type: 'tier_metrics',
        tier: 'pro',
        data: {
          activeUsers: 8,
          avgUsage: 1250,
          revenue: 232.00,
          timestamp: new Date().toISOString()
        }
      });

      this.broadcastToRoom('tier_enterprise', {
        type: 'tier_metrics',
        tier: 'enterprise',
        data: {
          activeUsers: 3,
          avgUsage: 5000,
          revenue: 597.00,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Error broadcasting metrics:', error);
    }
  }

  // AI response streaming
  async streamAIResponse(clientId, responseId, prompt, apiKey) {
    const clientInfo = this.clients.get(clientId);
    if (!clientInfo || !clientInfo.authenticated) {
      return false;
    }

    // Send start of response
    this.sendToClient(clientId, {
      type: 'ai_response_start',
      responseId: responseId,
      prompt: prompt.substring(0, 100) + '...',
      timestamp: new Date().toISOString()
    });

    // Simulate streaming response
    const mockResponse = `This is a streaming AI response from Synova AI. Our revolutionary API key system with smart routing is processing your request in real-time. The response demonstrates how our business model creates value through intelligent AI provider selection and cost optimization.`;
    
    const words = mockResponse.split(' ');
    let currentText = '';

    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? ' ' : '') + words[i];
      
      this.sendToClient(clientId, {
        type: 'ai_response_chunk',
        responseId: responseId,
        chunk: words[i] + ' ',
        currentText: currentText,
        progress: (i + 1) / words.length,
        timestamp: new Date().toISOString()
      });

      // Small delay to simulate streaming
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Send end of response
    this.sendToClient(clientId, {
      type: 'ai_response_end',
      responseId: responseId,
      fullResponse: currentText,
      tokensUsed: Math.ceil(currentText.length / 4),
      cost: 0.025,
      timestamp: new Date().toISOString()
    });

    return true;
  }

  // Usage notifications
  broadcastUsageUpdate(apiKey, usageData) {
    // Find all clients with this API key
    const matchingClients = [];
    this.clients.forEach((clientInfo, clientId) => {
      if (clientInfo.apiKey === apiKey) {
        matchingClients.push(clientId);
      }
    });

    const notification = {
      type: 'usage_update',
      apiKey: apiKey,
      usage: usageData,
      timestamp: new Date().toISOString()
    };

    matchingClients.forEach(clientId => {
      this.sendToClient(clientId, notification);
    });
  }

  // System notifications
  broadcastSystemNotification(level, title, message) {
    const notification = {
      type: 'system_notification',
      level: level, // info, warning, error
      title: title,
      message: message,
      timestamp: new Date().toISOString()
    };

    this.broadcastToAll(notification);
  }

  // Get statistics
  getStatistics() {
    return {
      totalClients: this.clients.size,
      totalRooms: this.rooms.size,
      authenticatedClients: Array.from(this.clients.values()).filter(c => c.authenticated).length,
      roomDetails: Array.from(this.rooms.entries()).map(([name, clients]) => ({
        name: name,
        clients: clients.size
      })),
      uptime: process.uptime()
    };
  }

  generateClientId() {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Graceful shutdown
  shutdown() {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }

    this.broadcastSystemNotification('info', 'Server Shutdown', 'WebSocket server is shutting down');

    // Close all connections
    this.clients.forEach((clientInfo, clientId) => {
      try {
        clientInfo.ws.close();
      } catch (error) {
        console.error(`Error closing client ${clientId}:`, error);
      }
    });

    if (this.wss) {
      this.wss.close();
    }

    console.log('🌐 WebSocket server shut down');
  }
}

module.exports = WebSocketService;
