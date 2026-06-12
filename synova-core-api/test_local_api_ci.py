"""
Local API Test for CI/CD
"""
import asyncio
import aiohttp
import json
import sys
import time

async def test_endpoints():
    # Start the server
    import subprocess
    import signal
    import os

    server = subprocess.Popen([sys.executable, "main.py"])
    time.sleep(5)  # Wait for server to start

    try:
        async with aiohttp.ClientSession() as session:
            # Test health endpoint
            async with session.get("http://localhost:8000/health") as resp:
                if resp.status == 200:
                    data = await resp.json()
                    print("✅ Health check passed:", data)
                else:
                    print("❌ Health check failed:", resp.status)

            # Test generation endpoint
            payload = {"prompt": "Test prompt"}
            async with session.post("http://localhost:8000/generate", json=payload) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    print("✅ Generation test passed:", "response" in data)
                else:
                    print("❌ Generation test failed:", resp.status)
    finally:
        server.terminate()
        server.wait()

if __name__ == "__main__":
    asyncio.run(test_endpoints())
