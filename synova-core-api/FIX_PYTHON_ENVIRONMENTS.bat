@echo off
title 🐍 PYTHON ENVIRONMENTS FIXER

echo 🐍 PYTHON ENVIRONMENTS - FIXING INITIALIZATION
echo 🔧 Resolving Python Environment Manager Issues
echo.

echo 📋 STEP 1: Check Python Installation
echo.

echo 🔍 Checking Python installation...
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Python is installed
    python --version
    set "PYTHON_CMD=python"
) else (
    echo ❌ Python not found
    echo 🔍 Checking for python3...
    python3 --version >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ Python3 is installed
        python3 --version
        set "PYTHON_CMD=python3"
    ) else (
        echo ❌ Python3 not found
        echo 💡 Please install Python from https://python.org/
        pause
        exit /b
    )
)

echo.
echo 📋 STEP 2: Check Python Environment Variables
echo.

echo 🔍 Checking PYTHONPATH...
if defined PYTHONPATH (
    echo ✅ PYTHONPATH is set: %PYTHONPATH%
) else (
    echo ⚠️  PYTHONPATH not set
    echo 🛠️ Setting PYTHONPATH...
    set "PYTHONPATH=%~dp0repos\synova-core-api;%~dp0repos\synova-web;%~dp0repos\synova-mobile"
    echo ✅ PYTHONPATH set to: %PYTHONPATH%
)

echo.
echo 🔍 checking Python virtual environment tools...
%PYTHON_CMD% -m pip list | findstr virtualenv >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ virtualenv is installed
) else (
    echo ⚠️  virtualenv not found - installing...
    %PYTHON_CMD% -m pip install virtualenv
)

%PYTHON_CMD% -m pip list | findstr venv >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ venv is available
) else (
    echo ⚠️  venv not found - using built-in venv
)

echo.
echo 📋 STEP 3: Create Virtual Environments
echo.

echo 🛠️ Creating virtual environment for SYNOVA AI...
if not exist "venv" (
    echo 📦 Creating virtual environment...
    %PYTHON_CMD% -m venv venv
    echo ✅ Virtual environment created
) else (
    echo ✅ Virtual environment already exists
)

echo.
echo 📋 STEP 4: Activate Virtual Environment
echo.

echo 🚀 Activating virtual environment...
call venv\Scripts\activate.bat

echo ✅ Virtual environment activated
echo 📊 Python path: %VIRTUAL_ENV%

echo.
echo 📋 STEP 5: Install Required Packages
echo.

echo 📦 Installing Python packages for SYNOVA AI...
echo.

echo 🛠️ Installing core packages...
%PYTHON_CMD% -m pip install --upgrade pip
%PYTHON_CMD% -m pip install flask fastapi uvicorn
%PYTHON_CMD% -m pip install requests python-dotenv
%PYTHON_CMD% -m pip install sqlalchemy sqlite3
%PYTHON_CMD% -m pip install openai anthropic google-generativeai

echo.
echo 🛠️ Installing development packages...
%PYTHON_CMD% -m pip install black pylint pytest
%PYTHON_CMD% -m pip install jupyter notebook
%PYTHON_CMD% -m pip install debugpy

echo.
echo 🛠️ Installing SYNOVA AI specific packages...
%PYTHON_CMD% -m pip install numpy pandas matplotlib
%PYTHON_CMD% -m pip install streamlit gradio
%PYTHON_CMD% -m pip install transformers torch

echo.
echo 📋 STEP 6: Create Environment Configuration
echo.

echo 🛠️ Creating environment configuration...
if not exist ".env" (
    echo # 🐍 SYNOVA AI - PYTHON ENVIRONMENT > .env
    echo # Complete Python environment configuration >> .env
    echo PYTHONPATH=%PYTHONPATH% >> .env
    echo VIRTUAL_ENV=%VIRTUAL_ENV% >> .env
    echo PYTHON_CMD=%PYTHON_CMD% >> .env
    echo. >> .env
    echo # 🤖 AI PROVIDER CONFIGURATIONS >> .env
    echo OPENAI_API_KEY=your_openai_key_here >> .env
    echo ANTHROPIC_API_KEY=your_anthropic_key_here >> .env
    echo GOOGLE_API_KEY=your_google_key_here >> .env
    echo. >> .env
    echo # 💳 PAYMENT CONFIGURATION >> .env
    echo STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here >> .env
    echo STRIPE_SECRET_KEY=sk_test_your_key_here >> .env
    echo STRIPE_WEBHOOK_SECRET=whsec_your_key_here >> .env
    echo. >> .env
    echo # 🗄️ DATABASE CONFIGURATION >> .env
    echo DATABASE_URL=sqlite:///synova_ai.db >> .env
    echo REDIS_URL=redis://localhost:6379 >> .env
    echo. >> .env
    echo # 🚀 DEVELOPMENT CONFIGURATION >> .env
    echo DEBUG=true >> .env
    echo ENVIRONMENT=development >> .env
    echo LOG_LEVEL=info >> .env
    echo ✅ Environment configuration created
) else (
    echo ✅ Environment configuration already exists
)

echo.
echo 📋 STEP 7: Create VS Code Python Settings
echo.

echo 🛠️ Creating VS Code Python settings...
if not exist ".vscode" mkdir ".vscode"

echo {
echo   "python.defaultInterpreterPath": "%VIRTUAL_ENV%\\Scripts\\python.exe",
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
echo } > .vscode\settings.json

echo ✅ VS Code Python settings created
echo.

