# Free API Key Management System

🚀 **Your own OpenAI/Anthropic-like API system built entirely with free resources!**

A complete, self-hosted API key management system that auto-generates API keys and tokens, built entirely with free resources.

## ✨ Features

- **🔑 Auto-generated API Keys** - Cryptographically secure key generation (OpenAI/Anthropic format)
- **🛡️ Token Management** - JWT-based authentication with refresh tokens
- **⚡ Rate Limiting** - Configurable usage limits per API key
- **📊 Usage Analytics** - Track API calls, costs, and statistics
- **🎛️ Admin Dashboard** - Web interface for managing keys and viewing analytics
- **🔌 RESTful API** - Full CRUD operations for key management
- **🗄️ Database Integration** - SQLite/PostgreSQL support
- **🔒 Security Features** - Key rotation, expiration, revocation

## 🏗️ Architecture

```text
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client App    │───▶│   API Gateway   │───▶│   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Admin Panel   │
                       └─────────────────┘
```

## 🛠️ Tech Stack (100% Free)

- **Backend**: Node.js + Express
- **Database**: SQLite (free) or PostgreSQL (free tier)
- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript
- **Authentication**: JWT
- **Deployment**: Railway (free tier) or local
- **Monitoring**: Built-in analytics
- **Security**: bcryptjs + crypto

## 📁 Project Structure

```text
api-system/
├── src/
│   ├── server.js              # Main server entry point
│   ├── utils/
│   │   ├── keyGenerator.js   # Cryptographic key generation
│   │   ├── logger.js         # Logging utility
│   │   ├── validation.js     # Input validation
│   │   └── response.js       # Response formatting
│   ├── middleware/
│   │   ├── auth.js          # Authentication middleware
│   │   ├── errorHandler.js   # Error handling
│   │   └── rateLimiter.js   # Rate limiting
│   ├── database/
│   │   └── database.js      # Database operations
│   └── routes/
│       └── api.js           # API endpoints
├── public/
│   └── admin.html          # Admin dashboard
├── test/
│   └── api-test.js         # Comprehensive testing
├── scripts/
│   ├── setup.js           # Initial setup
│   ├── start.sh           # Production start
│   ├── dev.sh             # Development start
│   └── build.sh           # Production build
├── .env.example          # Environment template
├── .gitignore           # Git ignore rules
└── package.json         # Dependencies and scripts
```

## 🚀 Quick Start

### Option 1: Automatic Setup
```bash
git clone <your-repo>
cd api-system
npm run setup
npm start
```

### Option 2: Manual Setup
```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your settings

# 3. Start server
npm start
```

### Option 3: Development Mode
```bash
npm run dev
```

## 📡 API Endpoints

### Key Management
- `POST /api/v1/keys` - Generate new API key
- `GET /api/v1/keys` - List all keys
- `GET /api/v1/keys/:keyId` - Get specific key
- `PATCH /api/v1/keys/:keyId` - Update key
- `DELETE /api/v1/keys/:keyId` - Delete key
- `POST /api/v1/keys/batch` - Generate multiple keys

### Authentication
- `POST /api/v1/auth/validate` - Validate API key

### Analytics
- `GET /api/v1/analytics` - Usage statistics

### System
- `GET /health` - Health check
- `GET /` - API information

## 🔐 Security Features

- **Cryptographic Keys**: SHA-256 hashing + random generation
- **JWT Tokens**: Secure authentication with expiration
- **Rate Limiting**: Per-key request limits
- **Usage Tracking**: Complete audit trail
- **Key Rotation**: Secure key renewal
- **Permission System**: Role-based access control

## 🧪 Testing

```bash
# Run comprehensive tests
npm test

# Test specific endpoints
curl -X POST http://localhost:3000/api/v1/keys \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Key"}'

# Validate API key
curl -X GET http://localhost:3000/api/v1/auth/validate \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## 📊 Analytics Dashboard

Access the admin dashboard at `http://localhost:3000/admin.html` to:
- Generate new API keys
- View usage statistics
- Manage key permissions
- Monitor rate limits
- Export usage data

## 🔧 Configuration

Environment variables (`.env`):
```bash
PORT=3000                    # Server port
NODE_ENV=development          # Environment
JWT_SECRET=your-secret-key    # JWT signing secret
DATABASE_PATH=./data/api_keys.db # Database location
RATE_LIMIT_MAX_REQUESTS=1000  # Rate limit per hour
```

## 🚀 Deployment

### Local Development
```bash
npm start
```

### Production (Railway)
```bash
npm run build
# Deploy dist/ folder to Railway
```

### Docker (Coming Soon)
```dockerfile
# Docker support planned
```

## 📈 Monitoring & Analytics

- **Request Tracking**: Every API call logged
- **Performance Metrics**: Response times, success rates
- **Usage Analytics**: Per-key statistics
- **Error Tracking**: Failed requests, rate limits
- **Real-time Dashboard**: Live usage monitoring

## 🔄 API Key Format

Generated keys follow industry standards:
```text
sk_abc123def456789012345678901234567890abcdef12345678901234567890
│─┘─┘───┘───┘───┘───┘───┘───┘───┘───┘───┘───┘───┘
│ prefix │ timestamp │ random hash (64 chars)
```

## 🛡️ Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use strong JWT secrets** in production
3. **Implement rate limiting** for all endpoints
4. **Monitor usage** for anomalies
5. **Rotate keys** regularly
6. **Use HTTPS** in production
7. **Validate all inputs** before processing

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make your changes
4. Add tests for new features
5. Submit pull request

## 📄 License

MIT License - Free to use, modify, and distribute

---

**🎉 You now have your own API key management system that rivals commercial providers!**

Built with ❤️ using only free and open-source tools.
