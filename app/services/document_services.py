import shutil
from uuid import uuid4

from fastapi import Depends, File,HTTPException,Header, UploadFile
from pathlib import Path
from sqlalchemy.orm import Session
from jose import jwt,JWTError

from app.auth.dependencies import get_current_user
from app.models.document_model import Document

from ..core.database import get_db
from ..core.settings import settings
from ..models.user_model import User
from ..auth.hashingpwd import pwd_context
from ..auth.JWTAuth import create_access_token


UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


def FileUpload(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    database: Session = Depends(get_db)
):

    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="File Type Should be PDF"
        )


    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF Files Are Allowed"
        )


    filename = file.filename

    stored_filename = f"{uuid4()}_{filename}"

    file_path = UPLOAD_DIR / stored_filename

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    document = Document(
        user_id=user.id,
        filename=filename,
        file_path=str(file_path),
        file_type=file.content_type,
        status="uploaded"
    )

    database.add(document)
    database.commit()
    database.refresh(document)

    return document

def ViewAllDocumnets(user:User = Depends(get_current_user),database:Session = Depends(get_db)):
    document = database.query(Document).filter(Document.user_id == user.id).all()
    
    return document 

def RemoveDocs(id:int,user:User = Depends(get_current_user),database:Session = Depends(get_db)):
    document = database.query(Document).filter(Document.id == id).first()
    
    if not document:
        raise HTTPException(
            detail="Document Not Found",
            status_code=404
        )
    
    if document.user_id != user.id  :
        raise HTTPException(
            status_code=401,
            detail= " You are Not AUthorized To delete this Document"
        )
    
    file_path = Path(document.file_path)

    if file_path.exists():
        file_path.unlink()    
    
    database.delete(document)
    database.commit()      
    
    
    return {
        "message": "Document Deleted Successfully"
    }