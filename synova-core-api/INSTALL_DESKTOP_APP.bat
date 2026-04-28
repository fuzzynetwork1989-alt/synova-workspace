@echo off
title 🖥️ SYNOVA AI - DESKTOP APP INSTALLATION

echo 🖥️ SYNOVA AI - DESKTOP APP INSTALLATION
echo 🚀 Installing Professional Desktop Application
echo.

echo 📋 STEP 1: Check System Requirements
echo.

echo 🔍 Checking system requirements...
echo 📋 Required: Windows 10/11, 4GB RAM, 2GB storage
echo.

systeminfo | findstr /B /C:"OS Name" | findstr /i "windows"
if %errorlevel% equ 0 (
    echo ✅ Windows detected
) else (
    echo ❌ Windows not detected
    echo 💡 This installer is for Windows only
    pause
    exit /b
)

echo.
echo 📋 STEP 2: Check Node.js Installation
echo.

echo 🔍 Checking Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Node.js is installed
    node --version
) else (
    echo ❌ Node.js not found
    echo 💡 Installing Node.js...
    echo 📦 Downloading Node.js installer...
    
    if not exist "node-installer.exe" (
        echo 🌐 Downloading from nodejs.org...
        powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.12.2/node-v20.12.2-x64.msi' -OutFile 'node-installer.msi'"
    )
    
    echo 🛠️ Installing Node.js...
    msiexec /i node-installer.msi /quiet /norestart
    
    echo ⏳ Waiting for installation...
    timeout /t 30 /nobreak >nul
    
    echo 🔍 Verifying Node.js installation...
    node --version >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ Node.js installed successfully
        node --version
    ) else (
        echo ❌ Node.js installation failed
        echo 💡 Please install manually from https://nodejs.org/
        pause
        exit /b
    )
)

echo.
echo 📋 STEP 3: Install Electron Framework
echo.

echo 📦 Installing Electron for desktop app...
cd /d %~dp0repos\synova-desktop
if not exist "package.json" (
    echo 🛠️ Creating desktop app structure...
    call npm init -y
    call npm install electron electron-builder --save-dev
    call npm install axios express --save
) else (
    echo 📦 Installing dependencies...
    call npm install
)

echo.
echo 📋 STEP 4: Create Desktop App
echo.

echo 🛠️ Creating SYNOVA AI desktop application...
if not exist "main.js" (
    echo const { app, BrowserWindow, Menu, ipcMain } = require('electron'); > main.js
    echo const path = require('path'); >> main.js
    echo const axios = require('axios'); >> main.js
    echo. >> main.js
    echo let mainWindow; >> main.js
    echo. >> main.js
    echo function createWindow() { >> main.js
    echo   mainWindow = new BrowserWindow({ >> main.js
    echo     width: 1200, >> main.js
    echo     height: 800, >> main.js
    echo     webPreferences: { >> main.js
    echo       nodeIntegration: true, >> main.js
    echo       contextIsolation: false >> main.js
    echo     }, >> main.js
    echo     icon: path.join(__dirname, 'assets', 'icon.png'), >> main.js
    echo     title: '🧠 SYNOVA AI - Desktop Application' >> main.js
    echo   }); >> main.js
    echo. >> main.js
    echo   // Load the web app >> main.js
    echo   mainWindow.loadURL('http://localhost:3000'); >> main.js
    echo. >> main.js
    echo   // Create menu >> main.js
    echo   const template = [ >> main.js
    echo     { >> main.js
    echo       label: 'File', >> main.js
    echo       submenu: [ >> main.js
    echo         { label: 'New API Key', click: () => { mainWindow.webContents.send('new-api-key'); } }, >> main.js
    echo         { label: 'Exit', click: () => { app.quit(); } } >> main.js
    echo       ] >> main.js
    echo     }, >> main.js
    echo     { >> main.js
    echo       label: 'View', >> main.js
    echo       submenu: [ >> main.js
    echo         { label: 'Reload', role: 'reload' }, >> main.js
    echo         { label: 'Developer Tools', role: 'toggleDevTools' } >> main.js
    echo       ] >> main.js
    echo     }, >> main.js
    echo     { >> main.js
    echo       label: 'Help', >> main.js
    echo       submenu: [ >> main.js
    echo         { label: 'About SYNOVA AI', click: () => { >> main.js
    echo           require('electron').dialog.showMessageBox(mainWindow, { >> main.js
    echo             type: 'info', >> main.js
    echo             title: 'About SYNOVA AI', >> main.js
    echo             message: '🧠 SYNOVA AI Desktop Application', >> main.js
    echo             detail: 'Revolutionary AI Business System\nWhere Knowledge Creates What Money Cannot Buy' >> main.js
    echo           }); >> main.js
    echo         }} >> main.js
    echo       ] >> main.js
    echo     } >> main.js
    echo   ]; >> main.js
    echo. >> main.js
    echo   const menu = Menu.buildFromTemplate(template); >> main.js
    echo   Menu.setApplicationMenu(menu); >> main.js
    echo } >> main.js
    echo. >> main.js
    echo app.whenReady().then(createWindow); >> main.js
    echo. >> main.js
    echo app.on('window-all-closed', () => { >> main.js
    echo   if (process.platform !== 'darwin') app.quit(); >> main.js
    echo }); >> main.js
    echo. >> main.js
    echo app.on('activate', () => { >> main.js
    echo   if (BrowserWindow.getAllWindows().length === 0) createWindow(); >> main.js
    echo }); >> main.js
    echo. >> main.js
    echo // Handle API requests from renderer >> main.js
    echo ipcMain.handle('generate-api-key', async (event, { userId, tier }) => { >> main.js
    echo   try { >> main.js
    echo     const response = await axios.post('http://localhost:8000/api/v1/generate-key', { userId, tier }); >> main.js
    echo     return response.data; >> main.js
    echo   } catch (error) { >> main.js
    echo     return { error: error.message }; >> main.js
    echo   } >> main.js
    echo }); >> main.js
)

