from langchain_groq import ChatGroq
from ..core.settings import settings

llm = ChatGroq(
    model="openai/gpt-oss-120b",
    temperature=0,
    api_key=settings.GROQ_API_KEY
)

