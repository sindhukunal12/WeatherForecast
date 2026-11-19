import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="btn-toggle"
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
      aria-label="Toggle Theme"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.45rem 0.85rem',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        color: 'var(--text-primary)',
        cursor: 'pointer',
        fontSize: '0.825rem',
        fontWeight: '500',
        transition: 'all var(--transition-fast)',
      }}
    >
      {theme === 'dark' ? (
        <>
          <Sun size={16} color="var(--accent-glow)" />
          <span>Light</span>
        </>
      ) : (
        <>
          <Moon size={16} color="var(--accent-blue)" />
          <span>Dark</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;

