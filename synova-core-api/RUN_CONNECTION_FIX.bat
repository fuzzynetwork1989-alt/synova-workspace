@echo true
title 🚀 SYNOVA AI - RUN CONNECTION FIX

echo 🚀 SYNOVA AI - RUNNING CONNECTION FIX
echo 🔧 This will execute the connection issues fix script
echo.

echo 📋 STEP 1: Navigate to Project Directory
cd /d "%~dp0"

echo 📋 STEP 2: Execute Connection Fix Script
echo 🛠️ Running FIX_CONNECTION_ISSUES.bat...
echo.

call FIX_CONNECTION_ISSUES.bat

echo.
echo 📋 STEP 3: Fix Complete
echo ✅ Connection fix script has been executed
echo 🌐 Please check if services are now accessible
echo.
echo 🌐 Test these URLs:
echo    📱 Web App: http://localhost:3000
echo    🔧 API Dashboard: http://localhost:8000
echo    📲 Mobile Web: http://localhost:19006
echo.

pause