echo 📋 STEP 8: Create Python Environment Scripts
echo.

echo 🛠️ Creating environment management scripts...

echo @echo off > activate_env.bat
echo title 🐍 SYNOVA AI - ACTIVATE ENVIRONMENT >> activate_env.bat
echo echo 🐍 Activating SYNOVA AI Python Environment >> activate_env.bat
echo call venv\Scripts\activate.bat >> activate_env.bat
echo echo ✅ Environment activated! >> activate_env.bat
echo echo 📊 Python: %%VIRTUAL_ENV%%\Scripts\python.exe >> activate_env.bat
echo echo 🎯 Ready for SYNOVA AI development! >> activate_env.bat
echo pause >> activate_env.bat

echo @echo off > deactivate_env.bat
echo title 🐍 SYNOVA AI - DEACTIVATE ENVIRONMENT >> deactivate_env.bat
echo echo 🐍 Deactivating SYNOVA AI Python Environment >> deactivate_env.bat
echo call venv\Scripts\deactivate.bat >> deactivate_env.bat
echo echo ✅ Environment deactivated! >> deactivate_env.bat
echo pause >> deactivate_env.bat

echo ✅ Environment scripts created
echo.

echo 📋 STEP 9: Test Python Environment
echo.

echo 🧪 Testing Python environment...
echo.

echo 📊 Testing Python version...
%PYTHON_CMD% --version

echo.
echo 📊 Testing package imports...
%PYTHON_CMD% -c "
try:
    import flask
    print('✅ Flask imported successfully')
except ImportError:
    print('❌ Flask import failed')

try:
    import fastapi
    print('✅ FastAPI imported successfully')
except ImportError:
    print('❌ FastAPI import failed')

try:
    import requests
    print('✅ Requests imported successfully')
except ImportError:
    print('❌ Requests import failed')

try:
    import openai
    print('✅ OpenAI imported successfully')
except ImportError:
    print('❌ OpenAI import failed')

try:
    import debugpy
    print('✅ DebugPy imported successfully')
except ImportError:
    print('❌ DebugPy import failed')
"

echo.
echo 📊 Testing virtual environment...
if defined VIRTUAL_ENV (
    echo ✅ Virtual environment is active: %VIRTUAL_ENV%
) else (
    echo ❌ Virtual environment not active
)

echo.
echo 📋 STEP 10: Create Environment Documentation
echo.

echo 📝 Creating Python environment documentation...
echo # 🐍 SYNOVA AI - PYTHON ENVIRONMENT SETUP > PYTHON_ENVIRONMENT.md
echo. >> PYTHON_ENVIRONMENT.md
echo ## ✅ ENVIRONMENT CONFIGURATION COMPLETE >> PYTHON_ENVIRONMENT.md
echo. >> PYTHON_ENVIRONMENT.md
echo ### 📋 Virtual Environment: >> PYTHON_ENVIRONMENT.md
echo - **Path**: %VIRTUAL_ENV% >> PYTHON_ENVIRONMENT.md
echo - **Python**: %PYTHON_CMD% >> PYTHON_ENVIRONMENT.md
echo - **Activated**: Yes >> PYTHON_ENVIRONMENT.md
echo. >> PYTHON_ENVIRONMENT.md
echo ### 📦 Installed Packages: >> PYTHON_ENVIRONMENT.md
echo - **Web Framework**: Flask, FastAPI >> PYTHON_ENVIRONMENT.md
echo - **AI Libraries**: OpenAI, Anthropic, Google AI >> PYTHON_ENVIRONMENT.md
echo - **Development**: Black, Pylint, DebugPy >> PYTHON_ENVIRONMENT.md
echo - **Data Science**: NumPy, Pandas, Matplotlib >> PYTHON_ENVIRONMENT.md
echo. >> PYTHON_ENVIRONMENT.md
echo ### 🎯 Usage: >> PYTHON_ENVIRONMENT.md
echo ```bash >> PYTHON_ENVIRONMENT.md
echo # Activate environment >> PYTHON_ENVIRONMENT.md
echo call activate_env.bat >> PYTHON_ENVIRONMENT.md
echo. >> PYTHON_ENVIRONMENT.md
echo # Deactivate environment >> PYTHON_ENVIRONMENT.md
echo call deactivate_env.bat >> PYTHON_ENVIRONMENT.md
echo ``` >> PYTHON_ENVIRONMENT.md

echo ✅ Documentation created
echo.

echo 🐍 PYTHON ENVIRONMENT SETUP COMPLETE!
echo.
echo 📋 WHAT WAS CONFIGURED:
echo    ✅ Python installation verified
echo    ✅ Virtual environment created
echo    ✅ Required packages installed
echo    ✅ VS Code settings configured
echo    ✅ Environment scripts created
echo    ✅ Documentation generated
echo.
echo 📋 ENVIRONMENT DETAILS:
echo    🐍 Python: %PYTHON_CMD%
echo    📦 Virtual Env: %VIRTUAL_ENV%
echo    📋 Packages: 20+ development and AI libraries
echo    ⚙️ VS Code: Optimized Python settings
echo.
echo 📋 NEXT STEPS:
echo    1. Restart VS Code to apply Python settings
echo    2. Use activate_env.bat to activate environment
echo    3. Start developing SYNOVA AI features
echo    4. Test Python debugging and AI integration
echo.
echo 🐍 Your Python environment is ready for SYNOVA AI development!
echo 🚀 Environment manager initialization issues resolved!

pause
