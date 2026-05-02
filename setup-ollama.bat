@echo off
echo ========================================
echo Setting up Ollama Integration
echo ========================================
echo.

REM Check if Ollama is installed
ollama --version >nul 2>&1
if errorlevel 1 (
    echo Error: Ollama is not installed.
    echo.
    echo Installing Ollama...
    curl -fsSL https://ollama.com/install.sh | sh
    if errorlevel 1 (
        echo Error: Failed to install Ollama
        echo Please visit https://ollama.com/download to install manually
        pause
        exit /b 1
    )
    echo ✅ Ollama installed successfully
) else (
    for /f "tokens=*" %%i in ('ollama --version') do echo ✅ Ollama %%i found
)

echo.
echo Step 1: Starting Ollama service...
start /B ollama serve

REM Wait for Ollama to start
timeout /t 5 /nobreak >nul

echo Step 2: Checking Ollama service...
curl -s http://localhost:11434/api/version >nul 2>&1
if errorlevel 1 (
    echo ❌ Ollama service not responding
    echo Please check Ollama installation
    pause
    exit /b 1
) else (
    echo ✅ Ollama service is running
)

echo.
echo Step 3: Pulling Synova Brain model...
ollama pull synova-brain
if errorlevel 1 (
    echo ❌ Failed to pull synova-brain model
    echo This is expected if the Modelfile hasn't been created yet
    echo.
    echo Creating Synova Brain model from Modelfile...
    ollama create synova-brain -f Modelfile
    if errorlevel 1 (
        echo ❌ Failed to create synova-brain model
        pause
        exit /b 1
    )
    echo ✅ Synova Brain model created successfully
) else (
    echo ✅ Synova Brain model pulled successfully
)

echo.
echo Step 4: Pulling additional models...
echo Pulling DeepSeek R1...
ollama pull deepseek-r1:8b

echo Pulling Llama 3.1...
ollama pull llama3.1:8b

echo Pulling Qwen 2.5...
ollama pull qwen2.5:7b

echo.
echo Step 5: Testing model availability...
curl -s http://localhost:11434/api/tags | findstr "synova-brain" >nul
if errorlevel 1 (
    echo ❌ Synova Brain model not found
) else (
    echo ✅ Synova Brain model is available
)

echo.
echo Step 6: Installing Python dependencies...
cd apps\api
pip install -r requirements.txt
if errorlevel 1 (
    echo ❌ Failed to install Python dependencies
    pause
    exit /b 1
)
echo ✅ Python dependencies installed

echo.
echo Step 7: Starting Enhanced Brain API...
cd src
python enhanced_brain_api.py
if errorlevel 1 (
    echo ❌ Failed to start Brain API
    echo Check the error message above
    pause
    exit /b 1
)

echo.
echo ========================================
echo 🎉 OLLAMA INTEGRATION SETUP COMPLETE!
echo ========================================
echo.
echo 📡 API is running at: http://localhost:8000
echo 📚 API Documentation: http://localhost:8000/docs
echo 🧠 Model Manager: http://localhost:3000/models
echo.
echo Available endpoints:
echo   GET  /health - Health check
echo   POST /chat - Chat completion
echo   POST /stream - Streaming responses
echo   GET  /models - List models
echo   POST /models/manage - Manage models
echo   GET  /routing/stats - Routing statistics
echo.
echo Test the integration:
echo   curl http://localhost:8000/health
echo   curl -X POST http://localhost:8000/chat -H "Content-Type: application/json" -d "{\"prompt\":\"Hello\"}"
echo.
pause
