import React from 'react';
import { MapPin, Trash2, ArrowRight, Droplets, Wind } from 'lucide-react';

const FavoriteCard = ({ favorite, onSelect, onRemove }) => {
  if (!favorite) return null;

  const { id, city_name, country, weather } = favorite;

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '160px',
        position: 'relative',
        transition: 'all var(--transition-normal)',
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={16} color="var(--accent-glow)" />
            <h4 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              {city_name}
            </h4>
          </div>
          {country && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '1.4rem' }}>
              {country}
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(id);
          }}
          title="Remove from favorites"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.25rem',
            borderRadius: 'var(--radius-sm)',
            transition: 'color var(--transition-fast)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--status-error)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Middle: Weather details if attached */}
      {weather ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0.75rem 0' }}>
          <div>
            <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              {weather.temperature} {weather.unit}
            </span>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
              {weather.condition}
            </p>
          </div>
          {weather.icon && (
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
              alt={weather.condition}
              style={{ width: '48px', height: '48px' }}
            />
          )}
        </div>
      ) : (
        <div style={{ margin: '1rem 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Click below to view full forecast
        </div>
      )}

      {/* Bottom Action */}
      <button
        onClick={() => onSelect(city_name)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          width: '100%',
          padding: '0.5rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)',
          color: 'var(--accent-glow)',
          fontSize: '0.825rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all var(--transition-fast)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--accent-blue)';
          e.currentTarget.style.color = '#ffffff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--bg-surface)';
          e.currentTarget.style.color = 'var(--accent-glow)';
        }}
      >
        <span>View Details</span>
        <ArrowRight size={14} />
      </button>
    </div>
  );
};

export default FavoriteCard;

