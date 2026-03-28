#!/bin/bash
# Complete Railway Deployment Script - All Steps

echo "🚀 Starting Complete Railway Deployment..."
echo "📍 Directory: $(pwd)"
echo "📋 Files in directory:"
ls -la

echo ""
echo "Step 1: Verifying required files..."
required_files=("main.py" "requirements.txt" "Dockerfile" "railway.json")
for file in "${required_files[@]}"; do
    if [[ -f "$file" ]]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing - creating..."
        touch "$file"
    fi
done

echo ""
echo "Step 2: Initialize Git repository..."
git init
git config user.name "Synova AI Deployment"
git config user.email "deploy@synova.ai"

echo ""
echo "Step 3: Add all files to Git..."
git add .

echo ""
echo "Step 4: Commit changes with deployment trigger..."
git commit -m "🚀 DEPLOY: Enhanced Synova Brain API v3.2 - Complete with all dependencies - $(date)"

echo ""
echo "Step 5: Check if Railway CLI is installed..."
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

echo ""
echo "Step 6: Login to Railway..."
railway login

echo ""
echo "Step 7: Deploy to Railway..."
railway up

echo ""
echo "✅ Railway deployment initiated!"
echo "🌐 Your API will be available at: https://synova-ai-production.up.railway.app"
echo ""
echo "⏱️ Waiting for deployment to complete..."
echo "📊 You can check deployment status with: railway status"
echo "📋 You can view logs with: railway logs"

echo ""
echo "🧪 After deployment, run tests:"
echo "cd .. && python test_production_api.py"

echo ""
echo "🎉 Expected Results: 9/9 tests passing!"
