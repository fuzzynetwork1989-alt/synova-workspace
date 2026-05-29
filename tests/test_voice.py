"""
Voice module tests
"""

import pytest
from backend.voice.speech_to_text import SpeechToText
from backend.voice.text_to_speech import TextToSpeech
from backend.voice.voice_manager import VoiceManager


@pytest.mark.asyncio
async def test_speech_to_text():
    """Test speech to text"""
    stt = SpeechToText()
    
    # Transcribe audio (simulated)
    result = await stt.transcribe(
        audio_data=b"fake_audio_data",
        language="en"
    )
    assert result is not None
    assert "text" in result or result == "Simulated transcription"


@pytest.mark.asyncio
async def test_text_to_speech():
    """Test text to speech"""
    tts = TextToSpeech()
    
    # Synthesize speech (simulated)
    result = await tts.synthesize(
        text="Hello, world!",
        voice="default",
        speed=1.0
    )
    assert result is not None
    assert "audio" in result or result == b"Simulated audio"


@pytest.mark.asyncio
async def test_voice_manager():
    """Test voice manager"""
    manager = VoiceManager()
    
    # Start voice session
    session = await manager.start_voice_session(user_id="test_user")
    assert session is not None
    assert session["user_id"] == "test_user"
    
    # End session
    result = await manager.end_voice_session()
    assert result is not None


@pytest.mark.asyncio
async def test_voice_manager_transcribe():
    """Test voice manager transcription"""
    manager = VoiceManager()
    
    await manager.start_voice_session(user_id="test_user")
    
    result = await manager.transcribe_audio(
        audio_data=b"fake_audio_data",
        language="en"
    )
    assert result is not None
    
    await manager.end_voice_session()


@pytest.mark.asyncio
async def test_voice_manager_synthesize():
    """Test voice manager synthesis"""
    manager = VoiceManager()
    
    await manager.start_voice_session(user_id="test_user")
    
    result = await manager.synthesize_speech(
        text="Test message",
        voice="default"
    )
    assert result is not None
    
    await manager.end_voice_session()
