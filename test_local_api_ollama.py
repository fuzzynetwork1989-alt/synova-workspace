#!/usr/bin/env python3
"""Test Local API with Ollama Integration"""
import requests
import json
import time

def test_local_api():
    """Test local API endpoints with Ollama"""
    base_url = "http://localhost:8000"
    
    print("🧪 Testing Local API with Ollama Integration...")
    print(f"📍 Base URL: {base_url}")
    print("=" * 50)
    
    # Test endpoints
    endpoints = [
        ("/", "Root"),
        ("/health", "Health Check"),
        ("/generate", "Enhanced Generation"),
        ("/blueprint", "Blueprint Generation"),
        ("/code", "Code Generation")
    ]
    
    results = []
    
    for endpoint, name in endpoints:
        print(f"\n🔍 Testing {name}...")
        
        try:
            if endpoint == "/":
                response = requests.get(f"{base_url}{endpoint}", timeout=10)
            else:
                response = requests.post(
                    f"{base_url}{endpoint}",
                    json={"prompt": "Build me a modern warehouse"},
                    timeout=30
                )
            
            if response.status_code == 200:
                print(f"✅ {name} PASSED: {response.status_code}")
                results.append({"test": name, "status": "PASS", "response": response.json()})
            else:
                print(f"❌ {name} FAILED: {response.status_code}")
                results.append({"test": name, "status": "FAIL", "error": response.status_code})
                
        except Exception as e:
            print(f"❌ {name} ERROR: {e}")
            results.append({"test": name, "status": "ERROR", "error": str(e)})
    
    # Summary
    passed = len([r for r in results if r["status"] == "PASS"])
    total = len(results)
    
    print("\n" + "=" * 50)
    print(f"📊 Local Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 ALL LOCAL TESTS PASSED!")
        print("🚀 Ollama integration is working!")
    else:
        print("⚠️ Some local tests failed")
    
    # Save results
    with open("local_test_results.json", "w") as f:
        json.dump({
            "timestamp": time.time(),
            "base_url": base_url,
            "summary": {"passed": passed, "total": total, "success_rate": passed/total},
            "results": results
        }, f, indent=2)
    
    return passed == total

if __name__ == "__main__":
    print("🚀 Starting Local API Test...")
    print("📝 Make sure local API is running: python main.py")
    print("📝 And Ollama is running: ollama serve")
    print()
    
    success = test_local_api()
    
    if success:
        print("\n🎯 Next Steps:")
        print("1. Railway deployment will complete soon")
        print("2. Production tests will pass")
        print("3. Real Ollama responses will be served")
    else:
        print("\n🔧 Fix local issues first")
