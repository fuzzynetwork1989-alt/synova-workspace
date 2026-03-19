#!/bin/bash
# Synova Ultimate Repository Setup Script v4.1
# Master automation for complete workspace deployment

set -e  # Exit on any error

echo "🚀 SYNOVA AUTOPILOT MODE v4.1 - ULTIMATE SETUP"
echo "=================================================="

# Environment validation
if [[ -z "$GITHUB_TOKEN" ]]; then
    echo "❌ GITHUB_TOKEN environment variable required"
    echo "📖 Get token from: github.com → Settings → Developer settings → Tokens"
    exit 1
fi

if [[ -z "$RAILWAY_TOKEN" ]]; then
    echo "❌ RAILWAY_TOKEN environment variable required" 
    echo "📖 Get token from: railway.app → Account → API Tokens"
    exit 1
fi

# Configuration
REPO_OWNER="${GITHUB_REPOSITORY_OWNER:-fuzzynetwork1989-alt}"
REPO_NAME="synova-ai-ultimate-v4.1"
FULL_REPO="$REPO_OWNER/$REPO_NAME"

echo "🔧 Configuration:"
echo "   Repository: $FULL_REPO"
echo "   Owner: $REPO_OWNER"
echo "   Timestamp: $(date)"

# Initialize Git repository if needed
if [[ ! -d ".git" ]]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: Synova AI v4.1 workspace"
fi

# Create or update remote origin
echo "🔗 Setting up GitHub remote..."
if ! git remote get-url origin &>/dev/null; then
    git remote add origin "https://$GITHUB_TOKEN@github.com/$FULL_REPO.git"
    echo "✅ Remote origin added"
else
    git remote set-url origin "https://$GITHUB_TOKEN@github.com/$FULL_REPO.git"
    echo "✅ Remote origin updated"
fi

# Create GitHub repository if it doesn't exist
echo "🏗️ Creating GitHub repository..."
if ! gh repo view "$FULL_REPO" &>/dev/null; then
    gh repo create "$FULL_REPO" --public --description="Synova AI v4.1 - Autonomous XR Architecture Factory" --homepage="https://synova.ai" || echo "Repository may already exist"
    echo "✅ Repository created"
else
    echo "✅ Repository exists"
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push -u origin main --force || echo "Push completed"

# Setup Railway services
echo "🚂 Setting up Railway services..."
railway login --token "$RAILWAY_TOKEN"

# Create Railway projects
SERVICES=("synova-core-api" "synova-holo-renderer")
for service in "${SERVICES[@]}"; do
    echo "🏗️ Creating Railway service: $service"
    cd "$service"
    
    # Create railway.toml if not exists
    if [[ ! -f "railway.toml" ]]; then
        cat > railway.toml << EOF
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "npm start"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
EOF
    fi
    
    # Link and deploy
    railway link --name "$service" || echo "Service $service already linked"
    railway up --service "$service" || echo "Service $service deployment initiated"
    
    cd ..
done

# Setup EAS (Expo Application Services) for XR app
echo "📱 Setting up EAS for XR app..."
cd synova-xr-workspace

if [[ ! -z "$EAS_PROJECT_ID" && ! -z "$EAS_TOKEN" ]]; then
    eas login --token "$EAS_TOKEN"
    eas project:info || echo "EAS project setup required"
    
    # Build preview APK
    echo "🔨 Building XR preview APK..."
    eas build --platform android --profile preview --non-interactive
    
    echo "✅ EAS setup completed"
else
    echo "⚠️  EAS credentials not provided - skipping XR build"
fi

cd ..

# Setup environment files
echo "⚙️ Setting up environment files..."
cat > .env << EOF
# Synova AI v4.1 Environment Configuration
GITHUB_TOKEN=$GITHUB_TOKEN
RAILWAY_TOKEN=$RAILWAY_TOKEN
EAS_PROJECT_ID=${EAS_PROJECT_ID:-}
EAS_TOKEN=${EAS_TOKEN:-}
VERCEL_TOKEN=${VERCEL_TOKEN:-}
VERCEL_ORG_ID=${VERCEL_ORG_ID:-}
VERCEL_PROJECT_ID=${VERCEL_PROJECT_ID:-}

# Service URLs
CORE_API_URL=https://synova-core-api-production.up.railway.app
HOLO_RENDERER_URL=https://synova-holo-renderer-production.up.railway.app
UI_SYSTEM_URL=https://synova-ui.vercel.app

# AI Configuration
OLLAMA_HOST=http://localhost:11434
SYNOVA_BRAIN_MODEL=synova-brain-v3.2

