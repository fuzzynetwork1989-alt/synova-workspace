"""
Cache manager for Synova Brain
"""

from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)


class CacheManager:
    """Cache manager for storing and retrieving results"""

    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.cache_type = config.get("type", "memory")
        self.ttl = config.get("ttl", 3600)
        self.max_size = config.get("max_size", 1000)
        self._cache = {}

    async def get(self, key: str) -> Optional[Dict[str, Any]]:
        """Get value from cache"""
        if key in self._cache:
            entry = self._cache[key]
            if not self._is_expired(entry):
                return entry["value"]
            else:
                del self._cache[key]
        return None

    async def set(self, key: str, value: Dict[str, Any]) -> bool:
        """Set value in cache"""
        try:
            if len(self._cache) >= self.max_size:
                self._evict_oldest()
            self._cache[key] = {
                "value": value,
                "timestamp": self._get_timestamp(),
            }
            return True
        except Exception as e:
            logger.error(f"Cache set error: {e}")
            return False

    async def delete(self, key: str) -> bool:
        """Delete value from cache"""
        if key in self._cache:
            del self._cache[key]
            return True
        return False

    async def clear(self) -> bool:
        """Clear all cache entries"""
        self._cache.clear()
        return True

    def _is_expired(self, entry: Dict[str, Any]) -> bool:
        """Check if cache entry is expired"""
        import time
        return time.time() - entry["timestamp"] > self.ttl

    def _evict_oldest(self) -> None:
        """Evict oldest cache entry"""
        if self._cache:
            oldest_key = min(self._cache.keys(), key=lambda k: self._cache[k]["timestamp"])
            del self._cache[oldest_key]

    def _get_timestamp(self) -> float:
        """Get current timestamp"""
        import time
        return time.time()
