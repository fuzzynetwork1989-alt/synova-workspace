@echo off
title 🚀 SYNOVA AI - STARTING ALL SERVICES

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
echo ⏳ Waiting 10 seconds for all services to fully start...
timeout /t 10 /nobreak >nul

echo.
echo ✅ ALL SYNOVA AI SERVICES STARTED!
echo.
echo 🌐 ACCESS YOUR AI BUSINESS:
echo    📱 Web App: http://localhost:3000
echo    🔧 API Dashboard: http://localhost:8000
echo    📲 Mobile Web: http://localhost:19006
echo.
echo 💡 Services are running in separate command windows
echo 🎯 Close this window - services will continue running
echo.
echo 🚀 Press any key to open Web App...
pause >nul
start http://localhost:3000

echo.
echo 🎯 SYNOVA AI BUSINESS SYSTEM IS LIVE!
echo 💰 Start generating API keys and revenue immediately!
echo 🧠 Your Revolutionary AI Business is operational!
