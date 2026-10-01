import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowUp,
  Sparkles,
  Bot,
  FileText,
  RotateCcw,
  HelpCircle,
  BarChart3,
  BookOpen,
  Database,
  Layers,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import ChatMessage from './ChatMessage';
import SourceModal from './SourceModal';
import { chatAPI } from '../api/api';
import { useToast } from '../context/ToastContext';
import '../styles/chat.css';

export default function ChatWindow({
  documents = [],
  selectedDocId,
  onSelectDocId,
}) {
  const [messages, setMessages] = useState([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [inspectingSource, setInspectingSource] = useState(null);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const toast = useToast();

  const selectedDocument = documents.find(
    (d) => String(d.id) === String(selectedDocId)
  );

  // Auto-scroll when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  // Adjust textarea height dynamically
  const handleInputChange = (e) => {
    setInputQuestion(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async (questionToSend) => {
    const question = (questionToSend || inputQuestion).trim();
    if (!question || isGenerating) return;

    if (!selectedDocId) {
      toast.error('Please select an active document first.');
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: question,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuestion('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setIsGenerating(true);

    try {
      const response = await chatAPI.send({
        document_id: selectedDocId,
        question: question,
      });

      const aiMessage = {
        id: Date.now() + 1,
        role: 'ai',
        content: response.answer || 'I could not find this information in the uploaded document.',
        sources: response.sources || [],
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errMsg = err.message || 'Failed to retrieve AI answer.';
      toast.error(errMsg);

      const errorAiMessage = {
        id: Date.now() + 1,
        role: 'ai',
        content: `I encountered an issue retrieving the answer: ${errMsg}. Please verify that the document is properly indexed.`,
        sources: [],
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorAiMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleResetConversation = () => {
    setMessages([]);
    toast.info('Conversation dialogue reset.');
  };

  const suggestedQuestions = [
    {
      title: 'Executive Summary',
      desc: 'Summarize the main points and core objectives...',
      prompt: 'Provide an executive summary of this document, highlighting its core points and objectives.',
      icon: Sparkles,
    },
    {
      title: 'Key Terms & Policies',
      desc: 'What are the important terms, rules or definitions?',
      prompt: 'What are the key terms, policies, rules, and definitions specified in this document?',
      icon: HelpCircle,
    },
    {
      title: 'Data & Metrics',
      desc: 'Extract important numbers, dates and statistics...',
      prompt: 'Extract all important numerical data, dates, metrics, and statistics mentioned in the document.',
      icon: BarChart3,
    },
  ];

  return (
    <div className="chat-workspace-wrapper">
      {/* =========================================================
          1. Left Column: Document Context Panel
          ========================================================= */}
      <aside className="chat-context-panel">
        {/* Active Document Card */}
        <div className="active-doc-card">
          <div className="active-doc-header">
            <span className="active-doc-label">
              <span className="active-doc-icon-box">
                <FileText size={15} />
              </span>
              <span>Active Document</span>
            </span>

            <span className="doc-status-badge">
              <span className="pulse-dot dot-success" />
              <span>Indexed</span>
            </span>
          </div>

          {/* Document Selector if multiple documents exist */}
          {documents.length > 1 && (
            <div className="doc-selector-container">
              <label htmlFor="doc-select-picker" className="doc-selector-label">
                Switch Document:
              </label>
              <select
                id="doc-select-picker"
                className="doc-selector-dropdown"
                value={selectedDocId || ''}
                onChange={(e) => onSelectDocId(e.target.value)}
              >
                {documents.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.filename}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Active Document Name */}
          <h3 className="active-doc-filename" title={selectedDocument?.filename}>
            {selectedDocument?.filename || 'No document selected'}
          </h3>

          {/* RAG & Vector Store Info */}
          <div className="active-doc-specs">
            <div className="spec-item">
              <span className="spec-key">
                <Database size={13} />
                <span>Vector Store</span>
              </span>
              <span className="spec-val">ChromaDB</span>
            </div>

            <div className="spec-item">
              <span className="spec-key">
                <Layers size={13} />
                <span>Search Mode</span>
              </span>
              <span className="spec-val">Hybrid + Reranking</span>
            </div>
          </div>

          {/* Reset Conversation Button */}
          <button
            type="button"
            className="reset-convo-btn"
            onClick={handleResetConversation}
            title="Clear the current conversation dialogue"
          >
            <RotateCcw size={14} />
            <span>Reset conversation</span>
          </button>
        </div>

        {/* Suggested Questions Section */}
        <div className="suggested-section">
          <span className="suggested-section-title">
            <Sparkles size={14} style={{ color: 'var(--primary-400)' }} />
            <span>Suggested questions</span>
          </span>

          <div className="suggested-cards-stack">
            {suggestedQuestions.map((q, idx) => {
              const Icon = q.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  className="suggested-card-btn"
                  onClick={() => handleSend(q.prompt)}
                  disabled={isGenerating}
                >
                  <div className="suggested-card-header">
                    <span className="suggested-card-title">
                      <Icon size={14} className="suggested-card-title-icon" />
                      <span>{q.title}</span>
                    </span>
                    <ChevronRight size={13} style={{ color: 'var(--text-dim)' }} />
                  </div>
                  <span className="suggested-card-desc">{q.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* =========================================================
          2. Right Column: Chat Conversation Canvas
          ========================================================= */}
      <section className="chat-conversation-canvas">
        {/* Top Header of Chat Canvas */}
        <div className="chat-canvas-header">
          <div className="chat-header-left">
            <div className="assistant-avatar-pill">
              <Bot size={18} />
            </div>
            <div className="assistant-meta">
              <span className="assistant-name">AI Assistant</span>
              <span className="assistant-status">
                <span className="pulse-dot dot-success" />
                <span>Context Grounded</span>
              </span>
            </div>
          </div>

          <div className="chat-header-right">
            <div className="rag-tech-pill">
              <Layers size={12} />
              <span>Hybrid Search + Reranking</span>
            </div>
          </div>
        </div>

        {/* Chat Messages Feed */}
        <div className="chat-messages-scroll">
          {messages.length === 0 ? (
            /* Empty Chat State */
            <div className="empty-chat-canvas">
              <div className="empty-sparkle-badge">
                <Sparkles size={30} />
              </div>

              <h2 className="empty-chat-heading">Ask your document anything</h2>

              <p className="empty-chat-description">
                Your AI assistant can help you understand the selected document{' '}
                <strong style={{ color: '#FFFFFF' }}>
                  {selectedDocument?.filename}
                </strong>
                . Answers are synthesized strictly from retrieved passages.
              </p>

              <button
                type="button"
                className="empty-quick-prompt-btn"
                onClick={() =>
                  handleSend(
                    'What are the main concepts and principles discussed in this document?'
                  )
                }
              >
                <span>Try asking: "What are the main concepts?"</span>
                <ChevronRight size={14} />
              </button>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  onSourceClick={(source) => setInspectingSource(source)}
                />
              ))}

              {/* AI Loading State */}
              {isGenerating && (
                <div className="chat-msg-row ai-row">
                  <div className="chat-avatar-circle">
                    <Bot size={19} />
                  </div>
                  <div className="chat-bubble-container">
                    <span className="msg-sender-label">AI Assistant</span>
                    <div className="ai-loading-box">
                      <div className="thinking-dots">
                        <span className="thinking-dot" />
                        <span className="thinking-dot" />
                        <span className="thinking-dot" />
                      </div>
                      <span className="thinking-text">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Composer */}
        <div className="chat-composer-container">
          <div className="chat-composer-box">
            <textarea
              ref={textareaRef}
              rows={1}
              className="chat-composer-textarea"
              placeholder={
                selectedDocument
                  ? `Ask a question about ${selectedDocument.filename}...`
                  : 'Select a document to start asking questions...'
              }
              value={inputQuestion}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={!selectedDocId || isGenerating}
            />

            <button
              type="button"
              className="chat-composer-send-btn"
              onClick={() => handleSend()}
              disabled={!selectedDocId || !inputQuestion.trim() || isGenerating}
              title="Send question"
            >
              {isGenerating ? (
                <span
                  className="spinner spinner-sm"
                  style={{ borderTopColor: '#FFFFFF' }}
                />
              ) : (
                <ArrowUp size={19} />
              )}
            </button>
          </div>

          <div className="composer-hint-row">
            <span>
              {selectedDocument
                ? `Target: ${selectedDocument.filename}`
                : 'No document active'}
            </span>
            <span>Press Enter to send • Shift+Enter for new line</span>
          </div>
        </div>
      </section>

      {/* Citation Inspector Modal */}
      <SourceModal
        source={inspectingSource}
        isOpen={Boolean(inspectingSource)}
        onClose={() => setInspectingSource(null)}
      />
    </div>
  );
}
