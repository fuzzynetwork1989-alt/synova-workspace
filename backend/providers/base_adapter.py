"""
Base adapter for model providers
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List
import logging

logger = logging.getLogger(__name__)


class BaseAdapter(ABC):
    """Base class for model provider adapters"""

    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.base_url = config.get("base_url", "")
        self.api_key = config.get("api_key", "")
        self.timeout = config.get("timeout", 30)

    @abstractmethod
    async def generate(
        self,
        messages: List[Dict[str, str]],
        model: str,
        temperature: float = 0.7,
        max_tokens: int = 2048,
        stream: bool = False,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate text completion"""
        pass

    @abstractmethod
    async def generate_stream(
        self,
        messages: List[Dict[str, str]],
        model: str,
        temperature: float = 0.7,
        max_tokens: int = 2048,
        **kwargs
    ):
        """Generate streaming text completion"""
        pass

    @abstractmethod
    async def list_models(self) -> List[Dict[str, Any]]:
        """List available models"""
        pass

    @abstractmethod
    async def health_check(self) -> bool:
        """Check if provider is healthy"""
        pass

    @abstractmethod
    def get_model_info(self, model: str) -> Dict[str, Any]:
        """Get information about a specific model"""
        pass

    async def validate_config(self) -> bool:
        """Validate adapter configuration"""
        required_fields = ["base_url"]
        for field in required_fields:
            if field not in self.config:
                logger.error(f"Missing required config field: {field}")
                return False
        return True
