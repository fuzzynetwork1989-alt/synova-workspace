"""
Peak Brain - Unified Brain Orchestration System
Complete integration of all Brain components for frontier-class AI platform
"""

from typing import Dict, List, Optional, Union, Any, AsyncGenerator
from dataclasses import dataclass, field
from enum import Enum
from datetime import datetime, timedelta
import asyncio
import uuid
import json

# Import Brain components
from packages.ai.src.model_router import AdvancedModelRouter, RoutingRequest, ModelRoute
from packages.memory.src.hierarchical_memory import HierarchicalMemorySystem, MemoryType, MemoryLayer
try:
    from packages.agent_runtime.src.multi_agent_runtime import MultiAgentRuntime, ComplexTask, TaskResult, ToolRegistry
    from packages.agent_runtime.src.supanova_brain import SupanovaBrain
    AGENT_RUNTIME_AVAILABLE = True
except ImportError:
    AGENT_RUNTIME_AVAILABLE = False
    MultiAgentRuntime = None
    ComplexTask = None
    TaskResult = None
    ToolRegistry = None
    SupanovaBrain = None

from packages.observability.src.brain_observability import BrainObservability, SystemComponent
from packages.governance.src.brain_governance import BrainGovernance, ActionType
from packages.ai.src.provider_service import ProviderService, LLMProvider
from packages.retrieval.src.rag_service import RAGService
from packages.brain.src.autopilot_mode import AutopilotMode, AutopilotDepth
from packages.tools.src.tool_service import ToolService
from packages.safety.src.safety_service import SafetyService
from packages.billing.src.billing_service import BillingService, TenantTier
from packages.xr.src.xr_service import XRService, XRSessionType
from packages.research.src.deep_research import DeepResearchService
from packages.memory.src.memory_service import MemoryService
from packages.ai.src.synova_model import SynovaModel

class BrainMode(Enum):
    BOOTSTRAP = "bootstrap"
    FRONTIER = "frontier"
    HYBRID = "hybrid"

class RequestType(Enum):
    CHAT = "chat"
    REASONING = "reasoning"
    CODING = "coding"
    ANALYSIS = "analysis"
    MULTIMODAL = "multimodal"
    COMPLEX_TASK = "complex_task"

@dataclass
class BrainRequest:
    request_id: str
    user_id: str
    request_type: RequestType
    prompt: str
    context: Dict[str, Any] = field(default_factory=dict)
    preferences: Dict[str, Any] = field(default_factory=dict)
    session_id: Optional[str] = None
    max_cost: Optional[float] = None
    urgency: float = 0.5  # 0-1
    complexity: float = 0.5  # 0-1
    requires_streaming: bool = False
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class BrainResponse:
    request_id: str
    content: str
    mode: BrainMode
    components_used: List[str]
    execution_trace: List[Dict[str, Any]]
    metrics: Dict[str, Any]
    cost: float
    latency_ms: float
    quality_score: Optional[float] = None
    memory_items: List[str] = field(default_factory=list)
    tool_calls: List[Dict[str, Any]] = field(default_factory=list)
    governance_checks: List[Dict[str, Any]] = field(default_factory=list)

