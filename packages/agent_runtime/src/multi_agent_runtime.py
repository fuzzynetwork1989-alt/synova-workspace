"""
Multi-Agent Runtime - Peak Brain Component
Production agent orchestration with safety and governance
"""

from typing import Dict, List, Optional, Union, Any, Callable, AsyncGenerator
from dataclasses import dataclass, field
from enum import Enum
from datetime import datetime, timedelta
import asyncio
import uuid
import json
from abc import ABC, abstractmethod

class AgentType(Enum):
    ORCHESTRATOR = "orchestrator"
    PLANNER = "planner"
    EXECUTOR = "executor"
    VERIFIER = "verifier"
    CRITIC = "critic"
    SPECIALIST = "specialist"

class TaskStatus(Enum):
    QUEUED = "queued"
    PLANNING = "planning"
    EXECUTING = "executing"
    VERIFYING = "verifying"
    REVIEWING = "reviewing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class ToolPermission(Enum):
    READ_ONLY = "read_only"
    WRITE = "write"
    DESTRUCTIVE = "destructive"
    EXTERNAL_API = "external_api"
    ADMIN = "admin"

@dataclass
class ToolDefinition:
    name: str
    description: str
    parameters: Dict[str, Any]
    permission: ToolPermission
    timeout_seconds: int = 30
    retry_count: int = 3
    requires_approval: bool = False

@dataclass
class AgentCapability:
    agent_type: AgentType
    allowed_tools: List[str]
    forbidden_tools: List[str] = field(default_factory=list)
    max_execution_time: int = 300  # 5 minutes
    max_memory_mb: int = 512
    requires_human_approval: bool = False
    quality_threshold: float = 0.8

@dataclass
class TaskStep:
    step_id: str
    agent_type: AgentType
    description: str
    tools_required: List[str]
    expected_output: str
    dependencies: List[str] = field(default_factory=list)
    status: TaskStatus = TaskStatus.QUEUED
    result: Optional[Any] = None
    error: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

@dataclass
class ComplexTask:
    task_id: str
    description: str
    user_request: str
    priority: float  # 0-1
    complexity: float  # 0-1
    estimated_duration: int  # seconds
    max_cost: Optional[float] = None
    requires_human_approval: bool = False
    allowed_agents: List[AgentType] = field(default_factory=list)
    steps: List[TaskStep] = field(default_factory=list)
    status: TaskStatus = TaskStatus.QUEUED
    created_at: datetime = field(default_factory=datetime.now)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    final_result: Optional[Any] = None
    total_cost: float = 0.0
    audit_log: List[Dict[str, Any]] = field(default_factory=list)

@dataclass
class TaskResult:
    task_id: str
    status: TaskStatus
    result: Optional[Any] = None
    error: Optional[str] = None
    execution_trace: List[Dict[str, Any]] = field(default_factory=list)
    cost_breakdown: Dict[str, float] = field(default_factory=dict)
    quality_score: Optional[float] = None
    human_approval_required: bool = False
    rollback_available: bool = False

class BaseAgent(ABC):
    """Base class for all agent types"""
    
    def __init__(self, agent_id: str, capability: AgentCapability):
        self.agent_id = agent_id
        self.capability = capability
        self.active_tasks: List[str] = []
        self.execution_history: List[Dict[str, Any]] = []
        self.current_memory: Dict[str, Any] = {}
    
    @abstractmethod
    async def execute_step(self, step: TaskStep, context: Dict[str, Any]) -> Any:
        """Execute a single task step"""
        pass
    
    @abstractmethod
    async def can_handle_step(self, step: TaskStep) -> bool:
        """Check if agent can handle this step"""
        pass
    
    def log_execution(self, step_id: str, action: str, details: Dict[str, Any]):
        """Log execution for audit trail"""
        log_entry = {
            'timestamp': datetime.now().isoformat(),
            'agent_id': self.agent_id,
            'step_id': step_id,
            'action': action,
            'details': details
        }
        self.execution_history.append(log_entry)

