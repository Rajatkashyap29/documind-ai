from app.RAG.pdf_loader import load_pdf
from app.RAG.chunker import text_splitter
from app.RAG.embedding import embed_documents
from app.RAG.vector_store import create_vector_store
documents = load_pdf(
    "uploads/7a5fb59d-d694-4c83-bcc5-cd2a41ede521_ML_Mid_Sem_Unit_1_2_Notes.pdf"
)

chunks = text_splitter(documents)

vector_store = create_vector_store(chunks)

print("Total chunks:", len(chunks))
print("Vector store created successfully!")