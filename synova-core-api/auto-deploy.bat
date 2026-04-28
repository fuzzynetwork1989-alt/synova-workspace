@echo off
echo 🚀 SYNOVA AI - AUTOMATED DEPLOYMENT
echo ==================================
echo.

echo Step 1: Login to services...
echo.
echo Logging into Railway...
railway login
if %ERRORLEVEL% neq 0 (
    echo ❌ Railway login failed
    pause
    exit /b 1
)
echo ✅ Railway login successful
echo.

echo Logging into Vercel...
vercel --login
if %ERRORLEVEL% neq 0 (
    echo ❌ Vercel login failed
    pause
    exit /b 1
)
echo ✅ Vercel login successful
echo.

echo Step 2: Deploy API to Railway...
cd /d "c:\Users\fuzzy\CascadeProjects\windsurf-project\repos\synova-core-api
echo.
echo Initializing Railway project...
railway init --yes
if %ERRORLEVEL% neq 0 (
    echo ❌ Railway init failed
    pause
    exit /b 1
)
echo ✅ Railway project initialized
echo.

echo Deploying to Railway...
railway up
if %ERRORLEVEL% neq 0 (
    echo ❌ Railway deployment failed
    pause
    exit /b 1
)
echo ✅ API deployed to Railway!
echo.

echo Step 3: Deploy Web App to Vercel...
cd /d "c:\Users\fuzzy\CascadeProjects\windsurf-project\repos\synova-web
echo.
echo Deploying to Vercel...
vercel --prod --yes
if %ERRORLEVEL% neq 0 (
    echo ❌ Vercel deployment failed
    pause
    exit /b 1
)
echo ✅ Web App deployed to Vercel!
echo.

echo Step 4: Build Mobile App...
cd /d "c:\Users\fuzzy\CascadeProjects\windsurf-project\repos\synova-mobile
echo.
echo Building for Android...
npx eas build --platform android --profile production --non-interactive
if %ERRORLEVEL% neq 0 (
    echo ❌ Mobile app build failed
    pause
    exit /b 1
)
echo ✅ Mobile App built!
echo.

echo ==================================
echo 🎉 DEPLOYMENT COMPLETE!
echo ==================================
echo.
echo 🌐 YOUR PRODUCTION URLS:
echo - API: https://your-app-name.railway.app
echo - Web App: https://your-app-name.vercel.app
echo - API Docs: https://your-app-name.railway.app/docs
echo.
echo ⚙️  CONFIGURE ENVIRONMENT VARIABLES:
echo 1. Go to Railway dashboard: https://railway.app
echo 2. Find your project and add these variables:
echo    - DATABASE_URL=postgresql://username:password@host:port/database
echo    - OPENAI_API_KEY=sk-your-openai-key
echo    - ANTHROPIC_API_KEY=your-anthropic-key
echo    - JWT_SECRET=your-super-secret-jwt-key
echo 3. Go to Vercel dashboard: https://vercel.com
echo 4. Find your project and add:
echo    - NEXT_PUBLIC_API_URL=https://your-app.railway.app
echo.
echo 🎯 TEST YOUR DEPLOYMENT:
echo - API Health: curl https://your-app-name.railway.app/health
echo - Web App: Visit https://your-app-name.vercel.app
echo - AI API: POST to https://your-app-name.railway.app/api/v1/synova-ai
echo.
echo 🧠 YOUR SYNOVA AI API KEYS:
echo - Demo: sk-synova-demo-123456789 (Free tier)
echo - Pro: sk-synova-pro-987654321 (Pro tier)
echo - Enterprise: sk-synova-enterprise-555666777 (Enterprise tier)
echo.
echo 💰 BUSINESS MODEL:
echo - Free: $0/month (100 requests)
echo - Pro: $29/month (10,000 requests)
echo - Enterprise: $199/month (100,000 requests)
echo.
echo 🎉 YOUR SYNOVA AI IS LIVE WORLDWIDE!
echo.
pause
