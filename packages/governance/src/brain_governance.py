"""
Brain Governance System - Peak Brain Component
Safety, oversight, and human approval workflows for Brain systems
"""

from typing import Dict, List, Optional, Union, Any, Callable
from dataclasses import dataclass, field
from enum import Enum
from datetime import datetime, timedelta
import asyncio
import json
import uuid
from abc import ABC, abstractmethod

class ApprovalStatus(Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    EXPIRED = "expired"

class RiskLevel(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class PolicyType(Enum):
    SAFETY = "safety"
    PRIVACY = "privacy"
    COST = "cost"
    SECURITY = "security"
    ETHICS = "ethics"

class ActionType(Enum):
    TOOL_EXECUTION = "tool_execution"
    DATA_ACCESS = "data_access"
    MODEL_SELECTION = "model_selection"
    AGENT_TASK = "agent_task"
    MEMORY_OPERATION = "memory_operation"

@dataclass
class ApprovalRequest:
    request_id: str
    action_type: ActionType
    risk_level: RiskLevel
    description: str
    details: Dict[str, Any]
    requester: str  # agent_id or user_id
    timestamp: datetime = field(default_factory=datetime.now)
    expires_at: Optional[datetime] = None
    status: ApprovalStatus = ApprovalStatus.PENDING
    approver: Optional[str] = None
    approval_reason: Optional[str] = None
    rejection_reason: Optional[str] = None

@dataclass
class PolicyRule:
    rule_id: str
    name: str
    policy_type: PolicyType
    description: str
    condition: Callable[[Dict[str, Any]], bool]
    action: str  # allow, block, require_approval
    parameters: Dict[str, Any] = field(default_factory=dict)
    enabled: bool = True
    priority: int = 0

@dataclass
class GovernanceEvent:
    event_id: str
    event_type: str
    component: str
    action: str
    user_id: Optional[str]
    agent_id: Optional[str]
    timestamp: datetime = field(default_factory=datetime.now)
    details: Dict[str, Any] = field(default_factory=dict)
    risk_assessment: Optional[Dict[str, Any]] = None
    policy_violations: List[str] = field(default_factory=list)
    approval_required: bool = False
    approval_id: Optional[str] = None

class ApprovalHandler(ABC):
    """Base class for approval handlers"""
    
    @abstractmethod
    async def request_approval(self, request: ApprovalRequest) -> bool:
        """Request approval for an action"""
        pass
    
    @abstractmethod
    async def check_approval_status(self, request_id: str) -> Optional[ApprovalRequest]:
        """Check approval status"""
        pass

class HumanApprovalHandler(ApprovalHandler):
    """Human approval handler for UI-based approvals"""
    
    def __init__(self):
        self.pending_requests: Dict[str, ApprovalRequest] = {}
        self.approval_callbacks: List[Callable[[ApprovalRequest], None]] = []
    
    async def request_approval(self, request: ApprovalRequest) -> bool:
        """Request human approval"""
        self.pending_requests[request.request_id] = request
        
        # Notify UI components
        for callback in self.approval_callbacks:
            try:
                callback(request)
            except Exception as e:
                print(f"Error in approval callback: {e}")
        
        # Wait for approval (with timeout)
        timeout = request.expires_at or (datetime.now() + timedelta(hours=1))
        
        while datetime.now() < timeout:
            if request.request_id not in self.pending_requests:
                return True  # Approved and removed
            
            if self.pending_requests[request.request_id].status == ApprovalStatus.APPROVED:
                return True
            elif self.pending_requests[request.request_id].status == ApprovalStatus.REJECTED:
                return False
            
            await asyncio.sleep(1)
        
        # Timeout expired
        request.status = ApprovalStatus.EXPIRED
        return False
    
    async def check_approval_status(self, request_id: str) -> Optional[ApprovalRequest]:
        """Check approval status"""
        return self.pending_requests.get(request_id)
    
    def approve_request(self, request_id: str, approver: str, reason: str = ""):
        """Approve a request"""
        if request_id in self.pending_requests:
            request = self.pending_requests[request_id]
            request.status = ApprovalStatus.APPROVED
            request.approver = approver
            request.approval_reason = reason
            del self.pending_requests[request_id]
    
    def reject_request(self, request_id: str, approver: str, reason: str = ""):
        """Reject a request"""
        if request_id in self.pending_requests:
            request = self.pending_requests[request_id]
            request.status = ApprovalStatus.REJECTED
            request.approver = approver
            request.rejection_reason = reason
            del self.pending_requests[request_id]
    
    def add_approval_callback(self, callback: Callable[[ApprovalRequest], None]):
        """Add callback for new approval requests"""
        self.approval_callbacks.append(callback)
    
    def get_pending_requests(self) -> List[ApprovalRequest]:
        """Get all pending approval requests"""
        return list(self.pending_requests.values())

class AutoApprovalHandler(ApprovalHandler):
    """Automatic approval handler for low-risk actions"""
    
    def __init__(self, max_risk_level: RiskLevel = RiskLevel.LOW):
        self.max_risk_level = max_risk_level
    
    async def request_approval(self, request: ApprovalRequest) -> bool:
        """Auto-approve if risk level is within threshold"""
        if request.risk_level.value <= self.max_risk_level.value:
            request.status = ApprovalStatus.APPROVED
            request.approver = "auto_approval"
            request.approval_reason = f"Auto-approved: risk level {request.risk_level.value} <= {self.max_risk_level.value}"
            return True
        return False
    
    async def check_approval_status(self, request_id: str) -> Optional[ApprovalRequest]:
        """Check approval status"""
        return None  # Auto-approval doesn't track requests

class PolicyEngine:
    """Policy engine for governance rules"""
    
    def __init__(self):
        self.policies: Dict[str, PolicyRule] = {}
        self.policy_violations: List[Dict[str, Any]] = []
    
    def add_policy(self, policy: PolicyRule):
        """Add a governance policy"""
        self.policies[policy.rule_id] = policy
    
    def evaluate_action(self, action_context: Dict[str, Any]) -> Dict[str, Any]:
        """Evaluate an action against all policies"""
        violations = []
        required_approvals = []
        blocked = False
        
        # Sort policies by priority (higher first)
        sorted_policies = sorted(
            self.policies.values(),
            key=lambda p: p.priority,
            reverse=True
        )
        
        for policy in sorted_policies:
            if not policy.enabled:
                continue
            
            try:
                if policy.condition(action_context):
                    # Policy triggered
                    if policy.action == "block":
                        blocked = True
                        violations.append({
                            'policy_id': policy.rule_id,
                            'policy_name': policy.name,
                            'policy_type': policy.policy_type.value,
                            'reason': policy.description,
                            'timestamp': datetime.now().isoformat()
                        })
                    elif policy.action == "require_approval":
                        required_approvals.append({
                            'policy_id': policy.rule_id,
                            'policy_name': policy.name,
                            'policy_type': policy.policy_type.value,
                            'reason': policy.description
                        })
            except Exception as e:
                print(f"Error evaluating policy {policy.rule_id}: {e}")
        
        return {
            'allowed': not blocked,
            'blocked': blocked,
            'violations': violations,
            'required_approvals': required_approvals,
            'evaluation_timestamp': datetime.now().isoformat()
        }
    
    def get_policy_summary(self) -> Dict[str, Any]:
        """Get summary of all policies"""
        policies_by_type = {}
        
        for policy_type in PolicyType:
            policies_by_type[policy_type.value] = [
                {
                    'id': p.rule_id,
                    'name': p.name,
                    'enabled': p.enabled,
                    'action': p.action,
                    'priority': p.priority
                }
                for p in self.policies.values()
                if p.policy_type == policy_type
            ]
        
        return {
            'total_policies': len(self.policies),
            'enabled_policies': len([p for p in self.policies.values() if p.enabled]),
            'policies_by_type': policies_by_type,
            'recent_violations': self.policy_violations[-10:]
        }

class RiskAssessment:
    """Risk assessment for actions"""
    
    def __init__(self):
        self.risk_factors = {
            'destructive_tools': 0.8,
            'external_apis': 0.6,
            'data_access': 0.4,
            'high_cost': 0.5,
            'complex_operations': 0.3,
            'user_data': 0.7,
            'system_changes': 0.9
        }
    
    def assess_risk(self, action_context: Dict[str, Any]) -> Dict[str, Any]:
        """Assess risk level for an action"""
        risk_score = 0.0
        risk_factors = []
        
        # Check for destructive tools
        if action_context.get('tools_used'):
            destructive_tools = ['delete', 'remove', 'destroy', 'format', 'admin']
            for tool in action_context['tools_used']:
                if any(destructive in tool.lower() for destructive in destructive_tools):
                    risk_score += self.risk_factors['destructive_tools']
                    risk_factors.append('destructive_tools')
        
        # Check for external API calls
        if action_context.get('external_apis'):
            risk_score += self.risk_factors['external_apis']
            risk_factors.append('external_apis')
        
        # Check for data access
        if action_context.get('data_accessed'):
            sensitive_data = ['personal_info', 'financial_data', 'health_data']
            for data in action_context['data_accessed']:
                if data in sensitive_data:
                    risk_score += self.risk_factors['user_data']
                    risk_factors.append('user_data')
        
        # Check cost
        estimated_cost = action_context.get('estimated_cost', 0)
        if estimated_cost > 1.0:  # $1 threshold
            risk_score += self.risk_factors['high_cost']
            risk_factors.append('high_cost')
        
        # Check complexity
        complexity = action_context.get('complexity', 'simple')
        if complexity in ['complex', 'expert']:
            risk_score += self.risk_factors['complex_operations']
            risk_factors.append('complex_operations')
        
        # Determine risk level
        if risk_score >= 2.0:
            risk_level = RiskLevel.CRITICAL
        elif risk_score >= 1.5:
            risk_level = RiskLevel.HIGH
        elif risk_score >= 0.8:
            risk_level = RiskLevel.MEDIUM
        else:
            risk_level = RiskLevel.LOW
        
        return {
            'risk_score': min(risk_score, 3.0),  # Cap at 3.0
            'risk_level': risk_level.value,
            'risk_factors': risk_factors,
            'assessment_timestamp': datetime.now().isoformat()
        }

class BrainGovernance:
    """Main governance system for Brain components"""
    
    def __init__(self):
        self.policy_engine = PolicyEngine()
        self.risk_assessment = RiskAssessment()
        self.approval_handlers: List[ApprovalHandler] = []
        self.governance_events: List[GovernanceEvent] = []
        self.audit_log: List[Dict[str, Any]] = []
        
        # Setup default approval handlers
        self.auto_approver = AutoApprovalHandler(RiskLevel.LOW)
        self.human_approver = HumanApprovalHandler()
        
        self.approval_handlers = [self.auto_approver, self.human_approver]
        
        # Setup default policies
        self._setup_default_policies()
    
    def _setup_default_policies(self):
        """Setup default governance policies"""
        
        # Safety policy: Block destructive actions without approval
        self.policy_engine.add_policy(PolicyRule(
            rule_id="safety_destructive",
            name="Destructive Action Safety",
            policy_type=PolicyType.SAFETY,
            description="Block destructive tool usage without approval",
            condition=lambda ctx: any(
                tool in ['delete', 'remove', 'destroy', 'format'] 
                for tool in ctx.get('tools_used', [])
            ),
            action="require_approval",
            priority=100
        ))
        
        # Cost policy: Require approval for high-cost operations
        self.policy_engine.add_policy(PolicyRule(
            rule_id="cost_high_value",
            name="High Cost Control",
            policy_type=PolicyType.COST,
            description="Require approval for operations costing more than $1",
            condition=lambda ctx: ctx.get('estimated_cost', 0) > 1.0,
            action="require_approval",
            priority=90
        ))
        
        # Privacy policy: Block access to sensitive data without approval
        self.policy_engine.add_policy(PolicyRule(
            rule_id="privacy_sensitive_data",
            name="Sensitive Data Protection",
            policy_type=PolicyType.PRIVACY,
            description="Require approval for access to sensitive user data",
            condition=lambda ctx: any(
                data in ['personal_info', 'financial_data', 'health_data']
                for data in ctx.get('data_accessed', [])
            ),
            action="require_approval",
            priority=95
        ))
        
        # Security policy: Block external API calls to unknown domains
        self.policy_engine.add_policy(PolicyRule(
            rule_id="security_external_apis",
            name="External API Security",
            policy_type=PolicyType.SECURITY,
            description="Block external API calls to unapproved domains",
            condition=lambda ctx: any(
                api not in ctx.get('approved_domains', [])
                for api in ctx.get('external_apis', [])
            ),
            action="block",
            priority=85
        ))
    
    async def check_action_permission(self, action_context: Dict[str, Any]) -> Dict[str, Any]:
        """Check if an action is allowed and handle approvals"""
        
        # Create governance event
        event = GovernanceEvent(
            event_id=str(uuid.uuid4()),
            event_type="action_check",
            component=action_context.get('component', 'unknown'),
            action=action_context.get('action', 'unknown'),
            user_id=action_context.get('user_id'),
            agent_id=action_context.get('agent_id'),
            details=action_context
        )
        
        # Assess risk
        risk_assessment = self.risk_assessment.assess_risk(action_context)
        event.risk_assessment = risk_assessment
        
        # Evaluate policies
        policy_result = self.policy_engine.evaluate_action(action_context)
        event.policy_violations = [v['policy_id'] for v in policy_result['violations']]
        
        # Determine if approval is required
        approval_required = (
            not policy_result['allowed'] or
            len(policy_result['required_approvals']) > 0 or
            risk_assessment['risk_level'] in ['high', 'critical']
        )
        
        event.approval_required = approval_required
        
        # Handle approval if required
        approval_result = None
        if approval_required:
            approval_result = await self._request_approval(
                action_context, risk_assessment, policy_result
            )
            event.approval_id = approval_result.get('approval_id') if approval_result else None
        
        # Log the event
        self.governance_events.append(event)
        self.audit_log.append({
            'timestamp': event.timestamp.isoformat(),
            'event_id': event.event_id,
            'action': action_context.get('action'),
            'component': action_context.get('component'),
            'user_id': action_context.get('user_id'),
            'agent_id': action_context.get('agent_id'),
            'risk_level': risk_assessment['risk_level'],
            'policy_violations': event.policy_violations,
            'approval_required': approval_required,
            'approved': approval_result.get('approved', False) if approval_result else False
        })
        
        return {
            'allowed': policy_result['allowed'] and (approval_result.get('approved', False) if approval_result else not approval_required),
            'risk_assessment': risk_assessment,
            'policy_result': policy_result,
            'approval_required': approval_required,
            'approval_result': approval_result,
            'event_id': event.event_id
        }
    
    async def _request_approval(self, action_context: Dict[str, Any], 
                             risk_assessment: Dict[str, Any], 
                             policy_result: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Request approval for an action"""
        
        # Determine risk level
        risk_level = RiskLevel(risk_assessment['risk_level'])
        
        # Create approval request
        request = ApprovalRequest(
            request_id=str(uuid.uuid4()),
            action_type=ActionType(action_context.get('action_type', 'tool_execution')),
            risk_level=risk_level,
            description=f"Approval required for {action_context.get('action', 'action')}",
            details={
                'action_context': action_context,
                'risk_assessment': risk_assessment,
                'policy_violations': policy_result['violations'],
                'required_approvals': policy_result['required_approvals']
            },
            requester=action_context.get('agent_id') or action_context.get('user_id', 'system'),
            expires_at=datetime.now() + timedelta(hours=1)
        )
        
        # Try approval handlers in order
        for handler in self.approval_handlers:
            try:
                approved = await handler.request_approval(request)
                if approved:
                    return {
                        'approved': True,
                        'approval_id': request.request_id,
                        'handler': type(handler).__name__,
                        'approver': request.approver
                    }
            except Exception as e:
                print(f"Error in approval handler {type(handler).__name__}: {e}")
                continue
        
        return {
            'approved': False,
            'approval_id': request.request_id,
            'reason': 'No approval handler approved the request'
        }
    
    def get_pending_approvals(self) -> List[ApprovalRequest]:
        """Get all pending approval requests"""
        return self.human_approver.get_pending_requests()
    
    def approve_action(self, request_id: str, approver: str, reason: str = ""):
        """Approve a pending action"""
        self.human_approver.approve_request(request_id, approver, reason)
    
    def reject_action(self, request_id: str, approver: str, reason: str = ""):
        """Reject a pending action"""
        self.human_approver.reject_request(request_id, approver, reason)
    
    def get_governance_dashboard(self) -> Dict[str, Any]:
        """Get governance dashboard data"""
        recent_events = self.governance_events[-100:]
        pending_approvals = self.get_pending_approvals()
        
        # Calculate statistics
        total_events = len(recent_events)
        approval_required = len([e for e in recent_events if e.approval_required])
        high_risk_events = len([e for e in recent_events if e.risk_assessment and e.risk_assessment['risk_level'] in ['high', 'critical']])
        
        return {
            'timestamp': datetime.now().isoformat(),
            'statistics': {
                'total_events': total_events,
                'approval_required_rate': approval_required / total_events if total_events > 0 else 0,
                'high_risk_rate': high_risk_events / total_events if total_events > 0 else 0,
                'pending_approvals': len(pending_approvals)
            },
            'pending_approvals': [
                {
                    'request_id': req.request_id,
                    'action_type': req.action_type.value,
                    'risk_level': req.risk_level.value,
                    'description': req.description,
                    'requester': req.requester,
                    'timestamp': req.timestamp.isoformat()
                }
                for req in pending_approvals
            ],
            'recent_events': [
                {
                    'event_id': event.event_id,
                    'action': event.action,
                    'component': event.component,
                    'risk_level': event.risk_assessment['risk_level'] if event.risk_assessment else 'unknown',
                    'approval_required': event.approval_required,
                    'timestamp': event.timestamp.isoformat()
                }
                for event in recent_events[-20:]
            ],
            'policy_summary': self.policy_engine.get_policy_summary()
        }
    
    def get_audit_log(self, limit: int = 100, component: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get audit log with optional filtering"""
        log = self.audit_log
        
        if component:
            log = [entry for entry in log if entry.get('component') == component]
        
        return log[-limit:]
    
    def add_approval_handler(self, handler: ApprovalHandler):
        """Add a custom approval handler"""
        self.approval_handlers.append(handler)
    
    def update_policy(self, rule_id: str, enabled: Optional[bool] = None, 
                     action: Optional[str] = None, priority: Optional[int] = None):
        """Update an existing policy"""
        if rule_id in self.policy_engine.policies:
            policy = self.policy_engine.policies[rule_id]
            if enabled is not None:
                policy.enabled = enabled
            if action is not None:
                policy.action = action
            if priority is not None:
                policy.priority = priority
