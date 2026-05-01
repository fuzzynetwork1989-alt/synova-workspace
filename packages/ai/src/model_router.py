"""
Advanced Model Router - Peak Brain Component
Intelligent model routing with cost, latency, and capability optimization
"""

from typing import Dict, List, Optional, Union, Any
from dataclasses import dataclass
from enum import Enum
import asyncio
import time
from datetime import datetime, timedelta

class ModelTier(Enum):
    FAST_CHEAP = "fast_cheap"
    BALANCED = "balanced"
    PREMIUM_REASONING = "premium_reasoning"
    SPECIALIZED = "specialized"

class TaskType(Enum):
    CHAT = "chat"
    CODING = "coding"
    REASONING = "reasoning"
    MULTIMODAL = "multimodal"
    MATH = "math"
    ANALYSIS = "analysis"

@dataclass
class ModelCapabilities:
    name: str
    tier: ModelTier
    max_tokens: int
    cost_per_1k_tokens: float
    avg_latency_ms: int
    supports_streaming: bool
    supports_function_calling: bool
    supports_multimodal: bool
    specialized_for: List[TaskType]
    quality_score: float  # 0-1 based on evals

@dataclass
class RoutingRequest:
    task_type: TaskType
    complexity: float  # 0-1
    urgency: float  # 0-1
    budget_constraint: Optional[float]  # max cost per request
    latency_requirement: Optional[int]  # max latency in ms
    token_estimate: int
    requires_streaming: bool
    requires_function_calling: bool
    requires_multimodal: bool
    user_tier: str = "standard"  # standard, premium, enterprise

@dataclass
class ModelRoute:
    primary_model: ModelCapabilities
    fallback_models: List[ModelCapabilities]
    routing_confidence: float
    estimated_cost: float
    estimated_latency: int
    routing_rationale: str

