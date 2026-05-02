@echo off
echo Building Synova AI Desktop Application...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Install dependencies
echo Installing dependencies...
call npm install

REM Build the web app first
echo Building web application...
cd ..
call npm run build

REM Return to desktop directory
cd desktop

REM Create build directory if it doesn't exist
if not exist build mkdir build

REM Copy built web app to desktop build folder
echo Copying web application build...
xcopy "..\build" "build\" /E /I /Y

REM Create desktop assets folder if it doesn't exist
if not exist assets mkdir assets

REM Download a placeholder icon (you should replace this with your actual icon)
echo Creating placeholder icon...
powershell -Command "Invoke-WebRequest -Uri 'https://via.placeholder.com/512x512/4F46E5/FFFFFF?text=SY' -OutFile 'assets\icon.png'"

REM Build the desktop application
echo Building desktop executable...
call npm run build:win

if errorlevel 1 (
    echo Error: Desktop build failed.
    pause
    exit /b 1
)

echo.
echo ✅ Desktop application built successfully!
echo 📁 Installation files are in the 'dist' folder
echo.
echo Available installers:
dir dist\*.exe /B
echo.
pause
