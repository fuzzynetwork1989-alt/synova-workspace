@echo off
title 🐍 SYNOVA AI - PYTHON EXTENSIONS INSTALLER

echo 🐍 SYNOVA AI - PYTHON EXTENSIONS INSTALLATION
echo 🔧 Installing Required VS Code Extensions
echo.

echo 📋 STEP 1: Check VS Code Installation
echo.

echo 🔍 Checking if VS Code is installed...
code --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ VS Code is installed
    echo 📊 Version: 
    code --version
) else (
    echo ❌ VS Code not found
    echo 💡 Please install VS Code from: https://code.visualstudio.com/
    pause
    exit /b
)

echo.
echo 📋 STEP 2: Install Python Extension
echo.

echo 🐍 Installing Python extension for VS Code...
echo.

echo 📦 Attempting to install via command line...
code --install-extension ms-python.python

if %errorlevel% equ 0 (
    echo ✅ Python extension installed successfully
) else (
    echo ⚠️  Command line installation failed
    echo 💡 Please install manually:
    echo    1. Open VS Code
    echo    2. Press Ctrl+Shift+X
    echo    3. Search for "Python" 
    echo    4. Install by Microsoft (ms-python.python)
    echo    5. Look for "Python" by Microsoft in extensions
)

echo.
echo 📋 STEP 3: Install Python Debugger Extension
echo.

echo 🐍 Installing Python Debugger extension...
echo.

code --install-extension ms-python.debugpy

if %errorlevel% equ 0 (
    echo ✅ Python Debugger installed successfully
) else (
    echo ⚠️  Command line installation failed
    echo 💡 Please install manually:
    echo    1. Open VS Code
    echo    2. Press Ctrl+Shift+X
    echo    3. Search for "Python Debugger"
    echo    4. Install by Microsoft (ms-python.debugpy)
    echo    5. Look for "Python Debugger" by Microsoft in extensions
)

echo.
echo 📋 STEP 4: Install Additional Python Extensions
echo.

echo 🛠️ Installing additional Python development extensions...
echo.

echo 📦 Installing Pylint...
code --install-extension ms-python.pylint

echo 📦 Installing Black Formatter...
code --install-extension ms-python.black-formatter

echo 📦 Installing Jupyter...
code --install-extension ms-toolsai.jupyter

echo 📦 Installing Python Docstring Generator...
code --install-extension njpwerner.autodocstring

echo.
echo 📋 STEP 5: Verify Installation
echo.

echo 🔍 Verifying installed extensions...
echo.

echo 📋 Listing installed Python extensions...
code --list-extensions | findstr python

echo.
echo 📋 STEP 6: Create Python Development Settings
echo.

echo 🔧 Creating optimized Python development settings...
if not exist ".vscode" mkdir ".vscode"

(
echo {
echo   "python.defaultInterpreterPath": "python",
echo   "python.terminal.activateEnvironment": true,
echo   "python.analysis.typeCheckingMode": "basic",
echo   "python.linting.enabled": true,
echo   "python.linting.pylintEnabled": true,
echo   "python.linting.flake8Enabled": false,
echo   "python.formatting.provider": "black",
echo   "python.formatting.blackArgs": ["--line-length", "88"],
echo   "python.sortImports.args": ["--profile", "black"],
echo   "python.testing.pytestEnabled": true,
echo   "python.testing.unittestEnabled": false,
echo   "python.testing.pytestArgs": ["-v"],
echo   "python.terminal.activateEnvironment": true,
echo   "python.analysis.autoImportCompletions": true,
echo   "python.analysis.symbolsAutoImportCompletions": true,
echo   "files.associations": {
echo     "*.py": "python"
echo   },
echo   "emmet.includeLanguages": {
echo     "python": "html"
echo   },
echo   "editor.wordBasedSuggestions": true,
echo   "editor.snippetSuggestions": "top",
echo   "editor.tabSize": 4,
echo   "editor.insertSpaces": true,
echo   "editor.rulers": [88],
echo   "python.formatting.blackArgs": ["--line-length", "88"]
echo }
) > .vscode\settings.json

echo ✅ Python development settings created
echo.

echo 📋 STEP 7: Test Python Extensions
echo.

echo 🧪 Testing Python environment...
echo.

echo 🔍 Creating test Python file...
echo # 🧪 Test file for SYNOVA AI Python extensions > test_python.py
echo print("✅ Python extensions test successful!") >> test_python.py
echo import sys >> test_python.py
echo print(f"🐍 Python version: {sys.version}") >> test_python.py
echo try: >> test_python.py
echo     import debugpy >> test_python.py
echo     print("✅ debugpy imported successfully") >> test_python.py
echo except ImportError: >> test_python.py
echo     print("❌ debugpy not available") >> test_python.py
echo except Exception as e: >> test_python.py
echo     print(f"❌ Error: {e}") >> test_python.py

echo 🧪 Running test...
python test_python.py

echo.
echo 🧹 Cleaning up test file...
del test_python.py

echo.
echo 🐍 PYTHON EXTENSIONS INSTALLATION COMPLETE!
echo.
echo 📋 INSTALLED EXTENSIONS:
echo    ✅ Python (ms-python.python)
echo    ✅ Python Debugger (ms-python.debugpy)
echo    ✅ Pylint (ms-python.pylint)
echo    ✅ Black Formatter (ms-python.black-formatter)
echo    ✅ Jupyter (ms-toolsai.jupyter)
echo    ✅ Python Docstring Generator (njpwerner.autodocstring)
echo.
echo 📋 NEXT STEPS:
echo    1. Restart VS Code
echo    2. Open Python file (.py)
echo    3. Verify extensions are active
echo    4. Test debugging with F5
echo    5. Check for IntelliSense and linting
echo.
echo 🐍 Your Python development environment is ready!
echo 🚀 SYNOVA AI development optimized!

pause
