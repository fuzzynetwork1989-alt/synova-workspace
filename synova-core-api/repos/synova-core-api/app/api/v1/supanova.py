from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from app.db.session import get_db
import httpx
import os
import asyncio

router = APIRouter()

class SupanovaTask(BaseModel):
    task_type: str
    description: str
    priority: Optional[str] = "medium"
    context: Optional[Dict[str, Any]] = {}

class SupanovaResponse(BaseModel):
    task_id: str
    result: str
    confidence: float
    processing_time: float
    multi_modal_data: Optional[Dict[str, Any]] = {}

@router.post("/supanova/execute", response_model=SupanovaResponse)
async def supanova_execute(
    task: SupanovaTask,
    db: Session = Depends(get_db)
):
    """Supanova Super-Agent System - Multi-modal task execution"""
    try:
        api_key = os.getenv("SUPANOVA_API_KEY")
        base_url = os.getenv("SUPANOVA_BASE_URL", "https://api.supanova.ai")
        
        if not api_key:
            raise HTTPException(status_code=500, detail="Supanova API key not configured")
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{base_url}/v2/super-agent/execute",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "task": task.task_type,
                    "description": task.description,
                    "priority": task.priority,
                    "context": task.context,
                    "model": os.getenv("SUPANOVA_MODEL", "supanova-ultra"),
                    "max_tokens": int(os.getenv("SUPANOVA_MAX_TOKENS", "8192")),
                    "temperature": float(os.getenv("SUPANOVA_TEMPERATURE", "0.5")),
                    "enable_multi_modal": os.getenv("SUPANOVA_ENABLE_MULTI_MODAL", "true").lower() == "true"
                }
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Supanova API error: {response.text}"
                )
            
            result = response.json()
            
            return SupanovaResponse(
                task_id=result.get("task_id", ""),
                result=result.get("result", ""),
                confidence=result.get("confidence", 0.0),
                processing_time=result.get("processing_time", 0.0),
                multi_modal_data=result.get("multi_modal_data", {})
            )
            
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Supanova API request failed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Supanova processing error: {str(e)}")

@router.post("/supanova/multi-modal")
async def supanova_multimodal(
    text: str,
    image_data: Optional[str] = None,
    audio_data: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Supanova multi-modal processing with text, image, and audio"""
    try:
        api_key = os.getenv("SUPANOVA_API_KEY")
        base_url = os.getenv("SUPANOVA_BASE_URL", "https://api.supanova.ai")
        
        if not api_key:
            raise HTTPException(status_code=500, detail="Supanova API key not configured")
        
        payload = {
            "text": text,
            "model": os.getenv("SUPANOVA_MODEL", "supanova-ultra")
        }
        
        if image_data:
            payload["image"] = image_data
        if audio_data:
            payload["audio"] = audio_data
        
        async with httpx.AsyncClient(timeout=90.0) as client:
            response = await client.post(
                f"{base_url}/v2/multi-modal/process",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                json=payload
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Supanova multi-modal error: {response.text}"
                )
            
            return response.json()
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Multi-modal processing error: {str(e)}")

@router.get("/supanova/capabilities")
async def get_supanova_capabilities():
    """Get Supanova Super-Agent capabilities"""
    return {
        "capabilities": [
            {"name": "text_generation", "description": "Advanced text generation"},
            {"name": "image_analysis", "description": "Multi-modal image understanding"},
            {"name": "audio_processing", "description": "Speech-to-text and audio analysis"},
            {"name": "code_generation", "description": "Code writing and debugging"},
            {"name": "data_analysis", "description": "Data processing and visualization"},
            {"name": "task_automation", "description": "Automated task execution"},
            {"name": "reasoning", "description": "Complex reasoning and planning"}
        ],
        "models": [
            {"id": "supanova-ultra", "name": "Supanova Ultra", "description": "Most capable model"},
            {"id": "supanova-pro", "name": "Supanova Pro", "description": "Professional tasks"},
            {"id": "supanova-fast", "name": "Supanova Fast", "description": "Quick responses"}
        ]
    }

@router.get("/supanova/status")
async def supanova_status():
    """Check Supanova service status"""
    return {
        "status": "active",
        "api_configured": bool(os.getenv("SUPANOVA_API_KEY")),
        "base_url": os.getenv("SUPANOVA_BASE_URL", "https://api.supanova.ai"),
        "multi_modal_enabled": os.getenv("SUPANOVA_ENABLE_MULTI_MODAL", "true").lower() == "true",
        "current_model": os.getenv("SUPANOVA_MODEL", "supanova-ultra")
    }
