# 🧠 SYNOVA AI - Database Models
# Persistent storage for API keys, usage, and business metrics

from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from datetime import datetime
import uuid

Base = declarative_base()

class APIKey(Base):
    """API Key model for Synova AI business system"""
    __tablename__ = "api_keys"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    api_key = Column(String, unique=True, nullable=False, index=True)
    user_id = Column(String, nullable=False, index=True)
    tier = Column(String, nullable=False, default='free')  # free, pro, enterprise
    
    # Limits and usage
    limits_requests = Column(Integer, nullable=False, default=100)
    limits_tokens = Column(Integer, nullable=False, default=10000)
    usage_requests = Column(Integer, nullable=False, default=0)
    usage_tokens = Column(Integer, nullable=False, default=0)
    
    # Billing information
    monthly_rate = Column(Float, nullable=False, default=0.0)
    cost_per_request = Column(Float, nullable=False, default=0.0)
    total_cost = Column(Float, nullable=False, default=0.0)
    total_revenue = Column(Float, nullable=False, default=0.0)
    
    # Metadata
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    last_used = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'api_key': self.api_key,
            'user_id': self.user_id,
            'tier': self.tier,
            'limits': {
                'requests': self.limits_requests,
                'tokens': self.limits_tokens
            },
            'usage': {
                'requests': self.usage_requests,
                'tokens': self.usage_tokens
            },
            'billing': {
                'monthly_rate': self.monthly_rate,
                'cost_per_request': self.cost_per_request,
                'total_cost': self.total_cost,
                'total_revenue': self.total_revenue
            },
            'remaining': {
                'requests': max(0, self.limits_requests - self.usage_requests),
                'tokens': max(0, self.limits_tokens - self.usage_tokens)
            },
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'last_used': self.last_used.isoformat() if self.last_used else None,
            'is_active': self.is_active
        }

class UsageLog(Base):
    """Usage log for tracking API requests and costs"""
    __tablename__ = "usage_logs"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    api_key_id = Column(String, nullable=False, index=True)
    
    # Request details
    prompt = Column(Text, nullable=False)
    response = Column(Text, nullable=True)
    tokens_used = Column(Integer, nullable=False, default=0)
    
    # Provider information
    actual_provider = Column(String, nullable=False)  # OpenAI, Anthropic, Google
    actual_model = Column(String, nullable=False)
    actual_cost = Column(Float, nullable=False, default=0.0)
    
    # Business metrics
    user_cost = Column(Float, nullable=False, default=0.0)
    profit_margin = Column(Float, nullable=False, default=0.0)
    routing_reason = Column(String, nullable=True)
    
    # Metadata
    created_at = Column(DateTime, default=func.now())
    response_time_ms = Column(Integer, nullable=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'api_key_id': self.api_key_id,
            'prompt': self.prompt[:100] + '...' if len(self.prompt) > 100 else self.prompt,
            'tokens_used': self.tokens_used,
            'actual_provider': self.actual_provider,
            'actual_model': self.actual_model,
            'actual_cost': self.actual_cost,
            'user_cost': self.user_cost,
            'profit_margin': self.profit_margin,
            'routing_reason': self.routing_reason,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'response_time_ms': self.response_time_ms
        }

class BusinessMetrics(Base):
    """Business metrics for revenue and analytics"""
    __tablename__ = "business_metrics"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Revenue metrics
    total_revenue = Column(Float, nullable=False, default=0.0)
    total_cost = Column(Float, nullable=False, default=0.0)
    total_profit = Column(Float, nullable=False, default=0.0)
    
    # Usage metrics
    total_requests = Column(Integer, nullable=False, default=0)
    total_tokens = Column(Integer, nullable=False, default=0.0)
    
    # Tier breakdown
    free_tier_revenue = Column(Float, nullable=False, default=0.0)
    pro_tier_revenue = Column(Float, nullable=False, default=0.0)
    enterprise_tier_revenue = Column(Float, nullable=False, default=0.0)
    
    # Provider breakdown
    openai_usage = Column(Integer, nullable=False, default=0)
    anthropic_usage = Column(Integer, nullable=False, default=0)
    google_usage = Column(Integer, nullable=False, default=0)
    
    # Metadata
    period_start = Column(DateTime, nullable=False, default=func.now())
    period_end = Column(DateTime, nullable=False, default=func.now())
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    def to_dict(self):
        return {
            'id': self.id,
            'total_revenue': self.total_revenue,
            'total_cost': self.total_cost,
            'total_profit': self.total_profit,
            'total_requests': self.total_requests,
            'total_tokens': self.total_tokens,
            'revenue_by_tier': {
                'free': self.free_tier_revenue,
                'pro': self.pro_tier_revenue,
                'enterprise': self.enterprise_tier_revenue
            },
            'usage_by_provider': {
                'openai': self.openai_usage,
                'anthropic': self.anthropic_usage,
                'google': self.google_usage
            },
            'period_start': self.period_start.isoformat() if self.period_start else None,
            'period_end': self.period_end.isoformat() if self.period_end else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class PureKnowledgeLog(Base):
    """Pure Knowledge system logs for revolutionary AI operations"""
    __tablename__ = "pure_knowledge_logs"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Operation details
    operation_type = Column(String, nullable=False)  # create, optimize, innovate
    operation_data = Column(JSON, nullable=True)
    
    # Results
    result = Column(JSON, nullable=True)
    success = Column(Boolean, nullable=False, default=True)
    error_message = Column(Text, nullable=True)
    
    # Performance metrics
    processing_time_ms = Column(Integer, nullable=True)
    innovation_score = Column(Float, nullable=True)
    optimization_level = Column(String, nullable=True)
    
    # Metadata
    created_at = Column(DateTime, default=func.now())
    user_id = Column(String, nullable=True, index=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'operation_type': self.operation_type,
            'operation_data': self.operation_data,
            'result': self.result,
            'success': self.success,
            'error_message': self.error_message,
            'processing_time_ms': self.processing_time_ms,
            'innovation_score': self.innovation_score,
            'optimization_level': self.optimization_level,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'user_id': self.user_id
        }

# Database connection and session management
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import os

# Database configuration
DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///./synova_ai.db')

# Create engine
if DATABASE_URL.startswith('sqlite'):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool
    )
