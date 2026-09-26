from langchain_core.prompts import ChatPromptTemplate
from .retriever import retrieve_documents
from .llm import llm


prompt = ChatPromptTemplate.from_template(
    """
    You are a helpful document assistant.

    Answer the user's question using only the provided context.

    If the answer is not present in the context, say:
    "I could not find this information in the uploaded documents."

    Context:
    {context}

    Question:
    {question}
    """
)

def ask_question(question:str):
    documents = retrieve_documents(question)
    
    context = "\n\n".join(
    document.page_content
    for document in documents
    )
    
    messages = prompt.format_messages(
        context=context,
        question=question
    )
    
    response = llm.invoke(messages)
    
    return {
        "answer": response.content,
        "sources": [
            {
                "source": doc.metadata.get("source"),
                "page": doc.metadata.get("page")
            }
            for doc in documents
        ]
    }