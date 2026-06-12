"""
Hugging Face adapter for model hosting and inference
"""

from typing import Dict, Any, List, Optional
import httpx
import logging
from .base_adapter import BaseAdapter

logger = logging.getLogger(__name__)


class HuggingFaceAdapter(BaseAdapter):
    """Adapter for Hugging Face Inference API"""

    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.base_url = config.get("base_url", "https://api-inference.huggingface.co")
        self.api_key = config.get("api_key", "")
        self.timeout = config.get("timeout", 30)

    async def generate(
        self,
        messages: List[Dict[str, str]],
        model: str,
        temperature: float = 0.7,
        max_tokens: int = 2048,
        stream: bool = False,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate text completion using Hugging Face API"""
        try:
            prompt = self._messages_to_prompt(messages)
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            }
            payload = {
                "inputs": prompt,
                "parameters": {
                    "temperature": temperature,
                    "max_new_tokens": max_tokens,
                    "return_full_text": False,
                },
            }
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/models/{model}",
                    headers=headers,
                    json=payload,
                )
                response.raise_for_status()
                result = response.json()
            return {
                "success": True,
                "content": result[0].get("generated_text", ""),
                "model": model,
                "provider": "huggingface",
            }
        except Exception as e:
            logger.error(f"Hugging Face generation error: {e}")
            return {"success": False, "error": str(e), "provider": "huggingface"}

    async def generate_stream(
        self,
        messages: List[Dict[str, str]],
        model: str,
        temperature: float = 0.7,
        max_tokens: int = 2048,
        **kwargs
    ):
        """Generate streaming text completion"""
        try:
            prompt = self._messages_to_prompt(messages)
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            }
            payload = {
                "inputs": prompt,
                "parameters": {
                    "temperature": temperature,
                    "max_new_tokens": max_tokens,
                    "stream": True,
                },
            }
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                async with client.stream(
                    "POST",
                    f"{self.base_url}/models/{model}",
                    headers=headers,
                    json=payload,
                ) as response:
                    response.raise_for_status()
                    async for chunk in response.aiter_text():
                        yield chunk
        except Exception as e:
            logger.error(f"Hugging Face streaming error: {e}")
            yield f"Error: {str(e)}"

    async def list_models(self) -> List[Dict[str, Any]]:
        """List available models from Hugging Face"""
        try:
            headers = {"Authorization": f"Bearer {self.api_key}"}
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(
                    f"{self.base_url}/models",
                    headers=headers,
                )
                response.raise_for_status()
                return response.json()
        except Exception as e:
            logger.error(f"Hugging Face list models error: {e}")
            return []

    async def health_check(self) -> bool:
        """Check if Hugging Face API is healthy"""
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.get(f"{self.base_url}/models")
                return response.status_code == 200
        except:
            return False

    def get_model_info(self, model: str) -> Dict[str, Any]:
        """Get information about a specific model"""
        return {
            "model": model,
            "provider": "huggingface",
            "base_url": self.base_url,
            "capabilities": ["text-generation", "streaming"],
        }

    def _messages_to_prompt(self, messages: List[Dict[str, str]]) -> str:
        """Convert messages to prompt format"""
        prompt = ""
        for msg in messages:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            if role == "system":
                prompt += f"System: {content}\n"
            elif role == "user":
                prompt += f"User: {content}\n"
            elif role == "assistant":
                prompt += f"Assistant: {content}\n"
        prompt += "Assistant:"
        return prompt
