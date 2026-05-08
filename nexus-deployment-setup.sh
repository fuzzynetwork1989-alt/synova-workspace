#!/bin/bash

# SYNOVA NEXUS Deployment Setup Script
# Sets up the complete NEXUS environment with model configuration

set -e

echo "🧠 SYNOVA NEXUS Deployment Setup"
echo "=================================="

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo "❌ Ollama is not installed. Please install Ollama first."
    echo "Visit: https://ollama.ai/download"
    exit 1
fi

# Check if Ollama is running
if ! ollama list &> /dev/null; then
    echo "🚀 Starting Ollama service..."
    ollama serve &
    sleep 5
fi

echo "✅ Ollama is running"

# Pull primary model
echo "📦 Pulling primary model: llama4:scout"
if ollama list | grep -q "llama4:scout"; then
    echo "✅ llama4:scout already available"
else
    echo "⬇️  Downloading llama4:scout (67GB)..."
    ollama pull llama4:scout
fi

# Pull fallback models
echo "📦 Pulling fallback models..."

# Gemma4:e2b
if ollama list | grep -q "gemma4:e2b"; then
    echo "✅ gemma4:e2b already available"
else
    echo "⬇️  Downloading gemma4:e2b (7.2GB)..."
    ollama pull gemma4:e2b
fi

# Check for revolutionary models
echo "🔍 Checking for revolutionary models..."

if ollama list | grep -q "synova-brain-gemma4-revolutionary"; then
    echo "✅ synova-brain-gemma4-revolutionary available"
else
    echo "⚠️  synova-brain-gemma4-revolutionary not found"
    echo "   Run setup_revolutionary_models.bat to create revolutionary models"
fi

if ollama list | grep -q "synova-brain-deepseek-revolutionary"; then
    echo "✅ synova-brain-deepseek-revolutionary available"
else
    echo "⚠️  synova-brain-deepseek-revolutionary not found"
    echo "   Run setup_revolutionary_models.bat to create revolutionary models"
fi

if ollama list | grep -q "synova-brain-production-revolutionary"; then
    echo "✅ synova-brain-production-revolutionary available"
else
    echo "⚠️  synova-brain-production-revolutionary not found"
    echo "   Run setup_revolutionary_models.bat to create revolutionary models"
fi

# Create necessary directories
echo "📁 Creating NEXUS directories..."
mkdir -p /var/lib/nexus/{models,storage,logs,cache}
mkdir -p ~/.nexus/config

# Copy configuration files
echo "📋 Setting up configuration files..."
if [ -f "nexus-model-config.json" ]; then
    cp nexus-model-config.json ~/.nexus/config/
    echo "✅ Model configuration copied"
else
    echo "⚠️  nexus-model-config.json not found"
fi

if [ -f ".env.nexus" ]; then
    cp .env.nexus ~/.nexus/config/
    echo "✅ Environment configuration copied"
else
    echo "⚠️  .env.nexus not found"
fi

# Set up environment variables
echo "🔧 Setting up environment variables..."
export NEXUS_DEFAULT_MODEL="llama4:scout"
export NEXUS_CONFIG_PATH="$HOME/.nexus/config"

# Test model availability
echo "🧪 Testing model availability..."

echo "Testing primary model (llama4:scout)..."
timeout 30 ollama run llama4:scout "Hello, this is a test." || echo "⚠️  Primary model test failed"

echo "Testing fallback model (gemma4:e2b)..."
timeout 30 ollama run gemma4:e2b "Hello, this is a test." || echo "⚠️  Fallback model test failed"

# Create startup script
echo "📜 Creating startup script..."
cat > ~/.nexus/start-nexus.sh << 'EOF'
#!/bin/bash

# SYNOVA NEXUS Startup Script

echo "🧠 Starting SYNOVA NEXUS..."

# Load environment variables
if [ -f "$HOME/.nexus/config/.env.nexus" ]; then
    export $(cat "$HOME/.nexus/config/.env.nexus" | grep -v '^#' | xargs)
fi

# Start Ollama if not running
if ! pgrep -f "ollama serve" > /dev/null; then
    echo "🚀 Starting Ollama..."
    ollama serve &
    sleep 5
fi

# Check model availability
echo "🔍 Checking model availability..."
ollama list | grep -E "(llama4:scout|gemma4:e2b|synova-brain-.*-revolutionary)" || echo "⚠️  Some models not available"

# Display configuration
echo "📋 NEXUS Configuration:"
echo "   Default Model: $NEXUS_DEFAULT_MODEL"
echo "   Config Path: $NEXUS_CONFIG_PATH"
echo "   Ollama URL: $OLLAMA_BASE_URL"

echo "✅ SYNOVA NEXUS is ready!"
echo "   Use 'nexus --help' for available commands"
EOF

chmod +x ~/.nexus/start-nexus.sh

# Create systemd service (optional)
if command -v systemctl &> /dev/null; then
    echo "🔧 Creating systemd service..."
    sudo tee /etc/systemd/system/nexus.service > /dev/null << 'EOF'
[Unit]
Description=SYNOVA NEXUS AI Development Platform
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$HOME/.nexus
ExecStart=$HOME/.nexus/start-nexus.sh
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

    echo "✅ Systemd service created"
    echo "   Enable with: sudo systemctl enable nexus"
    echo "   Start with: sudo systemctl start nexus"
fi

# Display final status
echo ""
echo "🎉 SYNOVA NEXUS Setup Complete!"
echo "================================="
echo ""
echo "📊 Available Models:"
ollama list | grep -E "(llama4:scout|gemma4:e2b|synova-brain-.*-revolutionary)" || echo "   No models found"
echo ""
echo "🔧 Configuration:"
echo "   Config Path: $HOME/.nexus/config"
echo "   Startup Script: $HOME/.nexus/start-nexus.sh"
echo ""
echo "🚀 Next Steps:"
echo "   1. Run revolutionary model setup if needed:"
echo "      ./setup_revolutionary_models.bat"
echo "   2. Start NEXUS:"
echo "      $HOME/.nexus/start-nexus.sh"
echo "   3. Test with:"
echo "      ollama run llama4:scout 'Hello NEXUS!'"
echo ""
echo "🌟 SYNOVA NEXUS is ready for quantum-powered development!"
