#!/usr/bin/env python3
"""
Production Tests for Enhanced Synova Brain API
Tests all enhanced features with Railway production URL
"""

import asyncio
import aiohttp
import json
from datetime import datetime

# Production Configuration
PRODUCTION_URL = "https://synova-ai-production.up.railway.app"
API_BASE = f"{PRODUCTION_URL}/ai"

class ProductionTester:
    def __init__(self):
        self.base_url = API_BASE
        self.results = []
    
    async def test_health_check(self):
        """Test basic health check"""
        print("🏥 Testing Health Check...")
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{PRODUCTION_URL}/health") as response:
                    if response.status == 200:
                        data = await response.json()
                        print("✅ Health Check PASSED")
                        self.results.append({"test": "health", "status": "PASS", "data": data})
                        return True
                    else:
                        print(f"❌ Health Check FAILED: {response.status}")
                        self.results.append({"test": "health", "status": "FAIL", "error": response.status})
                        return False
        except Exception as e:
            print(f"❌ Health Check ERROR: {e}")
            self.results.append({"test": "health", "status": "ERROR", "error": str(e)})
            return False
    
    async def test_enhanced_generation(self):
        """Test enhanced brain generation"""
        print("🧠 Testing Enhanced Generation...")
        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    "prompt": "Design a modern sustainable office building",
                    "tier": "synova-brain-v3.2",
                    "session_id": "test-session"
                }
                
                async with session.post(f"{self.base_url}/generate", json=payload) as response:
                    if response.status == 200:
                        data = await response.json()
                        print("✅ Enhanced Generation PASSED")
                        print(f"   Response: {data.get('response', '')[:100]}...")
                        self.results.append({"test": "generation", "status": "PASS", "data": data})
                        return True
                    else:
                        print(f"❌ Enhanced Generation FAILED: {response.status}")
                        self.results.append({"test": "generation", "status": "FAIL", "error": response.status})
                        return False
        except Exception as e:
            print(f"❌ Enhanced Generation ERROR: {e}")
            self.results.append({"test": "generation", "status": "ERROR", "error": str(e)})
            return False
    
    async def test_streaming(self):
        """Test streaming generation"""
        print("📡 Testing Streaming Generation...")
        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    "prompt": "Create architectural blueprint",
                    "tier": "synova-brain-v3.2"
                }
                
                async with session.post(f"{self.base_url}/generate/stream", json=payload) as response:
                    if response.status == 200:
                        chunks = []
                        async for chunk in response.content.iter_chunked(1024):
                            if chunk:
                                chunks.append(chunk.decode())
                        
                        print("✅ Streaming Generation PASSED")
                        print(f"   Chunks received: {len(chunks)}")
                        self.results.append({"test": "streaming", "status": "PASS", "chunks": len(chunks)})
                        return True
                    else:
                        print(f"❌ Streaming Generation FAILED: {response.status}")
                        self.results.append({"test": "streaming", "status": "FAIL", "error": response.status})
                        return False
        except Exception as e:
            print(f"❌ Streaming Generation ERROR: {e}")
            self.results.append({"test": "streaming", "status": "ERROR", "error": str(e)})
            return False
    
    async def test_function_calling(self):
        """Test function calling"""
        print("🔧 Testing Function Calling...")
        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    "prompt": "Build a warehouse with office space",
                    "tier": "synova-brain-v3.2"
                }
                
                async with session.post(f"{self.base_url}/function-call", json=payload) as response:
                    if response.status == 200:
                        data = await response.json()
                        print("✅ Function Calling PASSED")
                        print(f"   Type: {data.get('type', 'unknown')}")
                        self.results.append({"test": "function_calling", "status": "PASS", "data": data})
                        return True
                    else:
                        print(f"❌ Function Calling FAILED: {response.status}")
                        self.results.append({"test": "function_calling", "status": "FAIL", "error": response.status})
                        return False
        except Exception as e:
            print(f"❌ Function Calling ERROR: {e}")
            self.results.append({"test": "function_calling", "status": "ERROR", "error": str(e)})
            return False
    
    async def test_blueprint_generation(self):
        """Test blueprint generation"""
        print("🏗️ Testing Blueprint Generation...")
        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    "blueprint_type": "modern",
                    "parameters": {
                        "dimensions": {"width": 100, "height": 50, "depth": 30},
                        "features": ["sustainable", "smart", "modern"]
                    }
                }
                
                async with session.post(f"{self.base_url}/blueprint", json=payload) as response:
                    if response.status == 200:
                        data = await response.json()
                        print("✅ Blueprint Generation PASSED")
                        print(f"   Blueprint ID: {data.get('blueprint_id', 'unknown')}")
                        self.results.append({"test": "blueprint", "status": "PASS", "data": data})
                        return True
                    else:
                        print(f"❌ Blueprint Generation FAILED: {response.status}")
                        self.results.append({"test": "blueprint", "status": "FAIL", "error": response.status})
                        return False
        except Exception as e:
            print(f"❌ Blueprint Generation ERROR: {e}")
            self.results.append({"test": "blueprint", "status": "ERROR", "error": str(e)})
            return False
    
    async def test_code_generation(self):
        """Test code generation"""
        print("💻 Testing Code Generation...")
        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    "prompt": "Create React component for 3D model viewer",
                    "language": "react",
                    "tier": "synova-brain-v3.2"
                }
                
                async with session.post(f"{self.base_url}/code", json=payload) as response:
                    if response.status == 200:
                        data = await response.json()
                        print("✅ Code Generation PASSED")
                        print(f"   Language: {data.get('language', 'unknown')}")
                        self.results.append({"test": "code_generation", "status": "PASS", "data": data})
                        return True
                    else:
                        print(f"❌ Code Generation FAILED: {response.status}")
                        self.results.append({"test": "code_generation", "status": "FAIL", "error": response.status})
                        return False
        except Exception as e:
            print(f"❌ Code Generation ERROR: {e}")
            self.results.append({"test": "code_generation", "status": "ERROR", "error": str(e)})
            return False
    
    async def test_multimodal(self):
        """Test multimodal analysis"""
        print("🖼️ Testing Multimodal Analysis...")
        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    "text": "Analyze this architectural design",
                    "images": ["test.jpg"],
                    "tier": "synova-brain-v3.2"
                }
                
                async with session.post(f"{self.base_url}/multimodal", json=payload) as response:
                    if response.status == 200:
                        data = await response.json()
                        print("✅ Multimodal Analysis PASSED")
                        print(f"   Text analysis: {data.get('text_analysis', '')[:50]}...")
                        self.results.append({"test": "multimodal", "status": "PASS", "data": data})
                        return True
                    else:
                        print(f"❌ Multimodal Analysis FAILED: {response.status}")
                        self.results.append({"test": "multimodal", "status": "FAIL", "error": response.status})
                        return False
        except Exception as e:
            print(f"❌ Multimodal Analysis ERROR: {e}")
            self.results.append({"test": "multimodal", "status": "ERROR", "error": str(e)})
            return False
    
    async def test_reasoning(self):
        """Test advanced reasoning"""
        print("🧠 Testing Advanced Reasoning...")
        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    "prompt": "Compare modern vs traditional architecture",
                    "tier": "synova-brain-v3.2"
                }
                
                async with session.post(f"{self.base_url}/reasoning", json=payload) as response:
                    if response.status == 200:
                        data = await response.json()
                        print("✅ Advanced Reasoning PASSED")
                        print(f"   Reasoning steps: {len(data.get('reasoning_steps', []))}")
                        self.results.append({"test": "reasoning", "status": "PASS", "data": data})
                        return True
                    else:
                        print(f"❌ Advanced Reasoning FAILED: {response.status}")
                        self.results.append({"test": "reasoning", "status": "FAIL", "error": response.status})
                        return False
        except Exception as e:
            print(f"❌ Advanced Reasoning ERROR: {e}")
            self.results.append({"test": "reasoning", "status": "ERROR", "error": str(e)})
            return False
    
    async def test_memory(self):
        """Test conversation memory"""
        print("🧠 Testing Conversation Memory...")
        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    "messages": [
                        {"content": "I like modern architecture", "role": "user"},
                        {"content": "Modern design emphasizes clean lines", "role": "assistant"},
                        {"content": "What about sustainable materials?", "role": "user"}
                    ],
                    "tier": "synova-brain-v3.2"
                }
                
                async with session.post(f"{self.base_url}/memory", json=payload) as response:
                    if response.status == 200:
                        data = await response.json()
                        print("✅ Conversation Memory PASSED")
                        print(f"   Topics: {data.get('conversation_summary', {}).get('topics_discussed', [])}")
                        self.results.append({"test": "memory", "status": "PASS", "data": data})
                        return True
                    else:
                        print(f"❌ Conversation Memory FAILED: {response.status}")
                        self.results.append({"test": "memory", "status": "FAIL", "error": response.status})
                        return False
        except Exception as e:
            print(f"❌ Conversation Memory ERROR: {e}")
            self.results.append({"test": "memory", "status": "ERROR", "error": str(e)})
            return False
    
    async def run_all_tests(self):
        """Run all production tests"""
        print("🚀 Starting Production Tests for Enhanced Synova Brain")
        print(f"📍 Testing URL: {PRODUCTION_URL}")
        print("=" * 60)
        
        tests = [
            self.test_health_check,
            self.test_enhanced_generation,
            self.test_streaming,
            self.test_function_calling,
            self.test_blueprint_generation,
            self.test_code_generation,
            self.test_multimodal,
            self.test_reasoning,
            self.test_memory
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            if await test():
                passed += 1
            print()
        
        # Summary
        print("=" * 60)
        print(f"📊 Test Results: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 ALL TESTS PASSED - Production Ready!")
        else:
            print("⚠️ Some tests failed - Check deployment")
        
        # Save results
        results_data = {
            "timestamp": datetime.now().isoformat(),
            "production_url": PRODUCTION_URL,
            "summary": {"passed": passed, "total": total, "success_rate": passed/total*100},
            "results": self.results
        }
        
        with open("production_test_results.json", "w") as f:
            json.dump(results_data, f, indent=2)
        
        print(f"📄 Results saved to production_test_results.json")
        return results_data

if __name__ == "__main__":
    tester = ProductionTester()
    asyncio.run(tester.run_all_tests())