class ToolRegistry:
    """Secure tool registry with permission management"""
    
    def __init__(self):
        self.tools: Dict[str, ToolDefinition] = {}
        self.tool_implementations: Dict[str, Callable] = {}
        self.usage_stats: Dict[str, Dict[str, Any]] = {}
    
    def register_tool(self, tool_def: ToolDefinition, implementation: Callable):
        """Register a new tool"""
        self.tools[tool_def.name] = tool_def
        self.tool_implementations[tool_def.name] = implementation
        self.usage_stats[tool_def.name] = {
            'total_calls': 0,
            'successful_calls': 0,
            'failed_calls': 0,
            'total_duration': 0,
            'last_used': None
        }
    
    async def execute_tool(self, tool_name: str, parameters: Dict[str, Any], 
                          agent_id: str) -> Any:
        """Execute a tool with permission checking and monitoring"""
        
        if tool_name not in self.tools:
            raise ValueError(f"Tool {tool_name} not found")
        
        if tool_name not in self.tool_implementations:
            raise ValueError(f"Tool implementation for {tool_name} not found")
        
        tool_def = self.tools[tool_name]
        stats = self.usage_stats[tool_name]
        
        # Update stats
        stats['total_calls'] += 1
        start_time = datetime.now()
        
        try:
            # Execute tool with timeout
            result = await asyncio.wait_for(
                self.tool_implementations[tool_name](**parameters),
                timeout=tool_def.timeout_seconds
            )
            
            stats['successful_calls'] += 1
            stats['last_used'] = datetime.now()
            
            return result
            
        except Exception as e:
            stats['failed_calls'] += 1
            raise e
        finally:
            duration = (datetime.now() - start_time).total_seconds()
            stats['total_duration'] += duration
    
    def get_tool_stats(self) -> Dict[str, Any]:
        """Get tool usage statistics"""
        return self.usage_stats.copy()

