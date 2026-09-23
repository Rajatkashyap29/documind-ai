from ..auth.dependencies import get_current_user
from ..core.database import get_db
from fastapi import APIRouter, Depends, File,Header, UploadFile
from sqlalchemy.orm import Session
from  ..schemas.document_schemas import DocumentResponse
from ..models.user_model import User

from ..services.document_services import FileUpload,ViewAllDocumnets



router = APIRouter(tags=["Documind AI"])

@router.post(
    "/upload",
    response_model=DocumentResponse
)
def upload_file(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),database: Session = Depends(get_db)):
    
    return FileUpload(file,user,database)

@router.get('/documents')
def seedocuments(user:User = Depends(get_current_user),database:Session = Depends(get_db)):
    return ViewAllDocumnets(user,database)