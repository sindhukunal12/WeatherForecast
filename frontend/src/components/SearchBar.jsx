import React, { useState } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

const SearchBar = ({ onCitySelect }) => {
  const [query, setQuery] = useState('');
  const { fetchWeatherData, history } = useWeather();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    const city = query.trim();
    if (onCitySelect) {
      onCitySelect(city);
    } else {
      fetchWeatherData(city);
    }
    setQuery('');
  };

  const handleQuickSelect = (city) => {
    if (onCitySelect) {
      onCitySelect(city);
    } else {
      fetchWeatherData(city);
    }
  };

  return (
    <div style={{ width: '100%', marginBottom: '1.75rem' }}>
      <form onSubmit={handleSearch} style={{ position: 'relative', width: '100%' }}>
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.4rem 0.75rem 0.4rem 1.25rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)',
            background: 'var(--bg-glass-card)',
            boxShadow: 'var(--shadow-md)',
            transition: 'border-color var(--transition-fast)',
          }}
        >
          <Search size={18} color="var(--accent-glow)" style={{ marginRight: '0.75rem', flexShrink: 0 }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any city, rural village, town, or PIN code (e.g. Ralegan Siddhi, Shirdi, Tokyo, 414001)..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              fontFamily: 'inherit',
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.25rem',
                marginRight: '0.5rem',
              }}
            >
              <X size={16} />
            </button>
          )}
          <button
            type="submit"
            style={{
              background: 'var(--accent-gradient)',
              border: 'none',
              color: '#ffffff',
              padding: '0.55rem 1.25rem',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.85rem',
              boxShadow: 'var(--shadow-sm)',
              transition: 'opacity var(--transition-fast)',
            }}
          >
            Search
          </button>
        </div>
      </form>

      {/* Recent Search Quick-Pills */}
      {history && history.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', overflowX: 'auto', paddingBottom: '4px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', flexShrink: 0 }}>
            <MapPin size={12} /> Recent:
          </span>
          {history.slice(0, 5).map((item) => (
            <button
              key={item.id}
              onClick={() => handleQuickSelect(item.city_name)}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.775rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent-glow)';
                e.currentTarget.style.borderColor = 'var(--accent-glow)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
            >
              {item.city_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

