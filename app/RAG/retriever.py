from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings


embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


def get_vector_store():
    vector_store = Chroma(
        persist_directory="./chroma_db",
        collection_name="documind_documents",
        embedding_function=embedding_model
    )

    return vector_store


def retrieve_documents(query: str, k: int = 3):
    vector_store = get_vector_store()

    documents = vector_store.similarity_search(
        query,
        k=k
    )

    return documents