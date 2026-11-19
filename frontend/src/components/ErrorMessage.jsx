import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.25rem 1.5rem',
        margin: '1.5rem 0',
        borderColor: 'rgba(239, 68, 68, 0.4)',
        background: 'rgba(239, 68, 68, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <AlertTriangle size={20} color="var(--status-error)" />
        <span style={{ fontSize: '0.925rem', color: 'var(--text-primary)' }}>
          {message || 'An unexpected error occurred while fetching weather data.'}
        </span>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 0.85rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: '500',
          }}
        >
          <RefreshCw size={14} />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
