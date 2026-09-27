from langchain_core.prompts import ChatPromptTemplate
from .retriever import retrieve_documents
from .llm import llm
from .hyde import generate_hypothetical_answer
from .query_enhancer import enhance_query
from .query_expander import expand_query



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

def ask_question(question: str, document_id: int):
    enhanced_query = enhance_query(question)

    expanded_queries = expand_query(enhanced_query)

    hypothetical_answer = generate_hypothetical_answer(
        enhanced_query
    )

    expanded_queries.append(hypothetical_answer)

    documents = retrieve_documents(
        expanded_queries,
        document_id
    )

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