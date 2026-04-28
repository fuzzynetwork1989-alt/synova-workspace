from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from app.db.session import get_db
import httpx
import os

router = APIRouter()

class AstranovaRequest(BaseModel):
    prompt: str
    max_tokens: Optional[int] = 4096
    temperature: Optional[float] = 0.7
    model: Optional[str] = "astranova-pro"

class AstranovaResponse(BaseModel):
    response: str
    model: str
    tokens_used: int
    processing_time: float

@router.post("/astranova/chat", response_model=AstranovaResponse)
async def astranova_chat(
    request: AstranovaRequest,
    db: Session = Depends(get_db)
):
    """Astranova AI Agent System - Advanced conversational AI"""
    try:
        api_key = os.getenv("ASTRANOVA_API_KEY")
        base_url = os.getenv("ASTRANOVA_BASE_URL", "https://api.astranova.ai")
        
        if not api_key:
            raise HTTPException(status_code=500, detail="Astranova API key not configured")
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{base_url}/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": request.model,
                    "messages": [{"role": "user", "content": request.prompt}],
                    "max_tokens": request.max_tokens,
                    "temperature": request.temperature
                }
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Astranova API error: {response.text}"
                )
            
            result = response.json()
            
            return AstranovaResponse(
                response=result["choices"][0]["message"]["content"],
                model=request.model,
                tokens_used=result.get("usage", {}).get("total_tokens", 0),
                processing_time=result.get("processing_time", 0.0)
            )
            
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Astranova API request failed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Astranova processing error: {str(e)}")

@router.get("/astranova/models")
async def get_astranova_models():
    """Get available Astranova models"""
    return {
        "models": [
            {"id": "astranova-pro", "name": "Astranova Pro", "description": "Advanced reasoning model"},
            {"id": "astranova-fast", "name": "Astranova Fast", "description": "Quick responses"},
            {"id": "astranova-creative", "name": "Astranova Creative", "description": "Creative writing model"}
        ]
    }

@router.get("/astranova/status")
async def astranova_status():
    """Check Astranova service status"""
    return {
        "status": "active",
        "api_configured": bool(os.getenv("ASTRANOVA_API_KEY")),
        "base_url": os.getenv("ASTRANOVA_BASE_URL", "https://api.astranova.ai")
    }
