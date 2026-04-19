from app.db.session import Base

# Import all models here to ensure they're registered with SQLAlchemy
# This file will be expanded as we add models

class BaseModel(Base):
    """Base model class with common fields."""
    
    __abstract__ = True
    
    # Common fields will be added here as we develop the schema
    pass
