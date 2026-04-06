from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    # Application
    APP_ENV: str = "development"
    APP_NAME: str = "synova-core-api"
    APP_URL: str = "http://localhost:8000"
    API_BASE_URL: str = "http://localhost:8000/api/v1"
    WEB_BASE_URL: str = "http://localhost:3000"
    
    # Database
    DATABASE_URL: str = "postgresql+psycopg://postgres:password@localhost:5432/synova_db"
    REDIS_URL: str = "redis://localhost:6379"
    PGVECTOR_ENABLED: bool = True
    
    # Authentication
    JWT_SECRET: str = "dev-super-secret-jwt-key"
    JWT_REFRESH_SECRET: str = "dev-super-secret-refresh-key"
    ENCRYPTION_KEY: str = "dev-encryption-key-32-chars-long-exactly-32-chars"
    SESSION_COOKIE_NAME: str = "synova_session"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Features
    DEFAULT_TENANT_PLAN: str = "pro"
    ENABLE_SIGNUPS: bool = True
    ENABLE_CLIENT_AI: bool = True
    ENABLE_ASTRANOVA: bool = True
    ENABLE_SUPANOVA: bool = True
    ENABLE_XR: bool = True
    ENABLE_VR: bool = True
    ENABLE_VIKTOR: bool = True
    
    # Model Configuration
    MODEL_DEFAULT_PROVIDER: str = "ollama"
    MODEL_DEFAULT_NAME: str = "llama-3.1"
    MODEL_FALLBACK_PROVIDER: str = "openai"
    MODEL_ROUTER_POLICY: str = "balanced"
    LOCALAI_BASE_URL: str = "http://localhost:8080"
    VLLM_BASE_URL: str = "http://localhost:8000"
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_API_KEY: Optional[str] = None
    
    # Astranova Configuration
    ASTRANOVA_API_KEY: Optional[str] = None
    ASTRANOVA_BASE_URL: str = "https://api.astranova.ai"
    ASTRANOVA_MODEL: str = "astranova-pro"
    ASTRANOVA_MAX_TOKENS: int = 4096
    ASTRANOVA_TEMPERATURE: float = 0.7
    
    # Supanova Configuration
    SUPANOVA_API_KEY: Optional[str] = None
    SUPANOVA_BASE_URL: str = "https://api.supanova.ai"
    SUPANOVA_MODEL: str = "supanova-ultra"
    SUPANOVA_MAX_TOKENS: int = 8192
    SUPANOVA_TEMPERATURE: float = 0.5
    SUPANOVA_ENABLE_MULTI_MODAL: bool = True
    
    # XR/VR Configuration
    XR_PROVIDER: str = "oculus"
    XR_SDK_VERSION: str = "latest"
    VR_WEBXR_SUPPORT: bool = True
    XR_HAND_TRACKING: bool = True
    XR_EYE_TRACKING: bool = True
    XR_SPATIAL_AUDIO: bool = True
    XR_ROOM_SCALE: bool = True
    XR_PASS_THROUGH: bool = True
    
    # External API Keys
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    GOOGLE_API_KEY: Optional[str] = None
    GROQ_API_KEY: Optional[str] = None
    HUGGINGFACE_TOKEN: Optional[str] = None
    
    # CORS - Fixed to include HTTPS ports
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173", "http://localhost:8081", "http://localhost:8082", "https://localhost:3001", "https://localhost:8082"]
    
    # Rate Limiting
    RATE_LIMIT_WINDOW_MS: int = 60000
    RATE_LIMIT_MAX_REQUESTS: int = 100
    AI_RATE_LIMIT_MAX: int = 20
    
    # Logging
    LOG_LEVEL: str = "debug"
    ENABLE_ERROR_TRACKING: bool = False
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
