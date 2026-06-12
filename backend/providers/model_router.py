"""
Model router for intelligent provider selection and fallback
"""

from typing import Dict, Any, List, Optional
import logging
from .huggingface_adapter import HuggingFaceAdapter
from .ollama_adapter import OllamaAdapter
from .vllm_adapter import VLLMAdapter

logger = logging.getLogger(__name__)


class ModelRouter:
    """Intelligent model routing with provider selection and fallback"""

    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.providers = {}
        self.routing_policy = config.get("routing_policy", "cost_aware")
        self._initialize_providers()

    def _initialize_providers(self):
        """Initialize all configured providers"""
        if "huggingface" in self.config:
            self.providers["huggingface"] = HuggingFaceAdapter(self.config["huggingface"])
        if "ollama" in self.config:
            self.providers["ollama"] = OllamaAdapter(self.config["ollama"])
        if "vllm" in self.config:
            self.providers["vllm"] = VLLMAdapter(self.config["vllm"])

    async def route_request(
        self,
        messages: List[Dict[str, str]],
        model: str,
        context: Optional[Dict[str, Any]] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """Route request to appropriate provider based on policy"""
        context = context or {}

        # Determine provider based on routing policy
        provider = self._select_provider(model, context)

        # Try primary provider
        result = await provider.generate(messages, model, **kwargs)

        # Fallback if primary fails
        if not result.get("success") and len(self.providers) > 1:
            logger.warning(f"Primary provider failed, trying fallback")
            for name, fallback_provider in self.providers.items():
                if fallback_provider != provider:
                    result = await fallback_provider.generate(messages, model, **kwargs)
                    if result.get("success"):
                        result["fallback_provider"] = name
                        break

        return result

    def _select_provider(self, model: str, context: Dict[str, Any]) -> Any:
        """Select provider based on routing policy"""
        if self.routing_policy == "local_first":
            return self.providers.get("ollama") or self.providers.get("vllm") or self.providers.get("huggingface")
        elif self.routing_policy == "cost_aware":
            return self.providers.get("ollama") or self.providers.get("huggingface") or self.providers.get("vllm")
        elif self.routing_policy == "latency_aware":
            return self.providers.get("ollama") or self.providers.get("vllm") or self.providers.get("huggingface")
        elif self.routing_policy == "privacy_aware":
            return self.providers.get("ollama") or self.providers.get("vllm") or self.providers.get("huggingface")
        else:
            return self.providers.get("vllm") or self.providers.get("huggingface") or self.providers.get("ollama")

    async def list_available_models(self) -> List[Dict[str, Any]]:
        """List all available models from all providers"""
        all_models = []
        for name, provider in self.providers.items():
            try:
                models = await provider.list_models()
                for model in models:
                    model["provider"] = name
                    all_models.append(model)
            except Exception as e:
                logger.error(f"Error listing models from {name}: {e}")
        return all_models

    async def health_check_all(self) -> Dict[str, bool]:
        """Check health of all providers"""
        health_status = {}
        for name, provider in self.providers.items():
            health_status[name] = await provider.health_check()
        return health_status
