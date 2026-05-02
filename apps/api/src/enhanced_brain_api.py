"""
Enhanced Synova Brain API with Ollama Integration
Production-ready FastAPI service with intelligent routing
"""

import os
import sys
import asyncio
from datetime import datetime
from typing import Dict, Any, List, Optional, Union
from pydantic import BaseModel, Field
import json
import logging

# FastAPI imports
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Add services to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'services'))

# Import our services
from brain_router import get_brain_router, RequestType, Provider
from ollama_service import get_ollama_service

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Pydantic models
class ChatRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=10000)
    session_id: Optional[str] = None
    request_type: Optional[str] = "chat"
    preferred_provider: Optional[str] = None
    max_cost: Optional[float] = None
    stream: Optional[bool] = False
    temperature: Optional[float] = None
    max_tokens: Optional[int] = None

class ChatResponse(BaseModel):
    response: str
    model: str
    provider: str
    request_type: str
    session_id: str
    timestamp: str
    routing: Dict[str, Any]
    metadata: Dict[str, Any]

class ModelManagementRequest(BaseModel):
    action: str = Field(..., description="Action: pull, delete, list, health")
    model_name: Optional[str] = None

class RoutingStats(BaseModel):
    routes: Dict[str, Any]
    performance: Dict[str, Any]
    usage: Dict[str, Any]
    ollama_models: Dict[str, Any]

# Initialize FastAPI
app = FastAPI(
    title="Enhanced Synova Brain API",
    description="Production-ready API with Ollama integration and intelligent routing",
    version="4.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global services
brain_router = None
ollama_service = None

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    global brain_router, ollama_service
    
    try:
        logger.info("🚀 Starting Enhanced Synova Brain API v4.0")
        
        # Initialize Ollama service
        ollama_service = await get_ollama_service()
        logger.info("✅ Ollama service initialized")
        
        # Initialize brain router
        brain_router = await get_brain_router()
        logger.info("✅ Brain router initialized")
        
        # Pull primary model if not available
        await ensure_primary_model()
        
        logger.info("🎉 All services initialized successfully")
        
    except Exception as e:
        logger.error(f"❌ Failed to initialize services: {e}")
        # Don't raise exception to allow API to start in degraded mode

async def ensure_primary_model():
    """Ensure the primary Synova model is available"""
    try:
        if not ollama_service:
            return
            
        stats = ollama_service.get_model_stats()
        if "synova-brain" not in stats["models"]:
            logger.info("📥 Pulling synova-brain model...")
            await ollama_service.pull_model("synova-brain")
            
    except Exception as e:
        logger.warning(f"⚠️ Could not ensure primary model: {e}")

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Enhanced Synova Brain API v4.0 - Ollama Integration",
        "status": "active",
        "version": "4.0.0",
        "features": [
            "intelligent_routing",
            "ollama_integration",
            "model_management",
            "fallback_handling",
            "streaming_responses",
            "performance_tracking",
            "cost_optimization"
        ],
        "endpoints": [
            "/health",
            "/chat",
            "/stream",
            "/models",
            "/routing/stats",
            "/routing/health"
        ]
    }

