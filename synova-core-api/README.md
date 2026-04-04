# Enhanced Synova Brain API

Production-ready FastAPI application with advanced LLM capabilities.

## Features

- 🧠 Enhanced Synova Brain v3.2 with streaming
- 📡 Streaming generation endpoints
- 🔧 Function calling like ChatGPT
- 🖼️ Multimodal analysis support
- 💻 Code generation for multiple languages
- 🧠 Advanced reasoning capabilities
- 🧠 Conversation memory management
- 🏗️ Blueprint generation for XR architecture

## Quick Start

```bash
# Install dependencies
pip install -r requirements-railway.txt

# Run locally
python main.py
```

## API Endpoints

- `GET /` - Root endpoint with feature list
- `GET /health` - Health check endpoint
- `POST /ai/generate` - Enhanced text generation
- `POST /ai/generate/stream` - Streaming generation
- `POST /ai/function-call` - Function calling
- `POST /ai/blueprint` - Blueprint generation
- `POST /ai/multimodal` - Multimodal analysis
- `POST /ai/code` - Code generation
- `POST /ai/reasoning` - Advanced reasoning
- `POST /ai/memory` - Conversation memory

## Deployment

This application is configured for Railway deployment with:
- Docker support
- Health checks
- Automatic restarts
- Environment variable support

## Requirements

- Python 3.11+
- FastAPI 0.104.1+
- PyTorch 2.1.0+
- Transformers 4.35.0+
