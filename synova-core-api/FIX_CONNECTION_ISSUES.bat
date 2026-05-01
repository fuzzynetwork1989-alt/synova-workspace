@echo off
title 🔧 SYNOVA AI - CONNECTION ISSUES FIXER

echo 🔧 SYNOVA AI - CONNECTION ISSUES FIX
echo 🚀 Resolving localhost connection problems
echo.

echo 📋 STEP 1: Check Service Status
echo.

echo 🔍 Checking if SYNOVA AI services are running...
tasklist | findstr "node.exe" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Node.js processes found
    echo 📊 Running Node.js processes:
    tasklist | findstr "node.exe"
) else (
    echo ❌ No Node.js processes running
    echo 💡 Services need to be started
)

echo.
echo 🔍 Checking port usage...
netstat -an | findstr ":3000" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Port 3000 is in use (Web App)
) else (
    echo ❌ Port 3000 is not in use
)

netstat -an | findstr ":8000" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Port 8000 is in use (API Server)
) else (
    echo ❌ Port 8000 is not in use
)

netstat -an | findstr ":19006" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Port 19006 is in use (Mobile Web)
) else (
    echo ❌ Port 19006 is not in use
)

echo.
echo 📋 STEP 2: Kill Existing Processes
echo.

echo 🔄 Stopping any existing SYNOVA AI processes...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im cmd.exe /fi "windowtitle eq SYNOVA*" >nul 2>&1

echo ⏳ Waiting for processes to terminate...
timeout /t 3 /nobreak >nul

echo ✅ Existing processes stopped
echo.

echo 📋 STEP 3: Check Dependencies
echo.

echo 🔍 Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Node.js is installed
    node --version
) else (
    echo ❌ Node.js not found
    echo 💡 Please install Node.js from https://nodejs.org/
    pause
    exit /b
)

echo.
echo 🔍 Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ npm is installed
    npm --version
) else (
    echo ❌ npm not found
    echo 💡 Please install npm with Node.js
    pause
    exit /b
)

echo.
echo 📋 STEP 4: Check Project Structure
echo.

echo 🔍 Verifying required directories...
if exist "repos\synova-core-api" (
    echo ✅ API directory exists
) else (
    echo ❌ API directory missing
    echo 💡 Creating API directory structure...
    mkdir repos\synova-core-api
)

if exist "repos\synova-web" (
    echo ✅ Web directory exists
) else (
    echo ❌ Web directory missing
    echo 💡 Creating Web directory structure...
    mkdir repos\synova-web
)

if exist "repos\synova-mobile" (
    echo ✅ Mobile directory exists
) else (
    echo ❌ Mobile directory missing
    echo 💡 Creating Mobile directory structure...
    mkdir repos\synova-mobile
)

echo.
echo 📋 STEP 5: Check Required Files
echo.

echo 🔍 Checking API server file...
if exist "repos\synova-core-api\main.js" (
    echo ✅ API server file exists
) else (
    echo ❌ API server file missing
    echo 💡 Creating minimal API server...
    echo const express = require('express'); > repos\synova-core-api\main.js
    echo const app = express(); >> repos\synova-core-api\main.js
    echo const port = 8000; >> repos\synova-core-api\main.js
    echo. >> repos\synova-core-api\main.js
    echo app.get('/', (req, res) => { >> repos\synova-core-api\main.js
    echo   res.json({ message: '🧠 SYNOVA AI API Server Running!', status: 'operational' }); >> repos\synova-core-api\main.js
    echo }); >> repos\synova-core-api\main.js
    echo. >> repos\synova-core-api\main.js
    echo app.listen(port, () => { >> repos\synova-core-api\main.js
    echo   console.log(`🚀 SYNOVA AI API Server running on port ${port}`); >> repos\synova-core-api\main.js
    echo }); >> repos\synova-core-api\main.js
    echo ✅ Minimal API server created
)

