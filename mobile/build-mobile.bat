@echo off
echo Building Synova AI Mobile Application (Android APK)...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if Expo CLI is installed
npx expo --version >nul 2>&1
if errorlevel 1 (
    echo Installing Expo CLI...
    call npm install -g @expo/cli
)

REM Install dependencies
echo Installing mobile dependencies...
call npm install

REM Create assets directory if it doesn't exist
if not exist assets mkdir assets

REM Download placeholder assets (replace with your actual assets)
echo Creating placeholder assets...
powershell -Command "Invoke-WebRequest -Uri 'https://via.placeholder.com/1024x1024/4F46E5/FFFFFF?text=SY' -OutFile 'assets\icon.png'"
powershell -Command "Invoke-WebRequest -Uri 'https://via.placeholder.com/1024x1024/4F46E5/FFFFFF?text=SY' -OutFile 'assets\adaptive-icon.png'"
powershell -Command "Invoke-WebRequest -Uri 'https://via.placeholder.com/1920x1080/4F46E5/FFFFFF?text=Synova+AI' -OutFile 'assets\splash.png'"
powershell -Command "Invoke-WebRequest -Uri 'https://via.placeholder.com/192x192/4F46E5/FFFFFF?text=SY' -OutFile 'assets\favicon.png'"

REM Check if user is logged in to Expo
echo Checking Expo login status...
npx expo whoami >nul 2>&1
if errorlevel 1 (
    echo Please login to Expo first:
    echo npx expo login
    echo.
    echo Then run this script again.
    pause
    exit /b 1
)

REM Build options
echo.
echo Build Options:
echo 1. Development APK (fast, for testing)
echo 2. Production APK (signed, for distribution)
echo 3. App Bundle (AAB for Google Play Store)
echo.
set /p buildType="Select build type (1-3): "

if "%buildType%"=="1" (
    echo Building Development APK...
    call npx eas build --platform android --profile development --local
) else if "%buildType%"=="2" (
    echo Building Production APK...
    call npx eas build --platform android --profile production --local
) else if "%buildType%"=="3" (
    echo Building App Bundle (AAB)...
    call npx eas build --platform android --profile production --local
) else (
    echo Invalid selection. Defaulting to Development APK...
    call npx eas build --platform android --profile development --local
)

if errorlevel 1 (
    echo Error: Mobile build failed.
    echo.
    echo Troubleshooting:
    echo 1. Make sure you have Android Studio installed
    echo 2. Set up Android SDK and emulator
    echo 3. Login to Expo: npx expo login
    echo 4. Configure EAS: npx eas build:configure
    pause
    exit /b 1
)

echo.
echo ✅ Mobile application built successfully!
echo 📁 APK/AAB files are in the build output folder
echo.
echo To install APK on Android device:
echo 1. Transfer APK file to device
echo 2. Enable "Install from unknown sources" in settings
echo 3. Tap APK file to install
echo.
pause
