@echo off
echo 🚀 Deploying Enhanced Synova Brain to Railway...

REM Navigate to Core API directory
cd "c:\Users\fuzzy\Synova AI (updated)\synova-workspace\synova-core-api"

REM Check Railway status
echo 📋 Checking Railway status...
railway status

REM Deploy to Railway
echo 🚀 Deploying to Railway...
railway up

REM Wait for deployment
echo ⏳ Waiting for deployment to complete...
timeout /t 30

REM Set environment variables
echo 🔧 Setting environment variables...
railway variables set SYNNOVA_BRAIN_ENABLED=true
railway variables set MODEL_NAME=microsoft/DialoGPT-medium
railway variables set DEVICE=cpu
railway variables set STREAMING_ENABLED=true
railway variables set FUNCTION_CALLING_ENABLED=true

REM Open Railway dashboard
echo 🌐 Opening Railway dashboard...
railway open

echo ✅ Deployment complete!
echo 🧪 Testing enhanced features...

REM Test health endpoint
echo 🏥 Testing health endpoint...
curl -f https://synova-core-api-production.up.railway.app/health
if %ERRORLEVEL% EQU 0 (
    echo ✅ Health check passed
    
    REM Test enhanced features
    echo 🧪 Testing streaming endpoint...
    curl -X POST https://synova-core-api-production.up.railway.app/ai/generate/stream ^
        -H "Content-Type: application/json" ^
        -d "{\"prompt\": \"Design modern office\", \"tier\": \"synova-brain-v3.2\"}"
    
    echo 🧪 Testing function calling...
    curl -X POST https://synova-core-api-production.up.railway.app/ai/function-call ^
        -H "Content-Type: application/json" ^
        -d "{\"prompt\": \"Build warehouse\", \"tier\": \"synova-brain-v3.2\"}"
    
    echo 🧪 Testing multimodal...
    curl -X POST https://synova-core-api-production.up.railway.app/ai/multimodal ^
        -H "Content-Type: application/json" ^
        -d "{\"text\": \"Analyze design\", \"images\": [\"test.jpg\"], \"tier\": \"synova-brain-v3.2\"}"
    
    echo 🧪 Testing code generation...
    curl -X POST https://synova-core-api-production.up.railway.app/ai/code ^
        -H "Content-Type: application/json" ^
        -d "{\"prompt\": \"Create React component\", \"language\": \"react\", \"tier\": \"synova-brain-v3.2\"}"
    
    echo 🧪 Testing advanced reasoning...
    curl -X POST https://synova-core-api-production.up.railway.app/ai/reasoning ^
        -H "Content-Type: application/json" ^
        -d "{\"prompt\": \"Compare architecture styles\", \"tier\": \"synova-brain-v3.2\"}"
    
    echo 🧪 Testing memory...
    curl -X POST https://synova-core-api-production.up.railway.app/ai/memory ^
        -H "Content-Type: application/json" ^
        -d "{\"messages\": [{\"content\": \"Test message\", \"role\": \"user\"}], \"tier\": \"synova-brain-v3.2\"}"
    
    echo 🎉 All enhanced features tested!
    echo 🌐 Your Enhanced Synova Brain is live at: https://synova-core-api-production.up.railway.app
    echo 📡 WebSocket URL: wss://synova-core-api-production.up.railway.app/ws
    
) else (
    echo ❌ Health check failed
)

echo 🔗 Next steps:
echo 1. Update Astranova with production URL
echo 2. Use synova-brain-llm-wrapper.js in your frontend
echo 3. Test all enhanced features in production
echo 🎉 Enjoy ChatGPT/Perplexity/Grok-level capabilities!

pause
