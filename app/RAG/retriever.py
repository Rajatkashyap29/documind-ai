from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from sentence_transformers import CrossEncoder
from rank_bm25 import BM25Okapi
from langchain_core.documents import Document


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
    queries: list[str],
    document_id: int,
    k: int = 10
):
    vector_store = get_vector_store()

    documents = []

    for query in queries:
        results = vector_store.similarity_search(
            query,
            k=k,
            filter={"document_id": document_id}
        )

        documents.extend(results)


    all_documents = vector_store.get(
        where={"document_id": document_id}
    )

    texts = all_documents["documents"]
    metadatas = all_documents["metadatas"]

    tokenized_docs = [
        text.lower().split()
        for text in texts
    ]

    bm25 = BM25Okapi(tokenized_docs)

    for query in queries:
        query_tokens = query.lower().split()

        scores = bm25.get_scores(query_tokens)

        top_indices = scores.argsort()[-k:][::-1]

        for index in top_indices:
            documents.append(
                Document(
                    page_content=texts[index],
                    metadata=metadatas[index]
                )
            )

  
    unique_documents = []
    seen = set()

    for document in documents:
        content = document.page_content

        if content not in seen:
            seen.add(content)
            unique_documents.append(document)

   
    pairs = [
        (query, document.page_content)
        for query in queries
        for document in unique_documents
    ]

    scores = reranker.predict(pairs)


    document_scores = {}

    index = 0

    for query in queries:
        for document in unique_documents:

            score = scores[index]
            index += 1

            doc_key = document.page_content

            if (
                doc_key not in document_scores
                or score > document_scores[doc_key]
            ):
                document_scores[doc_key] = score


    ranked_documents = sorted(
        unique_documents,
        key=lambda document: document_scores[
            document.page_content
        ],
        reverse=True
    )

    return ranked_documents[:3]