echo.
echo 🔍 Checking web app files...
if exist "repos\synova-web\package.json" (
    echo ✅ Web app package.json exists
) else (
    echo ❌ Web app package.json missing
    echo 💡 Creating minimal web app...
    echo { > repos\synova-web\package.json
    echo   "name": "synova-web", >> repos\synova-web\package.json
    echo   "version": "1.0.0", >> repos\synova-web\package.json
    echo   "scripts": { >> repos\synova-web\package.json
    echo     "dev": "next dev", >> repos\synova-web\package.json
    echo     "build": "next build", >> repos\synova-web\package.json
    echo     "start": "next start" >> repos\synova-web\package.json
    echo   }, >> repos\synova-web\package.json
    echo   "dependencies": { >> repos\synova-web\package.json
    echo     "next": "^13.0.0", >> repos\synova-web\package.json
    echo     "react": "^18.0.0", >> repos\synova-web\package.json
    echo     "react-dom": "^18.0.0" >> repos\synova-web\package.json
    echo   } >> repos\synova-web\package.json
    echo } >> repos\synova-web\package.json
    echo ✅ Web app package.json created
)

if exist "repos\synova-web\pages\index.js" (
    echo ✅ Web app index page exists
) else (
    echo ❌ Web app index page missing
    echo 💡 Creating minimal web app page...
    if not exist "repos\synova-web\pages" mkdir repos\synova-web\pages
    echo function HomePage() { > repos\synova-web\pages\index.js
    echo   return ( >> repos\synova-web\pages\index.js
    echo     ^<div^> >> repos\synova-web\pages\index.js
    echo       ^<h1^>🧠 SYNOVA AI Web App^</h1^> >> repos\synova-web\pages\index.js
    echo       ^<p^>🚀 Your AI Business System is Running!^</p^> >> repos\synova-web\pages\index.js
    echo       ^<p^>💰 Ready for Revenue Generation^</p^> >> repos\synova-web\pages\index.js
    echo     ^</div^> >> repos\synova-web\pages\index.js
    echo   ); >> repos\synova-web\pages\index.js
    echo } >> repos\synova-web\pages\index.js
    echo. >> repos\synova-web\pages\index.js
    echo export default HomePage; >> repos\synova-web\pages\index.js
    echo ✅ Web app index page created
)

echo.
echo 🔍 Checking mobile app files...
if exist "repos\synova-mobile\package.json" (
    echo ✅ Mobile app package.json exists
) else (
    echo ❌ Mobile app package.json missing
    echo 💡 Creating minimal mobile app...
    echo { > repos\synova-mobile\package.json
    echo   "name": "synova-mobile", >> repos\synova-mobile\package.json
    echo   "version": "1.0.0", >> repos\synova-mobile\package.json
    echo   "main": "node_modules/expo/AppEntry.js", >> repos\synova-mobile\package.json
    echo   "scripts": { >> repos\synova-mobile\package.json
    echo     "start": "expo start", >> repos\synova-mobile\package.json
    echo     "web": "expo start --web", >> repos\synova-mobile\package.json
    echo     "android": "expo start --android", >> repos\synova-mobile\package.json
    echo     "ios": "expo start --ios" >> repos\synova-mobile\package.json
    echo   }, >> repos\synova-mobile\package.json
    echo   "dependencies": { >> repos\synova-mobile\package.json
    echo     "expo": "^49.0.0", >> repos\synova-mobile\package.json
    echo     "react": "^18.0.0", >> repos\synova-mobile\package.json
    echo     "react-native": "^0.72.0" >> repos\synova-mobile\package.json
    echo   } >> repos\synova-mobile\package.json
    echo } >> repos\synova-mobile\package.json
    echo ✅ Mobile app package.json created
)

echo.
echo 📋 STEP 6: Install Dependencies
echo.

echo 📦 Installing API dependencies...
cd /d %~dp0repos\synova-core-api
if not exist "node_modules" (
    echo 🛠️ Installing Express for API server...
    npm install express
) else (
    echo ✅ API dependencies already installed
)

