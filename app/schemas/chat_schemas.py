from pydantic import BaseModel
from typing import List

class Chatrequest(BaseModel):
    document_id: int
    question: str
    
class ChatResponse(BaseModel):
    answer: str
    sources: List[dict]