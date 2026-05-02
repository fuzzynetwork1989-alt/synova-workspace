"""
Brain Router Service
Manages intelligent routing between different AI models and services
including Ollama, external APIs, and fallback logic
"""

import os
import asyncio
from typing import Dict, List, Optional, Any, Union
from datetime import datetime
import json
import logging
from enum import Enum
from dataclasses import dataclass

from .ollama_service import OllamaService, ModelStatus

logger = logging.getLogger(__name__)

class Provider(Enum):
    OLLAMA = "ollama"
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    LOCAL = "local"
    FALLBACK = "fallback"

class RequestType(Enum):
    CHAT = "chat"
    CODE = "code"
    BLUEPRINT = "blueprint"
    REASONING = "reasoning"
    MULTIMODAL = "multimodal"

@dataclass
class RouteConfig:
    provider: Provider
    model: str
    priority: int
    max_tokens: int
    temperature: float
    cost_per_token: float
    capabilities: List[RequestType]

class BrainRouter:
    """Intelligent routing service for AI model selection"""
    
    def __init__(self):
        self.ollama_service: Optional[OllamaService] = None
        self.routes: Dict[RequestType, List[RouteConfig]] = {}
        self.performance_cache: Dict[str, Dict[str, Any]] = {}
        self.cost_tracker: Dict[str, float] = {}
        self.usage_stats: Dict[str, Dict[str, Any]] = {}
        self.initialize_routes()
        
    def initialize_routes(self):
        """Initialize routing configuration"""
        
        # Ollama routes (highest priority for privacy/cost)
        self.routes[RequestType.CHAT] = [
            RouteConfig(
                provider=Provider.OLLAMA,
                model="synova-brain",
                priority=1,
                max_tokens=2000,
                temperature=0.3,
                cost_per_token=0.0,
                capabilities=[RequestType.CHAT, RequestType.REASONING]
            ),
            RouteConfig(
                provider=Provider.OLLAMA,
                model="deepseek-r1:8b",
                priority=2,
                max_tokens=4000,
                temperature=0.7,
                cost_per_token=0.0,
                capabilities=[RequestType.CHAT, RequestType.CODE, RequestType.REASONING]
            ),
            RouteConfig(
                provider=Provider.OLLAMA,
                model="llama3.1:8b",
                priority=3,
                max_tokens=4000,
                temperature=0.5,
                cost_per_token=0.0,
                capabilities=[RequestType.CHAT, RequestType.CODE]
            )
        ]
        
        self.routes[RequestType.CODE] = [
            RouteConfig(
                provider=Provider.OLLAMA,
                model="deepseek-r1:8b",
                priority=1,
                max_tokens=4000,
                temperature=0.1,
                cost_per_token=0.0,
                capabilities=[RequestType.CODE, RequestType.CHAT]
            ),
            RouteConfig(
                provider=Provider.OLLAMA,
                model="qwen2.5:7b",
                priority=2,
                max_tokens=4000,
                temperature=0.2,
                cost_per_token=0.0,
                capabilities=[RequestType.CODE]
            )
        ]
        
        self.routes[RequestType.BLUEPRINT] = [
            RouteConfig(
                provider=Provider.OLLAMA,
                model="synova-brain",
                priority=1,
                max_tokens=3000,
                temperature=0.4,
                cost_per_token=0.0,
                capabilities=[RequestType.BLUEPRINT, RequestType.REASONING]
            ),
            RouteConfig(
                provider=Provider.OLLAMA,
                model="deepseek-r1:8b",
                priority=2,
                max_tokens=4000,
                temperature=0.6,
                cost_per_token=0.0,
                capabilities=[RequestType.BLUEPRINT]
            )
        ]
        
        self.routes[RequestType.REASONING] = [
            RouteConfig(
                provider=Provider.OLLAMA,
                model="synova-brain",
                priority=1,
                max_tokens=2500,
                temperature=0.2,
                cost_per_token=0.0,
                capabilities=[RequestType.REASONING, RequestType.CHAT]
            ),
            RouteConfig(
                provider=Provider.OLLAMA,
                model="deepseek-r1:8b",
                priority=2,
                max_tokens=4000,
                temperature=0.3,
                cost_per_token=0.0,
                capabilities=[RequestType.REASONING]
            )
        ]
        
    async def initialize(self):
        """Initialize the router with Ollama service"""
        self.ollama_service = await get_ollama_service()
        await self.update_route_availability()
        
    async def update_route_availability(self):
        """Update which routes are currently available"""
        if not self.ollama_service:
            return
            
        # Get available models from Ollama
        stats = self.ollama_service.get_model_stats()
        available_models = set(stats["models"].keys())
        
        # Update route availability
        for request_type, route_configs in self.routes.items():
            for route in route_configs:
                if route.provider == Provider.OLLAMA:
                    route.available = route.model in available_models
                    
    async def route_request(
        self,
        prompt: str,
        request_type: RequestType = RequestType.CHAT,
        preferred_provider: Optional[Provider] = None,
        max_cost: Optional[float] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """Route a request to the best available model"""
        
        start_time = datetime.now()
        
        try:
            # Get available routes for this request type
            available_routes = await self.get_available_routes(request_type, preferred_provider, max_cost)
            
            if not available_routes:
                raise Exception(f"No available routes for {request_type.value}")
                
            # Try routes in order of priority
            last_error = None
            for route in available_routes:
                try:
                    result = await self.execute_route(route, prompt, **kwargs)
                    
                    # Track performance
                    await self.track_performance(route, result, start_time)
                    
                    return result
                    
                except Exception as e:
                    last_error = e
                    logger.warning(f"⚠️ Route {route.model} failed: {e}")
                    continue
                    
            # All routes failed
            raise Exception(f"All routes failed. Last error: {last_error}")
            
        except Exception as e:
            logger.error(f"❌ Routing failed: {e}")
            raise
            
    async def get_available_routes(
        self,
        request_type: RequestType,
        preferred_provider: Optional[Provider] = None,
        max_cost: Optional[float] = None
    ) -> List[RouteConfig]:
        """Get available routes sorted by priority"""
        
        if request_type not in self.routes:
            raise ValueError(f"Unknown request type: {request_type}")
            
        routes = self.routes[request_type].copy()
        
        # Filter by preferred provider
        if preferred_provider:
            routes = [r for r in routes if r.provider == preferred_provider]
            
        # Filter by cost
        if max_cost is not None:
            routes = [r for r in routes if r.cost_per_token <= max_cost]
            
        # Filter by availability
        available_routes = []
        for route in routes:
            if await self.is_route_available(route):
                available_routes.append(route)
                
        # Sort by priority (lower number = higher priority)
        available_routes.sort(key=lambda x: x.priority)
        
        return available_routes
        
    async def is_route_available(self, route: RouteConfig) -> bool:
        """Check if a route is currently available"""
        
        if route.provider == Provider.OLLAMA:
            if not self.ollama_service:
                return False
                
            model_stats = self.ollama_service.get_model_stats()
            if route.model not in model_stats["models"]:
                return False
                
            model_info = model_stats["models"][route.model]
            return model_info["status"] == ModelStatus.AVAILABLE.value
            
        # Add other provider checks here
        return False
        
    async def execute_route(
        self,
        route: RouteConfig,
        prompt: str,
        **kwargs
    ) -> Dict[str, Any]:
        """Execute a request on a specific route"""
        
        if route.provider == Provider.OLLAMA:
            return await self.execute_ollama_route(route, prompt, **kwargs)
        else:
            raise ValueError(f"Unsupported provider: {route.provider}")
            
    async def execute_ollama_route(
        self,
        route: RouteConfig,
        prompt: str,
        **kwargs
    ) -> Dict[str, Any]:
        """Execute request on Ollama model"""
        
        if not self.ollama_service:
            raise Exception("Ollama service not initialized")
            
        # Prepare Ollama parameters
        ollama_params = {
            "temperature": route.temperature,
            "num_predict": route.max_tokens,
            **kwargs
        }
        
        # Generate response
        result = await self.ollama_service.generate_response(
            prompt=prompt,
            model=route.model,
            **ollama_params
        )
        
        # Add routing metadata
        result["routing"] = {
            "provider": route.provider.value,
            "model": route.model,
            "request_type": route.capabilities[0].value if route.capabilities else "general",
            "priority": route.priority,
            "cost": 0.0,  # Local models are free
            "response_time_ms": result.get("response_time_ms", 0)
        }
        
        return result
        
    async def track_performance(
        self,
        route: RouteConfig,
        result: Dict[str, Any],
        start_time: datetime
    ):
        """Track performance metrics for routes"""
        
        route_key = f"{route.provider.value}:{route.model}"
        response_time = (datetime.now() - start_time).total_seconds() * 1000
        
        if route_key not in self.performance_cache:
            self.performance_cache[route_key] = {
                "total_requests": 0,
                "successful_requests": 0,
                "failed_requests": 0,
                "avg_response_time_ms": 0,
                "total_response_time_ms": 0,
                "last_used": None
            }
            
        stats = self.performance_cache[route_key]
        stats["total_requests"] += 1
        stats["total_response_time_ms"] += response_time
        stats["avg_response_time_ms"] = stats["total_response_time_ms"] / stats["total_requests"]
        stats["last_used"] = datetime.now().isoformat()
        
        if result.get("response"):
            stats["successful_requests"] += 1
        else:
            stats["failed_requests"] += 1
            
        # Track usage
        if route_key not in self.usage_stats:
            self.usage_stats[route_key] = {
                "daily_requests": 0,
                "total_tokens": 0,
                "total_cost": 0.0
            }
            
        self.usage_stats[route_key]["daily_requests"] += 1
        
    async def get_routing_stats(self) -> Dict[str, Any]:
        """Get comprehensive routing statistics"""
        
        # Update route availability
        await self.update_route_availability()
        
        return {
            "routes": {
                request_type.value: [
                    {
                        "provider": route.provider.value,
                        "model": route.model,
                        "priority": route.priority,
                        "available": await self.is_route_available(route),
                        "capabilities": [cap.value for cap in route.capabilities],
                        "max_tokens": route.max_tokens,
                        "temperature": route.temperature,
                        "cost_per_token": route.cost_per_token
                    }
                    for route in routes
                ]
                for request_type, routes in self.routes.items()
            },
            "performance": self.performance_cache,
            "usage": self.usage_stats,
            "ollama_models": self.ollama_service.get_model_stats() if self.ollama_service else {},
            "timestamp": datetime.now().isoformat()
        }
        
    async def health_check(self) -> Dict[str, Any]:
        """Comprehensive health check for the router"""
        
        health = {
            "status": "healthy",
            "router_initialized": bool(self.ollama_service),
            "available_routes": 0,
            "total_routes": sum(len(routes) for routes in self.routes.values()),
            "ollama_health": {},
            "timestamp": datetime.now().isoformat()
        }
        
        try:
            if self.ollama_service:
                health["ollama_health"] = await self.ollama_service.health_check()
                
            # Count available routes
            for request_type, routes in self.routes.items():
                for route in routes:
                    if await self.is_route_available(route):
                        health["available_routes"] += 1
                        
            if health["available_routes"] == 0:
                health["status"] = "degraded"
                
        except Exception as e:
            health["status"] = "unhealthy"
            health["error"] = str(e)
            
        return health

# Global router instance
brain_router = BrainRouter()

async def get_brain_router() -> BrainRouter:
    """Get the global brain router instance"""
    if not brain_router.ollama_service:
        await brain_router.initialize()
    return brain_router

# Import Ollama service
async def get_ollama_service():
    from .ollama_service import get_ollama_service as get_ollama
    return await get_ollama()
