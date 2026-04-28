"""
Synova AI API - Main FastAPI Application
Production-ready API server with all Nexus integrations
"""

import os
import uuid
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
# Brain router integration
try:
    from packages.brain.src.peak_brain import PeakBrain, BrainMode
    from endpoints.brain_endpoints import router as brain_router
    brain_integration_enabled = True
    log.info("brain_integration_enabled")
except ImportError as e:
    log.warning("brain_import_failed", error=str(e))
    brain_integration_enabled = False

# Import middleware
from middleware.auth import get_current_user

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    log.info("application_startup", message="Starting Synova AI API")

    # Initialize Brain if integration is enabled
    if brain_integration_enabled:
        try:
            app.state.brain = PeakBrain(mode=BrainMode.BOOTSTRAP)
            log.info("brain_initialized", mode="BOOTSTRAP")
        except Exception as e:
            log.error("brain_init_failed", error=str(e))
            app.state.brain = None
    else:
        app.state.brain = None

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

# Register brain router if integration is enabled
if brain_integration_enabled:
    app.include_router(brain_router, prefix="/brain")
    log.info("brain_router_registered")
else:
    log.warning("brain_router_skipped", reason="integration_disabled")

# Enhanced Synova Brain endpoints (OpenAI-compatible)
@app.post("/ai/generate")
async def ai_generate(request: dict):
    """Basic AI generation endpoint"""
    try:
        prompt = request.get("prompt", "")
        tier = request.get("tier", "synova-brain-v3.2")
        session_id = request.get("session_id", f"session_{uuid.uuid4()}")

        if app.state.brain:
            response = await app.state.brain.process_request(
                prompt=prompt,
                session_id=session_id,
                mode="chat"
            )
            return {"response": response, "session_id": session_id}
        else:
            return {"response": "Brain not initialized", "session_id": session_id}
    except Exception as e:
        log.error("ai_generate_error", error=str(e))
        return {"error": str(e)}

@app.post("/ai/generate/stream")
async def ai_generate_stream(request: dict):
    """Streaming AI generation endpoint"""
    async def generate():
        try:
            prompt = request.get("prompt", "")
            session_id = request.get("session_id", f"session_{uuid.uuid4()}")

            if app.state.brain:
                async for chunk in app.state.brain.stream_request(
                    prompt=prompt,
                    session_id=session_id
                ):
                    yield f"data: {chunk}\n\n"
            else:
                yield "data: Brain not initialized\n\n"
        except Exception as e:
            log.error("ai_stream_error", error=str(e))
            yield f"data: Error: {str(e)}\n\n"

    from fastapi.responses import StreamingResponse
    return StreamingResponse(generate(), media_type="text/event-stream")

@app.post("/ai/function-call")
async def ai_function_call(request: dict):
    """Function calling endpoint"""
    try:
        prompt = request.get("prompt", "")

        if app.state.brain:
            result = await app.state.brain.detect_intent(prompt)
            return {
                "type": "function_call" if result.get("intent") else "text",
                "function": result.get("function"),
                "arguments": result.get("arguments", {}),
                "intent": result.get("intent")
            }
        else:
            return {"type": "text", "response": "Brain not initialized"}
    except Exception as e:
        log.error("ai_function_call_error", error=str(e))
        return {"error": str(e)}

@app.post("/ai/multimodal")
async def ai_multimodal(request: dict):
    """Multimodal analysis endpoint"""
    try:
        text = request.get("text", "")
        images = request.get("images", [])

        if app.state.brain:
            result = await app.state.brain.multimodal_analysis(text, images)
            return {
                "text_analysis": result.get("text_analysis"),
                "image_analysis": result.get("image_analysis")
            }
        else:
            return {"error": "Brain not initialized"}
    except Exception as e:
        log.error("ai_multimodal_error", error=str(e))
        return {"error": str(e)}

@app.post("/ai/code")
async def ai_code(request: dict):
    """Code generation endpoint"""
    try:
        prompt = request.get("prompt", "")
        language = request.get("language", "python")

        if app.state.brain:
            result = await app.state.brain.generate_code(prompt, language)
            return {
                "code": result.get("code"),
                "explanation": result.get("explanation")
            }
        else:
            return {"error": "Brain not initialized"}
    except Exception as e:
        log.error("ai_code_error", error=str(e))
        return {"error": str(e)}

@app.post("/ai/reasoning")
async def ai_reasoning(request: dict):
    """Advanced reasoning endpoint"""
    try:
        prompt = request.get("prompt", "")
        context = request.get("context", {})

        if app.state.brain:
            result = await app.state.brain.advanced_reasoning(prompt, context)
            return {
                "reasoning_steps": result.get("reasoning_steps"),
                "response": result.get("response")
            }
        else:
            return {"error": "Brain not initialized"}
    except Exception as e:
        log.error("ai_reasoning_error", error=str(e))
        return {"error": str(e)}

@app.post("/ai/memory")
async def ai_memory(request: dict):
    """Conversation memory endpoint"""
    try:
        messages = request.get("messages", [])
        session_id = request.get("session_id", f"session_{uuid.uuid4()}")

        if app.state.brain:
            result = await app.state.brain.process_conversation(messages, session_id)
            return {
                "conversation_summary": result.get("summary"),
                "session_id": session_id
            }
        else:
            return {"error": "Brain not initialized"}
    except Exception as e:
        log.error("ai_memory_error", error=str(e))
        return {"error": str(e)}

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
