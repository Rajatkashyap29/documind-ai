import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History as HistoryIcon,
  Search,
  Calendar,
  FileText,
  HelpCircle,
  Sparkles,
  BotMessageSquare,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';
import { chatAPI, documentsAPI } from '../api/api';
import { useToast } from '../context/ToastContext';
import EmptyState from '../components/EmptyState';
import { SkeletonCard } from '../components/Loading';
import '../styles/history.css';

export default function History() {
  const [history, setHistory] = useState([]);
  const [docMap, setDocMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const navigate = useNavigate();
  const toast = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [historyData, docsData] = await Promise.allSettled([
        chatAPI.getHistory(),
        documentsAPI.getAll(),
      ]);

      if (historyData.status === 'fulfilled' && Array.isArray(historyData.value)) {
        setHistory(historyData.value);
      }

      if (docsData.status === 'fulfilled' && Array.isArray(docsData.value)) {
        const map = {};
        docsData.value.forEach((d) => {
          map[d.id] = d.filename;
        });
        setDocMap(map);
      }
    } catch (err) {
      toast.error('Failed to load inquiry history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  const handleCopyAnswer = async (id, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
    }
  };

  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return history;
    const q = searchQuery.toLowerCase();
    return history.filter(
      (item) =>
        item.question?.toLowerCase().includes(q) ||
        item.answer?.toLowerCase().includes(q) ||
        docMap[item.document_id]?.toLowerCase().includes(q)
    );
  }, [history, searchQuery, docMap]);

  return (
    <div className="history-page-layout">
      {/* Header and Search */}
      <div className="history-header-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Total Inquiries: <strong>{history.length}</strong>
          </span>
        </div>

        <div className="history-search-wrap">
          <div className="input-wrapper">
            <span className="input-icon-left">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-input has-left-icon"
              placeholder="Search past questions or answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            className="btn btn-secondary btn-icon"
            onClick={loadData}
            title="Refresh history"
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? 'spinner' : ''} />
          </button>
        </div>
      </div>

      {/* History Items Feed */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : filteredHistory.length === 0 ? (
        <EmptyState
          icon={HistoryIcon}
          title={searchQuery ? 'No matching inquiries found' : 'No conversations yet'}
          description={
            searchQuery
              ? `No inquiries match "${searchQuery}". Try different keywords or clear the search.`
              : 'Start asking questions about your documents to build your conversation record.'
          }
          actionText={searchQuery ? 'Clear Filter' : 'Start Asking Questions'}
          onAction={searchQuery ? () => setSearchQuery('') : () => navigate('/chat')}
        />
      ) : (
        <div className="history-list">
          {filteredHistory.map((item) => {
            const docName = docMap[item.document_id] || `Document #${item.document_id}`;
            const isCopied = copiedId === item.id;

            return (
              <div key={item.id} className="history-card">
                <div className="history-card-header">
                  <div className="history-doc-badge">
                    <FileText size={14} />
                    <span>{docName}</span>
                  </div>

                  <div className="history-timestamp">
                    <Calendar size={13} />
                    <span>{formatDate(item.created_at)}</span>
                  </div>
                </div>

                {/* Question */}
                <div className="history-question-box">
                  <div className="history-q-icon">
                    <HelpCircle size={16} />
                  </div>
                  <h4 className="history-question-text">{item.question}</h4>
                </div>

                {/* Answer */}
                <div className="history-answer-box">
                  <div className="history-a-icon">
                    <Sparkles size={16} />
                  </div>
                  <div className="history-answer-text">{item.answer}</div>
                </div>

                {/* Action Buttons */}
                <div className="history-card-footer">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleCopyAnswer(item.id, item.answer)}
                    title="Copy response"
                  >
                    {isCopied ? (
                      <>
                        <Check size={14} style={{ color: 'var(--accent-emerald)' }} />
                        <span style={{ color: 'var(--accent-emerald)' }}>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy Answer</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => navigate(`/chat?document_id=${item.document_id}`)}
                    title="Query this document again"
                  >
                    <BotMessageSquare size={14} />
                    <span>Open in AI Chat</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
