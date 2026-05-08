# 🧠 SYNOVA NEXUS Model Router API Documentation

## Overview

The SYNOVA NEXUS Model Router API provides intelligent, context-aware model selection and routing for optimal performance and resource utilization.

## 🚀 Features

- **Intelligent Model Selection**: Context-aware routing based on task requirements
- **Graceful Fallback**: Automatic fallback to alternative models when needed
- **Load Balancing**: Distributes requests across available models
- **Health Monitoring**: Continuous model health checking and performance tracking
- **Resource Optimization**: Efficient resource allocation based on constraints

## 📡 API Endpoints

### **POST /api/v1/chat**
Primary chat endpoint with intelligent model routing.

**Request Body**:
```json
{
  "message": "User message here",
  "context": {
    "taskType": "creative|analytical|computational|enterprise|general",
    "complexity": "simple|moderate|complex",
    "resourceConstraints": "low|moderate|high",
    "latencyRequirements": "real-time|standard|batch",
    "featureRequirements": ["creativity", "code-generation", "multilingual"],
    "languageRequirements": ["en", "es", "fr"]
  },
  "options": {
    "stream": true,
    "max_tokens": 4096,
    "temperature": 0.7
  }
}
```

**Response**:
```json
{
  "model_used": "llama4:scout",
  "model_tier": "primary",
  "response": "Generated response here",
  "metadata": {
    "selection_reason": "Primary model selected for general-purpose task",
    "response_time": 1250,
    "confidence": 0.95,
    "fallback_used": false
  }
}
```

### **GET /api/v1/models/health**
Get health status of all available models.

**Response**:
```json
{
  "models": {
    "llama4:scout": {
      "healthy": true,
      "response_time": 1200,
      "error_rate": 0.02,
      "last_check": "2024-01-19T10:30:00Z",
      "load": 0.3
    },
    "gemma4:e2b": {
      "healthy": true,
      "response_time": 800,
      "error_rate": 0.01,
      "last_check": "2024-01-19T10:30:00Z",
      "load": 0.1
    }
  },
  "overall_health": "healthy"
}
```

### **GET /api/v1/models/stats**
Get routing statistics and performance metrics.

**Response**:
```json
{
  "routing_stats": {
    "total_requests": 1250,
    "primary_model_usage": 0.75,
    "fallback_usage": 0.25,
    "average_response_time": 1450,
    "success_rate": 0.98
  },
  "model_performance": {
    "llama4:scout": {
      "requests_handled": 938,
      "avg_response_time": 1200,
      "success_rate": 0.99
    },
    "gemma4:e2b": {
      "requests_handled": 312,
      "avg_response_time": 800,
      "success_rate": 0.97
    }
  }
}
```

### **POST /api/v1/models/select**
Manual model selection for testing or specific requirements.

**Request Body**:
```json
{
  "preferred_model": "gemma4:e2b",
  "force_selection": false,
  "context": {
    "taskType": "creative",
    "complexity": "moderate"
  }
}
```

**Response**:
```json
{
  "selected_model": "gemma4:e2b",
  "selection_confidence": 0.92,
  "reasoning": "Model matches creative task requirements and resource constraints",
  "estimated_performance": {
    "response_time": 850,
    "success_probability": 0.97
  }
}
```

## 🎯 Model Selection Logic

### **Primary Model (llama4:scout)**
- **Use Cases**: General-purpose tasks, complex reasoning, enterprise applications
- **Strengths**: Large context (128k), strong reasoning, latest architecture
- **Resource Requirements**: High (67GB)
- **Priority**: Always considered first

### **Fallback Models**

#### **Tier 1: gemma4:e2b**
- **Trigger**: Creative tasks, multilingual requirements, low resource constraints
- **Strengths**: Creative reasoning, multilingual support, efficient performance
- **Resource Requirements**: Low (7.2GB)

#### **Tier 2: synova-brain-gemma4-revolutionary**
- **Trigger**: Advanced creative tasks, emotional intelligence, neural resonance
- **Strengths**: 18+ creative/emotional features, neural resonance processing
- **Resource Requirements**: Moderate (5.4GB)

#### **Tier 3: synova-brain-deepseek-revolutionary**
- **Trigger**: Logical reasoning, computational tasks, code generation
- **Strengths**: 18+ logical/computational features, advanced reasoning
- **Resource Requirements**: Moderate (5.2GB)

#### **Tier 4: synova-brain-production-revolutionary**
- **Trigger**: Enterprise applications, complex systems, advanced features
- **Strengths**: 20+ enterprise features, infinite scalability
- **Resource Requirements**: High (15GB)

