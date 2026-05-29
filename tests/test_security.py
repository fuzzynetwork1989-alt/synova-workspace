"""
Security module tests
"""

import pytest
from backend.security.rate_limiter import RateLimiter
from backend.security.content_moderation import ContentModerator
from backend.security.input_validator import InputValidator
from backend.security.encryption import EncryptionManager


@pytest.mark.asyncio
async def test_rate_limiter():
    """Test rate limiter"""
    limiter = RateLimiter()
    
    # Set a limit
    limiter.set_limit("test_user", 10, 60)
    
    # Check within limit
    allowed = await limiter.check_limit("test_user")
    assert allowed is True


@pytest.mark.asyncio
async def test_content_moderation():
    """Test content moderation"""
    moderator = ContentModerator()
    
    # Safe content
    result = await moderator.moderate_content(
        content="This is a safe message",
        user_id="test_user"
    )
    assert result["flagged"] is False
    
    # Add blocked keyword
    moderator.add_blocked_keyword("spam")
    
    # Flagged content
    result = await moderator.moderate_content(
        content="This is spam content",
        user_id="test_user"
    )
    assert result["flagged"] is True


def test_input_validator_email():
    """Test email validation"""
    validator = InputValidator()
    assert validator.validate_email("test@example.com") is True
    assert validator.validate_email("invalid-email") is False


def test_input_validator_url():
    """Test URL validation"""
    validator = InputValidator()
    assert validator.validate_url("https://example.com") is True
    assert validator.validate_url("not-a-url") is False


def test_input_validator_json():
    """Test JSON validation"""
    validator = InputValidator()
    assert validator.validate_json('{"key": "value"}') is True
    assert validator.validate_json("not json") is False


def test_encryption_manager():
    """Test encryption manager"""
    encryption = EncryptionManager()
    
    plaintext = "Secret message"
    ciphertext = encryption.encrypt(plaintext)
    assert ciphertext != plaintext
    
    decrypted = encryption.decrypt(ciphertext)
    assert decrypted == plaintext


def test_password_hashing():
    """Test password hashing"""
    encryption = EncryptionManager()
    
    password = "secure_password_123"
    hashed = encryption.hash_password(password)
    assert hashed != password
    
    # Verify correct password
    assert encryption.verify_password(password, hashed) is True
    
    # Verify incorrect password
    assert encryption.verify_password("wrong_password", hashed) is False
