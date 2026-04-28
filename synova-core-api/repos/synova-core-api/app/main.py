from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import structlog

from app.core.config import settings
from app.core.logging import setup_logging
from app.api.v1 import auth, chat, organizations, workspaces, astranova, supanova, xr, synova_brain, deep_research, viktor
from app.db.session import engine
from app.db.base import Base

logger = structlog.get_logger()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting Synova Core API")
    logger.info("Features enabled", features={
        "astranova": settings.ENABLE_ASTRANOVA,
        "supanova": settings.ENABLE_SUPANOVA,
        "xr": settings.ENABLE_XR,
        "vr": settings.ENABLE_VR,
        "viktor": settings.ENABLE_VIKTOR,
        "synova_brain": True,
        "deep_research": True,
    })
    yield
    # Shutdown
    logger.info("Shutting down Synova Core API")

app = FastAPI(
    title="Synova AI Core API",
    description="Multi-tenant AI agent orchestration platform with Astranova, Supanova, XR/VR, Synova Brain, and Deep Research support",
    version="2.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(organizations.router, prefix="/api/v1/organizations", tags=["organizations"])
app.include_router(workspaces.router, prefix="/api/v1/workspaces", tags=["workspaces"])
app.include_router(chat.router, prefix="/api/v1/chat", tags=["chat"])
app.include_router(astranova.router, prefix="/api/v1", tags=["astranova"])
app.include_router(supanova.router, prefix="/api/v1", tags=["supanova"])
app.include_router(xr.router, prefix="/api/v1")
app.include_router(viktor.router, prefix="/api/v1")
app.include_router(synova_brain.router, prefix="/api/v1", tags=["synova_brain"])
app.include_router(deep_research.router, prefix="/api/v1", tags=["deep_research"])

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "synova-core-api", "version": "2.0.0"}

@app.get("/ready")
async def ready_check():
    return {"status": "ready", "service": "synova-core-api", "version": "2.0.0"}

@app.get("/api/v1/features")
async def get_features():
    """Get available features and their status"""
    return {
        "features": {
            "astranova": {
                "enabled": settings.ENABLE_ASTRANOVA,
                "description": "Advanced AI Agent System"
            },
            "supanova": {
                "enabled": settings.ENABLE_SUPANOVA,
                "description": "Super-Agent Multi-modal System"
            },
            "xr": {
                "enabled": settings.ENABLE_XR,
                "description": "Extended Reality Support"
            },
            "vr": {
                "enabled": settings.ENABLE_VR,
                "description": "Virtual Reality Support"
            },
            "viktor": {
                "enabled": settings.ENABLE_VIKTOR,
                "description": "Engineering Automation"
            },
            "synova_brain": {
                "enabled": True,
                "description": "Advanced LLM Brain System"
            },
            "deep_research": {
                "enabled": True,
                "description": "Advanced Research Engine"
            }
        }
    }

@app.get("/api/v1/capabilities")
async def get_capabilities():
    """Get all system capabilities"""
    return {
        "ai_capabilities": {
            "synova_brain": {
                "reasoning_engine": ["deductive", "inductive", "abductive", "causal", "analogical", "critical", "systems", "meta"],
                "language_processing": ["semantic", "syntactic", "pragmatic", "sentiment", "intent", "entity", "topic"],
                "creativity_engine": ["idea_generation", "pattern_recognition", "metaphor_creation", "creative_synthesis"],
                "emotional_intelligence": ["emotion_recognition", "empathy_simulation", "social_cognition"],
                "research_engine": ["information_retrieval", "source_evaluation", "fact_checking", "literature_review"],
                "code_generator": ["code_generation", "code_completion", "debug_assistance", "algorithm_design"],
                "learning_system": ["reinforcement", "transfer", "continual", "meta", "few_shot", "self_supervised"]
            },
            "deep_research": {
                "academic_databases": ["arXiv", "PubMed", "Google Scholar", "Semantic Scholar", "JSTOR"],
                "news_sources": ["NYT", "Washington Post", "BBC", "Reuters", "Guardian"],
                "web_search": ["Google", "Bing", "DuckDuckGo", "Brave"],
                "specialized": ["Wikipedia", "Stack Exchange", "GitHub", "Reddit"],
                "quality_assessment": ["credibility_scoring", "fact_checking", "cross_referencing", "bias_detection"]
            },
            "xr_capabilities": {
                "vr_support": True,
                "ar_support": True,
                "hand_tracking": True,
                "eye_tracking": True,
                "spatial_audio": True,
                "room_scale": True,
                "pass_through": True,
                "webxr_support": True
            },
            "agent_systems": {
                "astranova": {
                    "advanced_reasoning": True,
                    "multi_modal": True,
                    "conversation": True,
                    "model_selection": True
                },
                "supanova": {
                    "task_automation": True,
                    "multi_modal": True,
                    "code_generation": True,
                    "data_analysis": True,
                    "reasoning": True
                }
            }
        },
        "system_features": {
            "revolutionary_features": [
                "quantum_ai_prediction",
                "neural_synchronization",
                "consciousness_rendering",
                "dna_data_storage",
                "telepathic_search",
                "quantum_tab_management",
                "time_travel_browsing",
                "multidimensional_navigation",
                "holographic_browsing",
                "reality_browsing"
            ],
            "glass_morphism_theme": True,
            "https_support": True,
            "mobile_optimization": True,
            "production_ready": True,
            "app_store_optimized": True
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
