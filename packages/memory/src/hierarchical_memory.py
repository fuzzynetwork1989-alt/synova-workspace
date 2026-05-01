"""
Hierarchical Memory System - Peak Brain Component
Multi-layer memory with automatic compression and retrieval
"""

from typing import Dict, List, Optional, Union, Any, Tuple
from dataclasses import dataclass, field
from enum import Enum
from datetime import datetime, timedelta
import asyncio
import json
import hashlib
import uuid
from abc import ABC, abstractmethod

class MemoryLayer(Enum):
    IMMEDIATE = "immediate"      # Current context, 1 hour TTL
    SESSION = "session"         # Current session, 24 hours TTL
    WORKING = "working"         # Working memory, 7 days TTL
    LONG_TERM = "long_term"     # Long-term memory, 1 year TTL
    ARCHIVAL = "archival"       # Permanent storage

class MemoryType(Enum):
    CONVERSATION = "conversation"
    KNOWLEDGE = "knowledge"
    PREFERENCE = "preference"
    CONTEXT = "context"
    TOOL_RESULT = "tool_result"
    REASONING = "reasoning"
    PLAN = "plan"

@dataclass
class MemoryItem:
    content: str
    memory_type: MemoryType
    importance: float  # 0-1
    tags: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.now)
    accessed_at: datetime = field(default_factory=datetime.now)
    access_count: int = 0
    compression_level: int = 0  # 0=original, 1=compressed, 2=summarized
    embedding: Optional[List[float]] = None
    related_memories: List[str] = field(default_factory=list)
    
    def __post_init__(self):
        self.id = str(uuid.uuid4())

@dataclass
class MemoryConfig:
    layer: MemoryLayer
    max_size_mb: int
    ttl_hours: int
    compression_threshold: float = 0.7  # Compress when importance < threshold
    auto_summarize: bool = True

class MemoryStore(ABC):
    """Abstract base class for memory storage backends"""
    
    @abstractmethod
    async def store(self, item: MemoryItem) -> str:
        pass
    
    @abstractmethod
    async def retrieve(self, memory_id: str) -> Optional[MemoryItem]:
        pass
    
    @abstractmethod
    async def search(self, query: str, limit: int = 10) -> List[MemoryItem]:
        pass
    
    @abstractmethod
    async def delete(self, memory_id: str) -> bool:
        pass
    
    @abstractmethod
    async def cleanup_expired(self) -> int:
        pass

class InMemoryStore(MemoryStore):
    """In-memory implementation for development and testing"""
    
    def __init__(self):
        self.memories: Dict[str, MemoryItem] = {}
        self.indexes: Dict[str, List[str]] = {}  # tag and type indexes
    
    async def store(self, item: MemoryItem) -> str:
        self.memories[item.id] = item
        
        # Update indexes
        for tag in item.tags:
            if tag not in self.indexes:
                self.indexes[tag] = []
            self.indexes[tag].append(item.id)
        
        if item.memory_type.value not in self.indexes:
            self.indexes[item.memory_type.value] = []
        self.indexes[item.memory_type.value].append(item.id)
        
        return item.id
    
    async def retrieve(self, memory_id: str) -> Optional[MemoryItem]:
        item = self.memories.get(memory_id)
        if item:
            item.accessed_at = datetime.now()
            item.access_count += 1
        return item
    
    async def search(self, query: str, limit: int = 10) -> List[MemoryItem]:
        # Simple keyword search for now
        query_lower = query.lower()
        results = []
        
        for item in self.memories.values():
            if query_lower in item.content.lower():
                results.append(item)
                if len(results) >= limit:
                    break
        
        return sorted(results, key=lambda x: x.importance, reverse=True)
    
    async def delete(self, memory_id: str) -> bool:
        if memory_id in self.memories:
            item = self.memories[memory_id]
            del self.memories[memory_id]
            
            # Update indexes
            for tag in item.tags:
                if tag in self.indexes and memory_id in self.indexes[tag]:
                    self.indexes[tag].remove(memory_id)
            
            return True
        return False
    
    async def cleanup_expired(self) -> int:
        now = datetime.now()
        expired = []
        
        for memory_id, item in self.memories.items():
            # Check TTL based on layer (would need layer info)
            if now - item.created_at > timedelta(days=30):  # Simple TTL
                expired.append(memory_id)
        
        for memory_id in expired:
            await self.delete(memory_id)
        
        return len(expired)

