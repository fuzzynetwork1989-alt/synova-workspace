#!/usr/bin/env python3
"""
API endpoint tests for CI/CD pipeline
"""

import asyncio
import aiohttp
import json

async def test_endpoints():
    async with aiohttp.ClientSession() as session:
        # Test health endpoint
        async with session.get('http://localhost:8000/health') as resp:
            assert resp.status == 200
            data = await resp.json()
            print('Health check passed:', data)
        
        # Test generation endpoint
        payload = {
            'prompt': 'Test prompt',
            'tier': 'synova-brain-v3.2',
            'session_id': 'test-session'
        }
        async with session.post('http://localhost:8000/ai/generate', json=payload) as resp:
            assert resp.status == 200
            data = await resp.json()
            print('Generation test passed:', 'response' in data)

if __name__ == "__main__":
    asyncio.run(test_endpoints())
