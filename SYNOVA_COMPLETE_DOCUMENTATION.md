# Synova AI - Complete Documentation

**Version:** 4.1  
**Date:** April 2026  
**Document Type:** Complete Technical and User Documentation

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Overview](#project-overview)
3. [System Architecture](#system-architecture)
4. [Core Features](#core-features)
5. [User Manual](#user-manual)
6. [API Documentation](#api-documentation)
7. [Setup Guide](#setup-guide)
8. [Deployment Guide](#deployment-guide)
9. [Development Guide](#development-guide)
10. [Troubleshooting](#troubleshooting)
11. [Security Best Practices](#security-best-practices)
12. [Legal Information](#legal-information)
13. [Appendices](#appendices)

---

## Executive Summary

### What is Synova AI?

Synova AI is a frontier-class AI platform featuring Deep Resonance Thinking (DRT) - a novel 6-layer cognitive architecture that enables deeper reasoning, multi-perspective analysis, and continuous self-improvement. The platform provides a complete ecosystem for AI-powered application development with multi-agent orchestration, retrieval-augmented generation, hierarchical memory, and automatic application generation.

### Key Capabilities

- **Deep Resonance Thinking (DRT):** Proprietary 6-layer cognitive architecture for advanced reasoning
- **Multi-Agent System:** Supanova Brain for complex task coordination
- **Retrieval Augmented Generation (RAG):** Document analysis and knowledge base querying
- **Hierarchical Memory:** Short-term and long-term memory management
- **Autopilot:** Full-stack application generation from natural language
- **Vision & Voice:** Image analysis, speech transcription, and synthesis
- **Local LLM Integration:** Custom Synova model via Ollama for free, private inference

### Target Users

- **Developers:** Building AI-powered applications
- **Enterprises:** Deploying AI solutions with governance and compliance
- **Researchers:** Exploring advanced AI architectures
- **Content Creators:** Using AI for writing, analysis, and ideation

### Technology Stack

- **Backend:** FastAPI (Python)
- **Frontend:** Next.js (React)
- **Mobile:** React Native (Expo)
- **Database:** PostgreSQL
- **Cache:** Redis
- **LLM Runtime:** Ollama (local) or external providers
- **Deployment:** Railway (backend), Vercel (frontend), EAS (mobile)

---

## Project Overview

### Workspace Structure

```
synova-workspace/
├── apps/                    # Application code
│   ├── api/                 # FastAPI backend
│   ├── web/                 # Next.js frontend
│   ├── desktop/             # Desktop application
│   ├── mobile/              # React Native mobile app
│   ├── worker/              # Background job processor
│   ├── gateway/             # API gateway
│   └── admin/               # Admin console
├── packages/                # Shared packages
│   ├── ui/                  # Shared UI components
│   ├── config/              # Shared configuration
│   ├── types/               # TypeScript types
│   ├── sdk/                 # Client SDK
│   ├── prompts/             # Prompt templates
│   ├── agent-runtime/       # Multi-agent system
│   ├── memory/              # Memory management
│   ├── retrieval/           # RAG system
│   ├── evals/               # Evaluation harness
│   ├── ai-clients/          # LLM provider abstraction
│   ├── auth/                # Authentication
│   ├── billing/             # Billing integration
│   ├── observability/       # Monitoring and logging
│   ├── brain/               # Core brain orchestration
│   ├── governance/          # AI governance
│   ├── research/            # Deep research
│   ├── safety/              # Safety filters
│   ├── tools/               # Tool registry
│   └── xr/                  # XR/VR capabilities
├── ml/                      # Machine learning
│   ├── data-engine/         # Dataset creation
│   ├── tokenizer/           # Tokenization
│   ├── pretraining/         # Pretraining pipeline
│   ├── sft/                 # Supervised fine-tuning
│   ├── preference-optimization/  # RLHF
│   ├── safety/              # Safety training
│   ├── eval-harness/        # Model evaluation
│   ├── inference/           # Inference server
│   ├── model-registry/      # Model versioning
│   └── synthetic-data/      # Synthetic data generation
├── infra/                   # Infrastructure
│   ├── docker/              # Docker configurations
│   ├── k8s/                 # Kubernetes manifests
│   ├── terraform/           # Infrastructure as code
│   ├── github/              # GitHub Actions
│   ├── railway/             # Railway configuration
│   ├── vercel/              # Vercel configuration
│   └── local/               # Local development setup
├── docs/                    # Documentation
│   ├── architecture/        # Architecture docs
│   ├── product/             # Product documentation
│   ├── training/            # Training documentation
│   ├── security/            # Security documentation
│   ├── legal/               # Legal documents
│   ├── runbooks/            # Operational runbooks
│   └── adr/                 # Architecture decision records
├── scripts/                 # Utility scripts
├── .windsurf/               # Windsurf configuration
│   ├── rules/               # Development rules
│   └── workflows/           # Workflow definitions
├── Modelfile                # Ollama model configuration
├── .env                     # Environment variables
├── docker-compose.yml       # Local development
└── README.md                # Project README
```

### Ecosystem Components

#### 1. Core API (FastAPI)
- RESTful API with JWT authentication
- 8 endpoint routers (chat, RAG, agents, autopilot, memory, usage, vision, voice)
- Rate limiting and quota management
- Usage tracking and billing integration
- Streaming responses for real-time AI generation

#### 2. Brain System
- **PeakBrain:** Core orchestration component
- **HierarchicalMemorySystem:** Multi-level memory management
- **AdvancedModelRouter:** Intelligent model selection
- **MultiAgentRuntime:** Agent execution framework
- **ProviderService:** LLM provider abstraction
- **BrainGovernance:** AI governance and safety
- **BrainObservability:** Monitoring and metrics

#### 3. Agent Runtime
- **SupanovaBrain:** Multi-agent orchestration
- **SelfLearningAgent:** Adaptive agent behavior
- **ToolRegistry:** Standardized tool interface
- **WorkflowEngine:** Multi-step task execution

#### 4. Memory System
- **Short-term Memory:** Conversation context
- **Long-term Memory:** Persistent knowledge
- **Auto-extraction:** Automatic memory creation
- **Memory Retrieval:** Semantic search

#### 5. Retrieval System (RAG)
- **Document Ingestion:** PDF, TXT, MD support
- **Vector Search:** Semantic similarity
- **Hybrid Retrieval:** Vector + keyword
- **Reranking:** Result optimization
- **Citation Generation:** Source attribution

#### 6. Billing System
- **Stripe Integration:** Subscription management
- **Usage Tracking:** Token and request counting
- **Quota Enforcement:** Tier-based limits
- **Cost Calculation:** Per-provider pricing
- **Invoice Generation:** Automated billing

---

## System Architecture

### Deep Resonance Thinking (DRT)

Synova AI's proprietary 6-layer cognitive architecture:

#### Layer 1: Meta-Cognitive Awareness
**Purpose:** Self-awareness of reasoning process

**Techniques:**
- Confidence calibration with uncertainty quantification
- Metacognitive monitoring of reasoning quality
- Self-reflection on thought process
- Detection of reasoning errors and biases

**Implementation:**
```
For each reasoning step:
1. Generate confidence score (0-1)
2. Identify potential biases
3. Check for logical fallacies
4. Validate against known constraints
5. Adjust reasoning strategy if confidence low
```

#### Layer 2: Multi-Perspective Synthesis
**Purpose:** Reason from multiple viewpoints simultaneously

**Techniques:**
- Perspective-taking simulation (expert, critic, user, system)
- Contradiction detection and resolution
- Consensus building across perspectives
- Dialectical reasoning (thesis-antithesis-synthesis)

**Implementation:**
```
For complex problems:
1. Generate solution from Expert perspective
2. Generate critique from Critic perspective
3. Generate alternative from User perspective
4. Generate constraints from System perspective
5. Synthesize into unified solution
6. Validate synthesis against all perspectives
```

#### Layer 3: Temporal Depth Reasoning
**Purpose:** Reason across time and causality

**Techniques:**
- Causal chain analysis (forward and backward)
- Counterfactual simulation ("what if" scenarios)
- Temporal abstraction (short-term, medium-term, long-term)
- Future consequence modeling
- Historical pattern recognition

**Implementation:**
```
For decisions with temporal impact:
1. Map causal chain (cause → effect → consequence)
2. Simulate counterfactuals (alternative actions)
3. Analyze at multiple time horizons
4. Predict future states
5. Identify historical precedents
6. Synthesize temporal insights
```

#### Layer 4: Conceptual Lattice Navigation
**Purpose:** Navigate and connect concepts across domains

**Techniques:**
- Hierarchical concept mapping (abstract → concrete)
- Analogical reasoning (domain A → domain B)
- Concept blending (combine concepts)
- Abstract-concrete bridging
- Cross-domain pattern transfer

**Implementation:**
```
For novel problem solving:
1. Map problem to conceptual space
2. Identify analogous problems in other domains
3. Extract transferable patterns
4. Blend concepts from multiple domains
5. Bridge abstract principles to concrete solutions
6. Validate conceptual mapping
```

#### Layer 5: Emergent Property Detection
**Purpose:** Recognize system-level patterns and emergent behaviors

**Techniques:**
- Complex system pattern recognition
- Emergent behavior prediction
- Holistic understanding (beyond component analysis)
- System dynamics modeling
- Feedback loop identification

**Implementation:**
```
For complex systems:
1. Analyze individual components
2. Identify interactions between components
3. Detect emergent patterns
4. Model system dynamics
5. Predict emergent behaviors
6. Synthesize holistic understanding
```

#### Layer 6: Recursive Self-Improvement
**Purpose:** Learn from own reasoning and continuously improve

**Techniques:**
- Pattern recognition in own reasoning
- Adaptive strategy selection
- Meta-learning on thinking process
- Continuous optimization
- Knowledge consolidation

**Implementation:**
```
After each reasoning session:
1. Analyze reasoning pattern used
2. Evaluate effectiveness
3. Identify successful strategies
4. Update meta-strategies
5. Consolidate new knowledge
6. Optimize future reasoning
```

### Layer Activation Strategy

- **Simple queries:** Activate Layers 1, 6
- **Complex reasoning:** Activate Layers 1, 2, 3, 6
- **Novel problems:** Activate all 6 layers
- **System analysis:** Activate Layers 1, 3, 5, 6
- **Creative tasks:** Activate Layers 2, 4, 6

### Local LLM Integration (Ollama)

Synova AI supports local inference via Ollama with a custom model:

**Base Model:** deepseek-r1:8b

**Custom Modelfile Features:**
- Enhanced system prompt with Synova-specific cognitive traits
- Meta-cognitive awareness
- Temporal reasoning
- Multi-scale thinking
- Strategic synthesis
- Failure anticipation
- Adaptive uncertainty
- Cross-domain pattern recognition
- Ethical foresight

**Benefits:**
- Completely free
- Private (no data sent externally)
- Custom cognitive architecture
- Immediate availability
- No API costs

### API Architecture

**Base URL:**
- Development: `http://localhost:3000`
- Production: `https://api.synova.ai`

**Authentication:**
- JWT tokens for user authentication
- API keys for programmatic access
- Role-based access control (RBAC)
- Token refresh and rotation

**Rate Limiting:**
- Free Tier: 100 requests/minute
- Pro Tier: 1,000 requests/minute
- Enterprise: Unlimited

---

## Core Features

### 1. Chat Interface

**Standard Chat Mode:**
- Real-time streaming responses
- Conversation history
- Context-aware responses
- Multiple model selection

**Advanced Modes:**
- **Chat:** Standard conversation
- **Reasoning:** Deep analysis with DRT
- **Coding:** Code generation and debugging
- **Research:** Multi-step web research
- **Creative:** Creative ideation

**Complexity Control:**
- Adjustable from 0.0 (simple) to 1.0 (complex)
- Higher complexity activates more DRT layers
- Automatic layer selection based on query type

### 2. Deep Resonance Thinking

**Response Format:**
```
[THINKING PROCESS]
- Layer-by-layer analysis
- Confidence scores
- Perspective synthesis
- Causal chains
- Conceptual mappings
- System analysis

[SYNTHESIS]
- Integrated solution
- Confidence assessment
- Limitations
- Alternatives

[FINAL ANSWER]
- Clear, actionable response
- Reasoning summary
- Confidence level
```

### 3. Multi-Agent System (Supanova)

**Agent Types:**
- Research Agent: Web search and information gathering
- Analysis Agent: Data analysis and interpretation
- Planning Agent: Task planning and coordination
- Coding Agent: Code generation and debugging
- Creative Agent: Creative content generation

**Workflow:**
1. Task decomposition
2. Agent assignment
3. Parallel execution
4. Result synthesis
5. Quality validation

### 4. Document Analysis (RAG)

**Supported Formats:**
- PDF
- TXT
- Markdown (MD)
- DOCX (coming soon)

**Features:**
- Automatic document indexing
- Semantic search
- Citation generation
- Cross-document querying
- Re-indexing on updates

### 5. Memory Management

**Memory Types:**
- **Short-term Memory:** Conversation context (temporary)
- **Long-term Memory:** Persistent facts and preferences
- **Semantic Memory:** Conceptual knowledge
- **Episodic Memory:** Specific events and experiences

**Features:**
- Auto-extraction from conversations
- Manual memory creation
- Memory search and retrieval
- Memory organization by tags
- Memory deletion and editing

### 6. Application Generation (Autopilot)

**Depth Levels:**
- **Scaffold:** Basic project structure and configuration
- **MVP:** Complete features with database and API
- **Production:** Full implementation with security and monitoring

**Output:**
- Project structure
- Configuration files
- Database schema
- API endpoints
- UI components
- Testing setup
- Documentation
- Deployment configs

### 7. Vision and Voice

**Vision Analysis:**
- General image description
- Text extraction (OCR)
- Object detection
- Scene understanding

**Voice Transcription:**
- Audio to text conversion
- Multiple language support
- Timestamp generation

**Voice Synthesis:**
- Text to speech conversion
- Multiple voice options
- Adjustable speed and pitch

### 8. Usage and Billing

**Tracking:**
- Request counting
- Token counting
- Cost calculation
- Latency measurement
- Error tracking

**Subscription Tiers:**
- **Starter ($9/month):** 100K tokens/month
- **Pro ($49/month):** 1M tokens/month
- **Enterprise (Custom):** Unlimited tokens

---

## User Manual

### Getting Started

#### System Requirements

**For Web Interface:**
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Account (free or paid)

**For API Usage:**
- Python 3.10+ or other programming language
- API key or JWT token
- HTTP client library

**For Local Development:**
- Python 3.10+
- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- Docker (optional)

#### Creating an Account

1. Visit `https://synova.ai` (or your deployment URL)
2. Click "Sign Up"
3. Enter email and password
4. Verify email address
5. Choose subscription tier (Starter, Pro, Enterprise)

#### First Login

After creating your account:
1. Log in with your credentials
2. You'll receive an API key in your dashboard
3. Copy your API key for API usage
4. Explore the web interface

### Using the Chat Interface

#### Basic Chat

1. Navigate to the Chat page
2. Type your question in the input field
3. Press Enter or click Send
4. View the AI response

#### Advanced Chat Options

**Complexity Slider:**
- Adjust from 0.0 (simple) to 1.0 (complex)
- Higher complexity activates more DRT layers
- Use 0.8+ for novel problems

**Mode Selection:**
- **Chat:** Standard conversation
- **Reasoning:** Deep analysis with DRT
- **Coding:** Code generation and debugging
- **Research:** Multi-step web research
- **Creative:** Creative ideation

**Streaming Responses:**
- Enable for real-time response generation
- See the AI think in real-time
- Better for long responses

#### Example Queries

**Simple Query (Complexity 0.3):**
```
What is the capital of France?
```

**Complex Reasoning (Complexity 0.7):**
```
Analyze the potential long-term economic effects of AI automation on the job market.
```

**Novel Problem (Complexity 0.9):**
```
Design a novel approach to solving climate change that combines technology, policy, and behavioral economics.
```

### Using Deep Resonance Thinking

#### Understanding DRT

Deep Resonance Thinking is Synova AI's proprietary cognitive architecture that processes information through 6 specialized layers, each contributing unique insights.

#### Optimizing for DRT

**When to Use High Complexity (0.8-1.0):**
- Novel problems
- Creative tasks
- System analysis
- Long-term planning
- Multi-domain challenges

**When to Use Medium Complexity (0.4-0.7):**
- Complex reasoning
- Analysis tasks
- Comparisons
- Evaluations

**When to Use Low Complexity (0.0-0.3):**
- Simple questions
- Fact retrieval
- Quick answers
- Routine tasks

### Using Multi-Agent System (Supanova)

#### Using Supanova

1. Navigate to the Agents page
2. Describe your complex task
3. Click "Run Supanova"
4. Monitor agent execution
5. Review synthesized results

#### Example Use Cases

**Research Task:**
```
Research the latest developments in quantum computing and summarize their implications for cryptography.
```

**Analysis Task:**
```
Analyze the competitive landscape of electric vehicles and identify market opportunities.
```

**Planning Task:**
```
Create a comprehensive plan for launching a new SaaS product, including marketing, development, and operations.
```

### Using Document Analysis (RAG)

#### Uploading Documents

1. Navigate to the RAG page
2. Click "Upload Document"
3. Select file (PDF, TXT, MD)
4. Wait for processing
5. Document is now indexed

#### Querying Documents

1. Navigate to the RAG page
2. Type your question in the query field
3. Select documents to search (or search all)
4. Click "Query"
5. View response with document citations

#### Example Queries

**Specific Document Query:**
```
What does the Q3 financial report say about revenue growth?
```

**Cross-Document Query:**
```
Compare the strategies mentioned in the marketing plan with the actual results in the Q4 report.
```

### Using Memory Management

#### Viewing Memories

1. Navigate to the Memory page
2. View all stored memories
3. Filter by category or date

#### Creating Memories

**Manual Creation:**
1. Navigate to Memory page
2. Click "Add Memory"
3. Enter content
4. Save

**Auto-Extraction:**
Synova AI automatically extracts important information from conversations and stores it as memory.

#### Managing Memories

- Edit existing memories
- Delete memories
- Mark memories as private/public
- Organize by tags

### Using Application Generation (Autopilot)

#### Using Autopilot

1. Navigate to the Autopilot page
2. Describe your application idea
3. Select stack hints (optional)
4. Choose depth (Scaffold, MVP, Production)
5. Click "Generate"
6. Download generated code

#### Depth Levels

**Scaffold:**
- Basic project structure
- Configuration files
- README
- Quick start guide

**MVP:**
- Complete features
- Database schema
- API endpoints
- Basic UI
- Testing setup

**Production:**
- Full implementation
- Security hardening
- Monitoring
- Deployment configs
- Documentation

#### Example Prompts

**Simple:**
```
Build a task management app with drag-and-drop
```

**Detailed:**
```
Create a project management tool with:
- User authentication
- Project boards
- Task cards with due dates
- Team collaboration
- Real-time updates
- Mobile-responsive design
```

### Using Vision and Voice

#### Vision Analysis

1. Navigate to Vision page
2. Upload image
3. Select analysis type:
   - General description
   - Text extraction (OCR)
   - Object detection
   - Scene understanding
4. Click "Analyze"
5. View results

#### Voice Transcription

1. Navigate to Voice page
2. Upload audio file
3. Select language
4. Click "Transcribe"
5. View transcript

#### Voice Synthesis

1. Navigate to Voice page
2. Enter text
3. Select voice
4. Click "Synthesize"
5. Download audio file

---

## API Documentation

### Authentication

#### JWT Token Authentication

**Token Structure:**
```json
{
  "user_id": "user_123",
  "tenant_id": "tenant_456",
  "role": "user",
  "exp": 1714567890,
  "iat": 1714481490
}
```

**Generating Tokens (Development):**
```python
import jwt
from datetime import datetime, timedelta

def generate_free_token(user_id: str, secret: str = "your-jwt-secret"):
    payload = {
        "user_id": user_id,
        "tenant_id": "dev_tenant",
        "role": "admin",
        "exp": datetime.utcnow() + timedelta(days=365),
        "iat": datetime.utcnow()
    }
    token = jwt.encode(payload, secret, algorithm="HS256")
    return token

token = generate_free_token("dev_user")
print(f"Bearer {token}")
```

**Using Tokens:**
```bash
curl -X POST http://localhost:3000/api/chat/stream \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Hello"}]}'
```

#### API Key Authentication

**API Key Format:**
```
synova_sk_<tenant_id>_<random_string>
```

**Generating API Keys:**
```python
import secrets

def generate_api_key(tenant_id: str):
    random_part = secrets.token_urlsafe(32)
    api_key = f"synova_sk_{tenant_id}_{random_part}"
    return api_key

api_key = generate_api_key("tenant_123")
print(api_key)
```

**Using API Keys:**
```bash
curl -X POST http://localhost:3000/api/chat/stream \
  -H "X-API-Key: synova_sk_tenant_abc_xyz789" \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Hello"}]}'
```

### API Endpoints

#### Core Endpoints

**GET /** - API information
```bash
curl http://localhost:3000/
```

**GET /health** - Health check
```bash
curl http://localhost:3000/health
```

**GET /docs** - Interactive API documentation (Swagger UI)
```
Open in browser: http://localhost:3000/docs
```

#### Chat Endpoints

**POST /api/chat/stream** - Streaming chat
```bash
curl -X POST http://localhost:3000/api/chat/stream \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hello, what is Synova?"}
    ],
    "mode": "chat",
    "temperature": 0.7,
    "max_tokens": 4096
  }'
```

**Request Parameters:**
- `messages` (array): Conversation history
- `mode` (string): chat, reasoning, coding, research, creative
- `temperature` (float): 0.0-1.0, randomness
- `max_tokens` (int): Maximum response length
- `use_rag` (boolean): Enable RAG
- `use_memory` (boolean): Enable memory

**Response:** Server-Sent Events (SSE) stream

#### RAG Endpoints

**POST /api/rag/upload** - Upload document
```bash
curl -X POST http://localhost:3000/api/rag/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@document.pdf"
```

**POST /api/rag/query** - Query documents
```bash
curl -X POST http://localhost:3000/api/rag/query \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What does the document say about revenue?",
    "top_k": 5
  }'
```

#### Memory Endpoints

**GET /api/memory/** - List memories
```bash
curl -X GET http://localhost:3000/api/memory/ \
  -H "Authorization: Bearer <token>"
```

**POST /api/memory/** - Create memory
```bash
curl -X POST http://localhost:3000/api/memory/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "User prefers Python over JavaScript",
    "category": "preference"
  }'
```

#### Usage Endpoints

**GET /api/usage/** - Get usage statistics
```bash
curl -X GET http://localhost:3000/api/usage/ \
  -H "Authorization: Bearer <token>"
```

### Python Client Example

```python
import requests
import json

class SynovaClient:
    def __init__(self, api_key: str, base_url: str = "http://localhost:3000"):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
    
    def chat(self, message: str, mode: str = "chat", stream: bool = False):
        """Send chat message"""
        payload = {
            "messages": [{"role": "user", "content": message}],
            "mode": mode
        }
        
        if stream:
            response = requests.post(
                f"{self.base_url}/api/chat/stream",
                headers=self.headers,
                json=payload,
                stream=True
            )
            for line in response.iter_lines():
                if line:
                    yield json.loads(line)
        else:
            response = requests.post(
                f"{self.base_url}/api/chat/stream",
                headers=self.headers,
                json=payload
            )
            return response.json()
    
    def upload_document(self, file_path: str):
        """Upload document for RAG"""
        with open(file_path, 'rb') as f:
            files = {'file': f}
            response = requests.post(
                f"{self.base_url}/api/rag/upload",
                headers={"Authorization": f"Bearer {self.api_key}"},
                files=files
            )
        return response.json()
    
    def query_documents(self, query: str, top_k: int = 5):
        """Query uploaded documents"""
        payload = {"query": query, "top_k": top_k}
        response = requests.post(
            f"{self.base_url}/api/rag/query",
            headers=self.headers,
            json=payload
        )
        return response.json()
    
    def get_memories(self):
        """Get user memories"""
        response = requests.get(
            f"{self.base_url}/api/memory/",
            headers=self.headers
        )
        return response.json()
    
    def create_memory(self, content: str, category: str = "general"):
        """Create memory"""
        payload = {"content": content, "category": category}
        response = requests.post(
            f"{self.base_url}/api/memory/",
            headers=self.headers,
            json=payload
        )
        return response.json()

# Usage
client = SynovaClient(api_key="your-api-key")

# Chat
for chunk in client.chat("Hello, what is Synova?", stream=True):
    print(chunk.get("content", ""), end="")

# Upload document
result = client.upload_document("document.pdf")
print(result)

# Query documents
results = client.query_documents("What does it say about revenue?")
print(results)

# Get memories
memories = client.get_memories()
print(memories)
```

### Error Handling

**Error Codes:**
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Invalid or expired token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

**Rate Limit Headers:**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1714567890
```

**Handling Rate Limits:**
```python
import time

def make_request_with_retry(client, max_retries=3):
    for attempt in range(max_retries):
        response = client.chat("Hello")
        
        if response.status_code == 429:
            retry_after = int(response.headers.get("Retry-After", 60))
            time.sleep(retry_after)
            continue
        
        return response
    
    raise Exception("Max retries exceeded")
```

---

## Setup Guide

### Local Development Setup

#### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- Git
- Docker (optional)

#### Step 1: Clone Repository

```bash
git clone https://github.com/fuzzynetwork1989-alt/synova-workspace.git
cd synova-workspace
```

#### Step 2: Install Python Dependencies

```bash
cd apps/api
pip install -r requirements.txt
```

#### Step 3: Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```bash
# API Configuration
APP_HOST=0.0.0.0
APP_PORT=3000
APP_ENV=development
DEBUG=true

# Authentication
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION_HOURS=24

# Database
DATABASE_URL=postgresql://localhost/synova

# Redis
REDIS_URL=redis://localhost:6379

# LLM Providers (optional - using Ollama by default)
OPENAI_API_KEY=sk-xxxxxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxxxxx

# Ollama Configuration
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=synova

# Billing
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

#### Step 4: Set Up Database

```bash
# Create database
createdb synova

# Run migrations (if using Alembic)
cd apps/api
alembic upgrade head
```

#### Step 5: Start Redis

```bash
# Using Docker
docker run -d -p 6379:6379 redis:7

# Or locally
redis-server
```

#### Step 6: Install Ollama (for local LLM)

**Windows:**
1. Download from https://ollama.com/download/windows
2. Run installer
3. Restart terminal

**Linux/Mac:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

#### Step 7: Create Synova Model

```bash
cd synova-workspace
ollama create synova -f Modelfile
```

#### Step 8: Start API Server

```bash
cd apps/api/src
python main.py
```

Server will start on `http://localhost:3000`

#### Step 9: Verify Installation

```bash
# Health check
curl http://localhost:3000/health

# API documentation
# Open http://localhost:3000/docs in browser
```

### Frontend Setup (Next.js)

#### Step 1: Install Dependencies

```bash
cd apps/web
npm install
```

#### Step 2: Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:3000
```

#### Step 3: Start Development Server

```bash
npm run dev
```

Frontend will start on `http://localhost:3001`

### Docker Setup

#### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Services Included

- PostgreSQL (port 5432)
- Redis (port 6379)
- Synova API (port 3000)
- Synova Web (port 3001)

### Ollama Setup for Git Bash

If using Git Bash on Windows, add Ollama to PATH:

```bash
echo 'alias ollama="/c/Users/YourUsername/AppData/Local/Programs/Ollama/ollama.exe"' >> ~/.bashrc
source ~/.bashrc
```

Replace `YourUsername` with your actual username.

---

## Deployment Guide

### Deployment Architecture

**Backend Services → Railway:**
- synova-core-api (FastAPI)
- synova-holo-renderer (Node.js)
- PostgreSQL Database
- Redis Cache

**Frontend → Vercel:**
- synova-ui-system (Next.js)
- Static assets
- Serverless functions

**Mobile → EAS/Expo:**
- synova-xr-workspace (React Native)
- Android APK builds
- iOS IPA builds

### Pre-Deployment Checklist

```bash
# Update CLI tools
npm update -g @railway/cli
npm update -g vercel
npm update -g @expo/eas-cli

# Verify installations
railway --version
vercel --version
eas --version
```

### Railway Backend Deployment

#### Step 1: Login to Railway

```bash
railway login
```

#### Step 2: Deploy Core API

```bash
cd apps/api
railway up --service-name synova-core-api
```

#### Step 3: Deploy Holo Renderer (if applicable)

```bash
cd apps/holo-renderer
railway up --service-name synova-holo-renderer
```

#### Step 4: Get Service URLs

```bash
railway domain --service synova-core-api
railway domain --service synova-holo-renderer
```

#### Step 5: Configure Environment Variables in Railway

Add these in Railway dashboard:
```bash
APP_ENV=production
JWT_SECRET=<generate-secure-secret>
DATABASE_URL=<railway-provided>
REDIS_URL=<railway-provided>
OLLAMA_HOST=<if-using-external-ollama>
STRIPE_SECRET_KEY=<your-stripe-key>
STRIPE_PUBLISHABLE_KEY=<your-stripe-key>
STRIPE_WEBHOOK_SECRET=<your-webhook-secret>
```

### Vercel Frontend Deployment

#### Step 1: Login to Vercel

```bash
vercel --login
```

#### Step 2: Deploy UI System

```bash
cd apps/web
vercel --prod
```

#### Step 3: Configure Environment Variables

```bash
vercel env add NEXT_PUBLIC_API_URL production
# Enter: https://your-railway-api-url.railway.app

vercel env add NEXT_PUBLIC_WS_URL production
# Enter: wss://your-railway-api-url.railway.app
```

#### Step 4: Redeploy with Environment

```bash
vercel --prod --env NEXT_PUBLIC_API_URL=https://your-railway-api-url.railway.app
```

### EAS Mobile Deployment

#### Step 1: Login to EAS

```bash
eas login
```

#### Step 2: Configure EAS

```bash
cd apps/mobile
eas build:configure
```

#### Step 3: Build Android

```bash
eas build --platform android --profile production
```

#### Step 4: Build iOS

```bash
eas build --platform ios --profile production
```

#### Step 5: Submit to Stores

```bash
eas submit --platform all --profile production
```

### Deployment Monitoring

#### Health Checks

```bash
# Backend health
curl https://synova-core-api-production.up.railway.app/health

# Frontend health
curl https://your-vercel-app.vercel.app/

# Service status
railway status
vercel ls
eas build:list
```

#### Log Monitoring

```bash
# Railway logs
railway logs --service synova-core-api
railway logs --service synova-holo-renderer

# Vercel logs
vercel logs

# EAS build logs
eas build:view --platform android
```

### Rollback Procedures

#### Railway Rollback

```bash
# View deployment history
railway deployments

# Rollback to previous version
railway rollback --service synova-core-api
```

#### Vercel Rollback

```bash
# View deployment history
vercel list

# Rollback to previous deployment
vercel rollback [deployment-url]
```

#### EAS Rollback

```bash
# View build history
eas build:list

# Rollback (resubmit previous build)
eas submit --platform android --profile previous
```

### Success Criteria

**Backend (Railway):**
- [ ] Core API health endpoint returns 200
- [ ] Database connections working
- [ ] Redis cache operational
- [ ] Environment variables configured

**Frontend (Vercel):**
- [ ] Application loads in browser
- [ ] API calls to Railway successful
- [ ] Static assets serving correctly
- [ ] WebSocket connections established

**Mobile (EAS):**
- [ ] Android APK builds successfully
- [ ] iOS IPA builds successfully
- [ ] Apps install on test devices
- [ ] Store submission complete

---

## Development Guide

### Code Structure

#### Backend (FastAPI)

```
apps/api/src/
├── main.py                 # Application entry point
├── endpoints/              # API endpoints
│   ├── brain_endpoints.py  # Brain-specific endpoints
│   └── ...
├── routers/               # Route groups
│   ├── chat.py            # Chat router
│   ├── rag.py             # RAG router
│   ├── agents.py          # Agents router
│   ├── autopilot.py       # Autopilot router
│   ├── memory.py          # Memory router
│   ├── usage.py           # Usage router
│   ├── vision.py          # Vision router
│   └── voice.py           # Voice router
├── middleware/            # Middleware
│   └── auth.py           # Authentication middleware
└── ...
```

#### Packages

```
packages/
├── brain/                 # Core brain orchestration
│   └── src/
│       ├── peak_brain.py
│       └── autopilot_mode.py
├── ai/                    # AI provider abstraction
│   └── src/
│       ├── provider_service.py
│       ├── model_router.py
│       └── synova_model.py
├── memory/                # Memory management
│   └── src/
│       ├── hierarchical_memory.py
│       └── memory_service.py
├── retrieval/             # RAG system
│   └── src/
│       └── rag_service.py
├── agent-runtime/         # Multi-agent system
│   └── src/
│       ├── multi_agent_runtime.py
│       ├── self_learning_agent.py
│       └── supanova_brain.py
├── billing/               # Billing integration
│   └── src/
│       └── billing_service.py
├── safety/                # Safety filters
│   └── src/
│       └── safety_service.py
├── governance/            # AI governance
│   └── src/
│       └── brain_governance.py
├── observability/         # Monitoring
│   └── src/
│       └── brain_observability.py
└── ...
```

### Adding a New Endpoint

1. Create endpoint file in `apps/api/src/endpoints/`
2. Define your endpoints with FastAPI decorators
3. Add authentication with `Depends(get_current_user)`
4. Include error handling and logging
5. Register router in `main.py`

**Example:**
```python
# apps/api/src/endpoints/my_endpoint.py
from fastapi import APIRouter, Depends
from middleware.auth import get_current_user

router = APIRouter(prefix="/my-endpoint", tags=["my-endpoint"])

@router.get("/")
async def my_endpoint(current_user = Depends(get_current_user)):
    return {"message": "Hello", "user": current_user}
```

Register in `main.py`:
```python
from endpoints.my_endpoint import router as my_endpoint_router
app.include_router(my_endpoint_router, prefix="/api")
```

### Adding a New Package

1. Create package directory in `packages/`
2. Add `src/` subdirectory
3. Create `__init__.py` files
4. Implement package functionality
5. Add to `sys.path` in `main.py` if needed

**Example:**
```bash
mkdir -p packages/my-package/src
touch packages/my-package/src/__init__.py
touch packages/my-package/__init__.py
```

### Testing

#### Unit Tests

```bash
cd apps/api
pytest tests/
```

#### Integration Tests

```bash
pytest tests/integration/
```

#### API Tests

```bash
# Using curl
curl http://localhost:3000/health

# Using pytest
pytest tests/api/
```

### Debugging

#### Enable Debug Mode

Set in `.env`:
```bash
DEBUG=true
APP_ENV=development
```

#### View Logs

```bash
# Server logs
# View terminal where server is running

# Application logs
# Check logs/ directory
```

#### Common Issues

**Import Errors:**
- Ensure workspace root is in `sys.path`
- Check `__init__.py` files exist
- Verify package structure

**Database Connection:**
- Check DATABASE_URL in `.env`
- Ensure PostgreSQL is running
- Verify database exists

**Redis Connection:**
- Check REDIS_URL in `.env`
- Ensure Redis is running
- Test with `redis-cli ping`

---

## Troubleshooting

### Common Issues

#### API Server Won't Start

**Symptoms:** Server fails to start or crashes immediately

**Solutions:**
1. Check Python version (3.10+ required)
2. Verify all dependencies installed: `pip install -r requirements.txt`
3. Check `.env` file exists and is configured
4. Verify port 3000 is not in use
5. Check logs for specific error messages

**Commands:**
```bash
# Check Python version
python --version

# Install dependencies
pip install -r requirements.txt

# Check port usage
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Mac/Linux
```

#### Database Connection Errors

**Symptoms:** "Connection refused" or "database does not exist"

**Solutions:**
1. Verify PostgreSQL is running
2. Check DATABASE_URL in `.env`
3. Create database if needed: `createdb synova`
4. Check credentials in connection string

**Commands:**
```bash
# Check PostgreSQL status
sudo service postgresql status  # Linux
brew services list              # Mac

# Create database
createdb synova

# Test connection
psql postgresql://localhost/synova
```

#### Redis Connection Errors

**Symptoms:** "Connection refused" to Redis

**Solutions:**
1. Verify Redis is running
2. Check REDIS_URL in `.env`
3. Test Redis connection

**Commands:**
```bash
# Start Redis
redis-server

# Test connection
redis-cli ping
```

#### Ollama Connection Errors

**Symptoms:** "Error connecting to Ollama"

**Solutions:**
1. Verify Ollama is installed
2. Check Ollama is running: `ollama serve`
3. Verify OLLAMA_HOST in `.env`
4. Check Synova model exists: `ollama list`

**Commands:**
```bash
# Check Ollama version
ollama --version

# Start Ollama
ollama serve

# List models
ollama list

# Create Synova model
ollama create synova -f Modelfile
```

#### Authentication Errors

**Symptoms:** 401 Unauthorized responses

**Solutions:**
1. Verify token is valid and not expired
2. Check JWT_SECRET matches between generation and validation
3. Ensure token is sent in correct header
4. Check user exists in database

**Debug:**
```python
import jwt
token = "your-token"
try:
    decoded = jwt.decode(token, "your-secret", algorithms=["HS256"])
    print(decoded)
except jwt.ExpiredSignatureError:
    print("Token expired")
except jwt.InvalidTokenError:
    print("Invalid token")
```

#### Rate Limit Errors

**Symptoms:** 429 Too Many Requests

**Solutions:**
1. Implement exponential backoff
2. Check rate limit headers
3. Consider upgrading subscription tier
4. Reduce request frequency

**Example:**
```python
import time

def make_request_with_backoff(url, max_retries=3):
    for attempt in range(max_retries):
        response = requests.post(url)
        
        if response.status_code == 429:
            retry_after = int(response.headers.get("Retry-After", 60))
            time.sleep(retry_after * (2 ** attempt))  # Exponential backoff
            continue
        
        return response
```

#### Memory Issues

**Symptoms:** Out of memory errors, slow performance

**Solutions:**
1. Reduce batch size
2. Enable streaming responses
3. Clear cache regularly
4. Increase system memory
5. Use smaller models

#### Import Errors in Packages

**Symptoms:** ModuleNotFoundError for packages

**Solutions:**
1. Ensure workspace root is in `sys.path`
2. Check `__init__.py` files exist in all package directories
3. Verify package structure matches imports
4. Restart Python interpreter after changes

**Fix in main.py:**
```python
import sys
from pathlib import Path

workspace_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(workspace_root))
```

### Getting Help

**Documentation:**
- API docs: `http://localhost:3000/docs`
- User manual: `docs/user/synova-user-manual.md`
- Architecture: `docs/architecture/`

**Support:**
- Email: support@synova.ai
- GitHub Issues: https://github.com/fuzzynetwork1989-alt/synova-workspace/issues
- Status: status.synova.ai

---

## Security Best Practices

### API Security

1. **Never commit secrets** - Use environment variables
2. **Rotate tokens regularly** - Especially for production
3. **Use HTTPS in production** - Never expose API over HTTP
4. **Implement IP whitelisting** - For enterprise accounts
5. **Monitor usage** - Track unusual activity
6. **Revoke compromised tokens** - Immediately revoke suspicious tokens

### Environment Variables

**Required Variables:**
```bash
# Authentication
JWT_SECRET=<generate-secure-random-string>

# Database
DATABASE_URL=<secure-connection-string>

# Redis
REDIS_URL=<secure-connection-string>

# Billing
STRIPE_SECRET_KEY=<stripe-secret>
STRIPE_WEBHOOK_SECRET=<webhook-secret>
```

**Generating Secure Secrets:**
```bash
# JWT Secret
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Random API Key
python -c "import secrets; print('synova_sk_' + secrets.token_urlsafe(32))"
```

### Data Protection

1. **Encrypt sensitive data** - Use encryption at rest
2. **Secure transmission** - Use TLS/SSL
3. **Access controls** - Implement RBAC
4. **Audit logging** - Log all access
5. **Regular backups** - Backup database regularly
6. **Data retention** - Implement retention policies

### API Key Management

1. **Never share API keys** - Keep them secret
2. **Use environment variables** - Don't hardcode
3. **Rotate keys regularly** - Every 90 days
4. **Revoke unused keys** - Clean up old keys
5. **Monitor usage** - Track key usage
6. **Use scoped keys** - Limit permissions

### Input Validation

1. **Validate all inputs** - Sanitize user input
2. **Type checking** - Use type hints
3. **Length limits** - Prevent DoS
4. **SQL injection prevention** - Use parameterized queries
5. **XSS prevention** - Escape output
6. **CSRF protection** - Use CSRF tokens

### Rate Limiting

1. **Implement rate limits** - Prevent abuse
2. **Use exponential backoff** - Handle retries gracefully
3. **Monitor limits** - Track rate limit hits
4. **Provide feedback** - Inform users of limits
5. **Allow overage** - For paid tiers

---

## Legal Information

### License

Synova AI platform and documentation are proprietary. See Terms of Service for usage rights and restrictions.

### Terms of Service

**Full terms available at:** `docs/legal/terms-of-service.md`

**Key Points:**
- Usage governed by subscription tier
- Data privacy and retention policies
- Acceptable use policy
- Limitation of liability
- Termination conditions

### Privacy Policy

**Full policy available at:** `docs/legal/privacy-policy.md`

**Key Points:**
- Data collection practices
- Data usage and sharing
- User rights and controls
- Cookie policy
- Data security measures

### Compliance

**GDPR Compliance:**
- Data subject rights
- Data processing agreements
- Data protection impact assessments
- Breach notification procedures

**SOC 2 Compliance:**
- Security controls
- Availability controls
- Processing integrity
- Confidentiality
- Privacy

---

## Appendices

### Appendix A: Environment Variables Reference

#### API Configuration
```bash
APP_HOST=0.0.0.0
APP_PORT=3000
APP_ENV=development|production
DEBUG=true|false
```

#### Authentication
```bash
JWT_SECRET=<secret-key>
JWT_EXPIRATION_HOURS=24
```

#### Database
```bash
DATABASE_URL=postgresql://user:pass@host:port/db
```

#### Redis
```bash
REDIS_URL=redis://host:port
```

#### LLM Providers
```bash
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...
GROQ_API_KEY=gsk_...
DEEPSEEK_API_KEY=sk-...
HUGGINGFACE_API_KEY=hf_...
```

#### Ollama
```bash
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=synova
```

#### Billing
```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### CORS
```bash
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
```

### Appendix B: API Response Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Invalid or expired token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Appendix C: Subscription Tiers Comparison

| Feature | Starter | Pro | Enterprise |
|---------|---------|-----|------------|
| Price | $9/month | $49/month | Custom |
| Tokens/month | 100K | 1M | Unlimited |
| DRT Layers | Basic | Full | Full + Custom |
| RAG Documents | 100 | 1,000 | Unlimited |
| API Access | No | Yes | Yes |
| Priority Support | No | Yes | Yes |
| Custom Fine-tuning | No | No | Yes |
| SLA | No | 99% | 99.9% |
| On-premise | No | No | Yes |

### Appendix D: Glossary

**DRT:** Deep Resonance Thinking - Synova AI's 6-layer cognitive architecture

**RAG:** Retrieval Augmented Generation - AI that references uploaded documents

**Supanova:** Multi-agent orchestration system for complex tasks

**Autopilot:** Application generation from natural language descriptions

**Token:** Unit of text processing (roughly 4 characters)

**Complexity:** Setting that determines how many DRT layers are activated

**JWT:** JSON Web Token - Authentication token format

**RBAC:** Role-Based Access Control - Permission system

**SSE:** Server-Sent Events - Streaming response format

**Ollama:** Local LLM runtime for private inference

### Appendix E: Quick Reference Commands

#### Development
```bash
# Start API server
cd apps/api/src && python main.py

# Start frontend
cd apps/web && npm run dev

# Start Redis
redis-server

# Start PostgreSQL
sudo service postgresql start

# Run tests
pytest tests/
```

#### Ollama
```bash
# Create Synova model
ollama create synova -f Modelfile

# Run Synova model
ollama run synova

# List models
ollama list

# Pull base model
ollama pull deepseek-r1:8b
```

#### Deployment
```bash
# Railway deploy
railway up --service-name synova-core-api

# Vercel deploy
vercel --prod

# EAS build
eas build --platform android --profile production
```

#### Database
```bash
# Create database
createdb synova

# Run migrations
alembic upgrade head

# Connect to database
psql postgresql://localhost/synova
```

### Appendix F: Contact Information

**Website:** https://synova.ai  
**Email:** support@synova.ai  
**Documentation:** docs.synova.ai  
**API Reference:** api.synova.ai/docs  
**Status:** status.synova.ai  
**GitHub:** https://github.com/fuzzynetwork1989-alt/synova-workspace

### Appendix G: Version History

**v4.1 (April 2026)**
- Added Ollama integration for local LLM
- Enhanced Modelfile with cognitive traits
- Improved chat router with streaming
- Added comprehensive documentation

**v4.0 (March 2026)**
- Complete platform redesign
- Deep Resonance Thinking architecture
- Multi-agent system implementation
- RAG system integration

**v3.0 (February 2026)**
- Memory system overhaul
- Autopilot application generation
- Vision and voice capabilities

**v2.0 (January 2026)**
- API system complete
- Billing integration
- Multi-tenant support

**v1.0 (December 2025)**
- Initial release
- Basic chat functionality
- JWT authentication

---

## Document Control

**Document Owner:** Synova AI Team  
**Last Updated:** April 26, 2026  
**Next Review:** July 2026  
**Classification:** Public  

---

**End of Document**