## 🔧 Configuration

### **Environment Variables**
```bash
# Primary Configuration
NEXUS_DEFAULT_MODEL=llama4:scout
NEXUS_FALLBACK_MODELS=gemma4:e2b,synova-brain-gemma4-revolutionary,synova-brain-deepseek-revolutionary,synova-brain-production-revolutionary

# Performance
NEXUS_MAX_TOKENS=4096
NEXUS_TEMPERATURE=0.7
NEXUS_TARGET_LATENCY_MS=2000

# Features
NEXUS_NEURAL_REONANCE=true
NEXUS_QUANTUM_PROCESSING=true
NEXUS_AI_HUMAN_SYMBIOSIS=true

# API
NEXUS_API_ENDPOINT=/api/v1/chat
NEXUS_RATE_LIMIT_RPM=60
```

### **Model Configuration**
```json
{
  "models": {
    "primary": {
      "name": "llama4:scout",
      "parameters": {
        "temperature": 0.7,
        "top_p": 0.9,
        "max_tokens": 4096
      }
    },
    "fallbacks": [
      {
        "name": "gemma4:e2b",
        "conditions": ["creative", "multilingual", "low-resources"]
      }
    ]
  },
  "routing": {
    "strategy": "context-aware",
    "fallback_behavior": "graceful-degradation"
  }
}
```

## 📊 Performance Monitoring

### **Metrics Tracked**
- **Response Time**: Average response time per model
- **Success Rate**: Percentage of successful requests
- **Error Rate**: Percentage of failed requests
- **Load Distribution**: Current load on each model
- **Health Status**: Real-time health of all models

### **Alerts**
- **Performance Degradation**: Response time exceeds threshold
- **Model Failure**: Model becomes unhealthy
- **Resource Exhaustion**: High resource utilization
- **High Error Rate**: Error rate exceeds acceptable threshold

## 🚀 Usage Examples

### **Basic Chat Request**
```bash
curl -X POST http://localhost:3000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Explain quantum computing",
    "context": {
      "taskType": "general",
      "complexity": "moderate"
    }
  }'
```

### **Creative Task**
```bash
curl -X POST http://localhost:3000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Write a poem about artificial intelligence",
    "context": {
      "taskType": "creative",
      "complexity": "simple",
      "featureRequirements": ["creativity"]
    }
  }'
```

### **Code Generation**
```bash
curl -X POST http://localhost:3000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Create a REST API in Python",
    "context": {
      "taskType": "computational",
      "featureRequirements": ["code-generation"]
    }
  }'
```

### **Multilingual Task**
```bash
curl -X POST http://localhost:3000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Traduce esto al español: Hello world",
    "context": {
      "languageRequirements": ["en", "es"],
      "featureRequirements": ["multilingual"]
    }
  }'
```

## 🔍 Troubleshooting

### **Common Issues**

#### **Model Not Available**
```bash
# Check model status
curl http://localhost:3000/api/v1/models/health

# Pull missing model
ollama pull llama4:scout
```

#### **High Latency**
- Check resource constraints in context
- Consider using lighter models for simple tasks
- Monitor system resources

#### **Fallback Not Working**
- Verify fallback models are available
- Check model health status
- Review routing configuration

### **Debug Mode**
Enable debug logging for detailed routing information:
```bash
export NEXUS_DEBUG_MODE=true
export NEXUS_LOG_LEVEL=debug
```

## 🌟 Advanced Features

### **Streaming Responses**
```json
{
  "message": "Generate a long response",
  "options": {
    "stream": true,
    "chunk_size": 512
  }
}
```

### **Batch Processing**
```json
{
  "messages": [
    {"message": "Task 1", "context": {...}},
    {"message": "Task 2", "context": {...}}
  ],
  "options": {
    "batch": true,
    "parallel": true
  }
}
```

### **Custom Model Selection**
```json
{
  "message": "Specific task",
  "preferred_model": "gemma4:e2b",
  "force_selection": true
}
```

---

## 🎯 Best Practices

1. **Provide Context**: Always include task type and complexity for optimal routing
2. **Set Resource Constraints**: Specify resource requirements when known
3. **Monitor Performance**: Regularly check model health and performance metrics
4. **Use Streaming**: Enable streaming for long responses
5. **Handle Fallbacks**: Design your application to handle model fallbacks gracefully

**SYNOVA NEXUS Model Router: Intelligent model selection for optimal performance.**
