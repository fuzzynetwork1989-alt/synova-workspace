from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db

router = APIRouter()

@router.get("/")
async def get_chat_history(db: Session = Depends(get_db)):
    """Get chat history."""
    return {"message": "Chat history endpoint - to be implemented"}

@router.post("/")
async def send_message(db: Session = Depends(get_db)):
    """Send chat message."""
    return {"message": "Send message endpoint - to be implemented"}
