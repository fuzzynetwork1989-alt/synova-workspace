# Free API Key Management System

A complete, self-hosted API key management system that auto-generates API keys and tokens, built entirely with free resources.

## Features

- **Auto-generated API Keys** - Cryptographically secure key generation
- **Token Management** - JWT-based authentication with refresh tokens
- **Rate Limiting** - Configurable usage limits per API key
- **Usage Analytics** - Track API calls, costs, and statistics
- **Admin Dashboard** - Web interface for managing keys and viewing analytics
- **RESTful API** - Full CRUD operations for key management
- **Database Integration** - SQLite/PostgreSQL support
- **Security Features** - Key rotation, expiration, revocation

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client App    │───▶│   API Gateway   │───▶│   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Admin Panel   │
                       └─────────────────┘
```

## Tech Stack (All Free)

- **Backend**: Node.js + Express
- **Database**: SQLite (free) or PostgreSQL (free tier)
- **Frontend**: React + Vite
- **Authentication**: JWT
- **Deployment**: Railway (free tier) or local
- **Monitoring**: Built-in analytics

## Quick Start

1. Clone and setup
2. Install dependencies
3. Configure environment
4. Start the server
5. Access admin dashboard

## API Endpoints

- `POST /api/v1/keys` - Generate new API key
- `GET /api/v1/keys` - List all keys
- `DELETE /api/v1/keys/:id` - Revoke key
- `POST /api/v1/auth/validate` - Validate API key
- `GET /api/v1/analytics` - Usage statistics

## Security

- All keys are cryptographically generated
- JWT tokens with expiration
- Rate limiting per key
- Usage tracking and monitoring
- Key rotation support
