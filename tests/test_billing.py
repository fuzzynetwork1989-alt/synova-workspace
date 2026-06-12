"""
Billing module tests
"""

import pytest
from backend.billing.subscription import SubscriptionManager
from backend.billing.payment import PaymentProcessor
from backend.billing.usage import UsageTracker
from backend.billing.plans import PlanManager


@pytest.mark.asyncio
async def test_subscription_manager():
    """Test subscription manager"""
    manager = SubscriptionManager()
    
    subscription = await manager.create_subscription(
        user_id="test_user",
        plan_id="pro"
    )
    assert subscription is not None
    assert subscription["user_id"] == "test_user"


@pytest.mark.asyncio
async def test_get_subscription():
    """Test getting subscription"""
    manager = SubscriptionManager()
    
    await manager.create_subscription(
        user_id="test_user_2",
        plan_id="basic"
    )
    
    subscription = await manager.get_subscription("test_user_2")
    assert subscription is not None
    assert subscription["plan_id"] == "basic"


@pytest.mark.asyncio
async def test_payment_processor():
    """Test payment processor"""
    processor = PaymentProcessor()
    
    payment_intent = await processor.create_payment_intent(
        user_id="test_user",
        amount=1000,  # $10.00
        currency="usd"
    )
    assert payment_intent is not None
    assert payment_intent["amount"] == 1000


@pytest.mark.asyncio
async def test_usage_tracker():
    """Test usage tracker"""
    tracker = UsageTracker()
    
    await tracker.record_usage(
        user_id="test_user",
        metric="tokens_used",
        amount=100
    )
    
    usage = await tracker.get_usage("test_user")
    assert usage is not None
    assert usage["tokens_used"] >= 100


@pytest.mark.asyncio
async def test_quota_check():
    """Test quota checking"""
    tracker = UsageTracker()
    
    # Set quota
    tracker.set_quota("test_user", "tokens_used", 1000)
    
    # Check within quota
    within_quota = await tracker.check_quota("test_user", "tokens_used", 500)
    assert within_quota is True


def test_plan_manager():
    """Test plan manager"""
    manager = PlanManager()
    
    plans = manager.list_plans()
    assert isinstance(plans, list)
    assert len(plans) > 0
    
    pro_plan = manager.get_plan("pro")
    assert pro_plan is not None
    assert pro_plan["id"] == "pro"


def test_plan_comparison():
    """Test plan comparison"""
    manager = PlanManager()
    
    comparison = manager.compare_plans("basic", "pro")
    assert comparison is not None
    assert "basic" in comparison
    assert "pro" in comparison
