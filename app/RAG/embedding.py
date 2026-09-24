from langchain_huggingface import HuggingFaceEmbeddings




embedding = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

def embed_documents(chunks):
    embedding = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2")
    
    embeddings = embedding.embed_documents(
        [chunk.page_content for chunk in chunks]
    )
    
    return embeddings
    
    

    
    