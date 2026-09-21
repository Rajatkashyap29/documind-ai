from fastapi import FastAPI


from app.models.user_model import User
from .core.database import Base,engine
from .routes import user_routes

app = FastAPI(
    title="DocuMind AI",
    description="Enterprise Document Intelligence & RAG Platform",
    version="1.0.0",
)
app.include_router(user_routes.router)
Base.metadata.create_all(bind=engine)




@app.get("/health")
def health_check():
    return {"status": "healthy"}