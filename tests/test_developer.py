"""
Developer platform module tests
"""

import pytest
from backend.developer.sdk import SynovaSDK
from backend.developer.api_docs import APIDocumentation


@pytest.mark.asyncio
async def test_sdk_chat():
    """Test SDK chat"""
    sdk = SynovaSDK(base_url="http://localhost:8000", api_key="test_key")
    
    response = await sdk.chat(
        message="Hello, how are you?",
        model="synova-nexus"
    )
    assert response is not None


@pytest.mark.asyncio
async def test_sdk_streaming_chat():
    """Test SDK streaming chat"""
    sdk = SynovaSDK(base_url="http://localhost:8000", api_key="test_key")
    
    async for chunk in sdk.chat_stream(
        message="Tell me a story",
        model="synova-nexus"
    ):
        assert chunk is not None
        break  # Just test first chunk


@pytest.mark.asyncio
async def test_sdk_memory():
    """Test SDK memory operations"""
    sdk = SynovaSDK(base_url="http://localhost:8000", api_key="test_key")
    
    # Create memory
    await sdk.create_memory(
        content="Test memory content",
        metadata={"source": "test"}
    )
    
    # Search memory
    results = await sdk.search_memory("test", top_k=5)
    assert results is not None


def test_api_docs():
    """Test API documentation"""
    docs = APIDocumentation()
    
    # Generate OpenAPI spec
    spec = docs.generate_openapi_spec()
    assert spec is not None
    assert "openapi" in spec or "swagger" in spec
    
    # Add endpoint documentation
    docs.add_endpoint(
        path="/api/chat",
        method="POST",
        summary="Chat endpoint",
        description="Send a message to the AI",
        parameters=[
            {"name": "message", "type": "string", "required": True},
            {"name": "model", "type": "string", "required": False}
        ]
    )
    
    # Get endpoint docs
    endpoint_docs = docs.get_endpoint_docs("/api/chat")
    assert endpoint_docs is not None


def test_api_docs_list():
    """Test listing API endpoints"""
    docs = APIDocumentation()
    
    endpoints = docs.list_endpoints()
    assert isinstance(endpoints, list)