else:
    engine = create_engine(DATABASE_URL)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize database
def init_db():
    """Initialize database with all tables"""
    Base.metadata.create_all(bind=engine)
    print("🗄️ Database initialized successfully")

# Database utility functions
class DatabaseManager:
    """Database manager for Synova AI business operations"""
    
    def __init__(self):
        self.engine = engine
        self.SessionLocal = SessionLocal
    
    def get_session(self):
        """Get database session"""
        return self.SessionLocal()
    
    def create_api_key(self, api_key_data):
        """Create new API key"""
        db = self.get_session()
        try:
            api_key = APIKey(**api_key_data)
            db.add(api_key)
            db.commit()
            db.refresh(api_key)
            return api_key.to_dict()
        finally:
            db.close()
    
    def get_api_key(self, api_key):
        """Get API key by key string"""
        db = self.get_session()
        try:
            key_record = db.query(APIKey).filter(APIKey.api_key == api_key).first()
            if key_record:
                return key_record.to_dict()
            return None
        finally:
            db.close()
    
    def update_api_key_usage(self, api_key, tokens_used, cost_data):
        """Update API key usage and billing"""
        db = self.get_session()
        try:
            key_record = db.query(APIKey).filter(APIKey.api_key == api_key).first()
            if key_record:
                key_record.usage_requests += 1
                key_record.usage_tokens += tokens_used
                key_record.total_cost += cost_data.get('actual_cost', 0)
                key_record.total_revenue += cost_data.get('user_cost', 0)
                key_record.last_used = datetime.utcnow()
                db.commit()
                return key_record.to_dict()
            return None
        finally:
            db.close()
    
    def log_usage(self, usage_data):
        """Log API usage"""
        db = self.get_session()
        try:
            usage_log = UsageLog(**usage_data)
            db.add(usage_log)
            db.commit()
            return usage_log.to_dict()
        finally:
            db.close()
    
    def get_business_metrics(self):
        """Get current business metrics"""
        db = self.get_session()
        try:
            # Calculate metrics from API keys and usage logs
            total_keys = db.query(APIKey).count()
            total_requests = db.query(APIKey).with_entities(func.sum(APIKey.usage_requests)).scalar() or 0
            total_tokens = db.query(APIKey).with_entities(func.sum(APIKey.usage_tokens)).scalar() or 0
            total_revenue = db.query(APIKey).with_entities(func.sum(APIKey.total_revenue)).scalar() or 0.0
            total_cost = db.query(APIKey).with_entities(func.sum(APIKey.total_cost)).scalar() or 0.0
            
            # Revenue by tier
            free_revenue = db.query(APIKey).with_entities(func.sum(APIKey.total_revenue)).filter(APIKey.tier == 'free').scalar() or 0.0
            pro_revenue = db.query(APIKey).with_entities(func.sum(APIKey.total_revenue)).filter(APIKey.tier == 'pro').scalar() or 0.0
            enterprise_revenue = db.query(APIKey).with_entities(func.sum(APIKey.total_revenue)).filter(APIKey.tier == 'enterprise').scalar() or 0.0
            
            # Usage by provider
            openai_usage = db.query(UsageLog).filter(UsageLog.actual_provider == 'OpenAI').count()
            anthropic_usage = db.query(UsageLog).filter(UsageLog.actual_provider == 'Anthropic').count()
            google_usage = db.query(UsageLog).filter(UsageLog.actual_provider == 'Google AI').count()
            
            return {
                'totalKeys': total_keys,
                'totalRequests': total_requests,
                'totalTokens': total_tokens,
                'totalRevenue': total_revenue,
                'totalCost': total_cost,
                'totalProfit': total_revenue - total_cost,
                'revenueByTier': {
                    'free': free_revenue,
                    'pro': pro_revenue,
                    'enterprise': enterprise_revenue
                },
                'usageByProvider': {
                    'openai': openai_usage,
                    'anthropic': anthropic_usage,
                    'google': google_usage
                }
            }
        finally:
            db.close()
    
    def log_pure_knowledge_operation(self, operation_data):
        """Log pure knowledge operation"""
        db = self.get_session()
        try:
            log_entry = PureKnowledgeLog(**operation_data)
            db.add(log_entry)
            db.commit()
            return log_entry.to_dict()
        finally:
            db.close()

# Global database manager instance
db_manager = DatabaseManager()
