"""
Synova Brain - Core reasoning engine
"""

from typing import Dict, Any, List, Optional
import logging
from .cache_manager import CacheManager
from .session_manager import SessionManager
from .workspace_manager import WorkspaceManager

logger = logging.getLogger(__name__)


class SynovaBrain:
    """Core reasoning engine for Synova Nexus"""

    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.cache_manager = CacheManager(config.get("cache", {}))
        self.session_manager = SessionManager(config.get("session", {}))
        self.workspace_manager = WorkspaceManager(config.get("workspace", {}))
        self.state_graph = {}
        self.retry_manager = RetryManager(config.get("retry", {}))
        self.fallback_manager = FallbackManager(config.get("fallback", {}))

    async def process_request(
        self,
        request: Dict[str, Any],
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Process a reasoning request through the brain"""
        context = context or {}
        
        # Get or create session
        session = await self.session_manager.get_or_create(
            request.get("session_id"),
            request.get("user_id")
        )
        
        # Get workspace context
        workspace = await self.workspace_manager.get_workspace(
            request.get("workspace_id"),
            session.user_id
        )
        
        # Check cache
        cache_key = self._generate_cache_key(request)
        cached_result = await self.cache_manager.get(cache_key)
        if cached_result:
            return cached_result
        
        # Process through state graph
        result = await self._process_state_graph(request, context, session, workspace)
        
        # Cache result
        await self.cache_manager.set(cache_key, result)
        
        return result

    async def _process_state_graph(
        self,
        request: Dict[str, Any],
        context: Dict[str, Any],
        session: Any,
        workspace: Any
    ) -> Dict[str, Any]:
        """Process request through state graph"""
        state = "idle"
        result = {}
        
        while state != "complete":
            next_state = await self._transition_state(state, request, context, session, workspace)
            state = next_state
        
        return result

    async def _transition_state(
        self,
        current_state: str,
        request: Dict[str, Any],
        context: Dict[str, Any],
        session: Any,
        workspace: Any
    ) -> str:
        """Transition to next state in graph"""
        state_transitions = {
            "idle": "authenticating",
            "authenticating": "loading_workspace",
            "loading_workspace": "routing_model",
            "routing_model": "fetching_memory",
            "fetching_memory": "retrieving_sources",
            "retrieving_sources": "planning_action",
            "planning_action": "executing_tool",
            "executing_tool": "generating_response",
            "generating_response": "streaming_output",
            "streaming_output": "saving_state",
            "saving_state": "complete",
            "complete": "complete",
        }
        
        return state_transitions.get(current_state, "complete")

    def _generate_cache_key(self, request: Dict[str, Any]) -> str:
        """Generate cache key from request"""
        import hashlib
        import json
        request_str = json.dumps(request, sort_keys=True)
        return hashlib.md5(request_str.encode()).hexdigest()


class RetryManager:
    """Retry manager for failed operations"""

    def __init__(self, config: Dict[str, Any]):
        self.max_retries = config.get("max_retries", 3)
        self.backoff_factor = config.get("backoff_factor", 2)

    async def execute_with_retry(self, operation, *args, **kwargs):
        """Execute operation with retry logic"""
        import asyncio
        last_error = None
        
        for attempt in range(self.max_retries):
            try:
                return await operation(*args, **kwargs)
            except Exception as e:
                last_error = e
                wait_time = self.backoff_factor ** attempt
                await asyncio.sleep(wait_time)
        
        raise last_error


class FallbackManager:
    """Fallback manager for graceful degradation"""

    def __init__(self, config: Dict[str, Any]):
        self.fallback_chain = config.get("fallback_chain", [])

    async def execute_with_fallback(self, operation, *args, **kwargs):
        """Execute operation with fallback chain"""
        last_error = None
        
        for fallback in self.fallback_chain:
            try:
                return await fallback(*args, **kwargs)
            except Exception as e:
                last_error = e
                continue
        
        raise last_error
