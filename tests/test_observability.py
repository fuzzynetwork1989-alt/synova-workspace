"""
Observability module tests
"""

import pytest
from backend.observability.logger import Logger
from backend.observability.metrics import MetricsCollector
from backend.observability.evaluator import Evaluator
from backend.observability.health_check import HealthChecker


def test_logger():
    """Test logger"""
    logger = Logger()
    
    logger.info("Test info message")
    logger.warning("Test warning message")
    logger.error("Test error message")
    
    # Test with context
    logger.info("Test with context", context={"user_id": "test_user"})


def test_metrics_collector():
    """Test metrics collector"""
    metrics = MetricsCollector()
    
    # Record metric
    metrics.record_metric("request_count", 1, {"endpoint": "/chat"})
    
    # Increment counter
    metrics.increment_counter("total_requests", {"method": "POST"})
    
    # Timing
    metrics.start_timing("request_duration")
    metrics.stop_timing("request_duration", {"endpoint": "/chat"})
    
    # Get metrics
    all_metrics = metrics.get_metrics()
    assert all_metrics is not None


@pytest.mark.asyncio
async def test_evaluator():
    """Test evaluator"""
    evaluator = Evaluator()
    
    result = await evaluator.evaluate_response(
        prompt="What is 2+2?",
        response="2+2 equals 4",
        expected="4",
        metrics=["accuracy", "relevance"]
    )
    
    assert result is not None
    assert "accuracy" in result or "overall_score" in result


@pytest.mark.asyncio
async def test_health_checker():
    """Test health checker"""
    health_checker = HealthChecker()
    
    health = await health_checker.get_system_health()
    assert health is not None
    assert "status" in health
    
    # Check individual components
    db_health = await health_checker.check_database_health()
    assert db_health is not None
    
    vector_db_health = await health_checker.check_vector_db_health()
    assert vector_db_health is not None
    
    model_health = await health_checker.check_model_service_health()
    assert model_health is not None
