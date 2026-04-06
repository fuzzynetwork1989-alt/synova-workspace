@echo off
echo 🔧 SYNTHOVA AI - CORE API STARTUP SCRIPT
echo ================================================
echo.
echo 🚀 Starting Synova AI Core API Server...
echo.

echo [1/4] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js first.
    pause
    exit /b 1
)

echo ✅ Node.js is installed
echo.

echo [2/4] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ npm install failed
    pause
    exit /b 1
)

echo ✅ Dependencies installed
echo.

echo [3/4] Checking Python environment...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python not found. Please install Python 3.14+
    pause
    exit /b 1
)

echo ✅ Python is available
echo.

echo [4/4] Starting production server...
echo 🚀 Starting Synova AI API Server...
echo.

call npm start

echo.
echo 🎉 SYNTHOVA AI CORE API IS RUNNING!
echo.
echo 📋 API ENDPOINTS:
echo 🔧 Main API: http://localhost:8001
echo 📊 Analytics: http://localhost:8001/api/v1/analytics
echo 🔑 Keys: http://localhost:8001/api/v1/generate-key
echo 🤖 AI Chat: http://localhost:8001/api/v1/synova-ai
echo 🌐 WebSocket: ws://localhost:8001/ws
echo.
echo 📋 CONNECTED SERVICES:
echo ✅ Smart AI Routing
echo ✅ Database Persistence
echo ✅ Real-time Analytics
echo ✅ API Key Management
echo ✅ WebSocket Service
echo.

pause
