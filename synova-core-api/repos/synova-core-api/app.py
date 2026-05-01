#!/usr/bin/env python3
# 🧠 SYNOVA AI - HUGGINGFACE SPACES DEPLOYMENT
# Pure Knowledge Brain hosted on HuggingFace Spaces

import os
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.api.pure_knowledge_api import app

# HuggingFace Spaces configuration
if __name__ == "__main__":
    import uvicorn
    
    # Get port from environment or default to 7860 (HF Spaces default)
    port = int(os.environ.get("PORT", 7860))
    
    # Run with optimizations for HF Spaces
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        workers=1,  # Single worker for brain consistency
        log_level="info"
    )
