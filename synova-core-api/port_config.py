# Railway Port Configuration Fix
import os

# Check Railway port configuration
port = os.environ.get('PORT', 8000)
print(f"Starting on port: {port}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(port))
