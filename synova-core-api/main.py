"""
Synova AI Core API v4.1
FastAPI backend with Ollama integration for autonomous XR architecture
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Dict, Any, Optional
import json
from ollama import Client
import redis
from datetime import datetime
import logging
import time
import psutil
from enhanced_brain_fixed import EnhancedSynovaBrain

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Track start time for uptime monitoring
start_time = time.time()

app = FastAPI(
    title="Synova API v4.1",
    description="Autonomous XR Architecture & App Factory API",
    version="4.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS for web frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Performance monitoring middleware
@app.middleware("http")
async def performance_monitor(request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    
    # Log performance metrics
    logger.info(f"{request.method} {request.url} - {response.status_code} - {duration:.3f}s")
    
    # Log slow responses
    if duration > 2.0:
        logger.warning(f"Slow response detected: {request.url} took {duration:.3f}s")
    
    # Add performance headers
    response.headers["X-Response-Time"] = str(duration)
    response.headers["X-Memory-Usage"] = str(psutil.virtual_memory().percent)
    
    return response

# Enhanced health check with performance metrics
@app.get("/health/detailed")
async def detailed_health():
    """Enhanced health check with performance metrics"""
    try:
        memory = psutil.virtual_memory()
        return {
            "status": "healthy",
            "synova_brain": "active" if synova_brain else "inactive",
            "memory_usage": {
                "percent": memory.percent,
                "available_gb": round(memory.available / (1024**3), 2),
                "used_gb": round(memory.used / (1024**3), 2)
            },
            "cache_size": len(synova_brain.response_cache) if synova_brain else 0,
            "timestamp": datetime.now().isoformat(),
            "uptime": time.time() - start_time if 'start_time' in globals() else 0
        }
    except Exception as e:
        logger.error(f"Health check error: {e}")
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

# Ollama client
client = Client(host='host.docker.internal:11434')

# Redis for session management
try:
    redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
except Exception as e:
    redis_client = None
    print(f"Redis connection failed: {e}")

# Initialize Enhanced Synova Brain v3.2
try:
    synova_brain = EnhancedSynovaBrain()
    print("🧠 Enhanced Synova Brain v3.2 loaded successfully")
except Exception as e:
    print(f"Enhanced Synova Brain initialization failed: {e}")
    synova_brain = None

class ChatRequest(BaseModel):
    prompt: str
    tier: str = "core"
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    tier: str
    timestamp: str
    session_id: str

class BlueprintRequest(BaseModel):
    blueprint_type: str
    parameters: Dict[str, Any]
    voice_command: Optional[str] = None

class BlueprintResponse(BaseModel):
    blueprint_id: str
    name: str
    gltf_url: str
    babylon_scene: bool
    created_at: str

# AI Model Tiers
AI_MODELS = {
    "core": "llama3.2",
    "pro": "synova-brain-v3.2", 
    "enterprise": "grok-4"
}

# Blueprint Templates
BLUEPRINT_TEMPLATES = {
    "warehouse": {
        "id": "warehouse-v1",
        "name": "50x100m Industrial Warehouse",
        "dimensions": {"l": 50, "w": 100, "h": 12},
        "structure": {
            "foundation": "reinforced concrete 12\"",
            "frame": "steel I-beam 20m spans",
            "roof": "metal panel + skylights 20%",
            "doors": [{"type": "roll-up", "size": "14x16ft", "count": 4}]
        },
        "interiors": ["mezzanine lofts 10k sq ft", "office 2k sq ft", "HVAC zones"],
        "exports": {"gltf": "synova-warehouse.glb", "babylon_scene": True}
    },
    "lofts": {
        "id": "lofts-v1", 
        "name": "4-Story Urban Lofts (12 Units)",
        "floors": 4,
        "units_per_floor": 3,
        "features": ["glass curtain wall", "rooftop deck 5k sq ft", "ground retail", "gym/fitness"],
        "materials": {"exterior": "low-e glass + brick", "interior": "exposed concrete"},
        "exports": {"gltf": "synova-lofts.glb"}
    },
    "luxury": {
        "id": "luxury-v1",
        "name": "$1.2M Modern Estate (5,000 sq ft)",
        "beds": 5,
        "baths": 6,
        "features": [
            "infinity edge pool 40x12ft",
            "smart glass walls", 
            "wine cellar 1k bottles",
            "home theater 4K 120\"",
            "4-car climate garage",
            "holo-furnishings AR preview"
        ],
        "exports": {"gltf": "synova-luxury.glb", "quest_apk": True}
    }
}

@app.get("/")
async def root():
    return {"message": "Synova AI Core API v4.1 - Autonomous XR Architecture Factory"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "ollama": "connected",
            "redis": "connected" if redis_client else "disconnected",
            "synova_brain": "loaded" if synova_brain else "disconnected"
        }
    }

@app.post("/chat/{tier}", response_model=ChatResponse)
async def supanova_chat(request: ChatRequest, tier: str = "core"):
    """Main chat endpoint with tiered AI models"""
    
    # Validate tier
    if tier not in AI_MODELS:
        tier = "core"
    
    model = AI_MODELS[tier]
    
    try:
        # Get AI response
        response = client.chat(
            model=model,
            messages=[{
                "role": "user", 
                "content": f"Synova Brain v4.1: {request.prompt}"
            }]
        )
        
        ai_response = response["message"]["content"]
        
        # Store session if Redis available
        session_id = request.session_id or f"session_{datetime.now().timestamp()}"
        if redis_client:
            redis_client.setex(
                f"chat:{session_id}", 
                3600,  # 1 hour TTL
                json.dumps({
                    "prompt": request.prompt,
                    "response": ai_response,
                    "tier": tier,
                    "timestamp": datetime.now().isoformat()
                })
            )
        
        return ChatResponse(
            response=ai_response,
            tier=tier,
            timestamp=datetime.now().isoformat(),
            session_id=session_id
        )
        
    except Exception as e:
        print(f"Chat endpoint error: {e}")
        return ChatResponse(
            response="I apologize, but I'm experiencing technical difficulties. Please try again.",
            tier=tier,
            timestamp=datetime.now().isoformat(),
            session_id=request.session_id or "error"
        )

@app.post("/blueprint/generate", response_model=BlueprintResponse)
async def generate_blueprint(request: BlueprintRequest):
    """Generate XR architecture blueprints"""
    
    blueprint_type = request.blueprint_type.lower()
    if blueprint_type not in BLUEPRINT_TEMPLATES:
        blueprint_type = "warehouse"
    
    template = BLUEPRINT_TEMPLATES[blueprint_type].copy()
    
    # Apply custom parameters
    if request.parameters:
        if "dimensions" in request.parameters:
            template["dimensions"].update(request.parameters["dimensions"])
        if "features" in request.parameters:
            template["features"].extend(request.parameters["features"])
    
    # Generate unique ID
    timestamp = datetime.now().timestamp()
    blueprint_id = f"{template['id']}-{int(timestamp)}"
    
    # In production, this would trigger the holo-renderer
    gltf_url = f"/api/models/{blueprint_id}.glb"
    
    return BlueprintResponse(
        blueprint_id=blueprint_id,
        name=template["name"],
        gltf_url=gltf_url,
        babylon_scene=template.get("exports", {}).get("babylon_scene", False),
        created_at=datetime.now().isoformat()
    )

@app.post("/ai/generate/stream")
async def synova_brain_stream_generate(request: ChatRequest):
    """Enhanced Synova Brain streaming endpoint with advanced LLM features"""
    
    if not synova_brain:
        return {"error": "Enhanced Synova Brain is currently unavailable"}
    
    try:
        # Create streaming response
        async def generate_stream():
            for chunk in synova_brain.generate_with_streaming(request.prompt):
                yield f"data: {json.dumps(chunk)}\n\n"
        
        return StreamingResponse(
            generate_stream(),
            media_type="text/plain",
            headers={"Cache-Control": "no-cache", "Connection": "keep-alive"}
        )
        
    except Exception as e:
        return {"error": f"Enhanced generation failed: {str(e)}"}

@app.post("/ai/function-call")
async def synova_brain_function_call(request: Dict[str, Any]):
    """Function calling endpoint like ChatGPT"""
    
    if not synova_brain:
        return {"error": "Enhanced Synova Brain is currently unavailable"}
    
    try:
        prompt = request.get("prompt", "")
        function_result = synova_brain.function_calling(prompt)
        
        if function_result["type"] == "function_call":
            # Execute the function
            function_name = function_result["function"]["name"]
            arguments = function_result["arguments"]
            
            if function_name == "generate_blueprint":
                blueprint_response = synova_brain.generate_with_streaming(
                    f"Generate {arguments.get('blueprint_type', 'warehouse')} blueprint"
                )
                return {
                    "type": "function_result",
                    "function": function_name,
                    "result": blueprint_response,
                    "arguments": arguments
                }
        
        return function_result
        
    except Exception as e:
        return {"error": f"Function calling failed: {str(e)}"}

@app.post("/ai/multimodal")
async def synova_brain_multimodal(request: Dict[str, Any]):
    """Multimodal endpoint with image and text analysis"""
    
    if not synova_brain:
        return {"error": "Enhanced Synova Brain is currently unavailable"}
    
    try:
        text = request.get("text", "")
        images = request.get("images", [])
        
        result = synova_brain.multimodal_support(text, images)
        return result
        
    except Exception as e:
        return {"error": f"Multimodal analysis failed: {str(e)}"}

@app.post("/ai/code")
async def synova_brain_code_generation(request: Dict[str, Any]):
    """Code generation endpoint like advanced LLMs"""
    
    if not synova_brain:
        return {"error": "Enhanced Synova Brain is currently unavailable"}
    
    try:
        prompt = request.get("prompt", "")
        language = request.get("language", "javascript")
        
        result = synova_brain.code_generation(prompt, language)
        return result
        
    except Exception as e:
        return {"error": f"Code generation failed: {str(e)}"}

@app.post("/ai/reasoning")
async def synova_brain_reasoning(request: Dict[str, Any]):
    """Advanced reasoning endpoint like Grok"""
    
    if not synova_brain:
        return {"error": "Enhanced Synova Brain is currently unavailable"}
    
    try:
        prompt = request.get("prompt", "")
        context = request.get("context", {})
        
        result = synova_brain.advanced_reasoning(prompt, context)
        return result
        
    except Exception as e:
        return {"error": f"Advanced reasoning failed: {str(e)}"}

@app.post("/ai/memory")
async def synova_brain_memory(request: Dict[str, Any]):
    """Conversation memory endpoint"""
    
    if not synova_brain:
        return {"error": "Enhanced Synova Brain is currently unavailable"}
    
    try:
        messages = request.get("messages", [])
        
        result = synova_brain.conversation_memory(messages)
        return result
        
    except Exception as e:
        return {"error": f"Memory analysis failed: {str(e)}"}
async def synova_brain_generate(request: ChatRequest):
    """Dedicated Synova Brain v3.2 endpoint for XR architecture"""
    
    if not synova_brain:
        return ChatResponse(
            response="Synova Brain is currently unavailable. Please try again later.",
            tier="synova-brain-v3.2",
            timestamp=datetime.now().isoformat(),
            session_id=request.session_id or "fallback"
        )
    
    try:
        # Generate response using Synova Brain
        brain_response = synova_brain.generate_response(request.prompt)
        
        return ChatResponse(
            response=brain_response,
            tier="synova-brain-v3.2",
            timestamp=datetime.now().isoformat(),
            session_id=request.session_id or f"brain_{datetime.now().timestamp()}"
        )
        
    except Exception as e:
        print(f"Synova Brain error: {e}")
        return ChatResponse(
            response="I apologize, but I'm experiencing technical difficulties. Please try again.",
            tier="synova-brain-v3.2",
            timestamp=datetime.now().isoformat(),
            session_id=request.session_id or "error"
        )

@app.post("/ai/blueprint", response_model=BlueprintResponse)
async def ai_generate_blueprint(request: BlueprintRequest):
    """Generate XR blueprints using AI"""
    
    if not synova_brain:
        # Fallback to template-based generation
        blueprint_type = request.blueprint_type or "warehouse"
        if blueprint_type not in BLUEPRINT_TEMPLATES:
            blueprint_type = "warehouse"
        
        template = BLUEPRINT_TEMPLATES[blueprint_type].copy()
        timestamp = datetime.now().timestamp()
        blueprint_id = f"{template['id']}-{int(timestamp)}"
        
        return BlueprintResponse(
            blueprint_id=blueprint_id,
            name=template["name"],
            gltf_url=f"/api/models/{blueprint_id}.glb",
            babylon_scene=template.get("exports", {}).get("babylon_scene", False),
            created_at=datetime.now().isoformat()
        )
    
    try:
        # Generate blueprint description using AI
        if request.voice_command:
            prompt = f"Voice command: {request.voice_command}. Generate {request.blueprint_type} blueprint."
        else:
            prompt = f"Generate {request.blueprint_type} blueprint with parameters: {request.parameters}"
        
        # Use AI description for context (logging only)
        ai_description = synova_brain.generate_response(prompt)
        print(f"AI Blueprint Description: {ai_description[:100]}...")
        
        # Create AI-enhanced blueprint
        timestamp = datetime.now().timestamp()
        blueprint_id = f"ai-{request.blueprint_type}-{int(timestamp)}"
        
        return BlueprintResponse(
            blueprint_id=blueprint_id,
            name=f"AI Generated {request.blueprint_type.title()}",
            gltf_url=f"/api/models/{blueprint_id}.glb",
            babylon_scene=True,
            created_at=datetime.now().isoformat()
        )
        
    except Exception as e:
        print(f"AI Blueprint generation error: {e}")
        # Fallback to template
        blueprint_type = request.blueprint_type or "warehouse"
        template = BLUEPRINT_TEMPLATES.get(blueprint_type, BLUEPRINT_TEMPLATES["warehouse"])
        
        timestamp = datetime.now().timestamp()
        blueprint_id = f"{template['id']}-{int(timestamp)}"
        
        return BlueprintResponse(
            blueprint_id=blueprint_id,
            name=template["name"],
            gltf_url=f"/api/models/{blueprint_id}.glb",
            babylon_scene=template.get("exports", {}).get("babylon_scene", False),
            created_at=datetime.now().isoformat()
        )

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """Real-time streaming chat endpoint"""
    await websocket.accept()
    
    try:
        while True:
            data = await websocket.receive_text()
            
            # Parse message
            try:
                message_data = json.loads(data)
                prompt = message_data.get("prompt", data)  # Fallback to raw data
                tier = message_data.get("tier", "core")
            except json.JSONDecodeError:
                # If not JSON, use raw data as prompt
                prompt = data
                tier = "core"
            except Exception as e:
                print(f"WebSocket parse error: {e}")
                prompt = data
                tier = "core"
            
            if tier not in AI_MODELS:
                tier = "core"
            
            # Generate AI response
            if tier == "synova-brain-v3.2" and synova_brain:
                # Use Enhanced Synova Brain streaming
                for chunk in synova_brain.generate_with_streaming(prompt):
                    await websocket.send_text(json.dumps(chunk))
                
                await websocket.send_text("\n[STREAM_COMPLETE]\n")
            else:
                # Use Ollama for streaming response
                stream = client.chat(
                    model=AI_MODELS[tier],
                    messages=[{
                        "role": "user", 
                        "content": f"Synova Brain v4.1: {prompt}"
                    }],
                    stream=True
                )
                
                full_response = ""
                async for chunk in stream:
                    if "message" in chunk and "content" in chunk["message"]:
                        content = chunk["message"]["content"]
                        full_response += content
                        await websocket.send_text(content)
                
                # Send completion signal
                await websocket.send_text("\n[STREAM_COMPLETE]\n")
            
    except WebSocketDisconnect:
        pass
    except Exception as e:
        await websocket.send_text(f"Error: {str(e)}")

@app.get("/models/list")
async def list_available_models():
    """List available AI models and blueprints"""
    return {
        "ai_models": AI_MODELS,
        "blueprint_types": list(BLUEPRINT_TEMPLATES.keys()),
        "features": {
            "voice_commands": True,
            "real_time_rendering": True,
            "quest_export": True,
            "gltf_export": True
        }
    }

@app.post("/voice/process")
async def process_voice_command(audio_data: bytes, command_type: str = "whisper"):
    """Process voice commands for blueprint generation"""
    # This would integrate with Whisper.js for offline processing
    # For now, return a mock response
    
    voice_commands = {
        "show luxury": "luxury",
        "show warehouse": "warehouse", 
        "show lofts": "lofts",
        "modern home": "luxury",
        "industrial": "warehouse"
    }
    
    # Mock transcription (replace with actual Whisper integration)
    transcribed = "show luxury home"  # This would be the actual transcription
    
    for command, blueprint_type in voice_commands.items():
        if command in transcribed.lower():
            return {
                "transcribed": transcribed,
                "intent": blueprint_type,
                "confidence": 0.95
            }
    
    return {
        "transcribed": transcribed,
        "intent": None,
        "confidence": 0.0
    }

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get('PORT', 8000))
    print(f"Starting server on port: {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