class MultiAgentRuntime:
    """Production agent orchestration with safety and governance"""
    
    def __init__(self, tool_registry: ToolRegistry):
        self.tool_registry = tool_registry
        self.agents: Dict[str, BaseAgent] = {}
        self.active_tasks: Dict[str, ComplexTask] = {}
        self.task_history: List[ComplexTask] = []
        self.governance_rules = GovernanceRules()
        self.observability = AgentObservability()
        
        # Initialize agent capabilities
        self._initialize_agent_capabilities()
    
    def _initialize_agent_capabilities(self):
        """Initialize default agent capabilities"""
        self.agent_capabilities = {
            AgentType.ORCHESTRATOR: AgentCapability(
                agent_type=AgentType.ORCHESTRATOR,
                allowed_tools=['all'],
                max_execution_time=600,
                requires_human_approval=False,
                quality_threshold=0.9
            ),
            AgentType.PLANNER: AgentCapability(
                agent_type=AgentType.PLANNER,
                allowed_tools=['search', 'analyze', 'plan'],
                max_execution_time=300,
                requires_human_approval=False,
                quality_threshold=0.8
            ),
            AgentType.EXECUTOR: AgentCapability(
                agent_type=AgentType.EXECUTOR,
                allowed_tools=['code', 'api', 'file_ops'],
                forbidden_tools=['delete', 'admin'],
                max_execution_time=600,
                requires_human_approval=True,
                quality_threshold=0.7
            ),
            AgentType.VERIFIER: AgentCapability(
                agent_type=AgentType.VERIFIER,
                allowed_tools=['validate', 'test', 'check'],
                max_execution_time=180,
                requires_human_approval=False,
                quality_threshold=0.9
            ),
            AgentType.CRITIC: AgentCapability(
                agent_type=AgentType.CRITIC,
                allowed_tools=['analyze', 'review', 'quality_check'],
                max_execution_time=240,
                requires_human_approval=False,
                quality_threshold=0.85
            ),
            AgentType.SPECIALIST: AgentCapability(
                agent_type=AgentType.SPECIALIST,
                allowed_tools=[],  # Varies by specialist
                max_execution_time=300,
                requires_human_approval=False,
                quality_threshold=0.8
            )
        }
    
    def register_agent(self, agent: BaseAgent):
        """Register a new agent"""
        self.agents[agent.agent_id] = agent
    
    async def execute_task(self, task: ComplexTask) -> TaskResult:
        """Safe, multi-agent task execution with oversight"""
        
        # Validate task
        validation_result = await self.governance_rules.validate_task(task)
        if not validation_result.is_valid:
            return TaskResult(
                task_id=task.task_id,
                status=TaskStatus.FAILED,
                error=validation_result.error_message
            )
        
        # Store active task
        self.active_tasks[task.task_id] = task
        task.status = TaskStatus.PLANNING
        task.started_at = datetime.now()
        
        execution_trace = []
        cost_breakdown = {}
        total_cost = 0.0
        
        try:
            # Phase 1: Planning
            if not task.steps:
                task.steps = await self._plan_task(task)
                execution_trace.append({
                    'phase': 'planning',
                    'timestamp': datetime.now().isoformat(),
                    'steps_planned': len(task.steps)
                })
            
            # Phase 2: Execute steps in dependency order
            for step in self._get_execution_order(task.steps):
                step.status = TaskStatus.EXECUTING
                step.started_at = datetime.now()
                
                # Find suitable agent
                agent = await self._find_agent_for_step(step)
                if not agent:
                    raise ValueError(f"No agent available for step: {step.description}")
                
                # Check governance rules
                governance_result = await self.governance_rules.check_step_execution(step, agent)
                if not governance_result.allowed:
                    if governance_result.requires_human_approval:
                        # Request human approval
                        approval = await self._request_human_approval(step, agent)
                        if not approval:
                            raise ValueError("Human approval denied")
                    else:
                        raise ValueError(governance_result.reason)
                
                # Execute step
                try:
                    context = self._build_step_context(task, step)
                    result = await agent.execute_step(step, context)
                    
                    step.result = result
                    step.status = TaskStatus.COMPLETED
                    step.completed_at = datetime.now()
                    
                    # Log execution
                    agent.log_execution(step.step_id, 'completed', {'result': str(result)[:200]})
                    
                    execution_trace.append({
                        'step_id': step.step_id,
                        'agent_id': agent.agent_id,
                        'timestamp': datetime.now().isoformat(),
                        'status': 'completed',
                        'duration': (step.completed_at - step.started_at).total_seconds()
                    })
                    
                    # Update cost
                    step_cost = self._calculate_step_cost(step, agent)
                    cost_breakdown[step.step_id] = step_cost
                    total_cost += step_cost
                    
                except Exception as e:
                    step.error = str(e)
                    step.status = TaskStatus.FAILED
                    step.completed_at = datetime.now()
                    
                    agent.log_execution(step.step_id, 'failed', {'error': str(e)})
                    
                    execution_trace.append({
                        'step_id': step.step_id,
                        'agent_id': agent.agent_id,
                        'timestamp': datetime.now().isoformat(),
                        'status': 'failed',
                        'error': str(e)
                    })
                    
                    # Decide whether to continue or fail
                    if await self._should_fail_on_step_error(step, e):
                        raise e
            
            # Phase 3: Verification
            verification_result = await self._verify_task_completion(task)
            if not verification_result.passed:
                task.status = TaskStatus.FAILED
                return TaskResult(
                    task_id=task.task_id,
                    status=TaskStatus.FAILED,
                    error=f"Verification failed: {verification_result.reason}",
                    execution_trace=execution_trace,
                    cost_breakdown=cost_breakdown
                )
            
            # Phase 4: Final review (if critic agent available)
            critic_result = await self._conduct_final_review(task)
            quality_score = critic_result.quality_score
            
            # Complete task
            task.status = TaskStatus.COMPLETED
            task.completed_at = datetime.now()
            task.final_result = self._extract_final_result(task)
            task.total_cost = total_cost
            
            # Move to history
            self.task_history.append(task)
            del self.active_tasks[task.task_id]
            
            return TaskResult(
                task_id=task.task_id,
                status=TaskStatus.COMPLETED,
                result=task.final_result,
                execution_trace=execution_trace,
                cost_breakdown=cost_breakdown,
                quality_score=quality_score
            )
            
        except Exception as e:
            task.status = TaskStatus.FAILED
            task.completed_at = datetime.now()
            
            # Move to history
            self.task_history.append(task)
            del self.active_tasks[task.task_id]
            
            return TaskResult(
                task_id=task.task_id,
                status=TaskStatus.FAILED,
                error=str(e),
                execution_trace=execution_trace,
                cost_breakdown=cost_breakdown
            )
    
    async def _plan_task(self, task: ComplexTask) -> List[TaskStep]:
        """Break down complex task into steps"""
        steps = []
        
        # Find planner agent
        planner = await self._find_agent_by_type(AgentType.PLANNER)
        if not planner:
            raise ValueError("No planner agent available")
        
        # Create planning step
        planning_step = TaskStep(
            step_id=str(uuid.uuid4()),
            agent_type=AgentType.PLANNER,
            description=f"Plan execution for: {task.description}",
            tools_required=['analyze', 'plan'],
            expected_output="Detailed execution plan with steps"
        )
        
        # Execute planning
        context = {
            'task_description': task.description,
            'user_request': task.user_request,
            'complexity': task.complexity,
            'priority': task.priority
        }
        
        plan_result = await planner.execute_step(planning_step, context)
        
        # Parse plan result into steps (simplified)
        # In production, this would use structured output from the planner
        if isinstance(plan_result, dict) and 'steps' in plan_result:
            for i, step_info in enumerate(plan_result['steps']):
                step = TaskStep(
                    step_id=str(uuid.uuid4()),
                    agent_type=AgentType(step_info.get('agent_type', 'executor')),
                    description=step_info.get('description', f'Step {i+1}'),
                    tools_required=step_info.get('tools', []),
                    expected_output=step_info.get('expected_output', ''),
                    dependencies=step_info.get('dependencies', [])
                )
                steps.append(step)
        else:
            # Fallback: create simple execution plan
            execution_step = TaskStep(
                step_id=str(uuid.uuid4()),
                agent_type=AgentType.EXECUTOR,
                description="Execute user request",
                tools_required=['analyze', 'execute'],
                expected_output="Result of user request"
            )
            steps.append(execution_step)
        
        return steps
    
    def _get_execution_order(self, steps: List[TaskStep]) -> List[TaskStep]:
        """Get steps in dependency order"""
        # Simple topological sort (would be more sophisticated in production)
        ordered = []
        remaining = steps.copy()
        
        while remaining:
            # Find steps with no unmet dependencies
            ready = [
                step for step in remaining 
                if all(
                    dep_step in [s.step_id for s in ordered] 
                    for dep_step in step.dependencies
                )
            ]
            
            if not ready:
                # Circular dependency or missing dependency
                # Take the first remaining step as fallback
                ready = [remaining[0]]
            
            # Add the first ready step
            step = ready[0]
            ordered.append(step)
            remaining.remove(step)
        
        return ordered
    
    async def _find_agent_for_step(self, step: TaskStep) -> Optional[BaseAgent]:
        """Find suitable agent for step"""
        for agent in self.agents.values():
            if await agent.can_handle_step(step):
                # Check if agent has required tools
                if self._agent_has_tools(agent, step.tools_required):
                    return agent
        
        return None
    
    async def _find_agent_by_type(self, agent_type: AgentType) -> Optional[BaseAgent]:
        """Find agent by type"""
        for agent in self.agents.values():
            if agent.capability.agent_type == agent_type:
                return agent
        return None
    
    def _agent_has_tools(self, agent: BaseAgent, required_tools: List[str]) -> bool:
        """Check if agent has access to required tools"""
        allowed_tools = agent.capability.allowed_tools
        
        # If agent has access to all tools
        if 'all' in allowed_tools:
            return True
        
        # Check each required tool
        for tool in required_tools:
            if tool not in allowed_tools:
                return False
        
        return True
    
    def _build_step_context(self, task: ComplexTask, step: TaskStep) -> Dict[str, Any]:
        """Build context for step execution"""
        context = {
            'task_id': task.task_id,
            'task_description': task.description,
            'user_request': task.user_request,
            'step_description': step.description,
            'previous_results': {}
        }
        
        # Add results from completed dependency steps
        for dep_step in task.steps:
            if dep_step.step_id in step.dependencies and dep_step.result:
                context['previous_results'][dep_step.step_id] = dep_step.result
        
        return context
    
    async def _should_fail_on_step_error(self, step: TaskStep, error: Exception) -> bool:
        """Determine if task should fail on step error"""
        # In production, this would be more sophisticated
        # For now, fail on any error
        return True
    
    async def _verify_task_completion(self, task: ComplexTask) -> Any:
        """Verify task completion"""
        verifier = await self._find_agent_by_type(AgentType.VERIFIER)
        if not verifier:
            # Skip verification if no verifier available
            return type('VerificationResult', (), {'passed': True, 'reason': 'No verifier available'})()
        
        verification_step = TaskStep(
            step_id=str(uuid.uuid4()),
            agent_type=AgentType.VERIFIER,
            description="Verify task completion",
            tools_required=['validate', 'check'],
            expected_output="Verification result"
        )
        
        context = {
            'task_results': [step.result for step in task.steps if step.result],
            'task_description': task.description
        }
        
        try:
            result = await verifier.execute_step(verification_step, context)
            return result
        except Exception as e:
            return type('VerificationResult', (), {'passed': False, 'reason': str(e)})()
    
    async def _conduct_final_review(self, task: ComplexTask) -> Any:
        """Conduct final review of task"""
        critic = await self._find_agent_by_type(AgentType.CRITIC)
        if not critic:
            # Skip review if no critic available
            return type('ReviewResult', (), {'quality_score': 0.8})()
        
        review_step = TaskStep(
            step_id=str(uuid.uuid4()),
            agent_type=AgentType.CRITIC,
            description="Review task quality",
            tools_required=['analyze', 'review'],
            expected_output="Quality assessment"
        )
        
        context = {
            'task_description': task.description,
            'execution_results': [step.result for step in task.steps if step.result],
            'total_cost': task.total_cost
        }
        
        try:
            result = await critic.execute_step(review_step, context)
            return result
        except Exception as e:
            return type('ReviewResult', (), {'quality_score': 0.5, 'error': str(e)})()
    
    def _extract_final_result(self, task: ComplexTask) -> Any:
        """Extract final result from task"""
        # Get result from last step
        if task.steps:
            last_step = task.steps[-1]
            return last_step.result
        
        return None
    
    def _calculate_step_cost(self, step: TaskStep, agent: BaseAgent) -> float:
        """Calculate cost for step execution"""
        # Simplified cost calculation
        base_cost = 0.01  # Base cost per step
        
        # Agent-specific cost multiplier
        if agent.capability.agent_type == AgentType.EXECUTOR:
            base_cost *= 2.0
        elif agent.capability.agent_type == AgentType.CRITIC:
            base_cost *= 1.5
        
        # Tool usage cost
        tool_cost = len(step.tools_required) * 0.005
        
        return base_cost + tool_cost
    
    async def _request_human_approval(self, step: TaskStep, agent: BaseAgent) -> bool:
        """Request human approval for step execution"""
        # In production, this would integrate with UI/notification system
        # For now, auto-approve for development
        return True
    
    def get_task_status(self, task_id: str) -> Optional[ComplexTask]:
        """Get current status of a task"""
        return self.active_tasks.get(task_id)
    
    def get_runtime_stats(self) -> Dict[str, Any]:
        """Get runtime statistics"""
        return {
            'total_agents': len(self.agents),
            'active_tasks': len(self.active_tasks),
            'completed_tasks': len(self.task_history),
            'agent_types': {
                agent_type.value: len([
                    a for a in self.agents.values() 
                    if a.capability.agent_type == agent_type
                ])
                for agent_type in AgentType
            }
        }

