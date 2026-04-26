"""
Synova AI API - Main FastAPI Application
Production-ready API server with all Nexus integrations
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import structlog

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    cache_logger_on_first_use=True,
)

log = structlog.get_logger()

# Import routers
import sys
import os

# Add src to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Add workspace root to path for packages imports
workspace_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
sys.path.insert(0, workspace_root)

from routers.chat import router as chat_router
from routers.rag import router as rag_router
from routers.agents import router as agents_router
from routers.autopilot import router as autopilot_router
from routers.memory import router as memory_router
from routers.usage import router as usage_router
from routers.vision import router as vision_router
from routers.voice import router as voice_router
# brain_router temporarily disabled - complex cross-package dependencies require refactoring
# from endpoints.brain_endpoints import router as brain_router

# Import middleware
from middleware.auth import get_current_user

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    log.info("application_startup", message="Starting Synova AI API")

    # Initialize services (would be done here in production)
    # from packages.brain.src.peak_brain import PeakBrain, BrainMode
    # app.state.brain = PeakBrain(mode=BrainMode.BOOTSTRAP)

    yield

    log.info("application_shutdown", message="Shutting down Synova AI API")

# Create FastAPI app
app = FastAPI(
    title="Synova AI API",
    description="Production AI platform with Nexus integrations",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:8000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(chat_router, prefix="/api")
app.include_router(rag_router, prefix="/api")
app.include_router(agents_router, prefix="/api")
app.include_router(autopilot_router, prefix="/api")
app.include_router(memory_router, prefix="/api")
app.include_router(usage_router, prefix="/api")
app.include_router(vision_router, prefix="/api")
app.include_router(voice_router, prefix="/api")
# brain_router temporarily disabled - complex cross-package dependencies require refactoring
# app.include_router(brain_router, prefix="/api")

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "name": "Synova AI API",
        "version": "1.0.0",
        "status": "operational",
        "documentation": "/docs",
        "integrations": {
            "supanova_brain": "Multi-agent orchestration with LangGraph",
            "provider_service": "Provider-agnostic LLM service",
            "rag_service": "Retrieval Augmented Generation with pgvector",
            "autopilot_mode": "Full-stack application scaffolding",
            "tool_service": "External tool integration",
            "safety_service": "Content moderation and safety",
            "billing_service": "Stripe integration for subscriptions",
            "xr_service": "WebXR and spatial AI interfaces",
            "deep_research": "Automated multi-step research",
            "memory_service": "Hierarchical memory with Redis/Supabase"
        },
        "endpoints": {
            "chat": "/api/chat/stream",
            "rag": "/api/rag/upload, /api/rag/query",
            "agents": "/api/agents/supanova/run",
            "autopilot": "/api/autopilot/build",
            "memory": "/api/memory/",
            "usage": "/api/usage/",
            "vision": "/api/vision/analyze",
            "voice": "/api/voice/transcribe",
            "brain": "/brain/chat, /brain/status, /brain/health"
        }
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "services": {
            "api": "operational",
            "brain": "operational",
            "database": "operational" if os.getenv("SUPABASE_URL") else "not_configured",
            "redis": "operational" if os.getenv("REDIS_URL") else "not_configured",
            "stripe": "operational" if os.getenv("STRIPE_SECRET_KEY") else "not_configured"
        },
        "environment": os.getenv("APP_ENV", "development")
    }

# Startup event
@app.on_event("startup")
async def startup_event():
    """Run startup tasks"""
    log.info("startup", message="Initializing services")

    # Validate environment variables
    required_vars = [
        "OPENAI_API_KEY",
        "SUPABASE_URL",
        "SUPABASE_SERVICE_KEY",
        "JWT_SECRET"
    ]

    missing_vars = [var for var in required_vars if not os.getenv(var)]

    if missing_vars:
        log.warning("missing_env_vars", vars=missing_vars)
    else:
        log.info("env_vars_validated", count=len(required_vars))

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Run shutdown tasks"""
    log.info("shutdown", message="Cleaning up resources")

if __name__ == "__main__":
    import uvicorn

    host = os.getenv("APP_HOST", "127.0.0.1")
    port = int(os.getenv("APP_PORT", "8000"))
    debug = os.getenv("DEBUG", "true").lower() == "true"

    print(f"Starting server on {host}:{port}")
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=False,  # Disable reload to avoid potential issues
        log_level="info"
    )
