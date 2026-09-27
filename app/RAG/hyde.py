from langchain_core.prompts import ChatPromptTemplate
from .llm import llm

prompt = ChatPromptTemplate.from_template(
    """
    Write a short hypothetical answer to the user's question.
    The answer will be used only for document retrieval.

    User Question:
    {question}
    """
)


def generate_hypothetical_answer(question: str):
    messages = prompt.format_messages(question=question)
    response = llm.invoke(messages)

    return response.content.strip()

