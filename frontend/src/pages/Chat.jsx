import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UploadCloud, BotMessageSquare } from 'lucide-react';
import { documentsAPI } from '../api/api';
import ChatWindow from '../components/ChatWindow';
import EmptyState from '../components/EmptyState';
import { PageLoader } from '../components/Loading';

export default function Chat() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchDocs = async () => {
      setIsLoading(true);
      try {
        const data = await documentsAPI.getAll();
        if (isMounted && Array.isArray(data)) {
          setDocuments(data);

          // Check if query string specified document_id
          const params = new URLSearchParams(location.search);
          const docIdParam = params.get('document_id');

          if (docIdParam && data.some((d) => String(d.id) === String(docIdParam))) {
            setSelectedDocId(docIdParam);
          } else if (data.length > 0) {
            setSelectedDocId(String(data[0].id));
          }
        }
      } catch (err) {
        // Failed to load
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchDocs();
    return () => {
      isMounted = false;
    };
  }, [location.search]);

  if (isLoading) {
    return <PageLoader text="Connecting to DocuMind Knowledge Engine..." />;
  }

  if (documents.length === 0) {
    return (
      <EmptyState
        icon={UploadCloud}
        title="No documents available to query"
        description="To converse with DocuMind AI, please upload at least one PDF document first."
        actionText="Upload Your First Document"
        onAction={() => navigate('/documents')}
      />
    );
  }

  return (
    <ChatWindow
      documents={documents}
      selectedDocId={selectedDocId}
      onSelectDocId={(id) => setSelectedDocId(id)}
    />
  );
}
