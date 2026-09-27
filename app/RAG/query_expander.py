from langchain_core.prompts import ChatPromptTemplate
from .llm import llm

prompt = ChatPromptTemplate.from_template(
    """
    Generate 3 different search queries for the user's question.

    Make each query focus on a different aspect of the same information.
    Return only the queries, one per line.

    User Question:
    {question}
    """
)

def expand_query(question: str):
    messages = prompt.format_messages(question=question)
    response = llm.invoke(messages)

    queries = response.content.strip().split("\n")

    return [query.strip() for query in queries if query.strip()]

