# Synova Nexus Integration Guide

## Overview

This document describes the integration of Synova Nexus v1.0 components into the Synova AI platform. The integration adds production-grade multi-agent orchestration, provider-agnostic LLM service, RAG capabilities, Autopilot Mode, tool execution, safety guardrails, billing, and XR support.

## Components Integrated

### 1. Supanova Brain (LangGraph Multi-Agent Orchestration)

**File:** `packages/agent-runtime/src/supanova_brain.py`

**Features:**
- MoE (Mixture of Experts) routing for intelligent agent selection
- Planner-Executor-Verifier-Critic workflow
- Support for 5 agent types: code, logic, research, qa, creative
- LangGraph-based state management
- Execution statistics and health monitoring

**Integration Points:**
- Integrates with `AdvancedModelRouter` for model selection
- Integrates with `HierarchicalMemorySystem` for memory storage
- Provides streaming execution with trace events

**Usage:**
```python
from packages.agent-runtime.src.supanova_brain import SupanovaBrain

supanova = SupanovaBrain(model_router, memory_system)
async for event in supanova.run_supanova(messages):
    if event["type"] == "trace":
        print(f"Agent: {event['node']['name']}")
    elif event["type"] == "answer":
        print(f"Answer: {event['content']}")
```

### 2. Provider-Agnostic LLM Service

**File:** `packages/ai/src/provider_service.py`

**Features:**
- Unified interface for 6 LLM providers: OpenAI, Anthropic, Ollama, Gemini, Grok, HuggingFace
- Streaming support for all providers
- Cost calculation per model
- Vision support for compatible models
- Graceful fallback when providers unavailable

**Supported Providers:**
- OpenAI: GPT-4o, GPT-4o-mini
- Anthropic: Claude Opus 4.5, Claude Sonnet 4.6
- Ollama: Llama 3.1, Gemma 4
- Gemini: Gemini 2.5 Pro
- Grok: Grok 3
- HuggingFace: Mistral 7B

**Usage:**
```python
from packages.ai.src.provider_service import ProviderService, LLMProvider

service = ProviderService(default_provider=LLMProvider.openai)
async for chunk in service.stream_chat(messages, temperature=0.7):
    print(chunk, end="")
```

### 3. RAG Service (Retrieval Augmented Generation)

**File:** `packages/retrieval/src/rag_service.py`

**Features:**
- Document upload with automatic chunking
- Embedding generation (OpenAI or Ollama)
- Vector similarity search
- Multi-tenant support
- Supabase pgvector integration
- Redis caching support

**Configuration:**
```bash
EMBEDDING_PROVIDER=openai  # or ollama
EMBEDDING_MODEL=text-embedding-3-small
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-service-key
```

**Usage:**
```python
from packages.retrieval.src.rag_service import RAGService

rag = RAGService()
await rag.upload_document(tenant_id, "doc.pdf", content)
results = await rag.query("search query", tenant_id, top_k=5)
```

### 4. Autopilot Mode (Full-Stack Scaffolding)

**File:** `packages/brain/src/autopilot_mode.py`

**Features:**
- "Build [idea]" endpoint for project generation
- Automatic stack selection based on idea
- Three depth levels: scaffold, mvp, production
- Generates complete project structure
- Creates code files, configs, deployment setup
- Documentation generation

**Supported Stacks:**
- Next.js + FastAPI (default)
- React Native + Expo (mobile)
- FastAPI + Python (AI/ML)
- Node.js + Express (backend)

**Usage:**
```python
from packages.brain.src.autopilot_mode import AutopilotMode, AutopilotDepth

autopilot = AutopilotMode()
async for event in autopilot.generate_project(
    idea="Build a task management app",
    depth=AutopilotDepth.mvp
):
    if event["type"] == "file":
        print(f"Created: {event['path']}")
```

### 5. Tool Service

**File:** `packages/tools/src/tool_service.py`

**Features:**
- Tool registration and execution
- Permission levels: read_only, write, execute, admin
- Approval workflow for dangerous tools
- Built-in tools: web search, code execution, image generation, data analysis
- Serper and Tavily API integration
- Execution statistics

**Built-in Tools:**
- `web_search`: Search the web (Serper/Tavily)
- `code_execution`: Execute code in sandbox
- `image_generation`: Generate images from text
- `data_analysis`: Analyze data

