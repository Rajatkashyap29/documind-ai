import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Bot,
  User as UserIcon,
  Copy,
  Check,
  FileText,
  Bookmark,
  BookOpen,
} from 'lucide-react';

export default function ChatMessage({ message, onSourceClick }) {
  const [copied, setCopied] = useState(false);
  const isAi = message.role === 'ai';

  const formatTime = (timeString) => {
    if (!timeString) return '';
    try {
      const d = new Date(timeString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Extract a readable file name from source path (e.g. "uploads/uuid_filename.pdf")
  const getReadableFilename = (rawSource) => {
    if (!rawSource) return 'Uploaded Document';
    const parts = rawSource.replace(/\\/g, '/').split('/');
    const lastPart = parts[parts.length - 1];
    const uuidRegex = /^[0-9a-fA-F-]{36}_/;
    return lastPart.replace(uuidRegex, '');
  };

  return (
    <div className={`chat-msg-row ${isAi ? 'ai-row' : 'user-row'}`}>
      <div className="chat-avatar-circle">
        {isAi ? <Bot size={19} /> : <UserIcon size={17} />}
      </div>

      <div className="chat-bubble-container">
        <span className="msg-sender-label">
          {isAi ? 'AI Assistant' : 'You'}
        </span>

        <div className="chat-bubble">
          {isAi ? (
            <div className="prose-answer">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          ) : (
            <p style={{ margin: 0 }}>{message.content}</p>
          )}

          {/* Sources Section directly below AI Answer */}
          {isAi && message.sources && message.sources.length > 0 && (
            <div className="msg-sources-block">
              <div className="msg-sources-header">
                <BookOpen size={13} style={{ color: 'var(--primary-400)' }} />
                <span>Sources ({message.sources.length})</span>
              </div>

              <div className="msg-sources-list">
                {message.sources.map((src, index) => {
                  const filename = getReadableFilename(src?.source);
                  const pageNum =
                    src?.page !== undefined && src?.page !== null
                      ? typeof src.page === 'number'
                        ? src.page + 1
                        : src.page
                      : null;

                  return (
                    <div
                      key={index}
                      className="source-item-card"
                      onClick={() => onSourceClick && onSourceClick(src)}
                      style={{ cursor: onSourceClick ? 'pointer' : 'default' }}
                      title={`Source: ${src?.source || filename}`}
                    >
                      <div className="source-item-left">
                        <FileText size={15} style={{ color: '#FB7185', flexShrink: 0 }} />
                        <span className="source-item-title">{filename}</span>
                      </div>

                      {pageNum && (
                        <span
                          className="badge badge-primary"
                          style={{
                            fontSize: '0.72rem',
                            padding: '2px 8px',
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
                })}
              </div>
            </div>
          )}

          {/* Action Footer for AI message */}
          {isAi && (
            <div className="bubble-action-footer">
              <button
                type="button"
                className="bubble-copy-btn"
                onClick={handleCopy}
                title="Copy answer"
              >
                {copied ? (
                  <>
                    <Check size={13} style={{ color: 'var(--accent-emerald)' }} />
                    <span style={{ color: 'var(--accent-emerald)' }}>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy</span>
                  </>
                )}
              </button>

              {message.timestamp && (
                <span className="msg-timestamp">{formatTime(message.timestamp)}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
