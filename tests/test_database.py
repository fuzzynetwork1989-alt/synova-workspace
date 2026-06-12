"""
Database module tests
"""

import pytest
from backend.database.models import User, Conversation, Message
from backend.database.crud import (
    create_user, get_user, update_user, delete_user,
    create_conversation, get_conversation, get_user_conversations,
    create_message, get_conversation_messages
)


@pytest.mark.asyncio
async def test_create_user():
    """Test creating a user"""
    user_data = {
        "email": "test@example.com",
        "username": "testuser",
        "full_name": "Test User"
    }
    user = await create_user(user_data)
    assert user.email == user_data["email"]
    assert user.username == user_data["username"]


@pytest.mark.asyncio
async def test_get_user():
    """Test retrieving a user"""
    user_data = {
        "email": "test2@example.com",
        "username": "testuser2",
        "full_name": "Test User 2"
    }
    user = await create_user(user_data)
    retrieved_user = await get_user(user.id)
    assert retrieved_user.id == user.id
    assert retrieved_user.email == user.email


@pytest.mark.asyncio
async def test_create_conversation():
    """Test creating a conversation"""
    user_data = {
        "email": "test3@example.com",
        "username": "testuser3",
        "full_name": "Test User 3"
    }
    user = await create_user(user_data)
    
    conversation_data = {
        "user_id": user.id,
        "title": "Test Conversation"
    }
    conversation = await create_conversation(conversation_data)
    assert conversation.title == conversation_data["title"]
    assert conversation.user_id == user.id


@pytest.mark.asyncio
async def test_create_message():
    """Test creating a message"""
    user_data = {
        "email": "test4@example.com",
        "username": "testuser4",
        "full_name": "Test User 4"
    }
    user = await create_user(user_data)
    
    conversation_data = {
        "user_id": user.id,
        "title": "Test Conversation"
    }
    conversation = await create_conversation(conversation_data)
    
    message_data = {
        "conversation_id": conversation.id,
        "role": "user",
        "content": "Hello, world!"
    }
    message = await create_message(message_data)
    assert message.content == message_data["content"]
    assert message.role == message_data["role"]
