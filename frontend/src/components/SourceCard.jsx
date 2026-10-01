import React from 'react';
import { FileText, Bookmark } from 'lucide-react';

export default function SourceCard({ source, index }) {
  // Extract a readable file name from source path (e.g. "uploads/uuid_filename.pdf")
  const getReadableFilename = (rawSource) => {
    if (!rawSource) return 'Uploaded Document';
    const parts = rawSource.replace(/\\/g, '/').split('/');
    const lastPart = parts[parts.length - 1];
    // Remove UUID prefix if present: "uuid_filename.pdf"
    const uuidRegex = /^[0-9a-fA-F-]{36}_/;
    return lastPart.replace(uuidRegex, '');
  };

  const filename = getReadableFilename(source?.source);
  const pageNum =
    source?.page !== undefined && source?.page !== null
      ? typeof source.page === 'number'
        ? source.page + 1
        : source.page
      : null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 12px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 'var(--radius-md)',
        transition: 'all 0.15s ease',
      }}
      className="source-card-item"
    >
      <div
        style={{
          width: '26px',
          height: '26px',
          borderRadius: '6px',
          background: 'rgba(99, 102, 241, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--primary-400)',
          flexShrink: 0,
        }}
      >
        <FileText size={14} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '0.82rem',
            fontWeight: 600,
            color: 'var(--text-main)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          title={filename}
        >
          {filename}
        </div>
      </div>

      {pageNum && (
        <span
          className="badge badge-primary"
          style={{
            fontSize: '0.72rem',
            padding: '2px 7px',
            fontFamily: 'var(--font-mono)',
            flexShrink: 0,
          }}
        >
          <Bookmark size={11} />
          Page {pageNum}
        </span>
      )}
    </div>
  );
}
