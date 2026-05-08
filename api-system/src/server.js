import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { Database } from './database/database.js';
import { createAPIRoutes } from './routes/api.js';
import { AuthMiddleware } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

/**
 * Main API Server
 * Provides OpenAI/Anthropic-like API key management system
 */
class APIServer {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.database = new Database();
    this.auth = new AuthMiddleware(this.database);
  }

  async initialize() {
    try {
      // Initialize database
      await this.database.initialize();

      // Setup middleware
      this.setupMiddleware();

      // Setup routes
      this.setupRoutes();

      // Setup error handling
      this.setupErrorHandling();

      console.log('API Server initialized successfully');
    } catch (error) {
      console.error('Failed to initialize API Server:', error);
      throw error;
    }
  }

  setupMiddleware() {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: false, // Allow for API usage
    }));

    // CORS middleware
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || '*',
      credentials: true
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // Limit each IP to 1000 requests per windowMs
      message: {
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.'
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use(limiter);

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging middleware
    this.app.use((req, res, next) => {
      const start = Date.now();
      
      res.on('finish', async () => {
        const duration = Date.now() - start;
        
        // Log usage if API key is present
        if (req.apiKey) {
          try {
            await this.database.logUsage({
              keyId: req.apiKey.keyId,
              endpoint: req.path,
              method: req.method,
              statusCode: res.statusCode,
              responseTimeMs: duration,
              requestSize: req.headers['content-length'] || 0,
              responseSize: res.get('content-length') || 0,
              ipAddress: req.ip,
              userAgent: req.headers['user-agent']
            });
          } catch (error) {
            console.error('Failed to log usage:', error);
          }
        }

        console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
      });

      next();
    });
  }

  setupRoutes() {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        uptime: process.uptime()
      });
    });

    // API info endpoint
    this.app.get('/', (req, res) => {
      res.json({
        name: 'Free API Key Management System',
        version: '1.0.0',
        description: 'Auto-generate API keys like OpenAI/Anthropic using free resources',
        endpoints: {
          health: '/health',
          api: '/api/v1',
          keys: '/api/v1/keys',
          auth: '/api/v1/auth',
          analytics: '/api/v1/analytics'
        },
        documentation: 'https://github.com/your-repo/free-api-system'
      });
    });

    // API routes
    this.app.use('/api/v1', createAPIRoutes(this.database));

    // Serve static files (for admin dashboard)
    this.app.use(express.static(path.join(__dirname, '../public')));

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Not found',
        message: 'Endpoint not found',
        availableEndpoints: [
          'GET /',
          'GET /health',
          'POST /api/v1/keys',
          'GET /api/v1/keys',
          'GET /api/v1/keys/:keyId',
          'PATCH /api/v1/keys/:keyId',
          'DELETE /api/v1/keys/:keyId',
          'POST /api/v1/auth/validate',
          'GET /api/v1/analytics',
          'POST /api/v1/keys/batch'
        ]
      });
    });
  }

  setupErrorHandling() {
    // Global error handler
    this.app.use((error, req, res, next) => {
      console.error('Unhandled error:', error);

      // Don't expose error details in production
      const isDevelopment = process.env.NODE_ENV !== 'production';

      res.status(error.status || 500).json({
        error: error.name || 'Internal server error',
        message: error.message || 'An unexpected error occurred',
        ...(isDevelopment && { stack: error.stack })
      });
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      process.exit(1);
    });
  }

  async start() {
    try {
      await this.initialize();

      this.app.listen(this.port, () => {
        console.log(`🚀 API Server running on port ${this.port}`);
        console.log(`📊 Health check: http://localhost:${this.port}/health`);
        console.log(`🔑 API endpoints: http://localhost:${this.port}/api/v1`);
        console.log(`📖 Documentation: http://localhost:${this.port}/`);
        console.log(`\n🎯 Your own API key system is ready!`);
        console.log(`\n📝 Quick start:`);
        console.log(`1. Generate your first API key:`);
        console.log(`   curl -X POST http://localhost:${this.port}/api/v1/keys \\`);
        console.log(`     -H "Content-Type: application/json" \\`);
        console.log(`     -d '{"name": "My First Key"}'`);
        console.log(`\n2. Use the key to authenticate:`);
        console.log(`   curl -X GET http://localhost:${this.port}/api/v1/auth/validate \\`);
        console.log(`     -H "Authorization: Bearer YOUR_API_KEY"`);
      });
    } catch (error) {
      console.error('Failed to start API Server:', error);
      process.exit(1);
    }
  }

  async stop() {
    console.log('Shutting down API Server...');
    await this.database.close();
    process.exit(0);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received');
  process.exit(0);
});

// Start the server
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new APIServer();
  server.start().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

export default APIServer;