class HierarchicalMemorySystem:
    """Multi-layer memory with automatic compression and retrieval"""
    
    def __init__(self, store: Optional[MemoryStore] = None):
        self.store = store or InMemoryStore()
        self.layer_configs = self._initialize_layer_configs()
        self.compression_engine = MemoryCompressionEngine()
        self.retrieval_engine = MemoryRetrievalEngine(self.store)
        self.relationship_engine = MemoryRelationshipEngine()
        
    def _initialize_layer_configs(self) -> Dict[MemoryLayer, MemoryConfig]:
        return {
            MemoryLayer.IMMEDIATE: MemoryConfig(
                layer=MemoryLayer.IMMEDIATE,
                max_size_mb=10,  # 10KB
                ttl_hours=1,
                compression_threshold=0.9,
                auto_summarize=False
            ),
            MemoryLayer.SESSION: MemoryConfig(
                layer=MemoryLayer.SESSION,
                max_size_mb=1,   # 1MB
                ttl_hours=24,
                compression_threshold=0.8,
                auto_summarize=False
            ),
            MemoryLayer.WORKING: MemoryConfig(
                layer=MemoryLayer.WORKING,
                max_size_mb=10,  # 10MB
                ttl_hours=168,  # 7 days
                compression_threshold=0.6,
                auto_summarize=True
            ),
            MemoryLayer.LONG_TERM: MemoryConfig(
                layer=MemoryLayer.LONG_TERM,
                max_size_mb=100, # 100MB
                ttl_hours=8760, # 1 year
                compression_threshold=0.4,
                auto_summarize=True
            ),
            MemoryLayer.ARCHIVAL: MemoryConfig(
                layer=MemoryLayer.ARCHIVAL,
                max_size_mb=1000, # 1GB
                ttl_hours=-1,    # Permanent
                compression_threshold=0.2,
                auto_summarize=True
            )
        }
    
    async def store_memory(self, content: str, memory_type: MemoryType, 
                          importance: float = 0.5, tags: List[str] = None,
                          metadata: Dict[str, Any] = None, 
                          suggested_layer: Optional[MemoryLayer] = None) -> str:
        """Store memory with intelligent layer placement and compression"""
        
        # Create memory item
        memory = MemoryItem(
            content=content,
            memory_type=memory_type,
            importance=importance,
            tags=tags or [],
            metadata=metadata or {}
        )
        
        # Determine optimal layer
        layer = suggested_layer or self._determine_layer(memory)
        memory.metadata['layer'] = layer.value
        
        # Apply compression if needed
        if importance < self.layer_configs[layer].compression_threshold:
            memory = await self.compression_engine.compress_memory(memory)
        
        # Store the memory
        memory_id = await self.store.store(memory)
        
        # Find and store relationships
        related_memories = await self.relationship_engine.find_relationships(memory)
        for related_id in related_memories:
            memory.related_memories.append(related_id)
        
        return memory_id
    
    async def retrieve_context(self, query: str, max_tokens: int = 2000,
                             layers: Optional[List[MemoryLayer]] = None,
                             memory_types: Optional[List[MemoryType]] = None) -> List[MemoryItem]:
        """Context-aware memory retrieval with relevance scoring"""
        
        # Search across specified layers or all layers
        memories = await self.retrieval_engine.retrieve_with_context(
            query=query,
            max_tokens=max_tokens,
            layers=layers,
            memory_types=memory_types
        )
        
        return memories
    
    async def get_memory(self, memory_id: str) -> Optional[MemoryItem]:
        """Get specific memory by ID"""
        return await self.store.retrieve(memory_id)
    
    async def update_memory(self, memory_id: str, content: Optional[str] = None,
                          importance: Optional[float] = None,
                          tags: Optional[List[str]] = None) -> bool:
        """Update existing memory"""
        memory = await self.store.retrieve(memory_id)
        if not memory:
            return False
        
        if content is not None:
            memory.content = content
        if importance is not None:
            memory.importance = importance
        if tags is not None:
            memory.tags = tags
        
        memory.accessed_at = datetime.now()
        return True
    
    async def delete_memory(self, memory_id: str) -> bool:
        """Delete memory"""
        return await self.store.delete(memory_id)
    
    async def cleanup_expired_memories(self) -> Dict[str, int]:
        """Clean up expired memories across all layers"""
        cleanup_counts = {}
        
        for layer, config in self.layer_configs.items():
            if config.ttl_hours > 0:  # Don't clean archival layer
                count = await self.store.cleanup_expired()
                cleanup_counts[layer.value] = count
        
        return cleanup_counts
    
    async def get_memory_stats(self) -> Dict[str, Any]:
        """Get memory system statistics"""
        # This would require additional tracking in the store
        return {
            'total_memories': 0,  # Would be implemented in store
            'layer_distribution': {},  # Would be tracked
            'memory_types': {},  # Would be tracked
            'compression_stats': {},  # Would be tracked by compression engine
        }
    
    def _determine_layer(self, memory: MemoryItem) -> MemoryLayer:
        """Determine optimal storage layer based on memory characteristics"""
        
        # High importance and recent -> immediate or session
        if memory.importance > 0.8 and memory.memory_type in [MemoryType.CONVERSATION, MemoryType.CONTEXT]:
            return MemoryLayer.SESSION
        
        # Medium importance -> working memory
        if memory.importance > 0.5:
            return MemoryLayer.WORKING
        
        # Low importance but useful -> long-term
        if memory.importance > 0.2:
            return MemoryLayer.LONG_TERM
        
        # Very low importance -> archival (if worth keeping)
        if memory.importance > 0.1:
            return MemoryLayer.ARCHIVAL
        
        # Don't store very low importance memories
        return MemoryLayer.ARCHIVAL  # Will be compressed heavily

