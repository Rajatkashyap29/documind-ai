from fastapi import FastAPI


from app.models.user_model import User
from app.models.document_model import Document
from .core.database import Base,engine
from .routes import user_routes,document_routes

app = FastAPI(
    title="DocuMind AI",
    description="Enterprise Document Intelligence & RAG Platform",
    version="1.0.0",
)
app.include_router(user_routes.router)
app.include_router(document_routes.router)
Base.metadata.create_all(bind=engine)




@app.get("/health")
def health_check():
    return {"status": "healthy"}