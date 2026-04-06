@echo off
title 🚀 SYNOVA AI - QUICK START

echo 🧠 SYNOVA AI - YOUR AI BUSINESS SYSTEM
echo 🎯 Starting All Services...
echo.

echo ⚡ STEP 1: Starting API Server...
start "SYNOVA API" cmd /c "cd /d %~dp0repos\synova-core-api && node main.js"

echo ⏳ Waiting 8 seconds for API to initialize...
timeout /t 8 /nobreak >nul

echo ⚡ STEP 2: Starting Web App...
start "SYNOVA Web" cmd /c "cd /d %~dp0repos\synova-web && npm run dev"

echo ⏳ Waiting 8 seconds for Web App...
timeout /t 8 /nobreak >nul

echo ⚡ STEP 3: Starting Mobile Web...
start "SYNOVA Mobile" cmd /c "cd /d %~dp0repos\synova-mobile && npm run web"

echo.
echo ✅ ALL SYNOVA AI SERVICES STARTING!
echo.
echo 🌐 ACCESS YOUR AI BUSINESS:
echo    📱 Web App: http://localhost:3000
echo    🔧 API Dashboard: http://localhost:8000
echo    📲 Mobile Web: http://localhost:19006
echo.
echo 💡 Wait 15-20 seconds for full startup
echo 🎯 Then start generating API keys and revenue!
echo.
echo 🚀 Press any key to open Web App...
pause >nul
start http://localhost:3000
