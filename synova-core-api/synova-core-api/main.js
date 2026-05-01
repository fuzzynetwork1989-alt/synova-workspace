// 🧠 SYNTHOVA AI - PURE KNOWLEDGE MAIN APPLICATION (Node.js)
// 🔑 Your Own API Key System - Like Perplexity, Jasper, Copy.ai

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// Import routes
const synovaAIRouter = require("./src/routes/synovaAI");
const pureKnowledgeRouter = require("./src/routes/pureKnowledge");
const analyticsRouter = require("./src/routes/analytics");
const websocketRouter = require("./src/routes/websocket");

// Initialize database
const { db } = require("./src/database/init");

// Create Express app
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:3000",
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Include routes
app.use("/", synovaAIRouter);
app.use("/", pureKnowledgeRouter);
app.use("/", analyticsRouter);

// Initialize WebSocket
websocketRouter.initializeWebSocket(app);

// Root endpoint
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Synova AI - Pure Knowledge API</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; color: #8B5CF6; }
            .status { background: #f0f0f0; padding: 10px; border-radius: 5px; margin: 10px 0; }
            .link { color: #8B5CF6; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🧠 Synova AI</h1>
            <h2>Pure Knowledge API</h2>
            <p>🔑 Your Own API Key System</p>
        </div>
        
        <div class="status">
            <h3>🚀 Server Status: Operational</h3>
            <p>✅ API Key System: Active</p>
            <p>✅ Smart AI Routing: Active</p>
            <p>✅ Pure Knowledge System: Active</p>
            <p>✅ Business Analytics: Active</p>
        </div>
        
        <div class="status">
            <h3>📚 API Endpoints</h3>
            <p><a href="/api/v1/status" class="link">🔍 System Status</a></p>
            <p><a href="/api/v1/providers" class="link">🤖 Provider Status</a></p>
            <p><a href="/api/v1/analytics" class="link">📊 Business Analytics</a></p>
            <p><a href="/api/v1/generate-key" class="link">🔑 Generate API Key</a></p>
        </div>
        
        <div class="status">
            <h3>💰 Business Model</h3>
            <p>🔑 API Key Generation: Available</p>
            <p>🤖 Smart AI Routing: Active</p>
            <p>📊 Profit Tracking: Active</p>
            <p>📈 Business Analytics: Active</p>
        </div>
        
        <div class="status">
            <h3>🧪 Test Endpoints</h3>
            <p>POST /api/v1/synova-ai (AI requests)</p>
            <p>POST /api/v1/pure-knowledge/create (Create concepts)</p>
            <p>POST /api/v1/pure-knowledge/optimize (Optimize systems)</p>
            <p>POST /api/v1/pure-knowledge/innovate (Innovate solutions)</p>
        </div>
    </body>
    </html>
  `);
});

// Health check endpoint
app.get("/api/v1/status", (req, res) => {
  res.json({
    success: true,
    service: "Synova AI - Pure Knowledge API",
    version: "1.0.0",
    status: "operational",
    timestamp: new Date().toISOString(),
    features: {
      apiKeySystem: true,
      smartRouting: true,
      pureKnowledge: true,
      businessAnalytics: true,
      databasePersistence: true,
    },
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Not found",
    message: `Endpoint ${req.method} ${req.path} not found`,
  });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received, shutting down gracefully");
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err);
    } else {
      console.log("✅ Database connection closed");
    }
  });
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 SIGINT received, shutting down gracefully");
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err);
    } else {
      console.log("✅ Database connection closed");
    }
  });
  process.exit(0);
});

// Start server
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log("🚀 Starting Synova Pure Knowledge AI Server");
  console.log("🔑 Your Own API Key System - Like Perplexity, Jasper, Copy.ai");
  console.log("🧠 Pure Knowledge Brain + Smart AI Routing");
  console.log(
    "💰 Business Model: Users pay YOU → You use providers → You keep profit margin",
  );
  console.log("");
  console.log(`🌐 Server running on http://${HOST}:${PORT}`);
  console.log(`📚 API Documentation: http://${HOST}:${PORT}/api/v1/status`);
  console.log("");
  console.log("✅ API Key System: Active");
  console.log("✅ Smart AI Routing: Active");
  console.log("✅ Pure Knowledge System: Active");
  console.log("✅ Business Analytics: Active");
});
🔍 Checking npm installation...
🔍 Checking API server file...
}); 
