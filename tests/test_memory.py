"""
Memory/RAG module tests
"""

import pytest
from backend.memory.vector_store import VectorStore
from backend.memory.rag_pipeline import RAGPipeline
from backend.memory.embedding_service import EmbeddingService


@pytest.mark.asyncio
async def test_vector_store_add_document():
    """Test adding a document to vector store"""
    vector_store = VectorStore()
    result = await vector_store.add_document(
        document_id="test_doc_1",
        content="This is a test document for the vector store.",
        metadata={"source": "test"}
    )
    assert result is not None


@pytest.mark.asyncio
async def test_vector_store_search():
    """Test searching the vector store"""
    vector_store = VectorStore()
    await vector_store.add_document(
        document_id="test_doc_2",
        content="Python is a programming language",
        metadata={"source": "test"}
    )
    
    results = await vector_store.search("programming", top_k=5)
    assert len(results) > 0


@pytest.mark.asyncio
async def test_rag_pipeline_retrieve():
    """Test RAG pipeline retrieval"""
    rag_pipeline = RAGPipeline()
    results = await rag_pipeline.retrieve_and_generate(
        query="What is Python?",
        top_k=3
    )
    assert "results" in results or "answer" in results


@pytest.mark.asyncio
async def test_embedding_service():
    """Test embedding service"""
    embedding_service = EmbeddingService()
    embeddings = await embedding_service.get_embeddings(["test text"])
    assert len(embeddings) > 0
    assert len(embeddings[0]) > 0
