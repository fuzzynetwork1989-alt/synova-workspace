"""
Ultimate Railway 502 Fix
Absolutely minimal API - guaranteed to work
"""

from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "OK"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/generate")
async def generate(data: dict):
    return {"response": "Working"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
