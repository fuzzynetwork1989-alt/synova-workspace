#!/usr/bin/env python3
"""
Production smoke tests for CI/CD pipeline
"""

import asyncio
import aiohttp
import json

async def smoke_tests():
    base_url = 'https://synova-ai-production.up.railway.app'
    
    async with aiohttp.ClientSession() as session:
        # Test all endpoints
        endpoints = [
            '/health',
            '/health/detailed',
            '/ai/generate',
            '/ai/function-call',
            '/ai/blueprint',
            '/ai/code',
            '/ai/reasoning',
            '/ai/memory'
        ]
        
        results = {}
        for endpoint in endpoints:
            try:
                if endpoint == '/health' or endpoint == '/health/detailed':
                    async with session.get(f'{base_url}{endpoint}') as resp:
                        results[endpoint] = resp.status
                else:
                    payload = {'prompt': 'smoke test', 'tier': 'synova-brain-v3.2'}
                    if endpoint == '/blueprint':
                        payload = {'blueprint_type': 'modern', 'parameters': {}}
                    elif endpoint == '/code':
                        payload = {'prompt': 'test', 'language': 'javascript'}
                    
                    async with session.post(f'{base_url}{endpoint}', json=payload) as resp:
                        results[endpoint] = resp.status
            except Exception as e:
                results[endpoint] = f'ERROR: {e}'
        
        print('Smoke test results:')
        for endpoint, status in results.items():
            status_emoji = '✅' if str(status).startswith('2') else '❌'
            print(f'{status_emoji} {endpoint}: {status}')
        
        # Check if all critical endpoints are working
        critical_endpoints = ['/health', '/ai/generate']
        all_critical_ok = all(str(results[e]).startswith('2') for e in critical_endpoints)
        
        if not all_critical_ok:
            print('❌ Critical endpoints failed')
            exit(1)
        else:
            print('✅ All smoke tests passed')

if __name__ == "__main__":
    asyncio.run(smoke_tests())
