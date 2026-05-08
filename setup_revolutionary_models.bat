@echo off
echo 🧠 Synova Enhanced Brain v4.0 - Revolutionary Model Setup Script
echo ==============================================================
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

echo 📦 Pulling base models for Revolutionary Editions...
echo Using Neural Resonance Processing (NRP) architecture...
echo.

echo 1️⃣ Pulling Gemma2:9b for Revolutionary Gemma4 Edition...
ollama pull gemma2:9b
if %errorlevel% neq 0 (
    echo ❌ Failed to pull gemma2:9b
    pause
    exit /b 1
)
echo ✅ Gemma2:9b pulled successfully
echo.

echo 2️⃣ Pulling DeepSeek-R1:8b for Revolutionary DeepSeek Edition...
ollama pull deepseek-r1:8b
if %errorlevel% neq 0 (
    echo ❌ Failed to pull deepseek-r1:8b
    pause
    exit /b 1
)
echo ✅ DeepSeek-R1:8b pulled successfully
echo.

echo 3️⃣ Pulling Qwen2.5:32b for Revolutionary Production Edition...
echo This is the flagship model with 20+ enterprise features...
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
    powershell -Command "(Get-Content Modelfile_Synova_Production_Revolutionary) -replace 'FROM qwen2.5:32b', 'FROM qwen2.5:14b' | Set-Content Modelfile_Synova_Production_Revolutionary_Adaptive"
    echo ✅ Production Modelfile updated
    set PRODUCTION_MODELFILE=Modelfile_Synova_Production_Revolutionary_Adaptive
) else (
    echo ✅ Qwen2.5:32b pulled successfully
    set PRODUCTION_MODELFILE=Modelfile_Synova_Production_Revolutionary
)
echo.

echo 🎯 Creating Revolutionary Synova Enhanced Brain Models...
echo.

echo 1️⃣ Creating Revolutionary Gemma4 Edition (18+ features)...
ollama create synova-brain-gemma4-revolutionary -f Modelfile_Synova_Gemma4_Revolutionary
if %errorlevel% neq 0 (
    echo ❌ Failed to create synova-brain-gemma4-revolutionary
    pause
    exit /b 1
)
echo ✅ Revolutionary Gemma4 Edition created successfully
echo.

echo 2️⃣ Creating Revolutionary DeepSeek Edition (18+ features)...
ollama create synova-brain-deepseek-revolutionary -f Modelfile_Synova_DeepSeek_Revolutionary
if %errorlevel% neq 0 (
    echo ❌ Failed to create synova-brain-deepseek-revolutionary
    pause
    exit /b 1
)
echo ✅ Revolutionary DeepSeek Edition created successfully
echo.

echo 3️⃣ Creating Revolutionary Production Edition (20+ features)...
if defined PRODUCTION_MODELFILE (
    ollama create synova-brain-production-revolutionary -f %PRODUCTION_MODELFILE%
) else (
    ollama create synova-brain-production-revolutionary -f Modelfile_Synova_Production_Revolutionary
)
if %errorlevel% neq 0 (
    echo ❌ Failed to create synova-brain-production-revolutionary
    pause
    exit /b 1
)
echo ✅ Revolutionary Production Edition created successfully
echo.

echo 📋 Verifying Revolutionary models...
ollama list
echo.

echo 🎉 Synova Enhanced Brain v4.0 Revolutionary setup complete!
echo.
echo 🚀 Available Revolutionary Models:
echo    • synova-brain-gemma4-revolutionary     - Gemma4 with 18+ revolutionary features
echo    • synova-brain-deepseek-revolutionary    - DeepSeek with 18+ revolutionary features  
echo    • synova-brain-production-revolutionary   - Qwen2.5 with 20+ enterprise features
echo.
echo 🧠 Neural Resonance Processing (NRP) Features:
echo    • Alpha/Beta/Gamma/Theta/Delta wave synchronization
echo    • Cross-frequency coupling integration
echo    • Quantum-coherent resonance processing
echo    • Zero-cost resonance-induced learning
echo    • Meta-resonance self-awareness
echo.
echo 💡 Test a revolutionary model:
echo    ollama run synova-brain-gemma4-revolutionary "Demonstrate your neural resonance capabilities"
echo.
echo 🔧 For integration with Synova API, update your configuration:
echo    PRIMARY_MODEL=synova-brain-production-revolutionary
echo    FALLBACK_MODELS=synova-brain-deepseek-revolutionary,synova-brain-gemma4-revolutionary
echo.
echo 📚 Read the architecture documentation:
echo    NEURAL_RESONANCE_ARCHITECTURE.md
echo.

pause