class MemoryCompressionEngine:
    """Handles memory compression and summarization"""
    
    async def compress_memory(self, memory: MemoryItem) -> MemoryItem:
        """Compress memory based on importance and type"""
        
        if memory.compression_level >= 2:
            return memory  # Already maximally compressed
        
        # Determine compression strategy
        if memory.memory_type == MemoryType.CONVERSATION:
            memory = await self._compress_conversation(memory)
        elif memory.memory_type == MemoryType.KNOWLEDGE:
            memory = await self._compress_knowledge(memory)
        elif memory.memory_type == MemoryType.REASONING:
            memory = await self._compress_reasoning(memory)
        else:
            memory = await self._compress_generic(memory)
        
        return memory
    
    async def _compress_conversation(self, memory: MemoryItem) -> MemoryItem:
        """Compress conversation memory"""
        # Simple compression: keep key points
        sentences = memory.content.split('.')
        key_sentences = []
        
        for sentence in sentences[:10]:  # Keep first 10 sentences
            sentence = sentence.strip()
            if len(sentence) > 10:  # Keep meaningful sentences
                key_sentences.append(sentence)
        
        memory.content = '. '.join(key_sentences)
        memory.compression_level = 1
        return memory
    
    async def _compress_knowledge(self, memory: MemoryItem) -> MemoryItem:
        """Compress knowledge memory"""
        # Extract key concepts
        words = memory.content.split()
        key_words = []
        
        # Simple keyword extraction (would use NLP in production)
        for word in words[:50]:  # Keep first 50 words
            if len(word) > 3:  # Keep meaningful words
                key_words.append(word)
        
        memory.content = ' '.join(key_words)
        memory.compression_level = 1
        return memory
    
    async def _compress_reasoning(self, memory: MemoryItem) -> MemoryItem:
        """Compress reasoning memory"""
        # Keep conclusion and key steps
        lines = memory.content.split('\n')
        conclusion_lines = []
        
        for line in lines:
            line = line.strip()
            if any(keyword in line.lower() for keyword in ['conclusion', 'therefore', 'thus', 'result']):
                conclusion_lines.append(line)
        
        if conclusion_lines:
            memory.content = '\n'.join(conclusion_lines)
        else:
            # Fallback: keep last few lines
            memory.content = '\n'.join(lines[-5:])
        
        memory.compression_level = 1
        return memory
    
    async def _compress_generic(self, memory: MemoryItem) -> MemoryItem:
        """Generic compression for other memory types"""
        # Simple truncation
        max_length = 500
        if len(memory.content) > max_length:
            memory.content = memory.content[:max_length] + "..."
            memory.compression_level = 1
        
        return memory