**Usage:**
```python
from packages.tools.src.tool_service import ToolService

tools = ToolService()
result = await tools.run_tool("web_search", {"query": "AI trends"})
```

### 6. Safety Service

**File:** `packages/safety/src/safety_service.py`

**Features:**
- Input filtering and output criticism
- OpenAI Moderation API integration
- Local safety checks (no API required)
- Prompt injection detection
- PII leakage detection
- Code injection prevention
- Configurable thresholds

**Safety Categories:**
- hate_speech
- violence
- sexual_content
- self_harm
- illegal_content
- harassment
- misinformation
- prompt_injection

**Usage:**
```python
from packages.safety.src.safety_service import SafetyService

safety = SafetyService()
result = await safety.check_input(user_input)
if result.action == "block":
    print("Content blocked")
```

### 7. Billing Service

**File:** `packages/billing/src/billing_service.py`

**Features:**
- Stripe integration for subscriptions
- Three-tier pricing: Starter ($9), Pro ($29), Enterprise ($99)
- Usage tracking and cost calculation
- Feature access control by tier
- Checkout session creation
- Customer portal integration
- Webhook handling

**Tier Features:**
- **Starter**: Basic chat, 1GB memory, standard support
- **Pro**: Advanced chat, Supanova agents, 10GB memory, API access
- **Enterprise**: All features, custom models, unlimited memory, SLA

**Usage:**
```python
from packages.billing.src.billing_service import BillingService, TenantTier

billing = BillingService()
session = await billing.create_checkout_session(
    tenant_id, TenantTier.pro, success_url, cancel_url
)
```

### 8. XR Service (Extended Reality)

**File:** `packages/xr/src/xr_service.py`

**Features:**
- WebXR API integration
- AR/VR/MR session support
- Spatial AI queries
- Gesture recognition
- Voice command processing
- Environment understanding
- Spatial anchor creation
- Spatial content rendering

**Session Types:**
- AR (Augmented Reality)
- VR (Virtual Reality)
- Mixed Reality

**Interaction Modes:**
- Gaze
- Gesture
- Voice
- Controller
- Hand tracking

**Usage:**
```python
from packages.xr.src.xr_service import XRService, XRSessionType

xr = XRService()
session = await xr.create_xr_session(tenant_id, user_id, XRSessionType.ar)
result = await xr.spatial_query(session_id, "What objects are nearby?")
```

## Environment Variables

### Required for Production

```bash
# LLM Providers
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=...
GROK_API_KEY=...
HF_API_KEY=hf_...
OLLAMA_BASE_URL=http://localhost:11434

# RAG / Supabase
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-service-key
SUPABASE_ANON_KEY=your-anon-key
EMBEDDING_PROVIDER=openai
EMBEDDING_MODEL=text-embedding-3-small

# Redis
REDIS_URL=redis://localhost:6379

# Stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER=price_xxx
STRIPE_PRICE_PRO=price_xxx
STRIPE_PRICE_ENTERPRISE=price_xxx

# Search APIs
SERPER_API_KEY=...
TAVILY_API_KEY=...

# Safety
SAFETY_ENABLED=true
OPENAI_MODERATION=true
```

## Integration with Peak Brain

The Nexus components integrate with the existing Peak Brain orchestrator:

```python
from packages.brain.src.peak_brain import PeakBrain
from packages.agent-runtime.src.supanova_brain import SupanovaBrain
from packages.ai.src.provider_service import ProviderService
from packages.retrieval.src.rag_service import RAGService
from packages.tools.src.tool_service import ToolService
from packages.safety.src.safety_service import SafetyService

# Initialize components
provider_service = ProviderService()
rag_service = RAGService()
tool_service = ToolService()
safety_service = SafetyService()
supanova_brain = SupanovaBrain(model_router, memory_system)

# Peak Brain can now use all Nexus services
peak_brain = PeakBrain(
    model_router=model_router,
    memory_system=memory_system,
    agent_runtime=multi_agent_runtime,
    observability=observability,
    governance=governance,
    # New Nexus components
    provider_service=provider_service,
    rag_service=rag_service,
    tool_service=tool_service,
    safety_service=safety_service,
    supanova_brain=supanova_brain
)
```

