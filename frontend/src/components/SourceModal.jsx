import React from 'react';
import { BookOpen, FileText, Bookmark, X, ExternalLink, ShieldCheck } from 'lucide-react';

export default function SourceModal({ source, isOpen, onClose }) {
  if (!isOpen || !source) return null;

  const getReadableFilename = (rawSource) => {
    if (!rawSource) return 'Uploaded Document';
    const parts = rawSource.replace(/\\/g, '/').split('/');
    const lastPart = parts[parts.length - 1];
    const uuidRegex = /^[0-9a-fA-F-]{36}_/;
    return lastPart.replace(uuidRegex, '');
  };

  const filename = getReadableFilename(source?.source);
  const pageNum =
    source?.page !== undefined && source?.page !== null
      ? typeof source.page === 'number'
        ? source.page + 1
        : source.page
      : 'N/A';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '520px' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-400)',
              }}
            >
              <BookOpen size={20} />
            </div>
            <div>
              <h3 className="modal-title" style={{ fontSize: '1.05rem' }}>
                Citation Inspector
              </h3>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                RAG Document Reference
              </span>
            </div>
          </div>

          <button
            type="button"
            className="btn-ghost"
            onClick={onClose}
            style={{ padding: '6px', border: 'none', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: '16px 0' }}>
          {/* Document Details Card */}
          <div
            style={{
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(244, 63, 94, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FB7185',
                }}
              >
                <FileText size={18} />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#FFF' }}>
                  {filename}
                </div>
                <div
                  style={{
                    fontSize: '0.74rem',
                    color: 'var(--text-dim)',
                    fontFamily: 'var(--font-mono)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={source?.source}
                >
                  {source?.source}
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '10px',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Citation Page:
              </span>
              <span className="badge badge-primary">
                <Bookmark size={12} />
                Page {pageNum}
              </span>
            </div>
          </div>

          {/* RAG Verification Note */}
          <div
            style={{
              padding: '12px 14px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              fontSize: '0.82rem',
              color: '#A7F3D0',
              lineHeight: 1.45,
            }}
          >
            <ShieldCheck size={18} style={{ flexShrink: 0, marginTop: '2px', color: '#34D399' }} />
            <span>
              This chunk was retrieved from ChromaDB vector index and BM25 search, then prioritized by the Cross-Encoder reranker to formulate the AI response.
            </span>
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
