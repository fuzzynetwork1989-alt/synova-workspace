@echo off
REM Synova AI - Package for Mini PC Deployment
REM This script prepares the project for transfer to mini PC

echo ========================================
echo Synova AI - Mini PC Deployment Package
echo ========================================
echo.

echo Step 1: Creating deployment directory...
if not exist "synova-deployment" mkdir synova-deployment

echo Step 2: Copying project files...
xcopy /E /I /Y "apps" "synova-deployment\apps"
xcopy /E /I /Y "ml" "synova-deployment\ml"
xcopy /E /I /Y "data" "synova-deployment\data"
xcopy /E /I /Y "scripts" "synova-deployment\scripts"
xcopy /E /I /Y "docs" "synova-deployment\docs"

echo Step 3: Copying configuration files...
copy "docker-compose.yml" "synova-deployment\"
copy "BUILD_GUIDE.md" "synova-deployment\"
copy "PROJECT_STATUS.md" "synova-deployment\"
copy "TAURI_BUILD_FIX.md" "synova-deployment\"
copy "RAILWAY_DEPLOYMENT_GUIDE.md" "synova-deployment\"

echo Step 4: Creating setup instructions...
(
echo Synova AI - Mini PC Setup Instructions
echo ======================================
echo.
echo 1. Copy this entire folder to your mini PC
echo 2. Install Node.js 18+ on mini PC
echo 3. Install Rust on mini PC (for desktop build)
echo 4. Install Python 3.11+ on mini PC (for API)
echo 5. Install Java JDK 17+ (for Android build)
echo 6. Install Android Studio with SDK (for Android build)
echo.
echo BUILD DESKTOP APP:
echo cd apps/desktop
echo npm install
echo npm run tauri build
echo.
echo BUILD ANDROID APK:
echo cd apps/mobile
echo npm install
echo npx expo build:android
echo.
echo START API SERVER:
echo cd apps/api
echo .\start-api.bat
echo.
echo For detailed instructions, see BUILD_GUIDE.md
) > "synova-deployment\README_MINIPC.txt"

echo.
echo ========================================
echo Deployment package created successfully!
echo Location: synova-deployment\
echo.
echo Transfer this folder to your mini PC
echo and follow the instructions in README_MINIPC.txt
echo ========================================
echo.

pause
