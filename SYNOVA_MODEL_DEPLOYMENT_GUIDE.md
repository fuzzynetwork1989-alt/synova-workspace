# 🧠 Synova Enhanced Brain v4.0 - Model Deployment Guide

## Overview

Synova Enhanced Brain v4.0 consists of three production-ready AI models, each optimized for different use cases and deployment scenarios:

1. **Synova Gemma4 Edition** (`synova-brain-gemma4`) - Lightweight, efficient model
2. **Synova DeepSeek Edition** (`synova-brain-deepseek`) - Balanced performance model  
3. **Synova Production Edition** (`synova-brain-production`) - Enterprise-grade flagship model

## 🚀 Quick Setup

### Prerequisites

- **Ollama** installed and running
- **16GB+ RAM** for Gemma4 and DeepSeek editions
- **64GB+ RAM** for Production edition
- **200GB+ disk space** for all models

### Automated Setup

```bash
# Run the automated setup script
setup_synova_models.bat
```

### Manual Setup

```bash
# Pull base models
ollama pull gemma2:9b
ollama pull deepseek-r1:8b  
ollama pull qwen3:235b

# Create Synova models
ollama create synova-brain-gemma4 -f Modelfile_Synova_Gemma4
ollama create synova-brain-deepseek -f Modelfile_Synova_DeepSeek
ollama create synova-brain-production -f Modelfile_Synova_Production
```

## 📊 Model Specifications

### Synova Gemma4 Edition

- **Base Model**: Gemma2:9b
- **Size**: ~9GB
- **RAM Required**: 16GB+
- **Context Window**: 8192 tokens
- **Best For**: Lightweight applications, development, testing
- **Strengths**: Fast response, low resource usage

### Synova DeepSeek Edition  

- **Base Model**: DeepSeek-R1:8b
- **Size**: ~8GB
- **RAM Required**: 16GB+
- **Context Window**: 8192 tokens
- **Best For**: Coding, reasoning, technical tasks
- **Strengths**: Strong logical reasoning, code generation

### Synova Production Edition

- **Base Model**: Qwen3:235b (22B active)
- **Size**: ~140GB
- **RAM Required**: 64GB+
- **Context Window**: 32768 tokens (131k with YaRN)
- **Best For**: Enterprise production, complex reasoning
- **Strengths**: Highest quality, advanced reasoning, multilingual

## 🔧 Configuration

### Environment Variables

```bash
# Primary model configuration
PRIMARY_MODEL=synova-brain-production
FALLBACK_MODELS=synova-brain-deepseek,synova-brain-gemma4

# API Configuration  
PORT=8000
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_TIMEOUT=120

# Performance Configuration
MAX_TOKENS=4000
DEFAULT_TEMPERATURE=0.3
```

### Model Routing Logic

```
CHAT → synova-brain-production → synova-brain-deepseek → synova-brain-gemma4
CODE → synova-brain-deepseek → synova-brain-production → synova-brain-gemma4  
REASONING → synova-brain-production → synova-brain-deepseek
BLUEPRINT → synova-brain-production → synova-brain-deepseek
```

## 🧪 Testing Models

### Basic Functionality Test

```bash
# Test Gemma4 Edition
ollama run synova-brain-gemma4 "Introduce yourself and explain your capabilities"

# Test DeepSeek Edition
ollama run synova-brain-deepseek "Write a Python function for binary search"

# Test Production Edition  
ollama run synova-brain-production "Analyze the ethical implications of AI in healthcare"
```

### Advanced Features Test

```bash
# Test Quantum-Coherent Reasoning
ollama run synova-brain-production "Solve this complex problem using multiple approaches: [problem]"

# Test Predictive Empathy
ollama run synova-brain-production "I'm feeling overwhelmed with my project. Help me organize my thoughts."

# Test Cross-Domain Synthesis
ollama run synova-brain-production "How can patterns from biology improve software architecture?"
```

## 📈 Performance Monitoring

### Health Checks

```bash
# Check model availability
curl -s http://localhost:11434/api/tags | jq '.models | length'

# Check model health
curl -s http://localhost:8000/health | jq '.status'

# Check routing statistics
curl -s http://localhost:8000/routing/stats | jq '.routes'
```

### Performance Metrics

```json
{
  "routes": {
    "chat": [
      {
        "provider": "ollama",
        "model": "synova-brain-production",
        "priority": 1,
        "available": true,
        "avg_response_time_ms": 2100
      }
    ]
  },
  "performance": {
    "ollama:synova-brain-production": {
      "total_requests": 150,
      "successful_requests": 148,
      "avg_response_time_ms": 2100,
      "failed_requests": 2
    }
  }
}
```

