#!/usr/bin/env python3
"""
Simple test to check Railway API status
"""

import requests
import json
from datetime import datetime

def test_railway_api():
    """Test Railway API and save results"""
    results = {
        "timestamp": datetime.now().isoformat(),
        "tests": []
    }
    
    # Test health endpoint
    try:
        response = requests.get("https://synova-ai-production.up.railway.app/health", timeout=10)
        results["tests"].append({
            "endpoint": "/health",
            "status_code": response.status_code,
            "success": response.status_code == 200,
            "response": response.json() if response.status_code == 200 else response.text
        })
        print(f"Health check: {response.status_code}")
    except Exception as e:
        results["tests"].append({
            "endpoint": "/health",
            "status_code": None,
            "success": False,
            "error": str(e)
        })
        print(f"Health check error: {e}")
    
    # Test root endpoint
    try:
        response = requests.get("https://synova-ai-production.up.railway.app/", timeout=10)
        results["tests"].append({
            "endpoint": "/",
            "status_code": response.status_code,
            "success": response.status_code == 200,
            "response": response.json() if response.status_code == 200 else response.text
        })
        print(f"Root endpoint: {response.status_code}")
    except Exception as e:
        results["tests"].append({
            "endpoint": "/",
            "status_code": None,
            "success": False,
            "error": str(e)
        })
        print(f"Root endpoint error: {e}")
    
    # Save results
    with open("railway_test_results.json", "w") as f:
        json.dump(results, f, indent=2)
    
    # Summary
    passed = sum(1 for test in results["tests"] if test["success"])
    total = len(results["tests"])
    
    print(f"\nSummary: {passed}/{total} tests passed")
    
    return results

if __name__ == "__main__":
    test_railway_api()
