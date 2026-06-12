#!/bin/bash
# Synova Brain v3.2 Ollama Deployment Script

echo "🧠 Deploying Synova Brain v3.2 to Ollama..."

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo "📦 Installing Ollama..."
    curl -fsSL https://ollama.ai/install.sh | sh
fi

# Start Ollama service
echo "🚀 Starting Ollama service..."
ollama serve &

# Wait for Ollama to start
sleep 5

# Find the latest trained model
MODEL_DIR=$(find . -name "synova-brain-v3.2-*" -type d | sort | tail -n 1)
if [ -z "$MODEL_DIR" ]; then
    echo "❌ No trained model found. Please run training first."
    exit 1
fi

echo "📁 Using model: $MODEL_DIR"

# Create Ollama model
echo "🔧 Creating Synova Brain model..."
ollama create synova-brain -f "$MODEL_DIR/Modelfile"

# Test the model
echo "🧪 Testing Synova Brain..."
echo "Build me a modern warehouse" | ollama run synova-brain

echo "✅ Synova Brain v3.2 deployed successfully!"
echo "🚀 Test with: ollama run synova-brain"
echo "🔗 API available at: http://localhost:11434"
