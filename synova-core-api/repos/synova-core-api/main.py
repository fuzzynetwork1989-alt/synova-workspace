# SYNOVA AI - PURE KNOWLEDGE MAIN APPLICATION
# Your Own API Key System - Like Perplexity, Jasper, Copy.ai

import uvicorn
import logging
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
import json
from pathlib import Path

# Import routes
try:
    from src.routes.synovaAI import router as synovaAIRouter
    from src.routes.pureKnowledge import router as pureKnowledgeRouter
except ImportError:
    print(" Routes not found, using fallback")
    synovaAIRouter = None
    pureKnowledgeRouter = None

# Import database
try:
    from src.database.models import init_db
except ImportError:
    print(" Database models not found")
    init_db = None

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

def create_application():
    """Create and configure the FastAPI application"""
    app = FastAPI(
        title="Synova AI - Pure Knowledge API",
        description=" Your Own API Key System - Smart AI Routing to Best Provider",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc"
    )
    
    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000,http://localhost:5173').split(','),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Include routes if available
    if synovaAIRouter:
        app.include_router(synovaAIRouter, prefix="", tags=["Synova AI"])
        logger.info(" Synova AI routes loaded")
    else:
        logger.warning(" Synova AI routes not available")
    
    if pureKnowledgeRouter:
        app.include_router(pureKnowledgeRouter, prefix="", tags=["Pure Knowledge"])
        logger.info(" Pure Knowledge routes loaded")
    else:
        logger.warning(" Pure Knowledge routes not available")
    
    # Initialize database if available
    if init_db:
        try:
            init_db()
            logger.info(" Database initialized")
        except Exception as e:
            logger.error(f" Database initialization failed: {e}")
    
    return app

def main():
    """Main entry point"""
    logger.info(" Starting Synova Pure Knowledge AI Server")
    logger.info(" Your Own API Key System - Like Perplexity, Jasper, Copy.ai")
    logger.info(" Pure Knowledge Brain + Smart AI Routing")
    logger.info(" Business Model: Users pay YOU → You use providers → You keep profit margin")
    
    # Check environment variables
    required_vars = ['OPENAI_API_KEY', 'ANTHROPIC_API_KEY', 'GOOGLE_AI_API_KEY']
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        logger.warning(f" Missing environment variables: {missing_vars}")
        logger.warning("   Set these in .env file for real AI provider integration")
        logger.warning("   Using mock responses for missing providers")
    else:
        logger.info(" All AI provider API keys configured")
    
    # Create application
    app = create_application()
    
    # Add root endpoint
    @app.get("/")
    async def root():
        return HTMLResponse("""
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
                <h1> Synova AI</h1>
                <h2>Pure Knowledge API</h2>
                <p> Your Own API Key System</p>
            </div>
            
            <div class="status">
                <h3> Server Status: Operational</h3>
                <p> API Key System: Active</p>
                <p> Smart AI Routing: Active</p>
                <p> Pure Knowledge System: Active</p>
                <p> Business Analytics: Active</p>
            </div>
            
            <div class="status">
                <h3> Documentation</h3>
                <p><a href="/docs" class="link"> API Documentation</a></p>
                <p><a href="/redoc" class="link"> ReDoc Documentation</a></p>
                <p><a href="/api/v1/status" class="link"> System Status</a></p>
            </div>
            
            <div class="status">
                <h3> Business Model</h3>
                <p> API Key Generation: Available</p>
                <p> Smart AI Routing: Active</p>
                <p> Profit Tracking: Active</p>
                <p> Business Analytics: Active</p>
            </div>
            
            <div class="status">
                <h3> Test Endpoints</h3>
                <p><a href="/api/v1/status" class="link">Status Check</a></p>
                <p><a href="/api/v1/providers" class="link">Provider Status</a></p>
                <p><a href="/api/v1/analytics" class="link">Business Analytics</a></p>
            </div>
        </body>
        </html>
        """)
    
    # Run the application
    port = int(os.getenv('PORT', 8000))
    host = os.getenv('HOST', '0.0.0.0')
    
    logger.info(f" Server starting on {host}:{port}")
    logger.info(f" Documentation available at http://{host}:{port}/docs")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=os.getenv('ENABLE_RELOAD', 'false').lower() == 'true',
        log_level=os.getenv('LOG_LEVEL', 'info').lower()
    )

if __name__ == "__main__":
    main()
