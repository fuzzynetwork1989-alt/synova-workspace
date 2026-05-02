"""
Enhanced Ollama Integration Service
Manages Ollama models, routing, and fallback logic for Synova AI
"""

import os
import json
import asyncio
import aiohttp
from typing import Dict, List, Optional, Any, AsyncGenerator
from datetime import datetime
import logging
from dataclasses import dataclass
from enum import Enum

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ModelStatus(Enum):
    AVAILABLE = "available"
    LOADING = "loading"
    UNAVAILABLE = "unavailable"
    ERROR = "error"

@dataclass
class ModelInfo:
    name: str
    size: str
    status: ModelStatus
    parameters: Dict[str, Any]
    last_used: Optional[datetime] = None
    response_time_ms: Optional[float] = None

class OllamaService:
    """Enhanced Ollama service with model management and fallback"""
    
    def __init__(self, base_url: str = "http://localhost:11434"):
        self.base_url = base_url
        self.session: Optional[aiohttp.ClientSession] = None
        self.models: Dict[str, ModelInfo] = {}
        self.primary_model = "synova-brain"
        self.fallback_models = ["deepseek-r1:8b", "llama3.1:8b", "qwen2.5:7b"]
        self.current_model = None
        self.model_health_cache = {}
        self.cache_ttl = 300  # 5 minutes
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession(
            timeout=aiohttp.ClientTimeout(total=60),
            connector=aiohttp.TCPConnector(limit=10)
        )
        await self.initialize_models()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
            
    async def initialize_models(self):
        """Initialize model information and health status"""
        try:
            await self.refresh_models()
            await self.check_model_health()
            logger.info("✅ Ollama service initialized successfully")
        except Exception as e:
            logger.error(f"❌ Failed to initialize Ollama service: {e}")
            
    async def refresh_models(self):
        """Refresh available models from Ollama"""
        try:
            async with self.session.get(f"{self.base_url}/api/tags") as response:
                if response.status == 200:
                    data = await response.json()
                    for model in data.get("models", []):
                        model_name = model["name"]
                        self.models[model_name] = ModelInfo(
                            name=model_name,
                            size=model.get("size", "unknown"),
                            status=ModelStatus.AVAILABLE,
                            parameters=model.get("details", {}).get("parameter_count", 0)
                        )
                    logger.info(f"📊 Loaded {len(self.models)} models from Ollama")
        except Exception as e:
            logger.error(f"❌ Failed to refresh models: {e}")
            
    async def check_model_health(self):
        """Check health of all models"""
        current_time = datetime.now()
        
        for model_name in list(self.models.keys()):
            cache_key = f"health_{model_name}"
            if cache_key in self.model_health_cache:
                cached_time, is_healthy = self.model_health_cache[cache_key]
                if (current_time - cached_time).seconds < self.cache_ttl:
                    self.models[model_name].status = ModelStatus.AVAILABLE if is_healthy else ModelStatus.UNAVAILABLE
                    continue
                    
            try:
                start_time = datetime.now()
                async with self.session.post(
                    f"{self.base_url}/api/generate",
                    json={
                        "model": model_name,
                        "prompt": "test",
                        "stream": False
                    },
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as response:
                    response_time = (datetime.now() - start_time).total_seconds() * 1000
                    
                    if response.status == 200:
                        self.models[model_name].status = ModelStatus.AVAILABLE
                        self.models[model_name].response_time_ms = response_time
                        self.model_health_cache[cache_key] = (current_time, True)
                    else:
                        self.models[model_name].status = ModelStatus.UNAVAILABLE
                        self.model_health_cache[cache_key] = (current_time, False)
                        
            except Exception as e:
                logger.warning(f"⚠️ Model {model_name} health check failed: {e}")
                self.models[model_name].status = ModelStatus.ERROR
                self.model_health_cache[cache_key] = (current_time, False)
                
    async def get_best_model(self) -> str:
        """Get the best available model based on health and performance"""
        # Try primary model first
        if self.primary_model in self.models:
            model_info = self.models[self.primary_model]
            if model_info.status == ModelStatus.AVAILABLE:
                return self.primary_model
                
        # Try fallback models in order
        for fallback in self.fallback_models:
            if fallback in self.models:
                model_info = self.models[fallback]
                if model_info.status == ModelStatus.AVAILABLE:
                    return fallback
                    
        # Find any available model
        available_models = [
            name for name, info in self.models.items()
            if info.status == ModelStatus.AVAILABLE
        ]
        
        if available_models:
            # Choose the fastest available model
            fastest = min(
                available_models,
                key=lambda x: self.models[x].response_time_ms or float('inf')
            )
            return fastest
            
        raise Exception("No available models found")
        
    async def generate_response(
        self, 
        prompt: str, 
        model: Optional[str] = None,
        stream: bool = False,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate response using Ollama with automatic fallback"""
        
        # Determine which model to use
        target_model = model or await self.get_best_model()
        
        try:
            if stream:
                return await self._stream_response(prompt, target_model, **kwargs)
            else:
                return await self._generate_response(prompt, target_model, **kwargs)
                
        except Exception as e:
            logger.warning(f"⚠️ Model {target_model} failed: {e}")
            
            # Try fallback models
            if model != self.primary_model:
                try:
                    fallback_model = await self.get_best_model()
                    if fallback_model != target_model:
                        logger.info(f"🔄 Falling back to {fallback_model}")
                        return await self._generate_response(prompt, fallback_model, **kwargs)
                except Exception as fallback_error:
                    logger.error(f"❌ Fallback also failed: {fallback_error}")
                    
            raise Exception("All models failed to generate response")
            
    async def _generate_response(self, prompt: str, model: str, **kwargs) -> Dict[str, Any]:
        """Generate response from specific model"""
        start_time = datetime.now()
        
        request_data = {
            "model": model,
            "prompt": prompt,
            "stream": False,
            **kwargs
        }
        
        async with self.session.post(
            f"{self.base_url}/api/generate",
            json=request_data,
            timeout=aiohttp.ClientTimeout(total=60)
        ) as response:
            
            response_time = (datetime.now() - start_time).total_seconds() * 1000
            
            if response.status == 200:
                result = await response.json()
                
                # Update model stats
                if model in self.models:
                    self.models[model].last_used = datetime.now()
                    self.models[model].response_time_ms = response_time
                    
                return {
                    "response": result.get("response", ""),
                    "model": model,
                    "response_time_ms": response_time,
                    "done": result.get("done", False),
                    "context": result.get("context", []),
                    "created_at": result.get("created_at"),
                    "total_duration": result.get("total_duration", 0),
                    "load_duration": result.get("load_duration", 0)
                }
            else:
                error_text = await response.text()
                raise Exception(f"HTTP {response.status}: {error_text}")
                
    async def _stream_response(self, prompt: str, model: str, **kwargs) -> AsyncGenerator[Dict[str, Any], None]:
        """Stream response from specific model"""
        request_data = {
            "model": model,
            "prompt": prompt,
            "stream": True,
            **kwargs
        }
        
        async with self.session.post(
            f"{self.base_url}/api/generate",
            json=request_data,
            timeout=aiohttp.ClientTimeout(total=120)
        ) as response:
            
            if response.status == 200:
                async for line in response.content:
                    if line:
                        try:
                            data = json.loads(line.decode('utf-8'))
                            yield {
                                "response": data.get("response", ""),
                                "model": model,
                                "done": data.get("done", False),
                                "created_at": data.get("created_at")
                            }
                            if data.get("done", False):
                                break
                        except json.JSONDecodeError:
                            continue
            else:
                error_text = await response.text()
                raise Exception(f"HTTP {response.status}: {error_text}")
                
    async def pull_model(self, model_name: str) -> bool:
        """Pull a new model from Ollama registry"""
        try:
            logger.info(f"📥 Pulling model: {model_name}")
            
            async with self.session.post(
                f"{self.base_url}/api/pull",
                json={"name": model_name},
                timeout=aiohttp.ClientTimeout(total=600)  # 10 minutes
            ) as response:
                
                if response.status == 200:
                    async for line in response.content:
                        if line:
                            data = json.loads(line.decode('utf-8'))
                            status = data.get("status", "")
                            logger.info(f"📥 {status}")
                            
                            if "success" in status.lower():
                                await self.refresh_models()
                                logger.info(f"✅ Successfully pulled {model_name}")
                                return True
                                
                return False
                
        except Exception as e:
            logger.error(f"❌ Failed to pull model {model_name}: {e}")
            return False
            
    async def delete_model(self, model_name: str) -> bool:
        """Delete a model from Ollama"""
        try:
            async with self.session.delete(
                f"{self.base_url}/api/delete",
                json={"name": model_name}
            ) as response:
                
                if response.status == 200:
                    if model_name in self.models:
                        del self.models[model_name]
                    logger.info(f"🗑️ Deleted model: {model_name}")
                    return True
                else:
                    logger.error(f"❌ Failed to delete {model_name}: {response.status}")
                    return False
                    
        except Exception as e:
            logger.error(f"❌ Error deleting model {model_name}: {e}")
            return False
            
    def get_model_stats(self) -> Dict[str, Any]:
        """Get statistics about available models"""
        stats = {
            "total_models": len(self.models),
            "available_models": len([m for m in self.models.values() if m.status == ModelStatus.AVAILABLE]),
            "unavailable_models": len([m for m in self.models.values() if m.status == ModelStatus.UNAVAILABLE]),
            "models": {}
        }
        
        for name, info in self.models.items():
            stats["models"][name] = {
                "size": info.size,
                "status": info.status.value,
                "parameters": info.parameters,
                "last_used": info.last_used.isoformat() if info.last_used else None,
                "response_time_ms": info.response_time_ms
            }
            
        return stats
        
    async def health_check(self) -> Dict[str, Any]:
        """Comprehensive health check"""
        try:
            # Check Ollama server
            async with self.session.get(f"{self.base_url}/api/version") as response:
                if response.status == 200:
                    version_data = await response.json()
                    ollama_version = version_data.get("version", "unknown")
                else:
                    ollama_version = "unavailable"
                    
            # Check model health
            await self.check_model_health()
            
            return {
                "status": "healthy",
                "ollama_version": ollama_version,
                "models": self.get_model_stats(),
                "primary_model": self.primary_model,
                "fallback_models": self.fallback_models,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "status": "unhealthy",
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }

# Singleton instance for global use
ollama_service = OllamaService()

async def get_ollama_service() -> OllamaService:
    """Get the global Ollama service instance"""
    return ollama_service