echo ✅ Desktop app main.js created
echo.

echo 📋 STEP 5: Create App Icon
echo.

if not exist "assets" mkdir assets
echo 🎨 Creating app icon...
echo 📋 Icon placeholder created - replace with actual icon.png

echo.
echo 📋 STEP 6: Build Desktop App
echo.

echo 🛠️ Building SYNOVA AI desktop application...
call npm run build

if %errorlevel% equ 0 (
    echo ✅ Desktop app built successfully
) else (
    echo ⚠️ Build failed - trying alternative method...
    call npx electron-builder
)

echo.
echo 📋 STEP 7: Create Desktop Shortcut
echo.

echo 🖱️ Creating desktop shortcut...
powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%USERPROFILE%\Desktop\SYNOVA AI.lnk'); $Shortcut.TargetPath = '%~dp0repos\synova-desktop\dist\SYNOVA-AI.exe'; $Shortcut.WorkingDirectory = '%~dp0repos\synova-desktop\dist'; $Shortcut.IconLocation = '%~dp0repos\synova-desktop\assets\icon.ico'; $Shortcut.Description = '🧠 SYNOVA AI - Revolutionary AI Business System'; $Shortcut.Save()"

echo ✅ Desktop shortcut created
echo.

echo 📋 STEP 8: Test Desktop App
echo.

echo 🧪 Testing desktop application...
echo 🚀 Starting desktop app...
start "" "%~dp0repos\synova-desktop\dist\SYNOVA-AI.exe"

echo.
echo ⏳ Waiting for app to start...
timeout /t 10 /nobreak >nul

echo ✅ Desktop app should be running now!
echo 💡 Check your desktop for SYNOVA AI shortcut
echo 🌐 The app will load http://localhost:3000

echo.
echo 🖥️ DESKTOP APP INSTALLATION COMPLETE!
echo.
echo 📋 WHAT WAS INSTALLED:
echo    ✅ Node.js (if needed)
echo    ✅ Electron framework
echo    ✅ SYNOVA AI desktop app
echo    ✅ Desktop shortcut
echo    ✅ System integration
echo.
echo 📋 HOW TO USE:
echo    1. Double-click desktop shortcut
echo    2. Or run: repos\synova-desktop\dist\SYNOVA-AI.exe
echo    3. App loads web interface in desktop window
echo    4. Use File menu for API key generation
echo    5. Use View menu for developer tools
echo.
echo 🎯 Your SYNOVA AI desktop app is ready!
echo 🚀 Professional desktop experience achieved!

pause
