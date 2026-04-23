"""
Memory Service - Redis short-term and Supabase long-term memory
Conversation history management with auto-extraction of memorable facts
"""

import os
import json
import uuid
from typing import List, Optional, Dict, Any
import structlog

log = structlog.get_logger()

TTL_SECONDS = 3600 * 6  # 6 hours TTL for short-term memory


class MemoryService:
    """
    Memory Service - Manages short-term (Redis) and long-term (Supabase) memory
    Provides conversation history and persistent user memories
    """
    
    def __init__(self):
        self.redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
        
        self.memory_stats = {
            'short_term_retrievals': 0,
            'long_term_retrievals': 0,
            'memories_saved': 0,
            'auto_extractions': 0
        }
        
        # Auto-extraction keywords
        self.memory_keywords = [
            "my name is", "i prefer", "i work at", "i live in",
            "remember that", "always", "never forget", "my favorite",
            "i like", "i hate", "i want", "i need"
        ]
    
    async def get_redis_client(self):
        """Get Redis client (lazy import)"""
        try:
            import redis.asyncio as aioredis
            return aioredis.from_url(self.redis_url, decode_responses=True)
        except ImportError:
            log.warning("redis_not_installed")
            return None
    
    def get_supabase_client(self):
        """Get Supabase client (lazy import)"""
        try:
            from supabase import create_client
            return create_client(self.supabase_url, self.supabase_key)
        except ImportError:
            log.warning("supabase_not_installed")
            return None
    
    async def get_short_term(self, conversation_id: str) -> List[Dict[str, Any]]:
        """
        Get short-term conversation history from Redis
        
        Args:
            conversation_id: Conversation ID
            
        Returns:
            List of message dictionaries
        """
        self.memory_stats['short_term_retrievals'] += 1
        
        r = await self.get_redis_client()
        if not r:
            return []
        
        try:
            raw = await r.get(f"conv:{conversation_id}")
            await r.aclose()
            return json.loads(raw) if raw else []
        except Exception as e:
            log.error("redis_get_error", error=str(e))
            return []
    
    async def set_short_term(self, conversation_id: str, messages: List[Dict[str, Any]]):
        """
        Set short-term conversation history in Redis
        
        Args:
            conversation_id: Conversation ID
            messages: List of message dictionaries
        """
        r = await self.get_redis_client()
        if not r:
            return
        
        try:
            await r.setex(f"conv:{conversation_id}", TTL_SECONDS, json.dumps(messages))
            await r.aclose()
        except Exception as e:
            log.error("redis_set_error", error=str(e))
    
    async def append_short_term(self, conversation_id: str, message: Dict[str, Any]):
        """
        Append message to short-term memory
        
        Args:
            conversation_id: Conversation ID
            message: Message dictionary
        """
        history = await self.get_short_term(conversation_id)
        history.append(message)
        
        # Keep only last 50 messages
        if len(history) > 50:
            history = history[-50:]
        
        await self.set_short_term(conversation_id, history)
    
    async def get_long_term_memories(self, user_id: str, limit: int = 20) -> List[Dict[str, Any]]:
        """
        Get long-term memories from Supabase
        
        Args:
            user_id: User ID
            limit: Maximum number of memories to return
            
        Returns:
            List of memory items
        """
        self.memory_stats['long_term_retrievals'] += 1
        
        db = self.get_supabase_client()
        if not db:
            return []
        
        try:
            result = db.table("memories").select("*").eq("user_id", user_id).order("importance", desc=True).limit(limit).execute()
            return result.data or []
        except Exception as e:
            log.error("supabase_get_error", error=str(e))
            return []
    
    async def save_memory(self, item: Dict[str, Any]) -> str:
        """
        Save memory to Supabase
        
        Args:
            item: Memory item dictionary
            
        Returns:
            Memory ID
        """
        self.memory_stats['memories_saved'] += 1
        
        db = self.get_supabase_client()
        if not db:
            return ""
        
        try:
            if not item.get("id"):
                item["id"] = str(uuid.uuid4())
            
            db.table("memories").upsert(item).execute()
            return item["id"]
        except Exception as e:
            log.error("supabase_save_error", error=str(e))
            return ""
    
    async def delete_memory(self, memory_id: str, user_id: str):
        """
        Delete memory from Supabase
        
        Args:
            memory_id: Memory ID
            user_id: User ID for authorization
        """
        db = self.get_supabase_client()
        if not db:
            return
        
        try:
            db.table("memories").delete().eq("id", memory_id).eq("user_id", user_id).execute()
        except Exception as e:
            log.error("supabase_delete_error", error=str(e))
    
    async def extract_and_save_memory(self, user_id: str, message_content: str):
        """
        Auto-extract memorable facts from user messages
        
        Args:
            user_id: User ID
            message_content: Message content to analyze
        """
        lower = message_content.lower()
        
        # Check if message contains memory keywords
        if any(kw in lower for kw in self.memory_keywords):
            self.memory_stats['auto_extractions'] += 1
            
            item = {
                "user_id": user_id,
                "content": message_content[:500],
                "category": "auto_extracted",
                "importance": 0.7,
                "created_at": None  # Will be set by database
            }
            
            await self.save_memory(item)
    
    async def get_memory_stats(self) -> Dict[str, Any]:
        """Get memory statistics"""
        return self.memory_stats
    
    async def health_check(self) -> Dict[str, Any]:
        """Health check for memory service"""
        return {
            "status": "healthy",
            "redis_configured": bool(self.redis_url),
            "supabase_configured": bool(self.supabase_url and self.supabase_key),
            "stats": await self.get_memory_stats()
        }
