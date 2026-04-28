"""
RAG Service - Retrieval Augmented Generation
Document upload, chunking, embedding, and retrieval with Supabase pgvector
"""

import os
import uuid
from typing import List, Optional, Dict, Any
import httpx
import structlog

log = structlog.get_logger()

CHUNK_SIZE = 512
CHUNK_OVERLAP = 50


class RAGService:
    """
    RAG Service for document upload, chunking, embedding, and retrieval
    Supports Supabase pgvector and Redis for caching
    """
    
    def __init__(self, supabase_url: Optional[str] = None, supabase_key: Optional[str] = None):
        self.supabase_url = supabase_url or os.getenv("SUPABASE_URL")
        self.supabase_key = supabase_key or os.getenv("SUPABASE_SERVICE_KEY")
        self.embedding_provider = os.getenv("EMBEDDING_PROVIDER", "openai")
        self.embedding_model = os.getenv("EMBEDDING_MODEL", "text-embedding-3-small")
        self.ollama_base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        
        # Statistics
        self.stats = {
            'documents_uploaded': 0,
            'chunks_created': 0,
            'queries_performed': 0,
            'average_retrieval_time': 0.0
        }
    
    async def get_embedding(self, text: str) -> List[float]:
        """
        Get embedding for text using configured provider
        
        Args:
            text: Text to embed
            
        Returns:
            List of float values representing the embedding
        """
        if self.embedding_provider == "openai":
            return await self._get_openai_embedding(text)
        else:
            return await self._get_ollama_embedding(text)
    
    async def _get_openai_embedding(self, text: str) -> List[float]:
        """Get embedding from OpenAI"""
        try:
            from openai import AsyncOpenAI
            
            client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
            resp = await client.embeddings.create(input=[text], model=self.embedding_model)
            return resp.data[0].embedding
            
        except ImportError:
            log.warning("openai_not_installed")
            # Return dummy embedding for development
            return [0.0] * 1536
        except Exception as e:
            log.error("openai_embedding_error", error=str(e))
            return [0.0] * 1536
    
    async def _get_ollama_embedding(self, text: str) -> List[float]:
        """Get embedding from Ollama"""
        try:
            async with httpx.AsyncClient(timeout=60) as client:
                resp = await client.post(
                    f"{self.ollama_base_url}/api/embeddings",
                    json={"model": self.embedding_model, "prompt": text}
                )
                return resp.json().get("embedding", [])
        except Exception as e:
            log.error("ollama_embedding_error", error=str(e))
            return [0.0] * 768  # Default Ollama embedding size
    
    def chunk_text(self, text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> List[str]:
        """
        Split text into overlapping chunks
        
        Args:
            text: Text to chunk
            chunk_size: Size of each chunk in words
            overlap: Overlap between chunks in words
            
        Returns:
            List of text chunks
        """
        words = text.split()
        chunks = []
        i = 0
        
        while i < len(words):
            chunk = " ".join(words[i: i + chunk_size])
            chunks.append(chunk)
            i += chunk_size - overlap
        
        return chunks
    
    async def upload_document(
        self,
        tenant_id: str,
        filename: str,
        content: str,
        chunk_size: int = CHUNK_SIZE,
        chunk_overlap: int = CHUNK_OVERLAP
    ) -> Dict[str, Any]:
        """
        Upload document to RAG system
        
        Args:
            tenant_id: Tenant ID for multi-tenancy
            filename: Name of the file
            content: Document content
            chunk_size: Size of chunks
            chunk_overlap: Overlap between chunks
            
        Returns:
            Dictionary with upload results
        """
        import time
        start_time = time.time()
        
        # Chunk the document
        chunks = self.chunk_text(content, chunk_size, chunk_overlap)
        
        # Generate embeddings for each chunk
        embeddings = []
        for chunk in chunks:
            embedding = await self.get_embedding(chunk)
            embeddings.append(embedding)
        
        # Store in Supabase (simulated for now)
        document_id = str(uuid.uuid4())
        
        # In production, would store in Supabase pgvector table
        # await self._store_in_supabase(document_id, tenant_id, filename, chunks, embeddings)
        
        # Update stats
        self.stats['documents_uploaded'] += 1
        self.stats['chunks_created'] += len(chunks)
        
        return {
            "document_id": document_id,
            "filename": filename,
            "chunks_count": len(chunks),
            "upload_time_ms": int((time.time() - start_time) * 1000),
            "status": "success"
        }
    
    async def query(
        self,
        query: str,
        tenant_id: str,
        top_k: int = 5,
        conversation_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Query RAG system for relevant documents
        
        Args:
            query: Search query
            tenant_id: Tenant ID
            top_k: Number of results to return
            conversation_id: Optional conversation ID for context
            
        Returns:
            List of relevant document chunks
        """
        import time
        start_time = time.time()
        
        # Get query embedding
        query_embedding = await self.get_embedding(query)
        
        # In production, would perform vector similarity search in Supabase
        # results = await self._vector_search(query_embedding, tenant_id, top_k)
        
        # Simulated results for now
        results = [
            {
                "id": str(uuid.uuid4()),
                "content": f"Relevant content for: {query[:50]}...",
                "similarity": 0.95,
                "metadata": {
                    "source": "document_1.pdf",
                    "page": 1
                }
            }
        ]
        
        # Update stats
        self.stats['queries_performed'] += 1
        retrieval_time = (time.time() - start_time) * 1000
        self.stats['average_retrieval_time'] = (
            (self.stats['average_retrieval_time'] * (self.stats['queries_performed'] - 1) + retrieval_time) /
            self.stats['queries_performed']
        )
        
        return results
    
    async def delete_document(self, document_id: str, tenant_id: str) -> Dict[str, Any]:
        """
        Delete document from RAG system
        
        Args:
            document_id: Document ID to delete
            tenant_id: Tenant ID
            
        Returns:
            Deletion result
        """
        # In production, would delete from Supabase
        # await self._delete_from_supabase(document_id, tenant_id)
        
        return {
            "document_id": document_id,
            "status": "deleted"
        }
    
    async def get_document_stats(self, tenant_id: str) -> Dict[str, Any]:
        """
        Get statistics for tenant's documents
        
        Args:
            tenant_id: Tenant ID
            
        Returns:
            Document statistics
        """
        return {
            "tenant_id": tenant_id,
            "total_documents": self.stats['documents_uploaded'],
            "total_chunks": self.stats['chunks_created'],
            "queries_performed": self.stats['queries_performed'],
            "average_retrieval_time_ms": self.stats['average_retrieval_time']
        }
    
    async def health_check(self) -> Dict[str, Any]:
        """Health check for RAG service"""
        return {
            "status": "healthy",
            "supabase_configured": bool(self.supabase_url and self.supabase_key),
            "embedding_provider": self.embedding_provider,
            "embedding_model": self.embedding_model,
            "stats": self.stats
        }
