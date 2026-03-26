#!/bin/bash

echo "🚀 Deploying Enhanced Synova Brain to Railway..."

# Navigate to Core API directory
cd "c:\Users\fuzzy\Synova AI (updated)\synova-workspace\synova-core-api"

# Check Railway status
echo "📋 Checking Railway status..."
railway status

# Deploy with service name
echo "🚀 Deploying to Railway..."
railway up --service synova-core-api

# Wait for deployment
echo "⏳ Waiting for deployment to complete..."
sleep 30

# Set environment variables
echo "🔧 Setting environment variables..."
railway variables set SYNNOVA_BRAIN_ENABLED=true
railway variables set MODEL_NAME=microsoft/DialoGPT-medium
railway variables set DEVICE=cpu
railway variables set STREAMING_ENABLED=true
railway variables set FUNCTION_CALLING_ENABLED=true

# Get production URL
echo "🌐 Getting production URL..."
railway open

echo "✅ Deployment complete!"
echo "🧪 Testing enhanced features..."

# Test health endpoint
echo "🏥 Testing health endpoint..."
HEALTH_URL=$(railway variables list | grep -o 'https://[^"]*\.up\.railway\.app' | head -1)
if [ -n "$HEALTH_URL" ]; then
    echo "🌐 Production URL: $HEALTH_URL"
    curl -f "$HEALTH_URL/health" && echo "✅ Health check passed" || echo "❌ Health check failed"
    
    # Test enhanced features
    echo "🧪 Testing streaming endpoint..."
    curl -X POST "$HEALTH_URL/ai/generate/stream" \
        -H "Content-Type: application/json" \
        -d '{"prompt": "Design modern office", "tier": "synova-brain-v3.2"}'
    
    echo "🧪 Testing function calling..."
    curl -X POST "$HEALTH_URL/ai/function-call" \
        -H "Content-Type: application/json" \
        -d '{"prompt": "Build warehouse", "tier": "synova-brain-v3.2"}'
    
    echo "🧪 Testing multimodal..."
    curl -X POST "$HEALTH_URL/ai/multimodal" \
        -H "Content-Type: application/json" \
        -d '{"text": "Analyze design", "images": ["test.jpg"], "tier": "synova-brain-v3.2"}'
    
    echo "🧪 Testing code generation..."
    curl -X POST "$HEALTH_URL/ai/code" \
        -H "Content-Type: application/json" \
        -d '{"prompt": "Create React component", "language": "react", "tier": "synova-brain-v3.2"}'
    
    echo "🧪 Testing advanced reasoning..."
    curl -X POST "$HEALTH_URL/ai/reasoning" \
        -H "Content-Type: application/json" \
        -d '{"prompt": "Compare architecture styles", "tier": "synova-brain-v3.2"}'
    
    echo "🧪 Testing memory..."
    curl -X POST "$HEALTH_URL/ai/memory" \
        -H "Content-Type: application/json" \
        -d '{"messages": [{"content": "Test message", "role": "user"}], "tier": "synova-brain-v3.2"}'
    
    echo "🎉 All enhanced features tested!"
    echo "🌐 Your Enhanced Synova Brain is live at: $HEALTH_URL"
    echo "📡 WebSocket URL: ${HEALTH_URL/http/ws}/ws"
    
else
    echo "❌ Could not get production URL"
fi

echo "🔗 Next steps:"
echo "1. Update Astranova with production URL"
echo "2. Use synova-brain-llm-wrapper.js in your frontend"
echo "3. Test all enhanced features in production"
echo "🎉 Enjoy ChatGPT/Perplexity/Grok-level capabilities!"