## API Endpoints

Add these endpoints to `apps/api/src/endpoints/brain_endpoints.py`:

```python
# Supanova Brain
@router.post("/supanova/run")
async def run_supanova(request: SupanovaRequest):
    async for event in supanova_brain.run_supanova(request.messages):
        yield event

# RAG
@router.post("/rag/upload")
async def upload_document(request: RAGUploadRequest):
    return await rag_service.upload_document(...)

@router.post("/rag/query")
async def query_rag(request: RAGQueryRequest):
    return await rag_service.query(...)

# Autopilot
@router.post("/autopilot/generate")
async def generate_project(request: AutopilotRequest):
    async for event in autopilot_mode.generate_project(...):
        yield event

# Tools
@router.post("/tools/run")
async def run_tool(request: ToolRequest):
    return await tool_service.run_tool(...)

# Safety
@router.post("/safety/check-input")
async def check_input(request: SafetyCheckRequest):
    return await safety_service.check_input(...)

# Billing
@router.post("/billing/checkout")
async def create_checkout(request: CheckoutRequest):
    return await billing_service.create_checkout_session(...)

# XR
@router.post("/xr/session")
async def create_xr_session(request: XRSessionRequest):
    return await xr_service.create_xr_session(...)
```

## Dependencies

Add to `apps/api/requirements.txt`:

```txt
# Nexus Integration
langgraph==0.3.5
langchain==0.3.14
langchain-core==0.3.28
langchain-openai==0.3.3
langchain-anthropic==0.3.3
langchain-community==0.3.14

# Providers
openai==1.59.6
anthropic==0.42.0
google-generativeai==0.8.3
stripe==11.4.1

# RAG
supabase==2.10.0
vecs==0.4.3

# Tools
httpx==0.28.1

# Safety
openai==1.59.6  # Already included

# General
structlog==24.4.0
httpx==0.28.1
```

## Deployment Considerations

### Railway (Backend)
- Deploy FastAPI app with all Nexus services
- Configure environment variables
- Set up Supabase connection
- Configure Redis for caching

### Vercel (Frontend)
- Deploy Next.js frontend
- Configure API routes to backend
- Set up environment variables

### Docker
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Monitoring and Observability

All Nexus services include health check endpoints:

```python
# Check all services
health_status = {
    "supanova": await supanova_brain.health_check(),
    "provider": await provider_service.health_check(),
    "rag": await rag_service.health_check(),
    "autopilot": await autopilot_mode.health_check(),
    "tools": await tool_service.health_check(),
    "safety": await safety_service.health_check(),
    "billing": await billing_service.health_check(),
    "xr": await xr_service.health_check()
}
```

## Security Considerations

1. **API Keys**: Never commit API keys to source control
2. **Rate Limiting**: Implement rate limiting for all endpoints
3. **Input Validation**: Use Pydantic schemas for all inputs
4. **Output Filtering**: Run all outputs through Safety Service
5. **Tenant Isolation**: Ensure multi-tenant data isolation
6. **Webhook Verification**: Verify Stripe webhooks

## Next Steps

1. Install dependencies: `pip install -r requirements.txt`
2. Configure environment variables
3. Set up Supabase database with pgvector extension
4. Configure Stripe products and prices
5. Test each service individually
6. Integrate with Peak Brain orchestrator
7. Add API endpoints
8. Deploy to production

## Troubleshooting

### LangGraph Not Installed
```bash
pip install langgraph langchain
```

### Supabase Connection Failed
- Check SUPABASE_URL and SUPABASE_SERVICE_KEY
- Ensure pgvector extension is enabled
- Verify database permissions

### Stripe Webhook Verification Failed
- Check STRIPE_WEBHOOK_SECRET
- Ensure webhook endpoint is HTTPS
- Verify signature in production

### Ollama Not Responding
- Ensure Ollama is running: `ollama serve`
- Check OLLAMA_BASE_URL
- Verify model is downloaded: `ollama pull llama3.1`

## Performance Optimization

1. **Caching**: Use Redis for frequent queries
2. **Batching**: Batch embedding requests
3. **Streaming**: Use streaming for all LLM calls
4. **Connection Pooling**: Reuse HTTP clients
5. **Async**: Use async/await throughout

## License

MIT License - See LICENSE file for details
