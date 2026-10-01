import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';
import { documentsAPI } from '../api/api';
import { useToast } from '../context/ToastContext';

export default function DocumentUpload({ onUploadSuccess }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef(null);
  const toast = useToast();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    if (!file) return false;
    const isPdfType = file.type === 'application/pdf';
    const isPdfExt = file.name.toLowerCase().endsWith('.pdf');

    if (!isPdfType && !isPdfExt) {
      const err = 'Invalid file type. Only PDF documents are supported by DocuMind AI.';
      setErrorMsg(err);
      toast.error(err);
      return false;
    }

    // Limit to reasonable size, e.g. 50MB
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      const err = 'File size exceeds 50MB. Please upload a smaller PDF.';
      setErrorMsg(err);
      toast.error(err);
      return false;
    }

    setErrorMsg('');
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleClearSelection = (e) => {
    e?.stopPropagation();
    setSelectedFile(null);
    setUploadProgress(0);
    setProcessingStatus('');
    setErrorMsg('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async (e) => {
    e?.stopPropagation();
    if (!selectedFile || isUploading) return;

    setIsUploading(true);
    setErrorMsg('');
    setUploadProgress(10);
    setProcessingStatus('Uploading PDF to DocuMind server...');

    try {
      const result = await documentsAPI.upload(selectedFile, (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 90) / progressEvent.total);
          setUploadProgress(percent);
          if (percent >= 90) {
            setProcessingStatus('Processing document embeddings & vector indexing...');
          }
        }
      });

      setUploadProgress(100);
      setProcessingStatus('Document successfully processed & ready for AI chat!');
      toast.success(`"${selectedFile.name}" indexed and ready for AI search!`);

      if (onUploadSuccess) {
        onUploadSuccess(result);
      }

      setTimeout(() => {
        handleClearSelection();
        setIsUploading(false);
      }, 1200);
    } catch (err) {
      const errDetail = err.message || 'Failed to upload document';
      setErrorMsg(errDetail);
      toast.error(errDetail);
      setIsUploading(false);
      setUploadProgress(0);
      setProcessingStatus('');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div
      className={`upload-dropzone ${dragActive ? 'drag-active' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => !isUploading && !selectedFile && fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        disabled={isUploading}
      />

      {!selectedFile ? (
        <>
          <div className="upload-icon-wrapper">
            <UploadCloud size={30} />
          </div>

          <h3 className="upload-title">Drag & Drop your PDF document</h3>
          <p className="upload-subtitle">
            Upload policies, research papers, reports, or contracts to enable instant hybrid vector search and question answering.
          </p>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            <UploadCloud size={16} />
            <span>Select PDF File</span>
          </button>

          <div className="upload-file-types" style={{ marginTop: '16px' }}>
            <span>PDF (up to 50MB)</span>
            <span>•</span>
            <span>Chunked & Embedded in ChromaDB</span>
          </div>
        </>
      ) : (
        <div className="file-selected-box" onClick={(e) => e.stopPropagation()}>
          <div className="file-preview-header">
            <div className="file-info-group">
              <div className="pdf-icon-badge">
                <FileText size={20} />
              </div>
              <div className="file-meta-text">
                <div className="file-name-label" title={selectedFile.name}>
                  {selectedFile.name}
                </div>
                <div className="file-size-label">{formatFileSize(selectedFile.size)}</div>
              </div>
            </div>

            {!isUploading && (
              <button
                type="button"
                className="btn-ghost"
                onClick={handleClearSelection}
                title="Remove selection"
                style={{ padding: '6px', border: 'none', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Progress / Status feedback */}
          {isUploading && (
            <div className="upload-progress-container">
              <div className="upload-progress-bar">
                <div
                  className="upload-progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <div className="progress-text-row">
                <span>{processingStatus}</span>
                <span>{uploadProgress}%</span>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="form-error-msg" style={{ marginTop: '6px' }}>
              <AlertCircle size={15} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            {!isUploading && (
              <>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleClearSelection}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleUpload}
                >
                  <Sparkles size={15} />
                  <span>Start Indexing</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
