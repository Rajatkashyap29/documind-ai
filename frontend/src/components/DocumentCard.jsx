import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, Trash2, BotMessageSquare, Sparkles } from 'lucide-react';

export default function DocumentCard({ document, onDeleteRequest }) {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const handleOpenChat = () => {
    navigate(`/chat?document_id=${document.id}`);
  };

  return (
    <div className="doc-card">
      <div className="doc-card-top">
        <div className="doc-card-icon-title">
          <div className="doc-icon-large">
            <FileText size={24} />
          </div>
          <div className="doc-title-area">
            <h4 className="doc-title" title={document.filename}>
              {document.filename}
            </h4>
            <div className="doc-meta-row">
              <div className="doc-meta-item">
                <Calendar size={13} />
                <span>{formatDate(document.uploaded_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="doc-card-status-row">
        <span className="badge badge-success">
          <span className="pulse-dot dot-success" />
          {document.status || 'Indexed'}
        </span>
        <span
          style={{
            fontSize: '0.78rem',
            color: 'var(--text-dim)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {document.file_type || 'application/pdf'}
        </span>
      </div>

      <div className="doc-actions-row">
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={() => onDeleteRequest(document)}
          title="Delete document"
        >
          <Trash2 size={15} />
          <span>Delete</span>
        </button>

        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={handleOpenChat}
          title="Open AI Chat with this document"
        >
          <BotMessageSquare size={15} />
          <span>Ask AI</span>
        </button>
      </div>
    </div>
  );
}
