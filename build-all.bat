@echo off
echo ========================================
echo Building Synova AI - Desktop + Mobile
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo Step 1: Building Web Application...
call npm run build
if errorlevel 1 (
    echo Error: Web application build failed.
    pause
    exit /b 1
)
echo ✅ Web application built successfully!
echo.

echo Step 2: Building Desktop Application...
cd desktop
call build-desktop.bat
if errorlevel 1 (
    echo Error: Desktop application build failed.
    cd ..
    pause
    exit /b 1
)
cd ..
echo ✅ Desktop application built successfully!
echo.

echo Step 3: Building Mobile Application...
cd mobile
call build-mobile.bat
if errorlevel 1 (
    echo Error: Mobile application build failed.
    cd ..
    pause
    exit /b 1
)
cd ..
echo ✅ Mobile application built successfully!
echo.

echo ========================================
echo 🎉 ALL BUILDS COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo 📦 Available distribution files:
echo.
echo Desktop:
echo   - Location: desktop\dist\
echo   - Files: Synova AI Setup.exe (Windows)
echo.
echo Mobile:
echo   - Location: mobile\build\ or EAS build output
echo   - Files: synova-mobile.apk (Android)
echo.
echo Web:
echo   - Location: build\
echo   - Files: Static web files for deployment
echo.
echo Installation Instructions:
echo.
echo Desktop (Windows):
echo   1. Run desktop\dist\Synova AI Setup.exe
echo   2. Follow installation wizard
echo   3. Launch from Start Menu or Desktop
echo.
echo Mobile (Android):
echo   1. Transfer APK to Android device
echo   2. Enable "Install from unknown sources"
echo   3. Tap APK file to install
echo   4. Launch from App Drawer
echo.
echo Web:
echo   1. Deploy build\ folder to web server
echo   2. Configure environment variables
echo   3. Access via browser
echo.
pause
