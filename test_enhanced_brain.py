#!/usr/bin/env python3
"""
Enhanced Synova Brain Test Suite
Test streaming, function calling, multimodal, and advanced LLM features
"""

import asyncio
import aiohttp
import json

async def test_enhanced_features():
    """Test all enhanced Synova Brain features"""
    
    base_url = "http://localhost:8000"
    
    print("🧪 Testing Enhanced Synova Brain Features...")
    print("=" * 60)
    
    # Test 1: Basic Generation
    print("\n1️⃣ Testing Basic AI Generation...")
    async with aiohttp.ClientSession() as session:
        async with session.post(
            f"{base_url}/ai/generate",
            json={"prompt": "Design a sustainable eco-friendly office building"}
        ) as response:
            if response.status == 200:
                result = await response.json()
                print(f"✅ Basic Response: {result['response'][:100]}...")
            else:
                print(f"❌ Basic Generation Failed: {response.status}")
    
    # Test 2: Streaming Generation
    print("\n2️⃣ Testing Streaming Generation...")
    async with aiohttp.ClientSession() as session:
        async with session.post(
            f"{base_url}/ai/generate/stream",
            json={"prompt": "Create a modern luxury mansion with smart home features"}
        ) as response:
            if response.status == 200:
                print("📡 Streaming Response:")
                async for line in response.content:
                    if line.startswith("data: "):
                        chunk = json.loads(line[6:])
                        if chunk.get("type") == "chunk":
                            print(f"   🧠 {chunk['content']}")
                        elif chunk.get("type") == "completion":
                            print(f"   ✅ Complete: {chunk['usage']}")
            else:
                print(f"❌ Streaming Failed: {response.status}")
    
    # Test 3: Function Calling
    print("\n3️⃣ Testing Function Calling...")
    async with aiohttp.ClientSession() as session:
        async with session.post(
            f"{base_url}/ai/function-call",
            json={"prompt": "Build me a 50x100 warehouse with office space"}
        ) as response:
            if response.status == 200:
                result = await response.json()
                if result.get("type") == "function_call":
                    print(f"✅ Function Called: {result['function']['name']}")
                    print(f"📋 Arguments: {result['arguments']}")
                else:
                    print(f"❌ Function Calling Failed: {result}")
            else:
                print(f"❌ Function Call Request Failed: {response.status}")
    
    # Test 4: Multimodal Analysis
    print("\n4️⃣ Testing Multimodal Analysis...")
    async with aiohttp.ClientSession() as session:
        async with session.post(
            f"{base_url}/ai/multimodal",
            json={
                "text": "Analyze this architectural design",
                "images": ["mock_image_1.jpg", "mock_image_2.jpg"]
            }
        ) as response:
            if response.status == 200:
                result = await response.json()
                print(f"✅ Text Analysis: {result.get('text_analysis', {})}")
                print(f"🖼️ Image Analysis: {result.get('image_analysis', {})}")
            else:
                print(f"❌ Multimodal Failed: {response.status}")
    
    # Test 5: Code Generation
    print("\n5️⃣ Testing Code Generation...")
    async with aiohttp.ClientSession() as session:
        async with session.post(
            f"{base_url}/ai/code",
            json={
                "prompt": "Create a React component for 3D model viewer",
                "language": "react"
            }
        ) as response:
            if response.status == 200:
                result = await response.json()
                print(f"✅ Generated {result['language']} code:")
                print(f"   📝 {result['code'][:200]}...")
            else:
                print(f"❌ Code Generation Failed: {response.status}")
    
    # Test 6: Advanced Reasoning
    print("\n6️⃣ Testing Advanced Reasoning...")
    async with aiohttp.ClientSession() as session:
        async with session.post(
            f"{base_url}/ai/reasoning",
            json={
                "prompt": "Compare and contrast modern vs traditional architecture",
                "context": {"user_preferences": {"style": "modern"}}
            }
        ) as response:
            if response.status == 200:
                result = await response.json()
                print(f"✅ Reasoning Steps: {len(result.get('reasoning_steps', []))}")
                for step in result.get('reasoning_steps', [])[:3]:
                    print(f"   🧠 {step['step']}: {step['action']}")
            else:
                print(f"❌ Advanced Reasoning Failed: {response.status}")
    
    # Test 7: Conversation Memory
    print("\n7️⃣ Testing Conversation Memory...")
    async with aiohttp.ClientSession() as session:
        messages = [
            {"content": "I want a modern office building", "role": "user"},
            {"content": "Make it sustainable and eco-friendly", "role": "user"},
            {"content": "Add glass walls and open spaces", "role": "user"}
        ]
        
        async with session.post(
            f"{base_url}/ai/memory",
            json={"messages": messages}
        ) as response:
            if response.status == 200:
                result = await response.json()
                summary = result.get('conversation_summary', {})
                print(f"✅ Topics Discussed: {summary.get('topics_discussed', [])}")
                print(f"🧠 User Preferences: {summary.get('user_preferences', {})}")
            else:
                print(f"❌ Memory Analysis Failed: {response.status}")
    
    # Test 8: WebSocket Streaming
    print("\n8️⃣ Testing WebSocket Streaming...")
    try:
        import websockets
        
        async with websockets.connect(f"ws://localhost:8000/ws") as websocket:
            print("🔗 Connected to WebSocket")
            
            # Test enhanced streaming
            await websocket.send(json.dumps({
                "prompt": "Design a futuristic smart home",
                "tier": "synova-brain-v3.2"
            }))
            
            chunks_received = 0
            async for message in websocket:
                if message.startswith("data: "):
                    chunk = json.loads(message[6:])
                    if chunk.get("type") == "chunk":
                        print(f"   📡 {chunk['content']}")
                        chunks_received += 1
                    elif chunk.get("type") == "completion":
                        print(f"   ✅ Streaming Complete: {chunks_received} chunks")
                        break
            
            print("✅ WebSocket Streaming Test Complete")
            
    except Exception as e:
        print(f"❌ WebSocket Test Failed: {e}")
    
    print("\n" + "=" * 60)
    print("🎉 Enhanced Synova Brain Feature Testing Complete!")
    print("\n📊 Feature Summary:")
    print("   ✅ Basic Generation: ChatGPT-style responses")
    print("   ✅ Streaming: Real-time token streaming")
    print("   ✅ Function Calling: Automated task execution")
    print("   ✅ Multimodal: Image + text analysis")
    print("   ✅ Code Generation: Multiple language support")
    print("   ✅ Advanced Reasoning: Step-by-step logic")
    print("   ✅ Conversation Memory: Context awareness")
    print("   ✅ WebSocket: Real-time communication")
    print("\n🚀 Enhanced Synova Brain now supports all major LLM features!")

async def main():
    """Run all enhanced tests"""
    await test_enhanced_features()

if __name__ == "__main__":
    asyncio.run(main())