class PeakBrain:
    """
    Peak Brain - Unified orchestration of all Brain components
    Provides intelligent, safe, and observable AI capabilities
    """

    def __init__(self, mode: BrainMode = BrainMode.BOOTSTRAP):
        self.mode = mode
        self.brain_id = f"peak_brain_{uuid.uuid4().hex[:8]}"

        # Initialize Brain components
        self.model_router = AdvancedModelRouter()
        self.memory_system = HierarchicalMemorySystem()
        if AGENT_RUNTIME_AVAILABLE:
            self.tool_registry = ToolRegistry()
            self.agent_runtime = MultiAgentRuntime(self.tool_registry)
        else:
            self.tool_registry = None
            self.agent_runtime = None
        self.observability = BrainObservability()
        self.governance = BrainGovernance()

        # Initialize Nexus components
        if AGENT_RUNTIME_AVAILABLE:
            self.supanova_brain = SupanovaBrain(self.model_router, self.memory_system)
        else:
            self.supanova_brain = None
        self.provider_service = ProviderService(default_provider=LLMProvider.openai)
        self.rag_service = RAGService()
        self.autopilot_mode = AutopilotMode()
        self.tool_service = ToolService()
        self.safety_service = SafetyService()
        self.billing_service = BillingService()
        self.xr_service = XRService()
        self.deep_research = DeepResearchService(self.tool_service, self.provider_service)
        self.memory_service = MemoryService()
        self.synova_model = SynovaModel()

        # Component status tracking
        self.component_status = {
            'model_router': True,
            'memory_system': True,
            'agent_runtime': AGENT_RUNTIME_AVAILABLE,
            'tool_registry': AGENT_RUNTIME_AVAILABLE,
            'observability': True,
            'governance': True,
            # Nexus components
            'supanova_brain': AGENT_RUNTIME_AVAILABLE,
            'provider_service': True,
            'rag_service': True,
            'autopilot_mode': True,
            'tool_service': True,
            'safety_service': True,
            'billing_service': True,
            'xr_service': True,
            'deep_research': True,
            'memory_service': True,
            'synova_model': True
        }

        # Performance metrics
        self.request_count = 0
        self.success_count = 0
        self.total_cost = 0.0
        self.total_latency = 0.0

        # Initialize components
        self._initialize_components()

    def _initialize_components(self):
        """Initialize all Brain components"""
        # Setup governance approval callback
        def approval_callback(approval_request):
            # This would integrate with UI notification system
            print(f"Approval required: {approval_request.description}")

        self.governance.human_approver.add_approval_callback(approval_callback)

        # Register basic tools (would be expanded in production)
        self._register_basic_tools()

    def _register_basic_tools(self):
        """Register basic tools for the tool registry"""
        if not AGENT_RUNTIME_AVAILABLE:
            return

        # Example tool implementations
        async def search_tool(query: str) -> Dict[str, Any]:
            return {"results": f"Search results for: {query}", "count": 5}

        async def analyze_tool(data: str) -> Dict[str, Any]:
            return {"analysis": f"Analysis of: {data[:100]}...", "confidence": 0.8}

        # Register tools
        from packages.agent_runtime.src.multi_agent_runtime import ToolDefinition, ToolPermission

        self.tool_registry.register_tool(
            ToolDefinition(
                name="search",
                description="Search for information",
                parameters={"query": "string"},
                permission=ToolPermission.READ_ONLY,
                timeout_seconds=10
            ),
            search_tool
        )

        self.tool_registry.register_tool(
            ToolDefinition(
                name="analyze",
                description="Analyze data or content",
                parameters={"data": "string"},
                permission=ToolPermission.READ_ONLY,
                timeout_seconds=15
            ),
            analyze_tool
        )

    async def process_request(self, request: BrainRequest) -> BrainResponse:
        """Process a Brain request with full orchestration"""

        trace_id = str(uuid.uuid4())
        start_time = datetime.now()

        try:
            # Step 1: Governance check
            governance_result = await self._check_governance(request, trace_id)
            if not governance_result['allowed']:
                return self._create_blocked_response(request, governance_result, start_time)

            # Step 2: Memory retrieval
            memory_context = await self._retrieve_memory(request, trace_id)

            # Step 3: Model routing
            model_route = await self._route_model(request, memory_context, trace_id)

            # Step 4: Determine execution strategy
            execution_strategy = self._determine_execution_strategy(request, model_route)

            # Step 5: Execute request
            if execution_strategy == 'agent_based':
                result = await self._execute_with_agents(request, model_route, memory_context, trace_id)
            else:
                result = await self._execute_direct(request, model_route, memory_context, trace_id)

            # Step 6: Store memory
            await self._store_memory(request, result, trace_id)

            # Step 7: Create response
            response = self._create_response(request, result, model_route, start_time, trace_id)

            # Update metrics
            self._update_metrics(response, True)

            return response

        except Exception as e:
            # Log error and create error response
            self.observability.metrics_collector.increment_counter(
                "brain_errors",
                labels={'error_type': type(e).__name__},
                component=SystemComponent.AGENT_RUNTIME
            )

            self._update_metrics(None, False)

            return BrainResponse(
                request_id=request.request_id,
                content=f"Error processing request: {str(e)}",
                mode=self.mode,
                components_used=[],
                execution_trace=[{"error": str(e), "timestamp": datetime.now().isoformat()}],
                metrics={},
                cost=0.0,
                latency_ms=(datetime.now() - start_time).total_seconds() * 1000
            )

    async def _check_governance(self, request: BrainRequest, trace_id: str) -> Dict[str, Any]:
        """Check governance policies for the request"""

        action_context = {
            'action': 'process_request',
            'action_type': request.request_type.value,
            'component': 'peak_brain',
            'user_id': request.user_id,
            'agent_id': 'peak_brain',
            'estimated_cost': request.max_cost,
            'complexity': request.complexity,
            'urgency': request.urgency,
            'tools_used': [],  # Will be populated during execution
            'data_accessed': [],  # Will be populated during execution
            'external_apis': []  # Will be populated during execution
        }

        return await self.governance.check_action_permission(action_context)

    async def _retrieve_memory(self, request: BrainRequest, trace_id: str) -> Dict[str, Any]:
        """Retrieve relevant memory for the request"""

        # Start memory operation trace
        span_id = self.observability.trace_collector.start_span(
            trace_id=trace_id,
            operation_name="memory_retrieval",
            component=SystemComponent.MEMORY_SYSTEM
        )

        try:
            # Determine memory layers to search
            layers = [MemoryLayer.SESSION, MemoryLayer.WORKING, MemoryLayer.LONG_TERM]

            # Retrieve context
            memories = await self.memory_system.retrieve_context(
                query=request.prompt,
                max_tokens=2000,
                layers=layers
            )

            # Record memory operation
            self.observability.record_memory_operation(
                operation="retrieve",
                layer="multiple",
                duration_ms=100,  # Would be actual timing
                success=True
            )

            # Finish trace
            self.observability.trace_collector.finish_span(span_id, "ok")

            return {
                'memories': memories,
                'context': ' '.join([m.content for m in memories[:5]]),  # First 5 memories
                'memory_ids': [m.id for m in memories]
            }

        except Exception as e:
            self.observability.trace_collector.finish_span(span_id, "error")
            self.observability.record_memory_operation(
                operation="retrieve",
                layer="multiple",
                duration_ms=100,
                success=False
            )
            return {'memories': [], 'context': '', 'memory_ids': []}

    async def _route_model(self, request: BrainRequest, memory_context: Dict[str, Any], trace_id: str) -> ModelRoute:
        """Route request to optimal model"""

        # Create routing request
        routing_request = RoutingRequest(
            task_type=self._map_request_type_to_task_type(request.request_type),
            complexity=request.complexity,
            urgency=request.urgency,
            budget_constraint=request.max_cost,
            latency_requirement=None,  # Could be derived from urgency
            token_estimate=len(request.prompt.split()) * 1.3,  # Rough estimate
            requires_streaming=request.requires_streaming,
            requires_function_calling=request.request_type in [RequestType.COMPLEX_TASK],
            requires_multimodal=request.request_type == RequestType.MULTIMODAL,
            user_tier="standard"  # Could be derived from user preferences
        )

        # Get model route
        route = self.model_router.route_request(routing_request)

        # Record model usage
        self.observability.record_request(
            trace_id=trace_id,
            operation="model_routing",
            component=SystemComponent.MODEL_ROUTER,
            duration_ms=50,  # Would be actual timing
            success=True,
            tags={'model': route.primary_model.name, 'strategy': route.routing_rationale}
        )

        return route

    def _map_request_type_to_task_type(self, request_type: RequestType):
        """Map request type to model router task type"""
        from packages.ai.src.model_router import TaskType

        mapping = {
            RequestType.CHAT: TaskType.CHAT,
            RequestType.REASONING: TaskType.REASONING,
            RequestType.CODING: TaskType.CODING,
            RequestType.ANALYSIS: TaskType.ANALYSIS,
            RequestType.MULTIMODAL: TaskType.MULTIMODAL,
            RequestType.COMPLEX_TASK: TaskType.REASONING
        }

        return mapping.get(request_type, TaskType.CHAT)

    def _determine_execution_strategy(self, request: BrainRequest, model_route: ModelRoute) -> str:
        """Determine whether to use agents or direct model execution"""

        # Use agents for complex tasks or when specific capabilities are needed
        if (request.request_type == RequestType.COMPLEX_TASK or
            request.complexity > 0.7 or
            request.urgency < 0.3):  # Low urgency allows for more complex processing
            return 'agent_based'

        # Use direct execution for simple requests
        return 'direct'

    async def _execute_with_agents(self, request: BrainRequest, model_route: ModelRoute,
                                  memory_context: Dict[str, Any], trace_id: str) -> Dict[str, Any]:
        """Execute request using multi-agent runtime"""

        # Create complex task
        task = ComplexTask(
            task_id=str(uuid.uuid4()),
            description=f"Process {request.request_type.value} request",
            user_request=request.prompt,
            priority=request.urgency,
            complexity=request.complexity,
            estimated_cost=request.max_cost or 1.0,
            requires_human_approval=request.complexity > 0.8
        )

        # Add context to task
        task.metadata.update({
            'model_route': model_route,
            'memory_context': memory_context,
            'user_preferences': request.preferences
        })

        # Execute task
        task_result = await self.agent_runtime.execute_task(task)

        # Record agent execution
        self.observability.record_agent_execution(
            agent_type="multi_agent",
            task_complexity="complex" if request.complexity > 0.7 else "moderate",
            duration_ms=task_result.execution_trace[-1].get('duration', 0) if task_result.execution_trace else 0,
            success=task_result.status.value == 'completed',
            cost=task_result.cost_breakdown.get('total', 0.0)
        )

        return {
            'content': task_result.result or "Task completed successfully",
            'task_result': task_result,
            'agent_based': True,
            'tool_calls': task_result.execution_trace
        }

    async def _execute_direct(self, request: BrainRequest, model_route: ModelRoute,
                            memory_context: Dict[str, Any], trace_id: str) -> Dict[str, Any]:
        """Execute request directly with model"""

        # Simulate model execution (would call actual model)
        # In production, this would integrate with the selected model

        # Record model usage
        estimated_tokens = len(request.prompt.split()) * 1.3
        estimated_cost = estimated_tokens * model_route.primary_model.cost_per_1k_tokens / 1000
        estimated_latency = model_route.estimated_latency

        self.observability.record_model_usage(
            model_name=model_route.primary_model.name,
            tokens_used=int(estimated_tokens),
            cost=estimated_cost,
            latency_ms=estimated_latency
        )

        # Generate response (simulated)
        if memory_context['context']:
            response_content = f"Based on previous context: {memory_context['context'][:200]}... " \
                           f"Here's my response to: {request.prompt[:100]}..."
        else:
            response_content = f"Direct model response to: {request.prompt[:100]}..."

        return {
            'content': response_content,
            'model_used': model_route.primary_model.name,
            'agent_based': False,
            'tool_calls': [],
            'tokens_used': estimated_tokens,
            'cost': estimated_cost
        }

    async def _store_memory(self, request: BrainRequest, result: Dict[str, Any], trace_id: str):
        """Store relevant information from the request and result"""

        try:
            # Store conversation memory
            await self.memory_system.store_memory(
                content=f"User: {request.prompt}\nAssistant: {result['content']}",
                memory_type=MemoryType.CONVERSATION,
                importance=0.7 if request.complexity > 0.5 else 0.5,
                tags=[request.request_type.value, request.user_id],
                metadata={
                    'request_id': request.request_id,
                    'mode': self.mode.value,
                    'components_used': result.get('components_used', [])
                }
            )

            # Store knowledge if this was a reasoning/analysis task
            if request.request_type in [RequestType.REASONING, RequestType.ANALYSIS]:
                await self.memory_system.store_memory(
                    content=result['content'][:500],  # First 500 chars
                    memory_type=MemoryType.KNOWLEDGE,
                    importance=0.6,
                    tags=['reasoning', 'analysis'],
                    metadata={'request_id': request.request_id}
                )

            # Record memory operation
            self.observability.record_memory_operation(
                operation="store",
                layer="auto",
                duration_ms=50,
                success=True
            )

        except Exception as e:
            self.observability.record_memory_operation(
                operation="store",
                layer="auto",
                duration_ms=50,
                success=False
            )

    def _create_response(self, request: BrainRequest, result: Dict[str, Any],
                        model_route: ModelRoute, start_time: datetime, trace_id: str) -> BrainResponse:
        """Create final response"""

        latency_ms = (datetime.now() - start_time).total_seconds() * 1000

        # Determine components used
        components_used = ['model_router']
        if result.get('agent_based'):
            components_used.extend(['agent_runtime', 'tool_registry'])
        if result.get('memory_ids'):
            components_used.append('memory_system')
        components_used.extend(['observability', 'governance'])

        # Calculate cost
        cost = result.get('cost', 0.0)

        # Create response
        response = BrainResponse(
            request_id=request.request_id,
            content=result['content'],
            mode=self.mode,
            components_used=components_used,
            execution_trace=[
                {
                    'component': 'peak_brain',
                    'action': 'process_request',
                    'timestamp': start_time.isoformat(),
                    'duration_ms': latency_ms,
                    'success': True
                }
            ],
            metrics={
                'model_used': result.get('model_used', 'unknown'),
                'agent_based': result.get('agent_based', False),
                'memory_retrieved': len(result.get('memory_ids', [])),
                'trace_id': trace_id
            },
            cost=cost,
            latency_ms=latency_ms,
            memory_items=result.get('memory_ids', []),
            tool_calls=result.get('tool_calls', []),
            governance_checks=[]  # Would be populated from governance results
        )

        return response

    def _create_blocked_response(self, request: BrainRequest, governance_result: Dict[str, Any],
                               start_time: datetime) -> BrainResponse:
        """Create response for blocked requests"""

        return BrainResponse(
            request_id=request.request_id,
            content="Request blocked by governance policies",
            mode=self.mode,
            components_used=['governance'],
            execution_trace=[{
                'component': 'governance',
                'action': 'block_request',
                'timestamp': datetime.now().isoformat(),
                'blocked': True,
                'reason': governance_result.get('policy_result', {}).get('violations', [])
            }],
            metrics={'blocked': True},
            cost=0.0,
            latency_ms=(datetime.now() - start_time).total_seconds() * 1000,
            governance_checks=[governance_result]
        )

    def _update_metrics(self, response: Optional[BrainResponse], success: bool):
        """Update performance metrics"""
        self.request_count += 1

        if success:
            self.success_count += 1

        if response:
            self.total_cost += response.cost
            self.total_latency += response.latency_ms

    async def process_streaming_request(self, request: BrainRequest) -> AsyncGenerator[str, None]:
        """Process request with streaming response"""

        # For now, implement simple streaming
        # In production, this would integrate with model streaming capabilities

        response = await self.process_request(request)

        # Simulate streaming by yielding chunks
        words = response.content.split()
        chunk_size = 5

        for i in range(0, len(words), chunk_size):
            chunk = ' '.join(words[i:i+chunk_size])
            yield chunk + ' '
            await asyncio.sleep(0.1)  # Simulate streaming delay

    def get_brain_status(self) -> Dict[str, Any]:
        """Get comprehensive Brain status"""

        return {
            'brain_id': self.brain_id,
            'mode': self.mode.value,
            'component_status': self.component_status,
            'performance_metrics': {
                'total_requests': self.request_count,
                'success_rate': self.success_count / self.request_count if self.request_count > 0 else 0,
                'average_cost': self.total_cost / self.request_count if self.request_count > 0 else 0,
                'average_latency_ms': self.total_latency / self.request_count if self.request_count > 0 else 0
            },
            'component_stats': {
                'model_router': self.model_router.get_routing_stats(),
                'agent_runtime': self.agent_runtime.get_runtime_stats(),
                'observability': self.observability.get_health_status(),
                'governance': self.governance.get_governance_dashboard()
            },
            'timestamp': datetime.now().isoformat()
        }

    def switch_mode(self, new_mode: BrainMode):
        """Switch Brain operating mode"""
        old_mode = self.mode
        self.mode = new_mode

        # Log mode switch
        self.observability.metrics_collector.increment_counter(
            "brain_mode_switches",
            labels={'from': old_mode.value, 'to': new_mode.value},
            component=SystemComponent.AGENT_RUNTIME
        )

    async def health_check(self) -> Dict[str, Any]:
        """Comprehensive health check"""

        health_status = {
            'overall': 'healthy',
            'components': {},
            'timestamp': datetime.now().isoformat()
        }

        # Check each component
        for component, status in self.component_status.items():
            health_status['components'][component] = {
                'status': 'healthy' if status else 'unhealthy',
                'last_check': datetime.now().isoformat()
            }

            if not status:
                health_status['overall'] = 'degraded'

        # Add observability health
        obs_health = self.observability.get_health_status()
        health_status['components']['observability'] = obs_health

        if obs_health['status'] != 'healthy':
            health_status['overall'] = 'degraded'

        return health_status

    def create_memory(self, content: str, memory_type: MemoryType,
                     importance: float = 0.5, tags: List[str] = None) -> str:
        """Create a memory item (convenience method)"""

        return asyncio.run(self.memory_system.store_memory(
            content=content,
            memory_type=memory_type,
            importance=importance,
            tags=tags or []
        ))

    def get_memory(self, query: str, max_tokens: int = 1000) -> List[str]:
        """Retrieve memories (convenience method)"""

        memories = asyncio.run(self.memory_system.retrieve_context(
            query=query,
            max_tokens=max_tokens
        ))

        return [m.content for m in memories]

    def get_pending_approvals(self) -> List[Dict[str, Any]]:
        """Get pending governance approvals"""

        pending = self.governance.get_pending_approvals()

        return [
            {
                'request_id': req.request_id,
                'action_type': req.action_type.value,
                'risk_level': req.risk_level.value,
                'description': req.description,
                'requester': req.requester,
                'timestamp': req.timestamp.isoformat()
            }
            for req in pending
        ]
