@echo off
echo 🌐 SYNTHOVA AI - WEB DASHBOARD BUILD SCRIPT
echo ================================================
echo.
echo 🌐 Building Synova AI Web Dashboard...
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

echo [2/5] Checking Next.js...
npx next --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Next.js not found. Installing...
    npm install next@latest
)

echo ✅ Next.js is ready
echo.

echo [3/5] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ npm install failed
    pause
    exit /b 1
)

echo ✅ Dependencies installed
echo.

echo [4/5] Building web application...
echo 🏗️ Building Next.js web application...
echo.

call npm run build

if %errorlevel% neq 0 (
    echo ❌ Web build failed
    pause
    exit /b 1
)

echo ✅ Web application build completed successfully!
echo.

echo [5/5] Starting production server...
echo 🚀 Starting Synova AI Web Dashboard...
echo.

call npm start

echo.
echo 🎉 SYNTHOVA AI WEB DASHBOARD IS RUNNING!
echo.
echo 📋 ACCESS POINTS:
echo 🌐 Local: http://localhost:3000
echo 📊 Dashboard: http://localhost:3000/dashboard
echo 🔧 API: http://localhost:8001
echo.
echo 📋 NEXT STEPS:
echo 1. Open http://localhost:3000 in your browser
echo 2. Access the complete AI dashboard
echo 3. Generate API keys and manage users
echo 4. Monitor real-time business analytics
echo.

pause
