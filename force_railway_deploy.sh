#!/bin/bash
# Railway deployment script

echo "🚀 Deploying Enhanced Synova Brain API to Railway..."

# Change to API directory
cd synova-core-api

# Add deployment trigger
echo "RAILWAY_DEPLOYMENT_TRIGGER=$(date)" > .env

# Stage all changes
git add .

# Commit with timestamp
git commit -m "🚀 Force Railway redeploy - $(date)"

echo "✅ Ready for Railway deployment"
echo "📋 Next steps:"
echo "   1. Push to GitHub repo connected to Railway"
echo "   2. Railway will automatically redeploy"
echo "   3. Test at: https://synova-ai-production.up.railway.app/health"
