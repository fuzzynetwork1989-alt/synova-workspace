# Synova AI Core API

FastAPI backend for the Synova AI multi-tenant SaaS platform.

## Features

- Multi-tenant architecture
- AI agent orchestration
- Real-time chat
- Authentication & authorization
- OpenTelemetry observability

## Quick Start

```bash
# Install dependencies
pip install -e .[dev]

# Start development server
uvicorn app.main:app --reload

# Run tests
pytest
```

## Environment

Copy `.env.example` to `.env` and configure your settings.

## API Documentation

Visit `http://localhost:8000/docs` for interactive API docs.
