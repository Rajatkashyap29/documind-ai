from langchain_text_splitters import RecursiveCharacterTextSplitter

def text_splitter(documents):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size = 500,
        chunk_overlap = 50
    )
    chunks = splitter.split_documents(documents)
    
    
    return chunks