"""
Synova Brain API v3.2 - FastAPI Web Service
Advanced AI with streaming, function calling, and multi-modal capabilities
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
import uvicorn
import os
from datetime import datetime
import sys

# Add current directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

# Import the advanced brain
from advanced_synova_brain import create_advanced_synova_brain

# Initialize FastAPI app
app = FastAPI(
    title="Synova Brain API",
    description="Advanced AI with streaming, function calling, and multi-modal capabilities",
    version="3.2.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the brain
brain = create_enhanced_synova_brain()

# Request/Response models
class GenerateRequest(BaseModel):
    prompt: str
    stream: Optional[bool] = False
    max_tokens: Optional[int] = 1000
    temperature: Optional[float] = 0.7

class GenerateResponse(BaseModel):
    response: str
    model: str
    timestamp: str
    processing_time: Optional[float] = None

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    timestamp: str
    model_loaded: bool

# Routes
@app.get("/", response_model=Dict[str, Any])
async def root():
    return {
        "service": "Synova Brain API v3.2",
        "status": "active",
        "endpoints": {
            "/health": "GET - Health check",
            "/generate": "POST - Generate text",
            "/generate/stream": "POST - Generate with streaming",
            "/analyze": "POST - Analyze intent",
            "/code": "POST - Generate code",
            "/multimodal": "POST - Multimodal analysis"
        },
        "model": brain.model_name,
        "device": brain.device
    }

@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(
        status="healthy",
        service="Synova Brain API v3.2",
        version="3.2.0",
        timestamp=datetime.now().isoformat(),
        model_loaded=brain.model is not None
    )

@app.post("/generate", response_model=GenerateResponse)
async def generate_text(request: GenerateRequest):
    try:
        import time
        start_time = time.time()
        
        # Generate response using the brain
        response = brain.generate(request.prompt)
        
        processing_time = time.time() - start_time
        
        return GenerateResponse(
            response=response,
            model=brain.model_name,
            timestamp=datetime.now().isoformat(),
            processing_time=processing_time
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate/stream")
async def generate_stream(request: GenerateRequest):
    """Generate text with streaming support"""
    try:
        return brain.stream_generate(request.prompt)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze")
async def analyze_intent(request: GenerateRequest):
    """Analyze user intent and patterns"""
    try:
        analysis = brain.detect_intent(request.prompt)
        return {
            "analysis": analysis,
            "prompt": request.prompt,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/code")
async def generate_code(request: GenerateRequest):
    """Generate code based on prompt"""
    try:
        code = brain.generate_react_code(request.prompt)
        return {
            "code": code,
            "language": "javascript",
            "framework": "react",
            "prompt": request.prompt,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/multimodal")
async def multimodal_analysis(request: dict):
    """Handle multimodal inputs"""
    try:
        text = request.get("text", "")
        images = request.get("images", [])
        
        response = brain.multimodal_support(text, images)
        return {
            "response": response,
            "input_text": text,
            "images_processed": len(images),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run the server
if __name__ == "__main__":
    # Railway-specific port handling
    port = int(os.environ.get("PORT", 8001))
    print(f"🧠 Synova Brain API v3.2 starting on port {port}")
    print(f"🤖 Model: {brain.model_name}")
    print(f"💻 Device: {brain.device}")
    print(f"🚀 Ready for advanced AI generation")
    
    uvicorn.run(app, host="0.0.0.0", port=port)
