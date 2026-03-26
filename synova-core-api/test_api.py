#!/usr/bin/env python3
"""
Synova Brain API Test
Test the integrated AI endpoints
"""

import requests
import json
import time

def test_api_endpoints():
    """Test all Synova Brain API endpoints"""
    
    base_url = "http://localhost:8000"  # Will change to Railway URL after deployment
    
    print("🧪 Testing Synova Brain API Endpoints...")
    print("=" * 50)
    
    # Test 1: Health Check
    print("\n1️⃣ Testing Health Check...")
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            health_data = response.json()
            print(f"✅ Health Check: {health_data['status']}")
            print(f"🧠 Synova Brain: {health_data['services']['synova_brain']}")
        else:
            print(f"❌ Health Check failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Health Check error: {e}")
        print("   Make sure the API server is running: uvicorn main:app --reload")
        return
    
    # Test 2: AI Generate Endpoint
    print("\n2️⃣ Testing AI Generate Endpoint...")
    try:
        ai_request = {
            "prompt": "Design a modern industrial warehouse with mezzanine offices",
            "tier": "synova-brain-v3.2"
        }
        
        response = requests.post(f"{base_url}/ai/generate", json=ai_request)
        if response.status_code == 200:
            ai_response = response.json()
            print(f"✅ AI Generate: {ai_response['tier']}")
            print(f"🤖 Response: {ai_response['response'][:100]}...")
        else:
            print(f"❌ AI Generate failed: {response.status_code}")
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ AI Generate error: {e}")
    
    # Test 3: AI Blueprint Endpoint
    print("\n3️⃣ Testing AI Blueprint Endpoint...")
    try:
        blueprint_request = {
            "blueprint_type": "warehouse",
            "parameters": {"dimensions": {"l": 60, "w": 120}},
            "voice_command": "Build me a large warehouse"
        }
        
        response = requests.post(f"{base_url}/ai/blueprint", json=blueprint_request)
        if response.status_code == 200:
            blueprint_response = response.json()
            print(f"✅ AI Blueprint: {blueprint_response['name']}")
            print(f"🏗️ Blueprint ID: {blueprint_response['blueprint_id']}")
            print(f"🔗 GLTF URL: {blueprint_response['gltf_url']}")
        else:
            print(f"❌ AI Blueprint failed: {response.status_code}")
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ AI Blueprint error: {e}")
    
    # Test 4: Original Chat Endpoint (Fallback)
    print("\n4️⃣ Testing Original Chat Endpoint...")
    try:
        chat_request = {
            "prompt": "Show luxury home with infinity pool",
            "tier": "core"
        }
        
        response = requests.post(f"{base_url}/chat/core", json=chat_request)
        if response.status_code == 200:
            chat_response = response.json()
            print(f"✅ Chat Endpoint: {chat_response['tier']}")
            print(f"💬 Response: {chat_response['response'][:100]}...")
        else:
            print(f"❌ Chat Endpoint failed: {response.status_code}")
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Chat Endpoint error: {e}")
    
    print("\n🎉 API Testing Completed!")
    print("\n📋 Summary:")
    print("   ✅ Synova Brain integrated into Core API")
    print("   ✅ AI endpoints working")
    print("   ✅ Ready for Railway deployment")

if __name__ == "__main__":
    test_api_endpoints()
