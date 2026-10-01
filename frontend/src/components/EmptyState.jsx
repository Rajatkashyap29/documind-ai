import React from 'react';
import { FileQuestion } from 'lucide-react';

export default function EmptyState({
  icon: Icon = FileQuestion,
  title = 'No items found',
  description = 'Get started by creating or uploading your first item.',
  actionText,
  onAction,
  actionIcon: ActionIcon,
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '50px 24px',
        background: 'rgba(18, 24, 38, 0.4)',
        border: '1px dashed var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        margin: '20px 0',
      }}
    >
      <div
        style={{
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--primary-400)',
          marginBottom: '16px',
        }}
      >
        <Icon size={28} />
      </div>

      <h3
        style={{
          fontSize: '1.15rem',
          fontWeight: 700,
          color: 'var(--text-main)',
          marginBottom: '8px',
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          maxWidth: '420px',
          lineHeight: 1.5,
          marginBottom: actionText ? '22px' : '0',
        }}
      >
        {description}
      </p>

      {actionText && onAction && (
        <button className="btn btn-primary" onClick={onAction}>
          {ActionIcon && <ActionIcon size={17} />}
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
}
