import React from 'react';
import { BrainCircuit } from 'lucide-react';

export function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeClass = size === 'lg' ? 'spinner-lg' : size === 'sm' ? 'spinner-sm' : '';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '30px' }}>
      <div className={`spinner ${sizeClass}`} />
      {text && <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{text}</p>}
    </div>
  );
}

export function PageLoader({ text = 'Loading DocuMind AI...' }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '16px',
      }}
    >
      <div
        style={{
          width: '54px',
          height: '54px',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          boxShadow: '0 0 25px rgba(99, 102, 241, 0.45)',
          animation: 'pulse 2s infinite ease-in-out',
        }}
      >
        <BrainCircuit size={30} />
      </div>
      <div className="spinner spinner-lg" />
      <span style={{ color: 'var(--text-muted)', fontSize: '0.92rem', fontWeight: 500 }}>
        {text}
      </span>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '10px' }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ width: '70%', height: '16px', marginBottom: '6px' }} />
          <div className="skeleton" style={{ width: '40%', height: '12px' }} />
        </div>
      </div>
      <div className="skeleton" style={{ width: '100%', height: '32px' }} />
    </div>
  );
}
