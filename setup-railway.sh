#!/bin/bash
# Railway Setup Commands
# Run these after getting your Railway token

echo "🚂 Setting up Railway Services for Synova AI v4.1"
echo "=============================================="

# Login to Railway
echo "🔑 Logging into Railway..."
railway login

# Create new project
echo "📦 Creating Railway project..."
railway create synova-ai-v4

# Deploy Core API
echo "🏗️ Deploying Core API..."
cd synova-core-api
railway up --service-name synova-core-api
CORE_API_URL=$(railway domain --service synova-core-api)
echo "✅ Core API will be available at: $CORE_API_URL"
cd ..

# Deploy Holo Renderer
echo "🎨 Deploying Holo Renderer..."
cd synova-holo-renderer
railway up --service-name synova-holo-renderer
RENDERER_URL=$(railway domain --service synova-holo-renderer)
echo "✅ Holo Renderer will be available at: $RENDERER_URL"
cd ..

# Set environment variables for both services
echo "⚙️ Setting environment variables..."
railway variables set NODE_ENV=production --service synova-core-api
railway variables set DATABASE_URL=postgresql://postgres:password@localhost:5432/synova --service synova-core-api
railway variables set REDIS_URL=redis://localhost:6379 --service synova-core-api

railway variables set NODE_ENV=production --service synova-holo-renderer
railway variables set PORT=3001 --service synova-holo-renderer
railway variables set CORE_API_URL=$CORE_API_URL --service synova-holo-renderer

echo ""
echo "✅ Railway setup complete!"
echo ""
echo "🌐 Service URLs:"
echo "   Core API: $CORE_API_URL"
echo "   Holo Renderer: $RENDERER_URL"
echo ""
echo "📊 Next: Update your .env.production with these URLs"
