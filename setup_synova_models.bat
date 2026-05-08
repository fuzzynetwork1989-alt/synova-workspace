@echo off
echo 🧠 Synova Enhanced Brain v4.0 - Model Setup Script
echo =====================================================
echo.

echo 🔍 Checking Ollama installation...
ollama --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Ollama not found. Please install Ollama first:
    echo    Visit https://ollama.com/download
    pause
    exit /b 1
)

echo ✅ Ollama found
echo.

echo 📦 Pulling base models...
echo This may take some time depending on your internet connection...
echo.

echo 1️⃣ Pulling Gemma2:9b for Synova Gemma4 edition...
ollama pull gemma2:9b
if %errorlevel% neq 0 (
    echo ❌ Failed to pull gemma2:9b
    pause
    exit /b 1
)
echo ✅ Gemma2:9b pulled successfully
echo.

echo 2️⃣ Pulling DeepSeek-R1:8b for Synova DeepSeek edition...
ollama pull deepseek-r1:8b
if %errorlevel% neq 0 (
    echo ❌ Failed to pull deepseek-r1:8b
    pause
    exit /b 1
)
echo ✅ DeepSeek-R1:8b pulled successfully
echo.

echo 3️⃣ Pulling Qwen3:235b for Synova Production edition...
echo ⚠️  This is a large model (~140GB), ensure you have sufficient disk space and RAM
pause
ollama pull qwen3:235b
if %errorlevel% neq 0 (
    echo ❌ Failed to pull qwen3:235b
    echo 💡 You may need more RAM or disk space. Consider using a smaller variant:
    echo    ollama pull qwen3:70b
    pause
    exit /b 1
)
echo ✅ Qwen3:235b pulled successfully
echo.

echo 🎯 Creating Synova Enhanced Brain models...
echo.

echo 1️⃣ Creating Synova Gemma4 Edition...
ollama create synova-brain-gemma4 -f Modelfile_Synova_Gemma4
if %errorlevel% neq 0 (
    echo ❌ Failed to create synova-brain-gemma4
    pause
    exit /b 1
)
echo ✅ Synova Gemma4 Edition created successfully
echo.

echo 2️⃣ Creating Synova DeepSeek Edition...
ollama create synova-brain-deepseek -f Modelfile_Synova_DeepSeek
if %errorlevel% neq 0 (
    echo ❌ Failed to create synova-brain-deepseek
    pause
    exit /b 1
)
echo ✅ Synova DeepSeek Edition created successfully
echo.

echo 3️⃣ Creating Synova Production Edition...
ollama create synova-brain-production -f Modelfile_Synova_Production
if %errorlevel% neq 0 (
    echo ❌ Failed to create synova-brain-production
    pause
    exit /b 1
)
echo ✅ Synova Production Edition created successfully
echo.

echo 📋 Verifying models...
ollama list
echo.

echo 🎉 Synova Enhanced Brain v4.0 setup complete!
echo.
echo 🚀 Available models:
echo    • synova-brain-gemma4     - Gemma4-based edition (9B parameters)
echo    • synova-brain-deepseek    - DeepSeek-R1 edition (8B parameters)  
echo    • synova-brain-production   - Qwen3 production edition (235B parameters)
echo.
echo 💡 Test a model:
echo    ollama run synova-brain-gemma4 "Hello, introduce yourself"
echo.
echo 🔧 For integration with Synova API, update your configuration:
echo    PRIMARY_MODEL=synova-brain-production
echo    FALLBACK_MODELS=synova-brain-deepseek,synova-brain-gemma4
echo.

pause
