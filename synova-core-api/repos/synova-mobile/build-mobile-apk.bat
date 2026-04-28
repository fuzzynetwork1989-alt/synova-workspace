@echo off
echo 🚀 SYNTHOVA AI - MOBILE APP BUILD SCRIPT
echo ================================================
echo.
echo 📱 Building Synova AI Mobile App for Android...
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

echo [2/5] Checking Expo CLI...
npx expo --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Expo CLI not found. Installing...
    npm install -g @expo/cli
)

echo ✅ Expo CLI is ready
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

echo [4/5] Building Android APK...
echo 🏗️ Building APK for Android devices...
echo.

call npx eas build --platform android --profile production --non-interactive

if %errorlevel% neq 0 (
    echo ❌ APK build failed
    pause
    exit /b 1
)

echo ✅ Android APK build completed successfully!
echo.

echo [5/5] Build Summary
echo 📱 APK Location: Check EAS dashboard or local build output
echo 📲 Install: Transfer APK to Android device and install
echo 🚀 Launch: Find "Synova AI" in your app drawer
echo.
echo 🎉 SYNTHOVA AI MOBILE APP IS READY!
echo.
echo 📋 NEXT STEPS:
echo 1. Download the APK from build output
echo 2. Enable "Unknown Sources" on Android device
echo 3. Install the APK file
echo 4. Launch Synova AI app
echo 5. Connect to your Synova AI API
echo.

pause
