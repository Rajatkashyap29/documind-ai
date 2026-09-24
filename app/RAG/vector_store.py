from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings


embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


def create_vector_store(chunks):
    vector_store = Chroma.from_documents(
        documents=chunks,
        embedding=embedding_model,
        persist_directory="./chroma_db",
        collection_name="documind_documents"
    )

    return vector_store