import React, { useState } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { PageLoader } from './components/Loading';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import Chat from './pages/Chat';
import History from './pages/History';

// Protected Route Guard
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <PageLoader text="Authenticating session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Authenticated App Shell with Sidebar & Navbar
function AppLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const getPageMeta = () => {
    switch (location.pathname) {
      case '/dashboard':
        return {
          title: 'Intelligence Dashboard',
          breadcrumbs: ['DocuMind AI', 'Dashboard'],
        };
      case '/documents':
        return {
          title: 'Document Knowledge Base',
          breadcrumbs: ['DocuMind AI', 'Documents'],
        };
      case '/chat':
        return {
          title: 'AI Document Assistant',
          breadcrumbs: ['DocuMind AI', 'AI Chat'],
          subtitle: 'Ask questions and get grounded answers from your documents.',
        };
      case '/history':
        return {
          title: 'Query History & Logs',
          breadcrumbs: ['DocuMind AI', 'History'],
          subtitle: 'Audit trail of past prompts and RAG answers.',
        };
      default:
        return {
          title: 'DocuMind AI',
          breadcrumbs: ['DocuMind AI'],
        };
    }
  };

  const meta = getPageMeta();

  return (
    <div className="app-container">
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="main-wrapper">
        <Navbar
          title={meta.title}
          subtitle={meta.subtitle}
          breadcrumbs={meta.breadcrumbs}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected SaaS Application Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Documents />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Chat />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <AppLayout>
              <History />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Default Fallback Redirect */}
      <Route
        path="/"
        element={
          isLoading ? (
            <PageLoader text="Loading DocuMind..." />
          ) : isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Wildcard 404 Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