class AdvancedModelRouter:
    """Intelligent model routing with cost, latency, and capability optimization"""
    
    def __init__(self):
        self.model_registry = self._initialize_model_registry()
        self.routing_cache = {}
        self.performance_history = {}
        self.cost_tracker = {}
        
    def _initialize_model_registry(self) -> Dict[str, ModelCapabilities]:
        """Initialize available models with their capabilities"""
        return {
            # Fast & Cheap Models
            "gpt-3.5-turbo": ModelCapabilities(
                name="gpt-3.5-turbo",
                tier=ModelTier.FAST_CHEAP,
                max_tokens=4096,
                cost_per_1k_tokens=0.0015,
                avg_latency_ms=800,
                supports_streaming=True,
                supports_function_calling=True,
                supports_multimodal=False,
                specialized_for=[TaskType.CHAT],
                quality_score=0.75
            ),
            "claude-instant": ModelCapabilities(
                name="claude-instant",
                tier=ModelTier.FAST_CHEAP,
                max_tokens=100000,
                cost_per_1k_tokens=0.0008,
                avg_latency_ms=600,
                supports_streaming=True,
                supports_function_calling=False,
                supports_multimodal=False,
                specialized_for=[TaskType.CHAT, TaskType.ANALYSIS],
                quality_score=0.78
            ),
            
            # Balanced Models
            "gpt-4": ModelCapabilities(
                name="gpt-4",
                tier=ModelTier.BALANCED,
                max_tokens=8192,
                cost_per_1k_tokens=0.03,
                avg_latency_ms=2500,
                supports_streaming=True,
                supports_function_calling=True,
                supports_multimodal=False,
                specialized_for=[TaskType.REASONING, TaskType.ANALYSIS],
                quality_score=0.88
            ),
            "claude-sonnet": ModelCapabilities(
                name="claude-sonnet",
                tier=ModelTier.BALANCED,
                max_tokens=100000,
                cost_per_1k_tokens=0.003,
                avg_latency_ms=1200,
                supports_streaming=True,
                supports_function_calling=True,
                supports_multimodal=False,
                specialized_for=[TaskType.REASONING, TaskType.ANALYSIS, TaskType.CODING],
                quality_score=0.91
            ),
            
            # Premium Reasoning Models
            "gpt-4-turbo": ModelCapabilities(
                name="gpt-4-turbo",
                tier=ModelTier.PREMIUM_REASONING,
                max_tokens=128000,
                cost_per_1k_tokens=0.01,
                avg_latency_ms=3000,
                supports_streaming=True,
                supports_function_calling=True,
                supports_multimodal=True,
                specialized_for=[TaskType.REASONING, TaskType.ANALYSIS, TaskType.MULTIMODAL],
                quality_score=0.94
            ),
            "claude-opus": ModelCapabilities(
                name="claude-opus",
                tier=ModelTier.PREMIUM_REASONING,
                max_tokens=100000,
                cost_per_1k_tokens=0.015,
                avg_latency_ms=2800,
                supports_streaming=True,
                supports_function_calling=True,
                supports_multimodal=False,
                specialized_for=[TaskType.REASONING, TaskType.ANALYSIS, TaskType.CODING],
                quality_score=0.96
            ),
            
            # Specialized Models
            "gpt-4-vision": ModelCapabilities(
                name="gpt-4-vision",
                tier=ModelTier.SPECIALIZED,
                max_tokens=4096,
                cost_per_1k_tokens=0.01,
                avg_latency_ms=3500,
                supports_streaming=True,
                supports_function_calling=True,
                supports_multimodal=True,
                specialized_for=[TaskType.MULTIMODAL],
                quality_score=0.92
            ),
            "claude-vision": ModelCapabilities(
                name="claude-vision",
                tier=ModelTier.SPECIALIZED,
                max_tokens=100000,
                cost_per_1k_tokens=0.012,
                avg_latency_ms=3200,
                supports_streaming=True,
                supports_function_calling=True,
                supports_multimodal=True,
                specialized_for=[TaskType.MULTIMODAL, TaskType.ANALYSIS],
                quality_score=0.93
            )
        }
    
    def route_request(self, request: RoutingRequest) -> ModelRoute:
        """Optimal model selection based on task, budget, and requirements"""
        
        # Check cache first
        cache_key = self._generate_cache_key(request)
        if cache_key in self.routing_cache:
            cached_route = self.routing_cache[cache_key]
            if self._is_cache_valid(cached_route):
                return cached_route
        
        # Filter models by requirements
        eligible_models = self._filter_models_by_requirements(request)
        
        # Score models based on multiple factors
        scored_models = self._score_models(eligible_models, request)
        
        # Select primary and fallback models
        primary_model, fallback_models = self._select_models(scored_models, request)
        
        # Create route with rationale
        route = ModelRoute(
            primary_model=primary_model,
            fallback_models=fallback_models,
            routing_confidence=scored_models[primary_model.name]['total_score'],
            estimated_cost=self._calculate_cost(primary_model, request),
            estimated_latency=self._estimate_latency(primary_model, request),
            routing_rationale=self._generate_rationale(primary_model, request)
        )
        
        # Cache the route
        self.routing_cache[cache_key] = route
        
        return route
    
    def _filter_models_by_requirements(self, request: RoutingRequest) -> List[ModelCapabilities]:
        """Filter models based on hard requirements"""
        eligible = []
        
        for model in self.model_registry.values():
            # Check streaming requirement
            if request.requires_streaming and not model.supports_streaming:
                continue
            
            # Check function calling requirement
            if request.requires_function_calling and not model.supports_function_calling:
                continue
            
            # Check multimodal requirement
            if request.requires_multimodal and not model.supports_multimodal:
                continue
            
            # Check token limit
            if request.token_estimate > model.max_tokens:
                continue
            
            # Check budget constraint
            if request.budget_constraint:
                estimated_cost = (request.token_estimate / 1000) * model.cost_per_1k_tokens
                if estimated_cost > request.budget_constraint:
                    continue
            
            # Check latency requirement
            if request.latency_requirement and model.avg_latency_ms > request.latency_requirement:
                continue
            
            eligible.append(model)
        
        return eligible
    
    def _score_models(self, models: List[ModelCapabilities], request: RoutingRequest) -> Dict[str, Dict[str, float]]:
        """Score models based on multiple factors"""
        scored = {}
        
        for model in models:
            scores = {
                'quality_fit': self._score_quality_fit(model, request),
                'cost_efficiency': self._score_cost_efficiency(model, request),
                'latency_fit': self._score_latency_fit(model, request),
                'capability_match': self._score_capability_match(model, request),
                'performance_history': self._score_performance_history(model)
            }
            
            # Weight the scores based on request characteristics
            weights = self._get_scoring_weights(request)
            total_score = sum(scores[key] * weights[key] for key in scores)
            
            scored[model.name] = {
                'scores': scores,
                'total_score': total_score,
                'model': model
            }
        
        return scored
    
    def _score_quality_fit(self, model: ModelCapabilities, request: RoutingRequest) -> float:
        """Score how well model quality matches task complexity"""
        if request.complexity > 0.8 and model.quality_score < 0.9:
            return 0.3
        elif request.complexity > 0.6 and model.quality_score < 0.8:
            return 0.5
        else:
            return model.quality_score
    
    def _score_cost_efficiency(self, model: ModelCapabilities, request: RoutingRequest) -> float:
        """Score cost efficiency (higher is better)"""
        if not request.budget_constraint:
            return 1.0  # No budget constraint
        
        estimated_cost = (request.token_estimate / 1000) * model.cost_per_1k_tokens
        if estimated_cost <= request.budget_constraint * 0.5:
            return 1.0
        elif estimated_cost <= request.budget_constraint * 0.8:
            return 0.7
        else:
            return 0.4
    
    def _score_latency_fit(self, model: ModelCapabilities, request: RoutingRequest) -> float:
        """Score latency fit"""
        if not request.latency_requirement:
            return 1.0
        
        if model.avg_latency_ms <= request.latency_requirement * 0.5:
            return 1.0
        elif model.avg_latency_ms <= request.latency_requirement * 0.8:
            return 0.7
        else:
            return 0.4
    
    def _score_capability_match(self, model: ModelCapabilities, request: RoutingRequest) -> float:
        """Score how well model capabilities match task type"""
        if request.task_type in model.specialized_for:
            return 1.0
        elif model.tier == ModelTier.PREMIUM_REASONING:
            return 0.8
        elif model.tier == ModelTier.BALANCED:
            return 0.6
        else:
            return 0.4
    
    def _score_performance_history(self, model: ModelCapabilities) -> float:
        """Score based on historical performance"""
        if model.name not in self.performance_history:
            return 0.8  # Neutral score for new models
        
        history = self.performance_history[model.name]
        recent_success_rate = history.get('success_rate_24h', 0.8)
        recent_avg_latency = history.get('avg_latency_24h', model.avg_latency_ms)
        
        # Factor in both success rate and latency consistency
        latency_score = 1.0 - min(abs(recent_avg_latency - model.avg_latency_ms) / model.avg_latency_ms, 0.5)
        
        return (recent_success_rate * 0.7) + (latency_score * 0.3)
    
    def _get_scoring_weights(self, request: RoutingRequest) -> Dict[str, float]:
        """Get scoring weights based on request characteristics"""
        weights = {
            'quality_fit': 0.3,
            'cost_efficiency': 0.2,
            'latency_fit': 0.2,
            'capability_match': 0.2,
            'performance_history': 0.1
        }
        
        # Adjust weights based on request priorities
        if request.urgency > 0.8:
            weights['latency_fit'] = 0.4
            weights['quality_fit'] = 0.2
        
        if request.budget_constraint:
            weights['cost_efficiency'] = 0.3
            weights['quality_fit'] = 0.2
        
        if request.complexity > 0.8:
            weights['quality_fit'] = 0.4
            weights['cost_efficiency'] = 0.1
        
        return weights
    
    def _select_models(self, scored_models: Dict[str, Dict[str, float]], request: RoutingRequest) -> tuple:
        """Select primary and fallback models"""
        # Sort by total score
        sorted_models = sorted(scored_models.items(), key=lambda x: x[1]['total_score'], reverse=True)
        
        if not sorted_models:
            raise ValueError("No eligible models found for request")
        
        # Primary model is the highest scoring
        primary_entry = sorted_models[0]
        primary_model = primary_entry[1]['model']
        
        # Fallback models are next best options
        fallback_models = []
        for entry in sorted_models[1:3]:  # Top 2 fallbacks
            fallback_models.append(entry[1]['model'])
        
        return primary_model, fallback_models
    
    def _calculate_cost(self, model: ModelCapabilities, request: RoutingRequest) -> float:
        """Calculate estimated cost for model"""
        return (request.token_estimate / 1000) * model.cost_per_1k_tokens
    
    def _estimate_latency(self, model: ModelCapabilities, request: RoutingRequest) -> int:
        """Estimate latency based on token count and model performance"""
        base_latency = model.avg_latency_ms
        token_factor = request.token_estimate / 1000  # Factor in token count
        
        return int(base_latency * (1 + token_factor * 0.1))
    
    def _generate_rationale(self, model: ModelCapabilities, request: RoutingRequest) -> str:
        """Generate human-readable routing rationale"""
        reasons = []
        
        # Quality rationale
        if request.complexity > 0.8 and model.quality_score > 0.9:
            reasons.append("High complexity requires premium quality")
        elif request.complexity < 0.4 and model.tier == ModelTier.FAST_CHEAP:
            reasons.append("Low complexity allows fast, cost-effective model")
        
        # Capability rationale
        if request.task_type in model.specialized_for:
            reasons.append(f"Model specialized for {request.task_type.value}")
        
        # Cost rationale
        if request.budget_constraint:
            estimated_cost = self._calculate_cost(model, request)
            if estimated_cost <= request.budget_constraint * 0.5:
                reasons.append("Well within budget constraints")
        
        # Latency rationale
        if request.urgency > 0.8 and model.avg_latency_ms < 1000:
            reasons.append("Low latency model for urgent request")
        
        # Feature rationale
        if request.requires_multimodal and model.supports_multimodal:
            reasons.append("Multimodal capability required")
        
        return "; ".join(reasons) if reasons else "Best overall fit for request"
    
    def _generate_cache_key(self, request: RoutingRequest) -> str:
        """Generate cache key for routing request"""
        key_parts = [
            request.task_type.value,
            str(request.complexity),
            str(request.urgency),
            str(request.budget_constraint),
            str(request.latency_requirement),
            str(request.requires_streaming),
            str(request.requires_function_calling),
            str(request.requires_multimodal),
            request.user_tier
        ]
        return "_".join(key_parts)
    
    def _is_cache_valid(self, route: ModelRoute) -> bool:
        """Check if cached route is still valid"""
        # Cache routes for 1 hour
        cache_age = datetime.now().timestamp() - route.routing_confidence  # Using confidence as timestamp hack
        return cache_age < 3600
    
    def update_performance_metrics(self, model_name: str, success: bool, latency: int, cost: float):
        """Update performance history for model"""
        if model_name not in self.performance_history:
            self.performance_history[model_name] = {
                'total_requests': 0,
                'successful_requests': 0,
                'total_latency': 0,
                'total_cost': 0.0,
                'last_updated': datetime.now()
            }
        
        history = self.performance_history[model_name]
        history['total_requests'] += 1
        history['total_latency'] += latency
        history['total_cost'] += cost
        
        if success:
            history['successful_requests'] += 1
        
        history['last_updated'] = datetime.now()
        
        # Calculate rolling metrics
        history['success_rate_24h'] = history['successful_requests'] / history['total_requests']
        history['avg_latency_24h'] = history['total_latency'] / history['total_requests']
    
    def get_routing_stats(self) -> Dict[str, Any]:
        """Get routing statistics for monitoring"""
        return {
            'total_models': len(self.model_registry),
            'cache_size': len(self.routing_cache),
            'performance_history_size': len(self.performance_history),
            'models_by_tier': {
                tier.value: len([m for m in self.model_registry.values() if m.tier == tier])
                for tier in ModelTier
            }
        }
