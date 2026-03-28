"""
Railway 502 Fix - The Right Way
Simple, working API that Railway can actually start
"""

import os
from datetime import datetime
from fastapi import FastAPI

# Create the simplest possible FastAPI app
app = FastAPI(
    title="Synova Brain API",
    description="Working API for Railway",
    version="3.2.0"
)

@app.get("/")
async def root():
    return {
        "message": "Synova Brain API v3.2.0",
        "status": "active",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/generate")
async def generate(data: dict):
    prompt = data.get("prompt", "")

    if "build" in prompt.lower() or "design" in prompt.lower():
        response = f"I'll create architectural designs for {prompt}."
    elif "code" in prompt.lower():
        response = f"Here's code for {prompt}."
    else:
        response = f"I can help with {prompt}."

    return {
        "response": response,
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn

    PORT = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=PORT)
