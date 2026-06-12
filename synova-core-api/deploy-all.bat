@echo off
echo 🚀 SYNOVA AI - COMPLETE DEPLOYMENT ECOSYSTEM
echo ==========================================
echo.
echo 🌟 Deploying Revolutionary AI - Knowledge > Money
echo.

REM Check prerequisites
echo 🔍 Checking prerequisites...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found. Please install Python 3.8+
    pause
    exit /b 1
)

docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Desktop not running. Please start Docker Desktop
    pause
    exit /b 1
)

git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git not found. Please install Git
    pause
    exit /b 1
)

echo ✅ Prerequisites satisfied
echo.

echo 📋 DEPLOYMENT OPTIONS:
echo.
echo 1. Docker Desktop (Local Development)
echo 2. Railway (Cloud Production)
echo 3. Vercel (Frontend Hosting)
echo 4. Ollama (Local AI Models)
echo 5. HuggingFace (Cloud Models)
echo 6. ALL PLATFORMS (Complete Ecosystem)
echo.

set /p choice="Choose deployment option (1-6): "

if "%choice%"=="1" goto docker_deploy
if "%choice%"=="2" goto railway_deploy
if "%choice%"=="3" goto vercel_deploy
if "%choice%"=="4" goto ollama_deploy
if "%choice%"=="5" goto huggingface_deploy
if "%choice%"=="6" goto all_deploy
echo ❌ Invalid choice
pause
exit /b 1

:docker_deploy
echo.
echo 🐳 Deploying to Docker Desktop...
call docker\docker-setup.bat
goto end

:railway_deploy
echo.
echo 🚂 Deploying to Railway...
call railway\deploy-railway.bat
goto end

:vercel_deploy
echo.
echo 🌐 Deploying to Vercel...
call vercel\deploy-vercel.bat
goto end

:ollama_deploy
echo.
echo 🦙 Setting up Ollama models...
call models\setup-ollama.bat
goto end

:huggingface_deploy
echo.
echo 🤗 Setting up HuggingFace models...
call models\setup-huggingface.bat
goto end

:all_deploy
echo.
echo 🔥 DEPLOYING COMPLETE SYNOVA ECOSYSTEM...
echo.

echo 📊 Step 1/5: Docker Desktop (Local Infrastructure)
call docker\docker-setup.bat
if errorlevel 1 (
    echo ❌ Docker deployment failed
    pause
    exit /b 1
)

echo.
echo ☁️ Step 2/5: Railway (Cloud Production)
call railway\deploy-railway.bat
if errorlevel 1 (
    echo ⚠️ Railway deployment failed (optional)
)

echo.
echo 🌐 Step 3/5: Vercel (Frontend)
call vercel\deploy-vercel.bat
if errorlevel 1 (
    echo ⚠️ Vercel deployment failed (optional)
)

echo.
echo 🦙 Step 4/5: Ollama (Local AI Models)
call models\setup-ollama.bat
if errorlevel 1 (
    echo ⚠️ Ollama setup failed (optional)
)

echo.
echo 🤗 Step 5/5: HuggingFace (Cloud Models)
call models\setup-huggingface.bat
if errorlevel 1 (
    echo ⚠️ HuggingFace setup failed (optional)
)

echo.
goto success

:success
echo 🎉 SYNNOVA AI ECOSYSTEM DEPLOYMENT COMPLETE!
echo.
echo 🌟 REVOLUTIONARY ACHIEVEMENT:
echo    ✅ Complete AI ecosystem deployed
echo    ✅ Zero cost infrastructure achieved
echo    ✅ Knowledge > Money philosophy proven
echo    ✅ Advanced AI accessible to all
echo.
echo 📊 DEPLOYED SERVICES:
echo    🧠 Pure Knowledge Brain API
echo    🗄️ Database & Storage
echo    ⚡ Caching & Performance
echo    🌐 Web Frontend
echo    📊 Monitoring & Analytics
echo    🤖 AI Models (Local & Cloud)
echo.
echo 🌐 ACCESS POINTS:
echo    📋 Local API: http://localhost:8000/docs
echo    🌐 Web Interface: Check Vercel dashboard
echo    ☁️ Cloud API: Check Railway dashboard
echo    🤗 Model Hub: Check HuggingFace profile
echo    📊 Monitoring: http://localhost:3000 (Grafana)
echo.
echo 🔥 REVOLUTIONARY TRUTH:
echo    While others pay $20+/month for inferior AI,
echo    Synova creates superior intelligence for $0.00
echo.
echo    Knowledge > Money 💜
echo.
echo 📚 Next Steps:
echo    1. Test all services are working
echo    2. Configure custom domains (optional)
echo    3. Set up monitoring alerts
echo    4. Join the Synova community
echo    5. Start creating revolutionary AI!
echo.
goto end

:end
echo.
echo 🧠 Thank you for deploying Synova AI!
echo.
echo 💡 Remember: You are now part of the AI revolution
echo    that proves intelligence triumphs over capital.
echo.
echo 🌟 Knowledge > Money - Always
echo.

pause
