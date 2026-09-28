from fastapi import APIRouter, Depends,Header
from ..schemas.chat_schemas import Chatrequest,ChatResponse
from ..models.user_model import User
from ..core.database import get_db
from ..auth.dependencies import get_current_user
from sqlalchemy.orm import Session
from ..services.chat_service import Chatting,ViewChatHistory

router = APIRouter(tags=["Documind AI"])

@router.post('/chat',response_model=ChatResponse)
def chat(data:Chatrequest,user:User = Depends(get_current_user),database:Session = Depends(get_db)):
    return Chatting(data,user,database)

@router.get("/history")
def chat_history(user: User = Depends(get_current_user),database: Session = Depends(get_db)):
    return ViewChatHistory(user,database)