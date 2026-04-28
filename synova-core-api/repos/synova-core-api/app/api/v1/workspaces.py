from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db

router = APIRouter()

@router.get("/")
async def get_workspaces(db: Session = Depends(get_db)):
    """Get user workspaces."""
    return {"message": "Workspaces endpoint - to be implemented"}

@router.post("/")
async def create_workspace(db: Session = Depends(get_db)):
    """Create new workspace."""
    return {"message": "Create workspace endpoint - to be implemented"}
