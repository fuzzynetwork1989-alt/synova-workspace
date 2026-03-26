#!/bin/bash
# Quick Production Deployment Script
# Run this after filling in .env.production with your tokens

set -e

echo "🚀 Synova AI v4.1 - Quick Production Deployment"
echo "================================================"

# Load environment
if [[ -f ".env.production" ]]; then
    export $(cat .env.production | grep -v '^#' | xargs)
    echo "✅ Environment loaded from .env.production"
else
    echo "❌ .env.production not found. Please create it with your tokens."
    exit 1
fi

# Validate required tokens
echo "🔍 Validating required tokens..."
required_tokens=("RAILWAY_TOKEN" "VERCEL_TOKEN" "EAS_TOKEN" "GITHUB_TOKEN")

for token in "${required_tokens[@]}"; do
    if [[ -z "${!token}" || "${!token}" == "your_${token,,}_here" ]]; then
        echo "❌ $token is not set in .env.production"
        exit 1
    fi
done

echo "✅ All required tokens are set"

# Deploy to Railway (Backend)
echo "🏗️ Deploying backend services to Railway..."
cd synova-core-api
railway login --token "$RAILWAY_TOKEN"
railway up --service-name synova-core-api
cd ..

cd synova-holo-renderer
railway up --service-name synova-holo-renderer
cd ..

echo "✅ Backend services deployed to Railway"

# Deploy to Vercel (Frontend)
echo "🎨 Deploying frontend to Vercel..."
cd synova-ui-system
vercel --prod --token "$VERCEL_TOKEN"
cd ..

echo "✅ Frontend deployed to Vercel"

# Build and Deploy Mobile App
echo "📱 Building and deploying mobile app..."
cd synova-xr-workspace
eas login --token "$EAS_TOKEN"
eas build --platform all --profile production
eas submit --platform all --profile production
cd ..

echo "✅ Mobile app built and submitted to stores"

# Update production URLs in environment
echo "🔗 Updating production URLs..."
# These URLs will be available after deployment
RAILWAY_API_URL="https://synova-core-api-production.up.railway.app"
RAILWAY_RENDERER_URL="https://synova-holo-renderer-production.up.railway.app"
VERCEL_URL="https://synova-ui.vercel.app"

echo "🌐 Production URLs:"
echo "   API: $RAILWAY_API_URL"
echo "   Renderer: $RAILWAY_RENDERER_URL"
echo "   Frontend: $VERCEL_URL"

# Health checks
echo "🏥 Running health checks..."
sleep 30

if curl -f "$RAILWAY_API_URL/health" > /dev/null 2>&1; then
    echo "✅ Core API is healthy"
else
    echo "❌ Core API health check failed"
fi

if curl -f "$RAILWAY_RENDERER_URL" > /dev/null 2>&1; then
    echo "✅ Holo Renderer is healthy"
else
    echo "❌ Holo Renderer health check failed"
fi

if curl -f "$VERCEL_URL" > /dev/null 2>&1; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend health check failed"
fi

echo ""
echo "🎉 Synova AI v4.1 Production Deployment Complete!"
echo ""
echo "📊 Next Steps:"
echo "   1. Monitor deployment health"
echo "   2. Set up monitoring dashboards"
echo "   3. Configure custom domains"
echo "   4. Test end-to-end functionality"
echo ""
echo "📱 Mobile App Status:"
echo "   Android: Processing in Google Play Console"
echo "   iOS: Processing in App Store Connect"
echo ""
echo "🔗 Quick Links:"
echo "   Railway Dashboard: https://railway.app"
echo "   Vercel Dashboard: https://vercel.com/dashboard"
echo "   Expo Dashboard: https://expo.dev"
