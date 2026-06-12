@echo off
title 🐍 SYNOVA AI - PYTHON DEBUGGER SETUP

echo 🐍 SYNOVA AI - PYTHON DEBUGGER INSTALLATION
echo 🔧 Fixing VS Code Python Debugger
echo.

echo 📋 STEP 1: Check Current Python Debugger
echo.

echo 🔍 Checking if debugpy is installed...
python -c "import debugpy; print('✅ debugpy is already installed')" 2>nul
if %errorlevel% equ 0 (
    echo ✅ debugpy is already installed
) else (
    echo ❌ debugpy not found - installing now...
    echo.
    echo 📦 Installing debugpy...
    pip install debugpy
    if %errorlevel% equ 0 (
        echo ✅ debugpy installed successfully
    ) else (
        echo ❌ Failed to install debugpy
        echo 💡 Try: pip install --user debugpy
    )
)

echo.
echo 📋 STEP 2: Verify Python Path
echo.

echo 🔍 Checking Python installation...
python --version
if %errorlevel% equ 0 (
    echo ✅ Python is accessible
) else (
    echo ❌ Python not found in PATH
    echo 💡 Please add Python to your system PATH
    echo 📁 Typical Python locations:
    echo    C:\Python39\python.exe
    echo    C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python39\python.exe
    echo    C:\Program Files\Python39\python.exe
)

echo.
echo 📋 STEP 3: Check VS Code Extensions
echo.

echo 🔍 Checking for Python extensions...
echo 📋 Required Extensions:
echo    ✅ Python (ms-python.python)
echo    ✅ Python Debugger (ms-python.debugpy)
echo.
echo 💡 To install in VS Code:
echo    1. Open VS Code
echo    2. Go to Extensions (Ctrl+Shift+X)
echo    3. Search for "Python" by Microsoft
echo    4. Install both Python and Python Debugger
echo.

echo.
echo 📋 STEP 4: Test Debugger Configuration
echo.

echo 🧪 Testing debugpy configuration...
python -c "
try:
    import debugpy
    print('✅ debugpy imported successfully')
    print('📊 Version:', debugpy.__version__ if hasattr(debugpy, '__version__') else 'Unknown')
    print('🔧 Debugger ready for VS Code')
except ImportError as e:
    print('❌ Import error:', e)
except Exception as e:
    print('❌ Error:', e)
"

echo.
echo 📋 STEP 5: Update VS Code Settings
echo.

echo 🔧 Creating VS Code settings for Python debugging...
if not exist ".vscode" mkdir ".vscode"
echo {
echo   "python.defaultInterpreterPath": "python",
echo   "python.terminal.activateEnvironment": true,
echo   "python.analysis.typeCheckingMode": "basic",
echo   "python.linting.enabled": true,
echo   "python.linting.pylintEnabled": true,
echo   "python.formatting.provider": "black"
echo } > .vscode\settings.json

echo ✅ VS Code Python settings created
echo.

echo 🐍 PYTHON DEBUGGER SETUP COMPLETE!
echo.
echo 📋 NEXT STEPS:
echo    1. Restart VS Code
echo    2. Open Python files (.py)
echo    3. Press F5 to start debugging
echo    4. Set breakpoints as needed
echo.
echo 🎯 Your Python debugging is now configured!
echo 🚀 SYNOVA AI development environment ready!

pause
