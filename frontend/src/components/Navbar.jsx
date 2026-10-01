import React, { useEffect, useState } from 'react';
import { Menu, Activity, ShieldCheck, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { healthAPI } from '../api/api';
import '../styles/navbar.css';

export default function Navbar({
  title,
  subtitle,
  breadcrumbs = ['DocuMind AI'],
  onOpenMobileMenu,
}) {
  const { user } = useAuth();
  const [isHealthy, setIsHealthy] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const checkBackend = async () => {
      try {
        const res = await healthAPI.check();
        if (isMounted) {
          setIsHealthy(res?.status === 'healthy');
        }
      } catch {
        if (isMounted) {
          setIsHealthy(false);
        }
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 30000); // Check every 30s
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <button
          className="menu-toggle-btn"
          onClick={onOpenMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="page-title-wrap">
          <div className="page-breadcrumbs">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb}>
                {idx > 0 && <ChevronRight size={12} />}
                <span>{crumb}</span>
              </React.Fragment>
            ))}
          </div>
          <h1 className="current-page-title">{title}</h1>
          {subtitle && <p className="current-page-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="navbar-right">
        {/* Real Backend Status Indicator */}
        <div
          className={`backend-health-pill ${!isHealthy ? 'offline' : ''}`}
          title={isHealthy ? 'FastAPI Backend Online' : 'FastAPI Backend Offline'}
        >
          <span className={`pulse-dot ${isHealthy ? 'dot-success' : 'dot-danger'}`} />
          <span>{isHealthy ? ' Intelligence Engine Active ' : 'Backend Disconnected'}</span>
        </div>

        {user && (
          <div className="nav-user-preview">
            <div className="nav-avatar-mini">{getInitials(user.name)}</div>
            <span className="nav-user-name">{user.name}</span>
          </div>
        )}
      </div>
    </header>
  );
}
