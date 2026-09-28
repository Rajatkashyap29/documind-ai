

from fastapi import Depends,HTTPException
from sqlalchemy.orm import Session
from ..RAG.rag_chain import ask_question
from app.auth.dependencies import get_current_user
from app.core.database import get_db
from app.models.document_model import Document
from app.models.user_model import User
from app.models.chat_history_model import ChatHistory
from app.schemas.chat_schemas import Chatrequest
from app.models.chat_history_model import ChatHistory


def Chatting(
    data: Chatrequest,
    user: User = Depends(get_current_user),
    database: Session = Depends(get_db)
):
    document = database.query(Document).filter(
        Document.id == data.document_id,
        Document.user_id == user.id
    ).first()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    result = ask_question(
    question=data.question,
    document_id=data.document_id
    )
    
    chat = ChatHistory(
    user_id=user.id,
    document_id=data.document_id,
    question=data.question,
    answer=result["answer"]
)

    database.add(chat)
    database.commit()
    database.refresh(chat)

    return {
        "answer": result["answer"],
        "sources": result["sources"]
    }

def ViewChatHistory(user: User = Depends(get_current_user),database: Session = Depends(get_db)):
    return database.query(ChatHistory).filter(ChatHistory.user_id == user.id).order_by(
        ChatHistory.created_at.desc()
    ).all()