# Ollama Integration Guide

Complete guide for setting up and managing Ollama models with Synova AI brain.

## 🚀 Quick Start

### Prerequisites
- **Ollama** installed and running
- **Python 3.8+** with async support
- **Node.js 16+** for web interface
- **8GB+ RAM** recommended for local models

### Installation Commands

```bash
# Install Ollama (Windows)
curl -fsSL https://ollama.com/install.sh | sh

# Or download from https://ollama.com/download

# Start Ollama service
ollama serve

# Run the automated setup
setup-ollama.bat
```

## 🧠 Model Management

### Available Models

| Model | Size | Use Case | Priority |
|--------|------|-----------|----------|
| synova-brain | ~8GB | Primary Synova AI | 1 |
| deepseek-r1:8b | ~8GB | Code & Reasoning | 2 |
| llama3.1:8b | ~8GB | General Chat | 3 |
| qwen2.5:7b | ~7GB | Code Generation | 4 |
| codellama:7b | ~7GB | Code Specialized | 5 |

### Model Operations

```bash
# Pull a model
ollama pull deepseek-r1:8b

# List all models
ollama list

# Delete a model
ollama rm deepseek-r1:8b

# Create custom model (using Modelfile)
ollama create synova-brain -f Modelfile

# Show model info
ollama show synova-brain
```

## 🔄 Intelligent Routing

### Request Types

The brain router automatically selects the best model based on request type:

- **CHAT** → synova-brain → deepseek-r1:8b → llama3.1:8b
- **CODE** → deepseek-r1:8b → qwen2.5:7b → llama3.1:8b
- **BLUEPRINT** → synova-brain → deepseek-r1:8b
- **REASONING** → synova-brain → deepseek-r1:8b

### Fallback Logic

1. **Primary model** (synova-brain) tried first
2. **Fallback models** tried in priority order
3. **Performance metrics** influence selection
4. **Health status** determines availability

## 📡 API Endpoints

### Core Endpoints

```bash
# Health check
GET /health

# Chat completion
POST /chat
{
  "prompt": "Hello, how are you?",
  "request_type": "chat",
  "session_id": "user123",
  "preferred_provider": "ollama",
  "temperature": 0.3
}

# Streaming response
POST /stream
{
  "prompt": "Tell me a story",
  "stream": true
}

# Model management
GET /models
POST /models/manage
{
  "action": "pull|delete|list|health",
  "model_name": "deepseek-r1:8b"
}
```

### Advanced Endpoints

```bash
# Routing statistics
GET /routing/stats

# Function calling
POST /function_call
{
  "prompt": "Generate a React component",
  "request_type": "code"
}

# Blueprint generation
POST /blueprint
{
  "prompt": "Modern office building",
  "request_type": "blueprint"
}
```

## 🎛️ Web Interface

### Model Manager UI

Access at: `http://localhost:3000/models`

Features:
- **Model listing** with status and size
- **Pull new models** with progress tracking
- **Delete models** with confirmation
- **Health monitoring** with real-time status
- **Performance metrics** and statistics

### Chat Interface

Access at: `http://localhost:3000/chat`

Features:
- **Model selection** with automatic routing
- **Streaming responses** with real-time display
- **Session management** with conversation history
- **Performance tracking** per request

## 🧪 Testing

### Run Comprehensive Tests

```bash
# Run all integration tests
cd tests
python test_ollama_integration.py

# Test specific components
python -c "from services.ollama_service import OllamaService; import asyncio; asyncio.run(OllamaService().__aenter__())"
```

### Test Categories

1. **Connection Tests**
   - Ollama service connectivity
   - API endpoint availability
   - Model health status

2. **Service Tests**
   - Model refresh and listing
   - Response generation
   - Health checks

3. **Routing Tests**
   - Request routing logic
   - Fallback mechanisms
   - Performance tracking

4. **Integration Tests**
   - End-to-end API calls
   - Model switching
   - Streaming responses

## 📊 Monitoring

### Performance Metrics

```json
{
  "routes": {
    "chat": [
      {
        "provider": "ollama",
        "model": "synova-brain",
        "priority": 1,
        "available": true,
        "avg_response_time_ms": 1250
      }
    ]
  },
  "performance": {
    "ollama:synova-brain": {
      "total_requests": 150,
      "successful_requests": 148,
      "avg_response_time_ms": 1250,
      "failed_requests": 2
    }
  },
  "usage": {
    "ollama:synova-brain": {
      "daily_requests": 45,
      "total_tokens": 12500,
      "total_cost": 0.0
    }
  }
}
```

### Health Monitoring

