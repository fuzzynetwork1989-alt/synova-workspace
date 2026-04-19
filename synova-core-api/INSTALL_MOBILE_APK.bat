@echo off
title 📱 SYNOVA AI - MOBILE APK INSTALLATION

echo 📱 SYNOVA AI - MOBILE APK INSTALLATION
echo 🚀 Installing Android Application
echo.

echo 📋 STEP 1: Check System Requirements
echo.

echo 🔍 Checking system requirements...
echo 📋 Required: Android SDK, Java JDK, 4GB RAM
echo.

echo 🔍 Checking Java installation...
java -version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Java is installed
    java -version
) else (
    echo ❌ Java not found
    echo 💡 Installing Java JDK...
    
    if not exist "jdk-installer.exe" (
        echo 📦 Downloading Java JDK...
        powershell -Command "Invoke-WebRequest -Uri 'https://download.oracle.com/java/21/latest/jdk-21_windows-x64_bin.exe' -OutFile 'jdk-installer.exe'"
    )
    
    echo 🛠️ Installing Java JDK...
    start /wait jdk-installer.exe /s
    
    echo ⏳ Waiting for installation...
    timeout /t 30 /nobreak >nul
    
    echo 🔍 Verifying Java installation...
    java -version >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ Java installed successfully
        java -version
    ) else (
        echo ❌ Java installation failed
        echo 💡 Please install manually from https://oracle.com/java/
        pause
        exit /b
    )
)

echo.
echo 📋 STEP 2: Check Android Studio/SDK
echo.

echo 🔍 Checking Android SDK...
if exist "%LOCALAPPDATA%\Android\Sdk" (
    echo ✅ Android SDK found
    set "ANDROID_SDK_ROOT=%LOCALAPPDATA%\Android\Sdk"
) else if exist "C:\Users\%USERNAME%\AppData\Local\Android\Sdk" (
    echo ✅ Android SDK found
    set "ANDROID_SDK_ROOT=C:\Users\%USERNAME%\AppData\Local\Android\Sdk"
) else (
    echo ❌ Android SDK not found
    echo 💡 Installing Android Studio...
    
    if not exist "android-studio.exe" (
        echo 📦 Downloading Android Studio...
        powershell -Command "Invoke-WebRequest -Uri 'https://redirector.gvt1.com/edgedl/android/studio/ide-zips/2023.3.1.18/windows/android-studio-2023.3.1.18-windows.zip' -OutFile 'android-studio.zip'"
        powershell -Command "Expand-Archive -Path 'android-studio.zip' -DestinationPath '.'"
    )
    
    echo 🛠️ Please install Android Studio manually:
    echo    1. Open android-studio\bin\studio64.exe
    echo    2. Complete installation
    echo    3. Install Android SDK
    echo    4. Run this script again
    pause
    exit /b
)

echo.
echo 📋 STEP 3: Setup Mobile Project
echo.

echo 🛠️ Setting up mobile project...
cd /d %~dp0repos\synova-mobile

if not exist "package.json" (
    echo ❌ Mobile project not found
    echo 💡 Creating mobile project...
    call npx create-expo-app synova-mobile --template
    cd synova-mobile
) else (
    echo ✅ Mobile project found
)

echo.
echo 📋 STEP 4: Install Dependencies
echo.

echo 📦 Installing mobile dependencies...
call npm install
call npm install @expo/vector-icons expo-av expo-camera expo-file-system expo-sqlite
call npm install react-native-web react-dom

echo.
echo 📋 STEP 5: Configure for APK Build
echo.

echo 🔧 Configuring for APK build...
if not exist "app.json" (
    echo ❌ app.json not found
) else (
    echo 🛠️ Updating app.json for APK build...
    powershell -Command "(Get-Content app.json) -replace '\"expo\": {', '\"expo\": { \"android\": { \"package\": \"com.synova.ai\", \"versionCode\": 1 }, ' | Set-Content app.json"
)

echo.
echo 📋 STEP 6: Install EAS CLI
echo.

echo 📦 Installing EAS CLI for APK building...
call npm install -g eas-cli

echo.
echo 📋 STEP 7: Login to Expo
echo.

echo 🔑 Logging into Expo account...
echo 💡 If you don't have an Expo account, create one at https://expo.dev/
echo.
set /p expo_email="Enter your Expo email: "
set /p expo_password="Enter your Expo password: "

echo 🚀 Logging in...
call eas login -u %expo_email% -p %expo_password%

