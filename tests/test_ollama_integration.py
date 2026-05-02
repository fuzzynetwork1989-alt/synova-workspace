"""
Comprehensive Ollama Integration Tests
Tests all aspects of the Ollama service and brain router
"""

import asyncio
import aiohttp
import json
import time
from datetime import datetime
import sys
import os

# Add services to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'services'))

from ollama_service import OllamaService, ModelStatus
from brain_router import BrainRouter, RequestType, Provider

class OllamaIntegrationTester:
    """Comprehensive test suite for Ollama integration"""
    
    def __init__(self):
        self.test_results = []
        self.base_url = "http://localhost:11434"
        
    def log_test(self, test_name: str, passed: bool, message: str = ""):
        """Log test result"""
        status = "✅ PASS" if passed else "❌ FAIL"
        result = {
            "test": test_name,
            "passed": passed,
            "message": message,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        print(f"{status} {test_name}: {message}")
        
    async def test_ollama_connection(self):
        """Test basic Ollama connection"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{self.base_url}/api/version") as response:
                    if response.status == 200:
                        data = await response.json()
                        self.log_test(
                            "Ollama Connection", 
                            True, 
                            f"Version {data.get('version', 'unknown')}"
                        )
                        return True
                    else:
                        self.log_test(
                            "Ollama Connection", 
                            False, 
                            f"HTTP {response.status}"
                        )
                        return False
        except Exception as e:
            self.log_test("Ollama Connection", False, str(e))
            return False
            
    async def test_ollama_service(self):
        """Test Ollama service initialization and operations"""
        try:
            async with OllamaService() as service:
                # Test model refresh
                await service.refresh_models()
                models = service.models
                self.log_test(
                    "Model Refresh", 
                    len(models) > 0, 
                    f"Found {len(models)} models"
                )
                
                # Test health check
                health = await service.health_check()
                self.log_test(
                    "Health Check", 
                    health.get("status") == "healthy", 
                    f"Status: {health.get('status')}"
                )
                
                # Test best model selection
                try:
                    best_model = await service.get_best_model()
                    self.log_test(
                        "Best Model Selection", 
                        bool(best_model), 
                        f"Selected: {best_model}"
                    )
                except Exception as e:
                    self.log_test("Best Model Selection", False, str(e))
                
                # Test response generation (if models available)
                if models:
                    try:
                        test_prompt = "Hello, how are you?"
                        response = await service.generate_response(test_prompt)
                        self.log_test(
                            "Response Generation", 
                            bool(response.get("response")), 
                            f"Generated {len(response.get('response', ''))} chars"
                        )
                    except Exception as e:
                        self.log_test("Response Generation", False, str(e))
                else:
                    self.log_test("Response Generation", False, "No models available")
                    
                # Test model stats
                stats = service.get_model_stats()
                self.log_test(
                    "Model Stats", 
                    "models" in stats, 
                    f"Stats for {stats.get('total_models', 0)} models"
                )
                
        except Exception as e:
            self.log_test("Ollama Service", False, str(e))
            
    async def test_brain_router(self):
        """Test brain router functionality"""
        try:
            router = BrainRouter()
            await router.initialize()
            
            # Test route availability
            available_routes = await router.get_available_routes(RequestType.CHAT)
            self.log_test(
                "Route Availability", 
                len(available_routes) > 0, 
                f"Found {len(available_routes)} available routes"
            )
            
            # Test request routing (if routes available)
            if available_routes:
                try:
                    test_prompt = "Test message for routing"
                    result = await router.route_request(
                        prompt=test_prompt,
                        request_type=RequestType.CHAT
                    )
                    self.log_test(
                        "Request Routing", 
                        bool(result.get("response")), 
                        f"Routed to {result.get('routing', {}).get('model', 'unknown')}"
                    )
                except Exception as e:
                    self.log_test("Request Routing", False, str(e))
            else:
                self.log_test("Request Routing", False, "No available routes")
                
            # Test routing stats
            try:
                stats = await router.get_routing_stats()
                self.log_test(
                    "Routing Stats", 
                    "routes" in stats, 
                    f"Stats for {len(stats.get('routes', {}))} request types"
                )
            except Exception as e:
                self.log_test("Routing Stats", False, str(e))
                
            # Test health check
            try:
                health = await router.health_check()
                self.log_test(
                    "Router Health", 
                    health.get("status") in ["healthy", "degraded"], 
                    f"Status: {health.get('status')}"
                )
            except Exception as e:
                self.log_test("Router Health", False, str(e))
                
        except Exception as e:
            self.log_test("Brain Router", False, str(e))
            
    async def test_model_switching(self):
        """Test model switching and fallback"""
        try:
            async with OllamaService() as service:
                await service.refresh_models()
                
                # Get available models
                available_models = list(service.models.keys())
                if len(available_models) < 2:
                    self.log_test(
                        "Model Switching", 
                        False, 
                        "Need at least 2 models for switching test"
                    )
                    return
                    
                # Test switching between models
                for model_name in available_models[:3]:  # Test max 3 models
                    try:
                        test_prompt = f"Test response from {model_name}"
                        response = await service.generate_response(
                            prompt=test_prompt,
                            model=model_name
                        )
                        
                        success = bool(response.get("response"))
                        self.log_test(
                            f"Model Test: {model_name}", 
                            success, 
                            f"Response: {len(response.get('response', ''))} chars"
                        )
                        
                        # Small delay between tests
                        await asyncio.sleep(1)
                        
                    except Exception as e:
                        self.log_test(f"Model Test: {model_name}", False, str(e))
                        
        except Exception as e:
            self.log_test("Model Switching", False, str(e))
            
    async def test_api_endpoints(self):
        """Test API endpoints"""
        base_url = "http://localhost:8000"
        
        # Test health endpoint
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{base_url}/health") as response:
                    if response.status == 200:
                        data = await response.json()
                        self.log_test(
                            "API Health", 
                            True, 
                            f"Status: {data.get('status', 'unknown')}"
                        )
                    else:
                        self.log_test("API Health", False, f"HTTP {response.status}")
        except Exception as e:
            self.log_test("API Health", False, str(e))
            
        # Test chat endpoint
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{base_url}/chat",
                    json={
                        "prompt": "Hello, test message",
                        "session_id": "test-session"
                    }
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        self.log_test(
                            "API Chat", 
                            True, 
                            f"Response: {len(data.get('response', ''))} chars"
                        )
                    else:
                        self.log_test("API Chat", False, f"HTTP {response.status}")
        except Exception as e:
            self.log_test("API Chat", False, str(e))
            
        # Test models endpoint
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{base_url}/models") as response:
                    if response.status == 200:
                        data = await response.json()
                        self.log_test(
                            "API Models", 
                            True, 
                            f"Found {data.get('total_models', 0)} models"
                        )
                    else:
                        self.log_test("API Models", False, f"HTTP {response.status}")
        except Exception as e:
            self.log_test("API Models", False, str(e))
            
    async def test_streaming(self):
        """Test streaming responses"""
        base_url = "http://localhost:8000"
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{base_url}/stream",
                    json={
                        "prompt": "Test streaming response",
                        "stream": True
                    }
                ) as response:
                    if response.status == 200:
                        chunks_received = 0
                        async for line in response.content:
                            if line:
                                chunks_received += 1
                                if chunks_received > 5:  # Test first few chunks
                                    break
                                    
                        self.log_test(
                            "API Streaming", 
                            chunks_received > 0, 
                            f"Received {chunks_received} chunks"
                        )
                    else:
                        self.log_test("API Streaming", False, f"HTTP {response.status}")
        except Exception as e:
            self.log_test("API Streaming", False, str(e))
            
    async def run_all_tests(self):
        """Run all tests"""
        print("🧪 Starting Ollama Integration Tests")
        print("=" * 50)
        
        # Test basic connectivity first
        ollama_connected = await self.test_ollama_connection()
        
        if ollama_connected:
            # Test Ollama service
            await self.test_ollama_service()
            
            # Test brain router
            await self.test_brain_router()
            
            # Test model switching
            await self.test_model_switching()
            
            # Test API endpoints
            await self.test_api_endpoints()
            
            # Test streaming
            await self.test_streaming()
        else:
            self.log_test("All Tests", False, "Ollama not connected - skipping other tests")
            
        # Print summary
        self.print_summary()
        
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 50)
        print("📊 TEST SUMMARY")
        print("=" * 50)
        
        passed = sum(1 for result in self.test_results if result["passed"])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total*100):.1f}%")
        
        print("\n🔍 Failed Tests:")
        failed_tests = [r for r in self.test_results if not r["passed"]]
        for test in failed_tests:
            print(f"  ❌ {test['test']}: {test['message']}")
            
        print("\n✅ Passed Tests:")
        passed_tests = [r for r in self.test_results if r["passed"]]
        for test in passed_tests:
            print(f"  ✅ {test['test']}")
            
        # Save results to file
        with open('test_results.json', 'w') as f:
            json.dump(self.test_results, f, indent=2)
        print(f"\n💾 Results saved to test_results.json")

async def main():
    """Main test execution"""
    tester = OllamaIntegrationTester()
    await tester.run_all_tests()

if __name__ == "__main__":
    asyncio.run(main())