```json
{
  "status": "healthy",
  "ollama_version": "0.1.47",
  "models": {
    "total_models": 4,
    "available_models": 3,
    "unavailable_models": 1
  },
  "services": {
    "brain_router": { "status": "healthy" },
    "ollama": { "status": "healthy" }
  }
}
```

## 🔧 Configuration

### Environment Variables

```bash
# API Configuration
PORT=8000
NODE_ENV=production

# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_TIMEOUT=60

# Model Configuration
PRIMARY_MODEL=synova-brain
FALLBACK_MODELS=deepseek-r1:8b,llama3.1:8b,qwen2.5:7b

# Performance Configuration
MAX_TOKENS=4000
DEFAULT_TEMPERATURE=0.3
```

### Custom Modelfile

Create custom models using the Modelfile:

```dockerfile
FROM deepseek-r1:8b

SYSTEM """
You are a specialized AI assistant for [your purpose].
Be helpful, accurate, and concise.
"""

PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER num_ctx 8192
```

## 🚨 Troubleshooting

### Common Issues

#### Ollama Not Responding
```bash
# Check if Ollama is running
ollama list

# Restart Ollama service
taskkill /f /im ollama
ollama serve

# Check port availability
netstat -an | findstr :11434
```

#### Model Pull Fails
```bash
# Check disk space
dir C:\Users\%USERNAME%\.ollama\models

# Use smaller model
ollama pull qwen2.5:4b

# Check network connection
curl -I https://ollama.com
```

#### API Not Starting
```bash
# Check Python dependencies
pip install -r apps/api/requirements.txt

# Check port conflicts
netstat -an | findstr :8000

# Check logs
python apps/api/src/enhanced_brain_api.py
```

#### Memory Issues
```bash
# Monitor memory usage
tasklist | findstr ollama

# Reduce model context
ollama run synova-brain --ctx-size 2048

# Use smaller models
ollama pull llama3.1:4b
```

### Debug Mode

Enable detailed logging:

```python
import logging
logging.basicConfig(level=logging.DEBUG)

# In enhanced_brain_api.py
logger.setLevel(logging.DEBUG)
```

### Performance Optimization

1. **Reduce Context Size**
   ```json
   {
     "num_ctx": 2048,
     "num_predict": 1000
   }
   ```

2. **Use Smaller Models**
   ```bash
   ollama pull qwen2.5:4b
   ```

3. **Enable GPU Acceleration**
   ```bash
   # Install CUDA version of Ollama
   # Check GPU support
   ollama run synova-brain --verbose
   ```

## 📚 Advanced Usage

### Custom Routing Logic

Extend the brain router for specialized use cases:

```python
# In services/brain_router.py
self.routes[RequestType.SPECIALIZED] = [
    RouteConfig(
        provider=Provider.OLLAMA,
        model="custom-specialized",
        priority=1,
        max_tokens=8000,
        temperature=0.1,
        cost_per_token=0.0,
        capabilities=[RequestType.SPECIALIZED]
    )
]
```

### Batch Processing

```python
# Process multiple requests concurrently
async def batch_process(prompts):
    tasks = [
        brain_router.route_request(prompt, RequestType.CHAT)
        for prompt in prompts
    ]
    return await asyncio.gather(*tasks)
```

### Model Fine-tuning

```bash
# Create fine-tuned model
ollama create fine-tuned-synova -f custom-modelfile

# Test fine-tuned model
ollama run fine-tuned-synova "Test prompt"
```

## 🔄 Updates & Maintenance

### Model Updates

```bash
# Update to latest model version
ollama pull deepseek-r1:8b-latest

# Remove old model
ollama rm deepseek-r1:8b

# Update routing configuration
# Edit services/brain_router.py
```

### Health Checks

```bash
# Automated health monitoring
curl -s http://localhost:8000/health | jq '.status'

# Model health check
curl -s http://localhost:11434/api/tags | jq '.models | length'
```

### Backup & Restore

```bash
# Backup models
copy C:\Users\%USERNAME%\.ollama\models D:\backup\ollama-models\

# Restore models
copy D:\backup\ollama-models\* C:\Users\%USERNAME%\.ollama\models\

# Recreate model registry
ollama list
```

---

## 🎯 Next Steps

1. **Run setup script**: `setup-ollama.bat`
2. **Test integration**: `python tests/test_ollama_integration.py`
3. **Access web interface**: `http://localhost:3000/models`
4. **Monitor performance**: Check `/routing/stats` endpoint
5. **Customize models**: Modify Modelfile for specific use cases

For support and updates, check the GitHub repository or documentation.