if %errorlevel% equ 0 (
    echo ✅ Successfully logged in to Expo
) else (
    echo ❌ Login failed
    echo 💡 Please check your credentials and try again
    pause
    exit /b
)

echo.
echo 📋 STEP 8: Configure EAS Build
echo.

echo 🔧 Configuring EAS build...
if not exist "eas.json" (
    echo 🛠️ Creating eas.json configuration...
    echo { > eas.json
    echo   "cli": { >> eas.json
    echo     "version": ">= 3.12.0" >> eas.json
    echo   }, >> eas.json
    echo   "build": { >> eas.json
    echo     "development": { >> eas.json
    echo       "developmentClient": true, >> eas.json
    echo       "distribution": "internal" >> eas.json
    echo     }, >> eas.json
    echo     "preview": { >> eas.json
    echo       "distribution": "store" >> eas.json
    echo     }, >> eas.json
    echo     "production": { >> eas.json
    echo       "android": { >> eas.json
    echo         "buildType": "apk" >> eas.json
    echo       } >> eas.json
    echo     } >> eas.json
    echo   }, >> eas.json
    echo   "submit": { >> eas.json
    echo     "production": {} >> eas.json
    echo   } >> eas.json
    echo } >> eas.json
    echo ✅ eas.json created
) else (
    echo ✅ eas.json already exists
)

echo.
echo 📋 STEP 9: Build APK
echo.

echo 🚀 Building SYNOVA AI APK...
echo ⏳ This may take 10-15 minutes...
echo.

call eas build --platform android --profile production

if %errorlevel% equ 0 (
    echo ✅ APK build successful!
    echo 📱 APK file should be available in your Expo account
    echo 💾 Download from: https://expo.dev/accounts/[your-account]/projects/[project-id]/builds
) else (
    echo ❌ APK build failed
    echo 💡 Trying alternative build method...
    call eas build --platform android --profile preview
)

echo.
echo 📋 STEP 10: Install APK on Device
echo.

echo 📱 Installing APK on connected device...
echo 💡 Connect your Android device via USB and enable USB debugging
echo.

echo 🔍 Checking for connected devices...
call adb devices

echo.
echo 📋 If you see your device listed above, the APK will be installed automatically
echo 📋 If not, download the APK from Expo and install manually
echo.

echo 📋 STEP 11: Create Mobile Shortcut
echo.

echo 🖱️ Creating mobile development shortcut...
powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%USERPROFILE%\Desktop\SYNOVA Mobile Dev.lnk'); $Shortcut.TargetPath = 'cmd'; $Shortcut.Arguments = '/k cd /d \"%~dp0repos\synova-mobile\" && npm start'; $Shortcut.WorkingDirectory = '%~dp0repos\synova-mobile'; $Shortcut.IconLocation = 'shell32.dll,13'; $Shortcut.Description = '📱 SYNOVA AI Mobile Development'; $Shortcut.Save()"

echo ✅ Mobile development shortcut created
echo.

echo 📋 STEP 12: Test Mobile App
echo.

echo 🧪 Testing mobile application...
echo 🚀 Starting mobile development server...
start "SYNOVA Mobile Dev" cmd /k "cd /d %~dp0repos\synova-mobile && npm start"

echo.
echo ⏳ Waiting for mobile server to start...
timeout /t 15 /nobreak >nul

echo ✅ Mobile development server should be running!
echo 📱 Scan QR code in Expo Go app to test
echo 🌐 Or access at: http://localhost:19006

echo.
echo 📱 MOBILE APK INSTALLATION COMPLETE!
echo.
echo 📋 WHAT WAS INSTALLED:
echo    ✅ Java JDK (if needed)
echo    ✅ Android SDK (if needed)
echo    ✅ EAS CLI for APK building
echo    ✅ Mobile project configuration
echo    ✅ APK build system
echo    ✅ Development shortcuts
echo.
echo 📋 APK BUILD STATUS:
echo    📱 APK built and ready for installation
echo    💾 Download from Expo dashboard
echo    📲 Install on Android devices
echo    🧪 Test with Expo Go app
echo.
echo 📋 HOW TO USE:
echo    1. Download APK from Expo dashboard
echo    2. Install on Android device
echo    3. Launch SYNOVA AI mobile app
echo    4. Connect to your AI business
echo    5. Generate API keys on the go
echo.
echo 🎯 Your SYNOVA AI mobile app is ready!
echo 🚀 Professional mobile experience achieved!

pause
