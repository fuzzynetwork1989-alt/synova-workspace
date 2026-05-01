@echo off
echo 🚀 SYNOVA AI - STARTING ALL SERVICES
echo 🧠 Your Complete AI Business System
echo.

echo 1️⃣ Starting API Server (port 8000)...
start "SYNOVA API" cmd /k "cd /d %~dp0repos\synova-core-api && node main.js"

echo.
echo 2️⃣ Waiting 5 seconds for API to start...
timeout /t 5 /nobreak >nul

echo.
echo 3️⃣ Starting Web App (port 3000)...
start "SYNOVA Web" cmd /k "cd /d %~dp0repos\synova-web && npm run dev"

echo.
echo 4️⃣ Waiting 5 seconds for Web App to start...
timeout /t 5 /nobreak >nul

echo.
echo 5️⃣ Starting Mobile Web (port 19006)...
start "SYNOVA Mobile" cmd /k "cd /d %~dp0repos\synova-mobile && npm run web"

echo.
echo ✅ All SYNOVA AI Services Starting...
echo.
echo 🌐 Access URLs:
echo    📱 Web App: http://localhost:3000
echo    🔧 API Dashboard: http://localhost:8000
echo    📲 Mobile Web: http://localhost:19006
echo.
echo 💡 Wait 10-15 seconds for all services to fully load
echo 🎯 Your AI Business is almost ready!

pause