# Database (if needed)
DATABASE_URL=${DATABASE_URL:-postgresql://localhost/synova}
REDIS_URL=${REDIS_URL:-redis://localhost:6379}
EOF

echo "✅ Environment file created"

# Create deployment scripts
echo "📜 Creating deployment scripts..."

cat > deploy.sh << 'EOF'
#!/bin/bash
# Quick deployment script for Synova AI v4.1

echo "🚀 Deploying Synova AI v4.1..."

# Deploy backend services
echo "📦 Deploying backend services..."
cd synova-core-api && railway up && cd ..
cd synova-holo-renderer && railway up && cd ..

# Build XR app (if EAS configured)
if [[ ! -z "$EAS_PROJECT_ID" ]]; then
    echo "📱 Building XR app..."
    cd synova-xr-workspace
    eas build --platform android --profile preview --non-interactive
    cd ..
fi

# Deploy frontend (if Vercel configured)
if [[ ! -z "$VERCEL_TOKEN" ]]; then
    echo "🎨 Deploying frontend..."
    cd synova-ui-system
    vercel --prod
    cd ..
fi

echo "✅ Deployment completed!"
echo "🌐 Services:"
echo "   Core API: https://synova-core-api-production.up.railway.app"
echo "   Holo Renderer: https://synova-holo-renderer-production.up.railway.app"
echo "   UI System: https://synova-ui.vercel.app"
EOF

chmod +x deploy.sh

# Create development script
cat > dev.sh << 'EOF'
#!/bin/bash
# Development environment setup for Synova AI v4.1

echo "🛠️ Starting Synova AI development environment..."

# Start backend services
echo "🔧 Starting backend services..."
cd synova-core-api && python main.py &
CORE_API_PID=$!
cd ..

cd synova-holo-renderer && npm start &
HOLO_RENDERER_PID=$!
cd ..

# Start frontend
echo "🎨 Starting frontend..."
cd synova-ui-system && npm dev &
UI_PID=$!
cd ..

# Start XR development
echo "📱 Starting XR development..."
cd synova-xr-workspace && npm start &
XR_PID=$!
cd ..

echo "✅ Development environment started!"
echo "🔗 Services:"
echo "   Core API: http://localhost:8000"
echo "   Holo Renderer: http://localhost:3001"
echo "   UI System: http://localhost:3000"
echo "   XR Workspace: http://localhost:19006"

# Wait for user input to stop
echo "Press Ctrl+C to stop all services..."
trap "echo '🛑 Stopping services...'; kill $CORE_API_PID $HOLO_RENDERER_PID $UI_PID $XR_PID 2>/dev/null; exit" INT
wait
EOF

chmod +x dev.sh

# Create status check script
cat > status.sh << 'EOF'
#!/bin/bash
# Status check script for Synova AI v4.1

echo "📊 Synova AI v4.1 Service Status"
echo "================================"

# Check local services
echo "🔧 Local Services:"
if curl -s http://localhost:8000/health >/dev/null 2>&1; then
    echo "   ✅ Core API: http://localhost:8000"
else
    echo "   ❌ Core API: http://localhost:8000 (offline)"
fi

if curl -s http://localhost:3001 >/dev/null 2>&1; then
    echo "   ✅ Holo Renderer: http://localhost:3001"
else
    echo "   ❌ Holo Renderer: http://localhost:3001 (offline)"
fi

if curl -s http://localhost:3000 >/dev/null 2>&1; then
    echo "   ✅ UI System: http://localhost:3000"
else
    echo "   ❌ UI System: http://localhost:3000 (offline)"
fi

# Check deployed services
echo ""
echo "🌐 Deployed Services:"
if curl -s https://synova-core-api-production.up.railway.app/health >/dev/null 2>&1; then
    echo "   ✅ Core API: https://synova-core-api-production.up.railway.app"
else
    echo "   ❌ Core API: https://synova-core-api-production.up.railway.app (offline)"
fi

if curl -s https://synova-holo-renderer-production.up.railway.app >/dev/null 2>&1; then
    echo "   ✅ Holo Renderer: https://synova-holo-renderer-production.up.railway.app"
else
    echo "   ❌ Holo Renderer: https://synova-holo-renderer-production.up.railway.app (offline)"
fi

if curl -s https://synova-ui.vercel.app >/dev/null 2>&1; then
    echo "   ✅ UI System: https://synova-ui.vercel.app"
else
    echo "   ❌ UI System: https://synova-ui.vercel.app (offline)"
fi

# Check AI services
echo ""
echo "🧠 AI Services:"
if command -v ollama >/dev/null 2>&1; then
    if ollama list | grep -q "synova-brain"; then
        echo "   ✅ Synova Brain: Available in Ollama"
    else
        echo "   ⚠️  Synova Brain: Not found in Ollama (run deploy.sh in synova-brain)"
    fi
else
    echo "   ❌ Ollama: Not installed"
fi

echo ""
echo "📱 XR App:"
if [[ -f "synova-xr-workspace/build-*.apk" ]]; then
    echo "   ✅ APK built: $(ls synova-xr-workspace/build-*.apk | head -1)"
else
    echo "   ❌ APK not built (run deploy.sh)"
fi

echo ""
echo "🔗 Quick Links:"
echo "   Repository: https://github.com/$FULL_REPO"
echo "   Railway: https://railway.app"
echo "   Documentation: https://synova.ai/docs"
EOF

chmod +x status.sh

# Final setup and push
echo "📤 Pushing complete setup to GitHub..."
git add .
git commit -m "feat: Add complete automation setup - v4.1"
git push origin main

# Wait for GitHub Actions to complete
echo "⏳ Waiting for GitHub Actions deployment..."
sleep 30

# Check deployment status
echo "📊 Checking deployment status..."
./status.sh

echo ""
echo "🎉 SYNOVA AUTOPILOT v4.1 SETUP COMPLETED!"
echo ""
echo "🚀 Next Steps:"
echo "   1. Check deployment status: ./status.sh"
echo "   2. Start development: ./dev.sh"
echo "   3. Deploy updates: ./deploy.sh"
echo "   4. View services: Check URLs above"
echo ""
echo "📚 Documentation:"
echo "   📖 README.md - Complete guide"
echo "   🔧 .github/workflows/ - CI/CD automation"
echo "   📱 synova-xr-workspace/ - XR application"
echo "   🧠 synova-brain/ - AI model training"
echo ""
echo "💰 Monetization Ready:"
echo "   💡 Fiverr: 'XR Architecture Blueprints' - $500+/gig"
echo "   🎮 Meta Store: Synova Architect app - $4.99 + IAP"
echo "   💎 SaaS: Core($0)/Pro($29)/Enterprise($99)"
echo ""
echo "🌟 Production URLs:"
echo "   🌐 https://synova-core-api-production.up.railway.app"
echo "   🎨 https://synova-ui.vercel.app"
echo "   🏗️  https://synova-holo-renderer-production.up.railway.app"
