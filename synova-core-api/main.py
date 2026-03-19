"""
Synova AI Core API v4.1
FastAPI backend with Ollama integration for autonomous XR architecture
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import asyncio
import json
import os
from ollama import Client
import redis
from datetime import datetime

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

# Ollama client
client = Client(host='host.docker.internal:11434')

# Redis for session management
try:
    redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
except:
    redis_client = None

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
            "redis": "connected" if redis_client else "disconnected"
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
        return ChatResponse(
            response=f"AI Service Error: {str(e)}",
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
                prompt = message_data.get("prompt", "")
                tier = message_data.get("tier", "core")
            except:
                prompt = data
                tier = "core"
            
            if tier not in AI_MODELS:
                tier = "core"
            
            # Stream AI response
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
    uvicorn.run(app, host="0.0.0.0", port=8000)
