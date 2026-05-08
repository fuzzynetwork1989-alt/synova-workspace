@echo off
echo 🧠 Synova Enhanced Brain v4.0 - Practical Model Setup Script
echo ==========================================================
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
echo Using practical sizes for efficient deployment...
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

echo 3️⃣ Pulling Qwen2.5:32b for Synova Production edition...
echo This is a more manageable size for production use...
ollama pull qwen2.5:32b
if %errorlevel% neq 0 (
    echo ❌ Failed to pull qwen2.5:32b
    echo 💡 Trying smaller alternative: qwen2.5:14b
    ollama pull qwen2.5:14b
    if %errorlevel% neq 0 (
        echo ❌ Failed to pull qwen2.5:14b
        pause
        exit /b 1
    )
    echo ✅ Qwen2.5:14b pulled successfully
    echo.
    echo 📝 Updating production Modelfile to use qwen2.5:14b...
    powershell -Command "(Get-Content Modelfile_Synova_Production) -replace 'FROM qwen3:235b', 'FROM qwen2.5:14b' | Set-Content Modelfile_Synova_Production_Practical"
    echo ✅ Production Modelfile updated
    set PRODUCTION_MODELFILE=Modelfile_Synova_Production_Practical
) else (
    echo ✅ Qwen2.5:32b pulled successfully
    echo.
    echo 📝 Updating production Modelfile to use qwen2.5:32b...
    powershell -Command "(Get-Content Modelfile_Synova_Production) -replace 'FROM qwen3:235b', 'FROM qwen2.5:32b' | Set-Content Modelfile_Synova_Production_Practical"
    echo ✅ Production Modelfile updated
    set PRODUCTION_MODELFILE=Modelfile_Synova_Production_Practical
)
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
if defined PRODUCTION_MODELFILE (
    ollama create synova-brain-production -f %PRODUCTION_MODELFILE%
) else (
    ollama create synova-brain-production -f Modelfile_Synova_Production_Practical
)
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
echo    • synova-brain-production   - Qwen2.5 production edition (14B/32B parameters)
echo.
echo 💡 Test a model:
echo    ollama run synova-brain-gemma4 "Hello, introduce yourself"
echo.
echo 🔧 For integration with Synova API, update your configuration:
echo    PRIMARY_MODEL=synova-brain-production
echo    FALLBACK_MODELS=synova-brain-deepseek,synova-brain-gemma4
echo.

pause
