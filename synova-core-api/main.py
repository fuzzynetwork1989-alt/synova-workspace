"""
Railway 502 Fix - Definitive Solution
Handles Railway's environment correctly
"""

import os
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "API is working"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/generate")
async def generate(data: dict):
    return {"response": "Working correctly"}

if __name__ == "__main__":
    import uvicorn
    # Railway-specific port handling - THIS IS THE KEY FIX
    port = int(os.environ.get("PORT", 8000))
    print(f"🚀 Starting on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
