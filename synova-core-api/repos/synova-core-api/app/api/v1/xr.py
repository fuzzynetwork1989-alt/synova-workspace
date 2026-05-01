from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from app.db.session import get_db
import os
import json

router = APIRouter()

class XRSession(BaseModel):
    session_id: str
    device_type: str
    capabilities: List[str]
    user_id: Optional[str] = None

class XRCommand(BaseModel):
    session_id: str
    command_type: str
    parameters: Dict[str, Any]
    timestamp: Optional[float] = None

class XRResponse(BaseModel):
    success: bool
    result: Dict[str, Any]
    error: Optional[str] = None

@router.post("/xr/session/start", response_model=XRResponse)
async def start_xr_session(
    session: XRSession,
    db: Session = Depends(get_db)
):
    """Start XR/VR session with device capabilities"""
    try:
        # Validate device type
        valid_devices = ["oculus", "htc", "valve", "magic_leap", "hololens"]
        if session.device_type not in valid_devices:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid device type. Supported: {valid_devices}"
            )
        
        # Store session (in production, use Redis or database)
        session_data = {
            "session_id": session.session_id,
            "device_type": session.device_type,
            "capabilities": session.capabilities,
            "user_id": session.user_id,
            "start_time": session.timestamp or 0.0,
            "status": "active"
        }
        
        return XRResponse(
            success=True,
            result={
                "session_established": True,
                "xr_config": {
                    "provider": os.getenv("XR_PROVIDER", "oculus"),
                    "webxr_support": os.getenv("VR_WEBXR_SUPPORT", "true").lower() == "true",
                    "hand_tracking": os.getenv("XR_HAND_TRACKING", "true").lower() == "true",
                    "eye_tracking": os.getenv("XR_EYE_TRACKING", "true").lower() == "true",
                    "spatial_audio": os.getenv("XR_SPATIAL_AUDIO", "true").lower() == "true",
                    "room_scale": os.getenv("XR_ROOM_SCALE", "true").lower() == "true",
                    "pass_through": os.getenv("XR_PASS_THROUGH", "true").lower() == "true"
                }
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"XR session start failed: {str(e)}")

@router.post("/xr/command", response_model=XRResponse)
async def execute_xr_command(
    command: XRCommand,
    db: Session = Depends(get_db)
):
    """Execute XR/VR command"""
    try:
        valid_commands = [
            "spawn_object", "move_object", "delete_object", 
            "change_environment", "toggle_pass_through",
            "recalibrate", "capture_screenshot", "start_recording"
        ]
        
        if command.command_type not in valid_commands:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid command. Supported: {valid_commands}"
            )
        
        # Process command based on type
        result = await process_xr_command(command)
        
        return XRResponse(success=True, result=result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"XR command failed: {str(e)}")

@router.get("/xr/capabilities")
async def get_xr_capabilities():
    """Get XR/VR system capabilities"""
    return {
        "supported_devices": [
            {"id": "oculus", "name": "Oculus Quest/Rift", "features": ["hand_tracking", "eye_tracking", "room_scale"]},
            {"id": "htc", "name": "HTC Vive", "features": ["room_scale", "spatial_audio"]},
            {"id": "valve", "name": "Valve Index", "features": ["hand_tracking", "room_scale", "spatial_audio"]},
            {"id": "magic_leap", "name": "Magic Leap", "features": ["hand_tracking", "eye_tracking", "pass_through"]},
            {"id": "hololens", "name": "Microsoft HoloLens", "features": ["hand_tracking", "eye_tracking", "pass_through"]}
        ],
        "features": {
            "hand_tracking": os.getenv("XR_HAND_TRACKING", "true").lower() == "true",
            "eye_tracking": os.getenv("XR_EYE_TRACKING", "true").lower() == "true",
            "spatial_audio": os.getenv("XR_SPATIAL_AUDIO", "true").lower() == "true",
            "room_scale": os.getenv("XR_ROOM_SCALE", "true").lower() == "true",
            "pass_through": os.getenv("XR_PASS_THROUGH", "true").lower() == "true",
            "webxr_support": os.getenv("VR_WEBXR_SUPPORT", "true").lower() == "true"
        },
        "sdk_version": os.getenv("XR_SDK_VERSION", "latest"),
        "provider": os.getenv("XR_PROVIDER", "oculus")
    }

@router.get("/xr/status")
async def xr_status():
    """Check XR/VR service status"""
    return {
        "status": "active",
        "provider": os.getenv("XR_PROVIDER", "oculus"),
        "webxr_enabled": os.getenv("VR_WEBXR_SUPPORT", "true").lower() == "true",
        "supported_features": [
            feature for feature, enabled in {
                "hand_tracking": os.getenv("XR_HAND_TRACKING", "true").lower() == "true",
                "eye_tracking": os.getenv("XR_EYE_TRACKING", "true").lower() == "true",
                "spatial_audio": os.getenv("XR_SPATIAL_AUDIO", "true").lower() == "true",
                "room_scale": os.getenv("XR_ROOM_SCALE", "true").lower() == "true",
                "pass_through": os.getenv("XR_PASS_THROUGH", "true").lower() == "true"
            }.items() if enabled
        ]
    }

async def process_xr_command(command: XRCommand) -> Dict[str, Any]:
    """Process XR command and return result"""
    command_handlers = {
        "spawn_object": lambda: {"object_id": f"obj_{command.session_id}_{int(command.timestamp or 0)}", "status": "spawned"},
        "move_object": lambda: {"status": "moved", "position": command.parameters.get("position", [0, 0, 0])},
        "delete_object": lambda: {"status": "deleted", "object_id": command.parameters.get("object_id")},
        "change_environment": lambda: {"environment": command.parameters.get("environment", "default"), "status": "changed"},
        "toggle_pass_through": lambda: {"pass_through": True, "status": "enabled"},
        "recalibrate": lambda: {"status": "recalibrated", "accuracy": 0.95},
        "capture_screenshot": lambda: {"screenshot_url": f"/screenshots/{command.session_id}.png", "status": "captured"},
        "start_recording": lambda: {"recording_id": f"rec_{command.session_id}", "status": "recording"}
    }
    
    handler = command_handlers.get(command.command_type)
    if handler:
        return handler()
    else:
        return {"error": "Unknown command"}

@router.get("/xr/environments")
async def get_xr_environments():
    """Get available XR environments"""
    return {
        "environments": [
            {"id": "office", "name": "Virtual Office", "type": "workspace"},
            {"id": "meeting_room", "name": "Meeting Room", "type": "collaboration"},
            {"id": "design_studio", "name": "3D Design Studio", "type": "creative"},
            {"id": "data_viz", "name": "Data Visualization", "type": "analytics"},
            {"id": "training_room", "name": "Training Room", "type": "education"},
            {"id": "showroom", "name": "Product Showroom", "type": "presentation"}
        ]
    }