## 🔄 Integration Examples

### Python Integration

```python
import requests
import json

def query_synova(prompt, model="synova-brain-production"):
    response = requests.post("http://localhost:11434/api/generate", {
        "model": model,
        "prompt": prompt,
        "stream": False
    })
    return response.json()['response']

# Example usage
result = query_synova("Explain quantum computing in simple terms")
print(result)
```

### Node.js Integration

```javascript
const axios = require('axios');

async function querySynova(prompt, model = 'synova-brain-production') {
    const response = await axios.post('http://localhost:11434/api/generate', {
        model: model,
        prompt: prompt,
        stream: false
    });
    return response.data.response;
}

// Example usage
const result = await querySynova('What are the benefits of renewable energy?');
console.log(result);
```

## 🚨 Troubleshooting

### Common Issues

#### Model Not Responding

```bash
# Check if Ollama is running
ollama list

# Restart Ollama service
taskkill /f /im ollama
ollama serve
```

#### Memory Issues

```bash
# Monitor memory usage
tasklist | findstr ollama

# Reduce context size for smaller systems
# Edit Modelfile and change num_ctx to 4096
```

#### Model Pull Fails

```bash
# Check disk space
dir C:\Users\%USERNAME%\.ollama\models

# Use smaller model variant
ollama pull qwen3:70b  # Instead of 235b
```

#### Performance Issues

```bash
# Enable GPU acceleration
# Edit Modelfile and uncomment: PARAMETER num_gpu 99

# Optimize for CPU
# Edit Modelfile and adjust: PARAMETER num_thread 8
```

## 📚 Advanced Usage

### Custom Model Creation

```bash
# Create specialized variant
cp Modelfile_Synova_Production Modelfile_Custom
# Edit Modelfile_Custom with your customizations
ollama create synova-brain-custom -f Modelfile_Custom
```

### Batch Processing

```python
import asyncio
import aiohttp

async def batch_query(prompts, model="synova-brain-production"):
    async with aiohttp.ClientSession() as session:
        tasks = [
            session.post("http://localhost:11434/api/generate", {
                "model": model,
                "prompt": prompt,
                "stream": False
            })
            for prompt in prompts
        ]
        responses = await asyncio.gather(*tasks)
        return [await r.json() for r in responses]
```

### Model Fine-tuning

```bash
# Create dataset for fine-tuning
# Follow Ollama fine-tuning documentation

# Create fine-tuned model
ollama create synova-brain-finetuned -f custom-modelfile
```

## 🎯 Best Practices

### Production Deployment

1. **Use Production Edition** as primary model
2. **Configure fallback models** for reliability
3. **Monitor performance metrics** continuously
4. **Implement health checks** and alerts
5. **Use GPU acceleration** when available
6. **Optimize context window** for your use case

### Development

1. **Start with Gemma4 Edition** for faster iteration
2. **Test with DeepSeek Edition** for coding tasks
3. **Validate with Production Edition** before deployment
4. **Use consistent prompting** across models
5. **Monitor token usage** and costs

### Security

1. **Secure Ollama API** with authentication
2. **Validate inputs** to prevent injection
3. **Monitor for abuse** and rate limiting
4. **Keep models updated** with latest versions
5. **Implement audit logging** for compliance

## 🔄 Updates & Maintenance

### Model Updates

```bash
# Update base models
ollama pull gemma2:9b-latest
ollama pull deepseek-r1:8b-latest  
ollama pull qwen3:235b-latest

# Recreate Synova models
ollama create synova-brain-gemma4 -f Modelfile_Synova_Gemma4
ollama create synova-brain-deepseek -f Modelfile_Synova_DeepSeek
ollama create synova-brain-production -f Modelfile_Synova_Production
```

### Backup & Restore

```bash
# Backup models
copy C:\Users\%USERNAME%\.ollama\models D:\backup\synova-models\

# Restore models
copy D:\backup\synova-models\* C:\Users\%USERNAME%\.ollama\models\
ollama list
```

---

## 🎉 Next Steps

1. **Run setup script**: `setup_synova_models.bat`
2. **Test integration**: Verify API connectivity
3. **Configure routing**: Set up model selection logic
4. **Monitor performance**: Track response times and accuracy
5. **Scale deployment**: Add load balancing for production

For support and updates, refer to the main Synova documentation and GitHub repository.