@app.get("/health")
async def health_check():
    """Comprehensive health check"""
    try:
        router_health = await brain_router.health_check() if brain_router else {"status": "uninitialized"}
        ollama_health = await ollama_service.health_check() if ollama_service else {"status": "uninitialized"}
        
        overall_status = "healthy"
        if router_health.get("status") != "healthy" or ollama_health.get("status") != "healthy":
            overall_status = "degraded"
            
        return {
            "status": overall_status,
            "api_version": "4.0.0",
            "timestamp": datetime.now().isoformat(),
            "services": {
                "brain_router": router_health,
                "ollama": ollama_health
            }
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

@app.post("/chat", response_model=ChatResponse)
async def chat_completion(request: ChatRequest):
    """Generate chat response with intelligent routing"""
    try:
        if not brain_router:
            raise HTTPException(status_code=503, detail="Brain router not initialized")
            
        # Parse request type
        try:
            request_type = RequestType(request.request_type.lower())
        except ValueError:
            request_type = RequestType.CHAT
            
        # Parse preferred provider
        preferred_provider = None
        if request.preferred_provider:
            try:
                preferred_provider = Provider(request.preferred_provider.lower())
            except ValueError:
                pass
                
        # Prepare additional parameters
        params = {}
        if request.temperature is not None:
            params["temperature"] = request.temperature
        if request.max_tokens is not None:
            params["num_predict"] = request.max_tokens
            
        # Route request
        result = await brain_router.route_request(
            prompt=request.prompt,
            request_type=request_type,
            preferred_provider=preferred_provider,
            max_cost=request.max_cost,
            **params
        )
        
        return ChatResponse(
            response=result.get("response", ""),
            model=result["routing"]["model"],
            provider=result["routing"]["provider"],
            request_type=request_type.value,
            session_id=request.session_id or "default",
            timestamp=datetime.now().isoformat(),
            routing=result["routing"],
            metadata={
                "created_at": result.get("created_at"),
                "total_duration": result.get("total_duration", 0),
                "load_duration": result.get("load_duration", 0),
                "context": result.get("context", [])
            }
        )
        
    except Exception as e:
        logger.error(f"❌ Chat completion failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/stream")
async def stream_chat(request: ChatRequest):
    """Stream chat response"""
    try:
        if not brain_router or not ollama_service:
            raise HTTPException(status_code=503, detail="Services not initialized")
            
        # Get the best model
        best_model = await ollama_service.get_best_model()
        
        async def generate():
            try:
                async for chunk in ollama_service._stream_response(
                    prompt=request.prompt,
                    model=best_model,
                    temperature=request.temperature or 0.3,
                    num_predict=request.max_tokens or 2000
                ):
                    yield f"data: {json.dumps(chunk)}\n\n"
                    
            except Exception as e:
                error_chunk = {
                    "error": str(e),
                    "model": best_model,
                    "done": True
                }
                yield f"data: {json.dumps(error_chunk)}\n\n"
                
        return StreamingResponse(generate(), media_type="text/plain")
        
    except Exception as e:
        logger.error(f"❌ Stream failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/models")
async def list_models():
    """List available models and their status"""
    try:
        if not ollama_service:
            raise HTTPException(status_code=503, detail="Ollama service not initialized")
            
        stats = ollama_service.get_model_stats()
        return {
            "models": stats["models"],
            "total_models": stats["total_models"],
            "available_models": stats["available_models"],
            "unavailable_models": stats["unavailable_models"],
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"❌ Model listing failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/models/manage")
async def manage_models(request: ModelManagementRequest):
    """Manage Ollama models (pull, delete, etc.)"""
    try:
        if not ollama_service:
            raise HTTPException(status_code=503, detail="Ollama service not initialized")
            
        if request.action == "pull":
            if not request.model_name:
                raise HTTPException(status_code=400, detail="Model name required for pull")
                
            success = await ollama_service.pull_model(request.model_name)
            return {
                "action": "pull",
                "model": request.model_name,
                "success": success,
                "timestamp": datetime.now().isoformat()
            }
            
        elif request.action == "delete":
            if not request.model_name:
                raise HTTPException(status_code=400, detail="Model name required for delete")
                
            success = await ollama_service.delete_model(request.model_name)
            return {
                "action": "delete",
                "model": request.model_name,
                "success": success,
                "timestamp": datetime.now().isoformat()
            }
            
        elif request.action == "list":
            stats = ollama_service.get_model_stats()
            return {
                "action": "list",
                "models": stats["models"],
                "timestamp": datetime.now().isoformat()
            }
            
        elif request.action == "health":
            health = await ollama_service.health_check()
            return {
                "action": "health",
                "health": health,
                "timestamp": datetime.now().isoformat()
            }
            
        else:
            raise HTTPException(status_code=400, detail=f"Unknown action: {request.action}")
            
    except Exception as e:
        logger.error(f"❌ Model management failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/routing/stats", response_model=RoutingStats)
async def get_routing_stats():
    """Get routing statistics and performance metrics"""
    try:
        if not brain_router:
            raise HTTPException(status_code=503, detail="Brain router not initialized")
            
        stats = await brain_router.get_routing_stats()
        return RoutingStats(**stats)
        
    except Exception as e:
        logger.error(f"❌ Routing stats failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/routing/health")
async def get_routing_health():
    """Get routing health status"""
    try:
        if not brain_router:
            raise HTTPException(status_code=503, detail="Brain router not initialized")
            
        health = await brain_router.health_check()
        return health
        
    except Exception as e:
        logger.error(f"❌ Routing health check failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/function_call")
async def function_calling(request: ChatRequest):
    """Function calling endpoint"""
    try:
        if not brain_router:
            raise HTTPException(status_code=503, detail="Brain router not initialized")
            
        # Route as reasoning request for function calling
        result = await brain_router.route_request(
            prompt=f"Function call: {request.prompt}",
            request_type=RequestType.REASONING,
            preferred_provider=Provider.OLLAMA,
            **({"temperature": request.temperature} if request.temperature else {})
        )
        
        return {
            "function_call": {
                "name": "process_request",
                "description": "Process user request with Synova brain",
                "arguments": {"prompt": request.prompt}
            },
            "response": result.get("response", ""),
            "routing": result.get("routing", {}),
            "timestamp": datetime.now().isoformat(),
            "session_id": request.session_id or "default"
        }
        
    except Exception as e:
        logger.error(f"❌ Function calling failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/blueprint")
async def generate_blueprint(request: ChatRequest):
    """Generate XR architecture blueprint"""
    try:
        if not brain_router:
            raise HTTPException(status_code=503, detail="Brain router not initialized")
            
        blueprint_prompt = f"Generate detailed XR architecture blueprint for: {request.prompt}"
        
        result = await brain_router.route_request(
            prompt=blueprint_prompt,
            request_type=RequestType.BLUEPRINT,
            preferred_provider=Provider.OLLAMA,
            **({"temperature": request.temperature} if request.temperature else {})
        )
        
        return {
            "blueprint": result.get("response", ""),
            "type": "xr_architecture",
            "format": "gltf_ready",
            "routing": result.get("routing", {}),
            "timestamp": datetime.now().isoformat(),
            "session_id": request.session_id or "default"
        }
        
    except Exception as e:
        logger.error(f"❌ Blueprint generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/code")
async def generate_code(request: ChatRequest):
    """Generate code"""
    try:
        if not brain_router:
            raise HTTPException(status_code=503, detail="Brain router not initialized")
            
        code_prompt = f"Generate code for: {request.prompt}"
        
        result = await brain_router.route_request(
            prompt=code_prompt,
            request_type=RequestType.CODE,
            preferred_provider=Provider.OLLAMA,
            **({"temperature": request.temperature} if request.temperature else {})
        )
        
        return {
            "code": result.get("response", ""),
            "language": "auto-detected",
            "routing": result.get("routing", {}),
            "timestamp": datetime.now().isoformat(),
            "session_id": request.session_id or "default"
        }
        
    except Exception as e:
        logger.error(f"❌ Code generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    PORT = int(os.environ.get("PORT", 8000))
    
    print(f"🚀 Starting Enhanced Synova Brain API v4.0")
    print(f"📡 Port: {PORT}")
    print(f"🧠 Ollama Integration: Enabled")
    print(f"🔄 Intelligent Routing: Enabled")
    print(f"📊 Performance Tracking: Enabled")
    
    uvicorn.run(
        "enhanced_brain_api:app",
        host="0.0.0.0",
        port=PORT,
        reload=False,
        workers=1
    )
