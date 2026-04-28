@echo off
echo 🚀 SYNTHOVA AI - PRODUCTION STARTUP SCRIPT
echo ================================================
echo.
echo 🔑 Starting Complete API Key System - 100% Ready
echo.

echo [1/5] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js first.
    pause
    exit /b 1
)

echo ✅ Node.js is installed
echo.

echo [2/5] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ npm install failed
    pause
    exit /b 1
)

echo ✅ Dependencies installed
echo.

echo [3/5] Starting production server...
echo 🌐 Server will start on http://localhost:8001
echo 📊 Dashboard: http://localhost:8001/dashboard.html
echo 📚 API Documentation: http://localhost:8001/api/v1/status
echo.
echo 🎉 SYNTHOVA AI IS READY FOR PRODUCTION!
echo 💰 Your API Key Business is now operational!
echo 🔑 Generate API Keys and start earning revenue!
echo.
echo Press Ctrl+C to stop the server
echo.

node main.js
