#!/usr/bin/env python3
"""Test Ollama Model Response"""
import requests
import json
import sys

def test_ollama_model():
    """Test the Ollama model response"""
    print("🧪 Testing Ollama Model...")
    
    try:
        # Test model via API
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "synova-brain",
                "prompt": "Build me a modern industrial warehouse with mezzanine offices",
                "stream": False
            },
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Ollama Response:")
            print(json.dumps(result, indent=2))
            return True
        else:
            print(f"❌ API Error: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Connection Error: {e}")
        return False

if __name__ == "__main__":
    success = test_ollama_model()
    if success:
        print("\n🎉 OLLAMA MODEL IS WORKING!")
        print("🚀 Ready for Railway API integration!")
    else:
        print("\n❌ Ollama model not responding")
        print("🔧 Check: ollama serve is running")