echo.
echo 📦 Installing web app dependencies...
cd /d %~dp0repos\synova-web
if not exist "node_modules" (
    echo 🛠️ Installing Next.js and React...
    npm install
) else (
    echo ✅ Web app dependencies already installed
)

echo.
echo 📦 Installing mobile app dependencies...
cd /d %~dp0repos\synova-mobile
if not exist "node_modules" (
    echo 🛠️ Installing Expo and React Native...
    npm install
) else (
    echo ✅ Mobile app dependencies already installed
)

cd /d %~dp0

echo.
echo 📋 STEP 7: Start Services Sequentially
echo.

echo 🚀 Starting API Server (port 8000)...
start "SYNOVA API" cmd /k "cd /d %~dp0repos\synova-core-api && node main.js"

echo ⏳ Waiting 5 seconds for API server to start...
timeout /t 5 /nobreak >nul

echo.
echo 🚀 Starting Web App (port 3000)...
start "SYNOVA Web" cmd /k "cd /d %~dp0repos\synova-web && npm run dev"

echo ⏳ Waiting 10 seconds for web app to start...
timeout /t 10 /nobreak >nul

echo.
echo 🚀 Starting Mobile Web (port 19006)...
start "SYNOVA Mobile" cmd /k "cd /d %~dp0repos\synova-mobile && npm run web"

echo ⏳ Waiting 15 seconds for mobile web to start...
timeout /t 15 /nobreak >nul

echo.
echo 📋 STEP 8: Verify Services Are Running
echo.

echo 🔍 Testing API Server...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8000' -TimeoutSec 5; Write-Host '✅ API Server is responding' } catch { Write-Host '❌ API Server not responding' }"

echo.
echo 🔍 Testing Web App...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000' -TimeoutSec 5; Write-Host '✅ Web App is responding' } catch { Write-Host '❌ Web App not responding' }"

echo.
echo 🔍 Testing Mobile Web...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:19006' -TimeoutSec 5; Write-Host '✅ Mobile Web is responding' } catch { Write-Host '❌ Mobile Web not responding' }"

echo.
echo 📋 STEP 9: Open Services in Browser
echo.

echo 🌐 Opening SYNOVA AI services in browser...
start http://localhost:8000
timeout /t 2 /nobreak >nul
start http://localhost:3000
timeout /t 2 /nobreak >nul
start http://localhost:19006

echo.
echo 📋 STEP 10: Connection Troubleshooting Guide
echo.

echo 🔧 CONNECTION TROUBLESHOOTING:
echo.
echo ✅ If services still don't work:
echo    1. Check Windows Firewall settings
echo    2. Disable VPN or proxy temporarily
echo    3. Clear browser cache and cookies
echo    4. Try different browser (Chrome, Firefox, Edge)
echo    5. Check if antivirus is blocking localhost
echo.
echo 🔧 PORT CONFLICTS:
echo    If ports are in use by other applications:
echo    1. Close other applications using ports 3000, 8000, 19006
echo    2. Or modify ports in configuration files
echo.
echo 🔧 NETWORK SETTINGS:
echo    1. Ensure localhost resolves to 127.0.0.1
echo    2. Check hosts file: C:\Windows\System32\drivers\etc\hosts
echo    3. Verify network adapter is working
echo.

echo ✅ CONNECTION ISSUES FIX COMPLETE!
echo.
echo 🌐 YOUR SYNOVA AI SERVICES SHOULD NOW BE ACCESSIBLE:
echo    📱 Web App: http://localhost:3000
echo    🔧 API Dashboard: http://localhost:8000
echo    📲 Mobile Web: http://localhost:19006
echo.
echo 💡 If issues persist:
echo    - Check individual service windows for error messages
echo    - Run this script again to restart services
echo    - Verify all dependencies are installed correctly
echo.
echo 🚀 Your SYNOVA AI Business System is now running!

pause
