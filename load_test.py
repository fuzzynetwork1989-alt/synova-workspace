#!/usr/bin/env python3
"""
Load testing for CI/CD pipeline
"""

import asyncio
import aiohttp
import time
from concurrent.futures import ThreadPoolExecutor

async def load_test():
    base_url = 'https://synova-ai-production.up.railway.app'
    concurrent_requests = 10
    total_requests = 50
    
    async def single_request(session, request_id):
        start_time = time.time()
        try:
            async with session.post(f'{base_url}/ai/generate', 
                                  json={'prompt': f'Load test {request_id}', 'tier': 'synova-brain-v3.2'}) as resp:
                await resp.text()
                return time.time() - start_time
        except:
            return float('inf')
    
    async with aiohttp.ClientSession() as session:
        # Run concurrent requests
        tasks = []
        for i in range(total_requests):
            if len(tasks) >= concurrent_requests:
                completed, tasks = await asyncio.wait(tasks, return_when=asyncio.FIRST_COMPLETED)
                tasks = list(tasks)
            
            task = asyncio.create_task(single_request(session, i))
            tasks.append(task)
        
        # Wait for remaining tasks
        if tasks:
            await asyncio.gather(*tasks)
    
    print('Load test completed')

if __name__ == "__main__":
    asyncio.run(load_test())
