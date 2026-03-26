# Railway Startup Script
import os
import sys

# Print environment for debugging
print("=== Railway Environment Debug ===")
print(f"Python version: {sys.version}")
print(f"Working directory: {os.getcwd()}")

# Check for Railway environment variables
railway_vars = ['PORT', 'RAILWAY_ENVIRONMENT', 'RAILWAY_SERVICE_NAME', 'RAILWAY_PROJECT_ID']
for var in railway_vars:
    value = os.environ.get(var, 'NOT_SET')
    print(f"{var}: {value}")

print("=== Starting Application ===")

# Import and run the main application
try:
    from main import app
    import uvicorn
    
    # Get port from Railway environment
    port = int(os.environ.get('PORT', 8000))
    print(f"Starting server on port: {port}")
    
    # Run the application
    uvicorn.run(app, host="0.0.0.0", port=port)
except Exception as e:
    print(f"Error starting application: {e}")
    import traceback
    traceback.print_exc()
