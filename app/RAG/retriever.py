from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from sentence_transformers import CrossEncoder

embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

reranker = CrossEncoder(
    "cross-encoder/ms-marco-MiniLM-L-6-v2"
)


def get_vector_store():
    vector_store = Chroma(
        persist_directory="./chroma_db",
        collection_name="documind_documents",
        embedding_function=embedding_model
    )

    return vector_store


def retrieve_documents(
    query: str,
    document_id: int,
    k: int = 10
):
    vector_store = get_vector_store()

    documents = vector_store.similarity_search(
        query,
        k=k,
        filter={"document_id": document_id}
    )
    
    pairs = [
    (query, document.page_content)
    for document in documents
    ]
    
    scores = reranker.predict(pairs)
    
    ranked_documents = sorted(
    zip(documents, scores),
    key=lambda x: x[1],
    reverse=True
    )
    
    top_documents = [
    document
    for document, score in ranked_documents[:3]
    ]

    return top_documents