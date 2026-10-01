import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Files,
  BotMessageSquare,
  History,
  LogOut,
  BrainCircuit,
  X,
  FileCheck2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import '../styles/sidebar.css';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = () => {
    logout();
    toast.info('You have been logged out securely.');
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'DM';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-header">
          <NavLink to="/dashboard" className="sidebar-brand" onClick={onClose}>
            <div className="brand-icon">
              <BrainCircuit size={22} />
            </div>
            <div className="brand-text-wrap">
              <span className="brand-name">DocuMind AI</span>
              <span className="brand-tag">Enterprise RAG</span>
            </div>
          </NavLink>
          <button
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          <div className="nav-label">Main Platform</div>

          <NavLink
            to="/dashboard"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <div className="nav-icon">
              <LayoutDashboard size={19} />
            </div>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/documents"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <div className="nav-icon">
              <Files size={19} />
            </div>
            <span>Documents</span>
          </NavLink>

          <NavLink
            to="/chat"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <div className="nav-icon">
              <BotMessageSquare size={19} />
            </div>
            <span>AI Chat</span>
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <div className="nav-icon">
              <History size={19} />
            </div>
            <span>Chat History</span>
          </NavLink>
        </nav>

        {/* Architecture Info Widget */}
        <div className="sidebar-status-card">
          <div className="status-row">
            <span>RAG Engine</span>
            <span className="status-badge-inline">
              <span className="pulse-dot dot-success" />
              Hybrid + HyDE
            </span>
          </div>
          <div className="status-row" style={{ marginTop: '8px' }}>
            <span>Vector Store</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
              ChromaDB
            </span>
          </div>
        </div>

        {/* Footer Profile & Logout */}
        <div className="sidebar-footer">
          {user && (
            <div className="user-profile-widget">
              <div className="user-avatar">{getInitials(user.name)}</div>
              <div className="user-details">
                <div className="user-name" title={user.name}>
                  {user.name}
                </div>
                <div className="user-email" title={user.email}>
                  {user.email}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="logout-btn"
            title="Log out from DocuMind"
          >
            <LogOut size={17} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
