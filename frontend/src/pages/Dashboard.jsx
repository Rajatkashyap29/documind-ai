import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Files,
  BotMessageSquare,
  UploadCloud,
  FileText,
  Calendar,
  Sparkles,
  ArrowRight,
  Database,
  Layers,
  Cpu,
  Search,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { documentsAPI, chatAPI } from '../api/api';
import { SkeletonCard } from '../components/Loading';
import EmptyState from '../components/EmptyState';
import '../styles/dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadDashboardData = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const [docsData, historyData] = await Promise.allSettled([
          documentsAPI.getAll(),
          chatAPI.getHistory(),
        ]);

        if (isMounted) {
          if (docsData.status === 'fulfilled' && Array.isArray(docsData.value)) {
            setDocuments(docsData.value);
          }
          if (historyData.status === 'fulfilled' && Array.isArray(historyData.value)) {
            setHistory(historyData.value);
          }
        }
      } catch (err) {
        if (isMounted) {
          setFetchError(err.message || 'Failed to load dashboard data');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDashboardData();
    return () => {
      isMounted = false;
    };
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const recentDocs = documents.slice(0, 4);
  const recentConversations = history.slice(0, 4);

  return (
    <div className="dashboard-container">
      {/* Welcome Banner */}
      <section className="welcome-banner">
        <div className="welcome-content">
          <div className="welcome-badge">
            <Sparkles size={14} />
            <span>Document Intelligence Active</span>
          </div>
          <h2 className="welcome-title">
            Welcome back, {user?.name || 'Researcher'}
          </h2>
          <p className="welcome-desc">
            Transform your enterprise PDF documents into an interactive knowledge base powered by hybrid semantic search, BM25 keyword matching, and cross-encoder reranking.
          </p>
        </div>

        <div className="welcome-actions">
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/documents')}
          >
            <UploadCloud size={17} />
            <span>Upload PDF</span>
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/chat')}
          >
            <BotMessageSquare size={17} />
            <span>Start AI Chat</span>
          </button>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-box metric-icon-indigo">
            <Files size={24} />
          </div>
          <div className="metric-details">
            <span className="metric-value">{documents.length}</span>
            <span className="metric-label">Indexed Documents</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box metric-icon-emerald">
            <MessageSquare size={24} />
          </div>
          <div className="metric-details">
            <span className="metric-value">{history.length}</span>
            <span className="metric-label">AI Queries Executed</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box metric-icon-cyan">
            <Database size={24} />
          </div>
          <div className="metric-details">
            <span className="metric-value">Active</span>
            <span className="metric-label">ChromaDB Vector Store</span>
          </div>
        </div>
      </section>

      {/* Two Column Grid: Recent Documents & Recent AI Queries */}
      <section className="dashboard-columns">
        {/* Left Column: Recent Documents */}
        <div className="section-panel">
          <div className="section-panel-header">
            <h3 className="panel-title">
              <Files size={18} style={{ color: 'var(--primary-400)' }} />
              <span>Recent Documents</span>
            </h3>
            <Link to="/documents" className="btn btn-ghost btn-sm">
              <span>View all</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : recentDocs.length === 0 ? (
            <EmptyState
              icon={UploadCloud}
              title="No documents indexed yet"
              description="Upload your first PDF document to build your vector knowledge base."
              actionText="Upload Document"
              onAction={() => navigate('/documents')}
            />
          ) : (
            <div className="recent-items-list">
              {recentDocs.map((doc) => (
                <div key={doc.id} className="recent-doc-row">
                  <div className="recent-doc-left">
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        background: 'rgba(244, 63, 94, 0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FB7185',
                        flexShrink: 0,
                      }}
                    >
                      <FileText size={16} />
                    </div>
                    <div>
                      <div className="recent-doc-name" title={doc.filename}>
                        {doc.filename}
                      </div>
                      <div className="recent-doc-date">
                        {formatDate(doc.uploaded_at)}
                      </div>
                    </div>
                  </div>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => navigate(`/chat?document_id=${doc.id}`)}
                    title="Ask AI about this document"
                  >
                    <BotMessageSquare size={14} />
                    <span>Ask AI</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Recent Conversations */}
        <div className="section-panel">
          <div className="section-panel-header">
            <h3 className="panel-title">
              <BotMessageSquare size={18} style={{ color: '#34D399' }} />
              <span>Recent AI Inquiries</span>
            </h3>
            <Link to="/history" className="btn btn-ghost btn-sm">
              <span>View all</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : recentConversations.length === 0 ? (
            <EmptyState
              icon={BotMessageSquare}
              title="No questions asked yet"
              description="Select any document and ask questions to view your inquiry history here."
              actionText="Start AI Chat"
              onAction={() => navigate('/chat')}
            />
          ) : (
            <div className="recent-items-list">
              {recentConversations.map((item) => (
                <div
                  key={item.id}
                  className="recent-chat-row"
                  onClick={() => navigate(`/chat?document_id=${item.document_id}`)}
                  style={{ cursor: 'pointer' }}
                  title="Click to open chat with this document"
                >
                  <div className="recent-chat-q">
                    <Search size={14} style={{ color: 'var(--primary-400)', flexShrink: 0 }} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.question}
                    </span>
                  </div>
                  <div className="recent-chat-a">{item.answer}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* RAG Engine Highlights Strip */}
      <section className="rag-features-strip">
        <div className="rag-feature-item">
          <div className="feature-dot-icon">
            <Search size={16} />
          </div>
          <div className="feature-texts">
            <span className="feature-title">BM25 Hybrid Retrieval</span>
            <span className="feature-desc">Combines dense vector similarity with sparse keyword precision</span>
          </div>
        </div>

        <div className="rag-feature-item">
          <div className="feature-dot-icon">
            <Layers size={16} />
          </div>
          <div className="feature-texts">
            <span className="feature-title">Cross-Encoder Rerank</span>
            <span className="feature-desc">Re-scores candidate chunks using ms-marco-MiniLM model</span>
          </div>
        </div>

        <div className="rag-feature-item">
          <div className="feature-dot-icon">
            <Cpu size={16} />
          </div>
          <div className="feature-texts">
            <span className="feature-title">Query Enhancement & HyDE</span>
            <span className="feature-desc">Hypothetical Document Embeddings for semantic depth</span>
          </div>
        </div>
      </section>
    </div>
  );
}
