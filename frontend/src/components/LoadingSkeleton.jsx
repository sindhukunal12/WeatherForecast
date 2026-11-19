import React from 'react';

const LoadingSkeleton = ({ type = 'card' }) => {
  if (type === 'hero') {
    return (
      <div
        className="glass-panel"
        style={{
          padding: '2.5rem',
          minHeight: '280px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          animation: 'pulse 1.8s infinite ease-in-out',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div style={{ width: '180px', height: '28px', background: 'var(--bg-surface-elevated)', borderRadius: '6px', marginBottom: '8px' }}></div>
            <div style={{ width: '100px', height: '16px', background: 'var(--bg-surface)', borderRadius: '4px' }}></div>
          </div>
          <div style={{ width: '64px', height: '64px', background: 'var(--bg-surface-elevated)', borderRadius: '50%' }}></div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <div style={{ width: '140px', height: '64px', background: 'var(--bg-surface-elevated)', borderRadius: '8px', marginBottom: '8px' }}></div>
          <div style={{ width: '220px', height: '18px', background: 'var(--bg-surface)', borderRadius: '4px' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.5rem',
        minHeight: '130px',
        animation: 'pulse 1.8s infinite ease-in-out',
      }}
    >
      <div style={{ width: '40%', height: '16px', background: 'var(--bg-surface-elevated)', borderRadius: '4px', marginBottom: '12px' }}></div>
      <div style={{ width: '70%', height: '32px', background: 'var(--bg-surface)', borderRadius: '6px' }}></div>
    </div>
  );
};

export default LoadingSkeleton;
