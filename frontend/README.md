# DocuMind AI — Premium Frontend

A modern, production-grade AI SaaS web application for **DocuMind AI** (Enterprise Document Intelligence & RAG Platform).

Built with **React**, **Vite**, **JavaScript**, **Axios**, **React Router**, and tailored **Vanilla CSS Design System**.

---

## 🌟 Key Features

1. **Enterprise AI SaaS Dashboard**:
   - Live summary metrics (Total Indexed Documents, AI Queries Executed, Vector Store Status).
   - Welcome banner with direct quick-action buttons.
   - Recent documents grid and recent conversation logs.
   - Live RAG pipeline status indicator (communicating Hybrid BM25, ChromaDB, and HyDE).

2. **Document Management & Drag-and-Drop Ingestion**:
   - Sleek drag-and-drop zone with animated hover states.
   - PDF validation (`application/pdf`, `.pdf` extensions).
   - Real-time upload progress and embedding generation status.
   - Document listing cards with creation dates, file formats, and status chips.
   - Search filter to instantly find indexed files by filename.
   - Delete confirmation modal with background blur and instant cache invalidation.

3. **Intelligent AI Chat Interface**:
   - Document selector dropdown to query any specific knowledge base.
   - Conversational chat bubbles with role-based styling (user vs. DocuMind AI Bot).
   - Context citation section displaying sources with page references.
   - One-click copy for AI answers.
   - Typing dots animation during RAG hybrid search & LLM generation.
   - Keyboard shortcuts: `Enter` to submit, `Shift + Enter` for newlines.
   - Suggested prompts for fast exploration of newly indexed documents.

4. **Query History & Conversation Records**:
   - Chronological log of past inquiries (newest first).
   - Search filter across both user questions, AI answers, and document titles.
   - Mapped document badges and exact timestamps.
   - Direct button to re-open any document in the AI Chat interface.

5. **JWT Authentication & Profile Management**:
   - Secure Login (`POST /login`) with error feedback (incorrect password, user not found).
   - Registration (`POST /register`) with client & server validation (duplicate email conflict handling, 8-character password constraint).
   - Automatic `Authorization: Bearer <token>` injection via Axios interceptors.
   - Auto-session timeout handling with automatic redirect to login.

6. **Responsive Layout**:
   - Collapsible slide-out drawer on mobile and tablet viewports.
   - Hamburger navigation toggle with backdrop blur overlay.
   - Fully optimized across mobile (375px), tablet (768px), and desktop (1024px+).

---

## 🚀 Getting Started

### 1. Start the FastAPI Backend
Ensure your Python virtual environment is activated and PostgreSQL is running:
```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Start the Frontend
From the repository root or the `frontend/` directory:
```bash
npm run dev
# or
npm --prefix frontend run dev
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173) in your browser.

---

## 🛠️ API Proxy Configuration

The frontend Vite server is pre-configured with a development proxy in `vite.config.js`:
- Direct calls to `/api/*` are routed seamlessly to `http://127.0.0.1:8000/*`.
- This eliminates CORS constraints in all browsers during local testing while strictly preserving the backend as-is.
