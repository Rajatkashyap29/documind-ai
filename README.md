# DocuMind AI

## Enterprise Document Intelligence & RAG Platform

DocuMind AI is a full-stack **Retrieval-Augmented Generation (RAG)** platform that allows users to securely upload PDF documents, ask questions about their documents, and receive AI-generated answers grounded in the uploaded content.

The platform combines **FastAPI, React, PostgreSQL, ChromaDB, LangChain, Hugging Face embeddings, BM25, HyDE, query expansion, query enhancement, and Cross-Encoder reranking** to build a multi-stage document question-answering system.

---

## Features

- JWT-based user authentication
- Secure password hashing with Passlib and bcrypt
- PDF document upload and management
- User-specific document ownership
- Document-level retrieval isolation
- PDF parsing and intelligent text chunking
- Hugging Face embedding generation
- ChromaDB vector storage
- Semantic vector search
- BM25 keyword search
- Hybrid retrieval
- Query enhancement
- Query expansion
- HyDE-based retrieval
- Cross-Encoder reranking
- AI-powered document question answering
- Source and page references
- Persistent chat history
- React-based dashboard and chat interface
- Dockerized backend

---

## How It Works

DocuMind processes documents and user questions through separate pipelines.

### Document Ingestion

```text
PDF Upload
    ↓
PDF Parsing
    ↓
Text Chunking
    ↓
Metadata Enrichment
    ↓
Embedding Generation
    ↓
ChromaDB
