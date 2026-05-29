"""
XR module tests
"""

import pytest
from backend.xr.xr_manager import XRManager
from backend.xr.spatial_audio import SpatialAudio
from backend.xr.gesture_recognition import GestureRecognition


@pytest.mark.asyncio
async def test_xr_manager():
    """Test XR manager"""
    manager = XRManager()
    
    # Initialize device
    result = await manager.initialize_device(device_type="vr")
    assert result is not None
    assert result["status"] in ["initialized", "simulated"]


@pytest.mark.asyncio
async def test_xr_session():
    """Test XR session management"""
    manager = XRManager()
    
    # Start session
    session = await manager.start_session(user_id="test_user")
    assert session is not None
    assert session["user_id"] == "test_user"
    
    # End session
    result = await manager.end_session()
    assert result is not None


def test_spatial_audio():
    """Test spatial audio"""
    audio = SpatialAudio()
    
    # Add audio source
    result = audio.add_audio_source(
        source_id="audio_1",
        position=[0, 0, 0],
        audio_data=b"fake_audio_data"
    )
    assert result is not None
    
    # Update position
    audio.update_position("audio_1", [1, 2, 3])
    
    # Remove source
    audio.remove_audio_source("audio_1")


def test_gesture_recognition():
    """Test gesture recognition"""
    gestures = GestureRecognition()
    
    # Register gesture
    gestures.register_gesture(
        gesture_name="wave",
        pattern=[1, 2, 3, 4, 5],
        action="say_hello"
    )
    
    # Recognize gesture
    result = gestures.recognize_gesture([1, 2, 3, 4, 5])
    assert result is not None
    assert result["gesture_name"] == "wave"
    
    # List gestures
    gesture_list = gestures.list_gestures()
    assert "wave" in gesture_list
