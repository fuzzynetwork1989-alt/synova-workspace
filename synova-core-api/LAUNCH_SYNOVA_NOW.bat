@echo off
title 🚀 SYNOVA AI - LAUNCH NOW

echo 🚀 SYNOVA AI - LAUNCHING YOUR AI BUSINESS
echo 🧠 Revolutionary AI Business System Starting
echo.

echo 📋 STEP 1: Starting API Server
echo ⚡ Launching SYNOVA AI API on port 8000...
start cmd /k "cd /d %~dp0repos\synova-core-api && node main.js"

echo.
echo 📋 STEP 2: Starting Web Application
echo ⚡ Launching SYNOVA AI Web App on port 3000...
start cmd /k "cd /d %~dp0repos\synova-web && npm run dev"

echo.
echo 📋 STEP 3: Starting Mobile Web
echo ⚡ Launching SYNOVA AI Mobile Web on port 19006...
start cmd /k "cd /d %~dp0repos\synova-mobile && npm run web"

echo.
echo 📋 STEP 4: Waiting for Services to Initialize
echo ⏳ Giving services time to start up...
timeout /t 15 /nobreak >nul

echo.
echo 📋 STEP 5: Opening Your AI Business
echo 🌐 Opening SYNOVA AI Web Application...
start http://localhost:3000

echo.
echo ✅ SYNOVA AI BUSINESS SYSTEM LAUNCHED!
echo.
echo 🎯 YOUR AI BUSINESS IS NOW LIVE:
echo    📱 Web App: http://localhost:3000
echo    🔧 API Dashboard: http://localhost:8000
echo    📲 Mobile Web: http://localhost:19006
echo.
echo 💰 NEXT STEPS:
echo    1. Generate API keys for customers
echo    2. Set up payment processing
echo    3. Launch marketing campaigns
echo    4. Start generating revenue
echo.
echo 🧠 SYNOVA AI - WHERE KNOWLEDGE CREATES WHAT MONEY CANNOT BUY!
echo 🚀 Your Revolutionary AI Business is operational!

pause