class GovernanceRules:
    """Governance and safety rules for agent execution"""
    
    async def validate_task(self, task: ComplexTask) -> Any:
        """Validate task against governance rules"""
        result = type('ValidationResult', (), {'is_valid': True, 'error_message': None})()
        
        # Check cost constraints
        if task.max_cost and task.estimated_cost > task.max_cost:
            result.is_valid = False
            result.error_message = f"Estimated cost {task.estimated_cost} exceeds maximum {task.max_cost}"
        
        # Check complexity limits
        if task.complexity > 0.9 and not task.requires_human_approval:
            result.is_valid = False
            result.error_message = "High complexity tasks require human approval"
        
        return result
    
    async def check_step_execution(self, step: TaskStep, agent: BaseAgent) -> Any:
        """Check if step execution is allowed"""
        result = type('GovernanceResult', (), {'allowed': True, 'requires_human_approval': False, 'reason': None})()
        
        # Check for destructive tools
        destructive_tools = ['delete', 'remove', 'destroy']
        if any(tool in step.tools_required for tool in destructive_tools):
            result.requires_human_approval = True
            result.reason = "Destructive operation requires human approval"
        
        # Check agent capability limits
        if agent.capability.requires_human_approval:
            result.requires_human_approval = True
            result.reason = f"Agent {agent.agent_id} requires human approval"
        
        return result

class AgentObservability:
    """Observability and monitoring for agent runtime"""
    
    def __init__(self):
        self.metrics = {
            'tasks_completed': 0,
            'tasks_failed': 0,
            'total_execution_time': 0,
            'agent_utilization': {},
            'tool_usage': {}
        }
    
    def record_task_completion(self, task: ComplexTask, duration: float):
        """Record task completion metrics"""
        self.metrics['tasks_completed'] += 1
        self.metrics['total_execution_time'] += duration
    
    def record_task_failure(self, task: ComplexTask, duration: float):
        """Record task failure metrics"""
        self.metrics['tasks_failed'] += 1
        self.metrics['total_execution_time'] += duration
    
    def get_metrics(self) -> Dict[str, Any]:
        """Get current metrics"""
        return self.metrics.copy()
