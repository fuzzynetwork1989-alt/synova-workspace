#!/usr/bin/env python3
"""
Test WebSocket functionality after fixes
"""

import asyncio
import websockets
import json

async def test_websocket():
    """Test the WebSocket endpoint"""
    uri = "ws://localhost:8000/ws"
    
    try:
        async with websockets.connect(uri) as websocket:
            print("🔗 Connected to WebSocket")
            
            # Test JSON message
            json_message = {
                "prompt": "Design a modern office building",
                "tier": "synova-brain-v3.2"
            }
            await websocket.send(json.dumps(json_message))
            print("📤 Sent JSON message")
            
            # Test raw text message
            await websocket.send("Show me a warehouse blueprint")
            print("📤 Sent raw text message")
            
            # Receive responses
            for i in range(2):
                response = await websocket.recv()
                print(f"📥 Response {i+1}: {response[:100]}...")
                
    except Exception as e:
        print(f"❌ WebSocket test failed: {e}")

if __name__ == "__main__":
    print("🧪 Testing WebSocket endpoint...")
    asyncio.run(test_websocket())
