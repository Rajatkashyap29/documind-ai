from langchain_core.prompts import ChatPromptTemplate
from .llm import llm

prompt = ChatPromptTemplate.from_template(
    """
    Rewrite the user's question into a clear and specific search query
    for retrieving relevant information from a document.

    Return only the rewritten query.

    User Question:
    {question}
    """
)

def enhance_query(question: str):
    messages = prompt.format_messages(question=question)
    response = llm.invoke(messages)

    return response.content.strip()