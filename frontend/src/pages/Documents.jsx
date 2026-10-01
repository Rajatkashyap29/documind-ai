import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Files,
  UploadCloud,
  Search,
  RefreshCw,
  Plus,
  AlertCircle,
} from 'lucide-react';
import { documentsAPI } from '../api/api';
import { useToast } from '../context/ToastContext';
import DocumentCard from '../components/DocumentCard';
import DocumentUpload from '../components/DocumentUpload';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import { SkeletonCard } from '../components/Loading';
import '../styles/documents.css';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const toast = useToast();
  const location = useLocation();

  const fetchDocuments = async () => {
    setIsLoading(true);
    setFetchError('');
    try {
      const data = await documentsAPI.getAll();
      if (Array.isArray(data)) {
        setDocuments(data);
      } else {
        setDocuments([]);
      }
    } catch (err) {
      const msg = err.message || 'Failed to fetch documents';
      setFetchError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
    // If URL has ?upload=true, expand or show upload area
    const params = new URLSearchParams(location.search);
    if (params.get('upload') === 'true') {
      setShowUploadModal(true);
    }
  }, [location.search]);

  const handleUploadSuccess = (newDoc) => {
    toast.success('Document uploaded and indexed successfully!');
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const handleDeleteRequest = (doc) => {
    setDocToDelete(doc);
  };

  const handleConfirmDelete = async () => {
    if (!docToDelete) return;

    setIsDeleting(true);
    try {
      await documentsAPI.delete(docToDelete.id);
      toast.success(`"${docToDelete.filename}" removed successfully.`);
      setDocuments((prev) => prev.filter((d) => d.id !== docToDelete.id));
      setDocToDelete(null);
    } catch (err) {
      const msg = err.message || 'Failed to delete document';
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) return documents;
    const q = searchQuery.toLowerCase();
    return documents.filter((d) => d.filename.toLowerCase().includes(q));
  }, [documents, searchQuery]);

  return (
    <div className="docs-page-layout">
      {/* Upload Dropzone Container */}
      <section>
        <DocumentUpload onUploadSuccess={handleUploadSuccess} />
      </section>

      {/* Header Bar & Search Filter */}
      <div className="docs-header-actions">
        <div className="docs-summary-metrics">
          <div className="metric-chip">
            <Files size={16} style={{ color: 'var(--primary-400)' }} />
            <span>
              Total Documents: <strong>{documents.length}</strong>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, justifyContent: 'flex-end', maxWidth: '500px' }}>
          <div className="input-wrapper" style={{ maxWidth: '320px' }}>
            <span className="input-icon-left">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-input has-left-icon"
              placeholder="Search documents by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            className="btn btn-secondary btn-icon"
            onClick={fetchDocuments}
            title="Refresh document repository"
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? 'spinner' : ''} />
          </button>
        </div>
      </div>

      {/* Error Banner if any */}
      {fetchError && (
        <div
          style={{
            padding: '14px 18px',
            background: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: '#FB7185',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={18} />
            <span>{fetchError}</span>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={fetchDocuments}>
            Retry
          </button>
        </div>
      )}

      {/* Documents Grid / States */}
      {isLoading ? (
        <div className="documents-grid">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : filteredDocuments.length === 0 ? (
        <EmptyState
          icon={Files}
          title={searchQuery ? 'No matching documents found' : 'No documents yet'}
          description={
            searchQuery
              ? `No documents matched "${searchQuery}". Clear your search query or upload a new PDF.`
              : 'Upload your first PDF to start asking questions with AI.'
          }
          actionText={searchQuery ? 'Clear Filter' : undefined}
          onAction={searchQuery ? () => setSearchQuery('') : undefined}
        />
      ) : (
        <div className="documents-grid">
          {filteredDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onDeleteRequest={handleDeleteRequest}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(docToDelete)}
        title="Delete Document"
        message={`Are you sure you want to permanently delete "${docToDelete?.filename}"? This will remove all associated vector embeddings from ChromaDB.`}
        confirmText="Delete Document"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => !isDeleting && setDocToDelete(null)}
      />
    </div>
  );
}