class MemoryRetrievalEngine:
    """Advanced memory retrieval with relevance scoring"""
    
    def __init__(self, store: MemoryStore):
        self.store = store
    
    async def retrieve_with_context(self, query: str, max_tokens: int = 2000,
                                   layers: Optional[List[MemoryLayer]] = None,
                                   memory_types: Optional[List[MemoryType]] = None) -> List[MemoryItem]:
        """Retrieve memories with context awareness and token limits"""
        
        # Search for relevant memories
        candidate_memories = await self.store.search(query, limit=50)
        
        # Filter by memory types if specified
        if memory_types:
            candidate_memories = [
                m for m in candidate_memories 
                if m.memory_type in memory_types
            ]
        
        # Filter by layers if specified
        if layers:
            layer_values = [l.value for l in layers]
            candidate_memories = [
                m for m in candidate_memories 
                if m.metadata.get('layer') in layer_values
            ]
        
        # Score and rank by relevance
        scored_memories = await self._score_relevance(candidate_memories, query)
        
        # Select memories within token limit
        selected_memories = await self._select_by_token_limit(scored_memories, max_tokens)
        
        return selected_memories
    
    async def _score_relevance(self, memories: List[MemoryItem], query: str) -> List[Tuple[MemoryItem, float]]:
        """Score memories by relevance to query"""
        scored = []
        query_lower = query.lower()
        query_words = set(query_lower.split())
        
        for memory in memories:
            score = 0.0
            
            # Text matching score
            content_lower = memory.content.lower()
            content_words = set(content_lower.split())
            
            # Exact phrase matching
            if query_lower in content_lower:
                score += 0.5
            
            # Word overlap
            word_overlap = len(query_words & content_words)
            if query_words:
                score += (word_overlap / len(query_words)) * 0.3
            
            # Tag matching
            tag_matches = len(set(query_lower.split()) & set(tag.lower() for tag in memory.tags))
            if memory.tags:
                score += (tag_matches / len(memory.tags)) * 0.2
            
            # Importance boost
            score += memory.importance * 0.1
            
            # Recency boost (more recent memories are slightly more relevant)
            hours_old = (datetime.now() - memory.created_at).total_seconds() / 3600
            recency_boost = max(0, 1 - hours_old / 168)  # Decay over 1 week
            score += recency_boost * 0.05
            
            scored.append((memory, score))
        
        # Sort by score
        scored.sort(key=lambda x: x[1], reverse=True)
        return scored
    
    async def _select_by_token_limit(self, scored_memories: List[Tuple[MemoryItem, float]], 
                                   max_tokens: int) -> List[MemoryItem]:
        """Select memories within token limit"""
        selected = []
        current_tokens = 0
        
        # Rough token estimation (4 characters per token on average)
        for memory, score in scored_memories:
            memory_tokens = len(memory.content) // 4
            
            if current_tokens + memory_tokens <= max_tokens:
                selected.append(memory)
                current_tokens += memory_tokens
            else:
                break
        
        return selected

class MemoryRelationshipEngine:
    """Manages relationships between memories"""
    
    async def find_relationships(self, memory: MemoryItem) -> List[str]:
        """Find related memories based on content and metadata"""
        related = []
        
        # Simple relationship detection based on tags and content similarity
        # In production, this would use embeddings and semantic similarity
        
        return related
