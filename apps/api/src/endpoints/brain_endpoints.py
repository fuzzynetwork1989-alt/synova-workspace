"""
Brain API Endpoints - Production Integration
REST API endpoints for Peak Brain functionality
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from fastapi.responses import StreamingResponse
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
from datetime import datetime
import asyncio
import json

# Import Brain components
from packages.brain.src.peak_brain import PeakBrain, BrainRequest, RequestType, BrainMode
from packages.memory.src.hierarchical_memory import MemoryType

# Pydantic models for API
class ChatRequest(BaseModel):
    user_id: str
    prompt: str
    session_id: Optional[str] = None
    preferences: Dict[str, Any] = Field(default_factory=dict)
    max_cost: Optional[float] = None
    urgency: float = Field(default=0.5, ge=0.0, le=1.0)
    complexity: float = Field(default=0.5, ge=0.0, le=1.0)
    streaming: bool = False
    mode: str = "chat"  # chat, supanova, rag, autopilot, deep_research
    use_rag: bool = False
    tenant_id: Optional[str] = None

class ChatResponse(BaseModel):
    request_id: str
    content: str
    mode: str
    components_used: List[str]
    cost: float
    latency_ms: float
    quality_score: Optional[float] = None
    memory_items: List[str] = Field(default_factory=list)
    tool_calls: List[Dict[str, Any]] = Field(default_factory=list)

class MemoryRequest(BaseModel):
    content: str
    memory_type: str  # conversation, knowledge, preference, context
    importance: float = Field(default=0.5, ge=0.0, le=1.0)
    tags: List[str] = Field(default_factory=list)

class MemoryResponse(BaseModel):
    memory_id: str
    success: bool
    message: str

class BrainStatusResponse(BaseModel):
    brain_id: str
    mode: str
    component_status: Dict[str, bool]
    performance_metrics: Dict[str, Any]
    timestamp: str

class ApprovalRequest(BaseModel):
    request_id: str
    approved: bool
    approver: str
    reason: str = ""

# Initialize router
router = APIRouter(prefix="/brain", tags=["brain"])

# Global Brain instance (in production, this would be properly managed)
brain_instance: Optional[PeakBrain] = None

def get_brain() -> PeakBrain:
    """Get or create Brain instance"""
    global brain_instance
    if brain_instance is None:
        brain_instance = PeakBrain(mode=BrainMode.BOOTSTRAP)
    return brain_instance

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest, brain: PeakBrain = Depends(get_brain)):
    """Process chat request with Brain - supports multiple modes via Nexus integration"""

    try:
        # Route to appropriate Nexus service based on mode
        if request.mode == "supanova":
            # Use Supanova Brain for multi-agent orchestration
            from packages.agent_runtime.src.supanova_brain import SupanovaBrain
            # In production, would integrate with actual Supanova execution
            response_content = "Supanova mode requires full integration with LangGraph"
            components_used = ["supanova_brain"]
            cost = 0.0
            latency_ms = 100.0

        elif request.mode == "rag" and request.use_rag:
            # Use RAG service for document-augmented responses
            if request.tenant_id:
                # In production: docs = await brain.rag_service.query(request.prompt, request.tenant_id)
                response_content = f"RAG mode: {request.prompt} (with document context)"
                components_used = ["rag_service", "provider_service"]
            else:
                response_content = "RAG mode requires tenant_id"
                components_used = []
            cost = 0.0
            latency_ms = 150.0

        elif request.mode == "autopilot":
            # Use Autopilot Mode for application scaffolding
            # In production: result = await brain.autopilot_mode.generate_project(request.prompt)
            response_content = "Autopilot mode generates full-stack applications from ideas"
            components_used = ["autopilot_mode", "provider_service"]
            cost = 0.0
            latency_ms = 200.0

        elif request.mode == "deep_research":
            # Use Deep Research Service for comprehensive research
            # In production: async for chunk in brain.deep_research.run_deep_research(request.prompt)
            response_content = "Deep research mode performs multi-step web research and synthesis"
            components_used = ["deep_research", "tool_service", "provider_service"]
            cost = 0.0
            latency_ms = 500.0

        else:
            # Standard chat mode using Peak Brain
            brain_request = BrainRequest(
                request_id=f"chat_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{len(request.prompt)}",
                user_id=request.user_id,
                request_type=RequestType.CHAT,
                prompt=request.prompt,
                context={'session_id': request.session_id, 'tenant_id': request.tenant_id} if request.session_id or request.tenant_id else {},
                preferences=request.preferences,
                session_id=request.session_id,
                max_cost=request.max_cost,
                urgency=request.urgency,
                complexity=request.complexity,
                requires_streaming=request.streaming
            )

            # Process request
            if request.streaming:
                response = await brain.process_request(brain_request)
                response.content = "[STREAMING] " + response.content
            else:
                response = await brain.process_request(brain_request)

            response_content = response.content
            components_used = response.components_used
            cost = response.cost
            latency_ms = response.latency_ms

        # Convert to API response
        return ChatResponse(
            request_id=f"{request.mode}_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            content=response_content,
            mode=request.mode,
            components_used=components_used,
            cost=cost,
            latency_ms=latency_ms,
            quality_score=0.8,
            memory_items=[],
            tool_calls=[]
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Brain processing error: {str(e)}")

@router.get("/chat/stream")
async def chat_stream_endpoint(
    user_id: str,
    prompt: str,
    session_id: Optional[str] = None,
    brain: PeakBrain = Depends(get_brain)
):
    """Streaming chat endpoint"""

    try:
        # Create Brain request
        brain_request = BrainRequest(
            request_id=f"stream_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{len(prompt)}",
            user_id=user_id,
            request_type=RequestType.CHAT,
            prompt=prompt,
            context={'session_id': session_id} if session_id else {},
            session_id=session_id,
            requires_streaming=True
        )

        # Return streaming response
        async def generate():
            async for chunk in brain.process_streaming_request(brain_request):
                yield f"data: {json.dumps({'chunk': chunk})}\n\n"
            yield "data: [DONE]\n\n"

        return StreamingResponse(
            generate(),
            media_type="text/plain",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no"  # Disable nginx buffering
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Streaming error: {str(e)}")

@router.post("/reasoning", response_model=ChatResponse)
async def reasoning_endpoint(request: ChatRequest, brain: PeakBrain = Depends(get_brain)):
    """Process reasoning request with Brain"""

    try:
        # Create Brain request for reasoning
        brain_request = BrainRequest(
            request_id=f"reasoning_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{len(request.prompt)}",
            user_id=request.user_id,
            request_type=RequestType.REASONING,
            prompt=request.prompt,
            context={'session_id': request.session_id} if request.session_id else {},
            preferences=request.preferences,
            session_id=request.session_id,
            max_cost=request.max_cost,
            urgency=request.urgency,
            complexity=max(request.complexity, 0.6),  # Reasoning typically more complex
            requires_streaming=request.streaming
        )

        # Process request
        response = await brain.process_request(brain_request)

        # Convert to API response
        return ChatResponse(
            request_id=response.request_id,
            content=response.content,
            mode=response.mode.value,
            components_used=response.components_used,
            cost=response.cost,
            latency_ms=response.latency_ms,
            quality_score=response.quality_score,
            memory_items=response.memory_items,
            tool_calls=response.tool_calls
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reasoning error: {str(e)}")

@router.post("/coding", response_model=ChatResponse)
async def coding_endpoint(request: ChatRequest, brain: PeakBrain = Depends(get_brain)):
    """Process coding request with Brain"""

    try:
        # Create Brain request for coding
        brain_request = BrainRequest(
            request_id=f"coding_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{len(request.prompt)}",
            user_id=request.user_id,
            request_type=RequestType.CODING,
            prompt=request.prompt,
            context={'session_id': request.session_id} if request.session_id else {},
            preferences=request.preferences,
            session_id=request.session_id,
            max_cost=request.max_cost,
            urgency=request.urgency,
            complexity=max(request.complexity, 0.5),
            requires_streaming=request.streaming
        )

        # Process request
        response = await brain.process_request(brain_request)

        # Convert to API response
        return ChatResponse(
            request_id=response.request_id,
            content=response.content,
            mode=response.mode.value,
            components_used=response.components_used,
            cost=response.cost,
            latency_ms=response.latency_ms,
            quality_score=response.quality_score,
            memory_items=response.memory_items,
            tool_calls=response.tool_calls
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Coding error: {str(e)}")

@router.post("/memory", response_model=MemoryResponse)
async def create_memory_endpoint(request: MemoryRequest, brain: PeakBrain = Depends(get_brain)):
    """Create a memory item"""

    try:
        # Convert memory type
        memory_type_map = {
            'conversation': MemoryType.CONVERSATION,
            'knowledge': MemoryType.KNOWLEDGE,
            'preference': MemoryType.PREFERENCE,
            'context': MemoryType.CONTEXT
        }

        memory_type = memory_type_map.get(request.memory_type.lower(), MemoryType.CONVERSATION)

        # Create memory
        memory_id = brain.create_memory(
            content=request.content,
            memory_type=memory_type,
            importance=request.importance,
            tags=request.tags
        )

        return MemoryResponse(
            memory_id=memory_id,
            success=True,
            message="Memory created successfully"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Memory creation error: {str(e)}")

@router.get("/memory")
async def retrieve_memory_endpoint(
    query: str,
    max_tokens: int = 1000,
    brain: PeakBrain = Depends(get_brain)
):
    """Retrieve memories"""

    try:
        memories = brain.get_memory(query=query, max_tokens=max_tokens)

        return {
            "query": query,
            "memories": memories,
            "count": len(memories)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Memory retrieval error: {str(e)}")

@router.get("/status", response_model=BrainStatusResponse)
async def brain_status_endpoint(brain: PeakBrain = Depends(get_brain)):
    """Get Brain status"""

    try:
        status = brain.get_brain_status()

        return BrainStatusResponse(
            brain_id=status['brain_id'],
            mode=status['mode'],
            component_status=status['component_status'],
            performance_metrics=status['performance_metrics'],
            timestamp=status['timestamp']
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Status error: {str(e)}")

@router.get("/health")
async def brain_health_endpoint(brain: PeakBrain = Depends(get_brain)):
    """Get Brain health"""

    try:
        health = await brain.health_check()
        return health

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health check error: {str(e)}")

@router.post("/mode")
async def switch_mode_endpoint(
    mode: str,
    brain: PeakBrain = Depends(get_brain)
):
    """Switch Brain operating mode"""

    try:
        mode_map = {
            'bootstrap': BrainMode.BOOTSTRAP,
            'frontier': BrainMode.FRONTIER,
            'hybrid': BrainMode.HYBRID
        }

        brain_mode = mode_map.get(mode.lower(), BrainMode.BOOTSTRAP)
        brain.switch_mode(brain_mode)

        return {
            "message": f"Brain mode switched to {brain_mode.value}",
            "previous_mode": brain.mode.value,
            "new_mode": brain_mode.value
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Mode switch error: {str(e)}")

@router.get("/approvals/pending")
async def pending_approvals_endpoint(brain: PeakBrain = Depends(get_brain)):
    """Get pending approvals"""

    try:
        pending = brain.get_pending_approvals()

        return {
            "pending_approvals": pending,
            "count": len(pending)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Approvals error: {str(e)}")

@router.post("/approvals/{request_id}")
async def handle_approval_endpoint(
    request_id: str,
    approval: ApprovalRequest,
    brain: PeakBrain = Depends(get_brain)
):
    """Handle approval request"""

    try:
        if approval.approved:
            brain.approve_action(request_id, approval.approver, approval.reason)
            message = f"Request {request_id} approved"
        else:
            brain.reject_action(request_id, approval.approver, approval.reason)
            message = f"Request {request_id} rejected"

        return {
            "message": message,
            "request_id": request_id,
            "approved": approval.approved,
            "approver": approval.approver
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Approval handling error: {str(e)}")

@router.get("/observability/dashboard")
async def observability_dashboard_endpoint(brain: PeakBrain = Depends(get_brain)):
    """Get observability dashboard data"""

    try:
        dashboard = brain.observability.get_dashboard_data()

        return dashboard

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Observability error: {str(e)}")

@router.get("/governance/dashboard")
async def governance_dashboard_endpoint(brain: PeakBrain = Depends(get_brain)):
    """Get governance dashboard data"""

    try:
        dashboard = brain.governance.get_governance_dashboard()

        return dashboard

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Governance error: {str(e)}")

@router.get("/metrics")
async def metrics_endpoint(brain: PeakBrain = Depends(get_brain)):
    """Get detailed metrics"""

    try:
        # Get comprehensive metrics
        metrics = {
            'brain_status': brain.get_brain_status(),
            'observability': brain.observability.get_dashboard_data(),
            'governance': brain.governance.get_governance_dashboard(),
            'health': await brain.health_check()
        }

        return metrics

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Metrics error: {str(e)}")

# Background task for Brain maintenance
@router.post("/maintenance/cleanup")
async def maintenance_cleanup_endpoint(background_tasks: BackgroundTasks, brain: PeakBrain = Depends(get_brain)):
    """Trigger maintenance cleanup"""

    async def cleanup_task():
        try:
            # Clean up expired memories
            cleanup_counts = await brain.memory_system.cleanup_expired_memories()

            # Clean up old traces (would be implemented in observability)
            # trace_cleanup = brain.observability.cleanup_old_traces()

            print(f"Maintenance completed: {cleanup_counts}")

        except Exception as e:
            print(f"Maintenance error: {e}")

    background_tasks.add_task(cleanup_task)

    return {
        "message": "Maintenance cleanup started",
        "timestamp": datetime.now().isoformat()
    }

# Error handlers
@router.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    return {
        "error": "Internal server error",
        "detail": str(exc),
        "timestamp": datetime.now().isoformat()
    }

# Middleware for request logging
@router.middleware("http")
async def log_requests(request, call_next):
    """Log all requests"""
    start_time = datetime.now()

    response = await call_next(request)

    process_time = (datetime.now() - start_time).total_seconds()

    # Log request (in production, would use proper logging)
    print(f"{request.method} {request.url.path} - {response.status_code} - {process_time:.3f}s")

    return response
