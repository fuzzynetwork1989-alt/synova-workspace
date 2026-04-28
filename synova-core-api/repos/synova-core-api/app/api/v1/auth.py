from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db

router = APIRouter()

@router.get("/me")
async def get_current_user(db: Session = Depends(get_db)):
    """Get current user profile."""
    return {"message": "Auth endpoint - to be implemented"}

@router.post("/login")
async def login(db: Session = Depends(get_db)):
    """User login."""
    return {"message": "Login endpoint - to be implemented"}

@router.post("/register")
async def register(db: Session = Depends(get_db)):
    """User registration."""
    return {"message": "Register endpoint - to be implemented"}
