import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, History, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { weatherApi } from '../services/api';

const POPULAR_LOCATIONS = [
  { name: 'Gharuan', admin: 'SAS Nagar, Punjab', type: 'Village / Town' },
  { name: 'Chandigarh', admin: 'Punjab & Haryana', type: 'City / Union Territory' },
  { name: 'Delhi', admin: 'National Capital Region', type: 'Metropolitan City' },
  { name: 'Mumbai', admin: 'Maharashtra, India', type: 'Metropolitan City' },
  { name: 'London', admin: 'Greater London, UK', type: 'Global Capital' },
  { name: 'Singapore', admin: 'Singapore', type: 'City-State' },
];

const SearchBar = ({ onCitySelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const { fetchWeatherData, history } = useWeather();
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch live autocomplete suggestions with debouncing
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    const debounceTimer = setTimeout(async () => {
      try {
        const results = await weatherApi.searchLocations(trimmed);
        if (isMounted) {
          setSuggestions(results);
          setIsLoading(false);
          setHighlightedIndex(-1);
        }
      } catch (err) {
        if (isMounted) {
          setSuggestions([]);
          setIsLoading(false);
        }
      }
    }, 250);

    return () => {
      isMounted = false;
      clearTimeout(debounceTimer);
    };
  }, [query]);

  const handleSelectLocation = (locationName) => {
    if (!locationName) return;
    setQuery(locationName);
    setIsOpen(false);
    if (onCitySelect) {
      onCitySelect(locationName);
    } else {
      fetchWeatherData(locationName);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
      handleSelectLocation(suggestions[highlightedIndex].name);
    } else {
      handleSelectLocation(query.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true);
      }
      return;
    }

    const currentList = query.trim().length >= 2 ? suggestions : POPULAR_LOCATIONS;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < currentList.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : currentList.length - 1));
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && currentList[highlightedIndex]) {
        e.preventDefault();
        handleSelectLocation(currentList[highlightedIndex].name);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} style={{ width: '100%', marginBottom: '1.75rem', position: 'relative' }}>
      <form onSubmit={handleSubmit} style={{ position: 'relative', width: '100%' }}>
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.45rem 0.75rem 0.45rem 1.25rem',
            borderRadius: isOpen && (suggestions.length > 0 || query.trim().length === 0) ? 'var(--radius-lg) var(--radius-lg) 0 0' : 'var(--radius-full)',
            border: isOpen ? '1px solid var(--accent-glow)' : '1px solid var(--border-subtle)',
            background: 'var(--bg-glass-card)',
            boxShadow: isOpen ? '0 0 20px rgba(0, 240, 255, 0.2)' : 'var(--shadow-md)',
            transition: 'all var(--transition-fast)',
          }}
        >
          <Search size={18} color="var(--accent-glow)" style={{ marginRight: '0.75rem', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search any city, rural village, town, or PIN code (e.g. Gharuan, Ralegan Siddhi, London, 414001)..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              fontFamily: 'inherit',
            }}
            autoComplete="off"
          />

          {isLoading && (
            <Loader2 size={16} color="var(--accent-glow)" className="animate-spin" style={{ marginRight: '0.5rem' }} />
          )}

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                inputRef.current?.focus();
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.25rem',
                marginRight: '0.5rem',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Clear search"
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

      {/* Autocomplete Search Dropdown List */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'linear-gradient(180deg, rgba(13, 23, 42, 0.98) 0%, rgba(8, 15, 30, 0.98) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--accent-glow)',
            borderTop: 'none',
            borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
            boxShadow: '0 15px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 240, 255, 0.15)',
            zIndex: 1000,
            maxHeight: '380px',
            overflowY: 'auto',
          }}
        >
          {/* Case 1: Active query with live suggestions */}
          {query.trim().length >= 2 && (
            <div>
              <div
                style={{
                  padding: '0.6rem 1rem',
                  fontSize: '0.725rem',
                  fontWeight: '700',
                  color: 'var(--accent-glow)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>Matching Locations ({suggestions.length})</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'none' }}>
                  Press Enter to select
                </span>
              </div>

              {suggestions.length > 0 ? (
                suggestions.map((item, index) => {
                  const isHighlighted = highlightedIndex === index;
                  const isVillage = item.type && item.type.includes('Village');

                  return (
                    <div
                      key={item.id || `${item.name}-${index}`}
                      onClick={() => handleSelectLocation(item.name)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      style={{
                        padding: '0.75rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        background: isHighlighted ? 'rgba(0, 240, 255, 0.12)' : 'transparent',
                        borderLeft: isHighlighted ? '3px solid var(--accent-glow)' : '3px solid transparent',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        transition: 'background var(--transition-fast)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                        <div
                          style={{
                            background: isVillage ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-surface)',
                            color: isVillage ? '#10b981' : 'var(--accent-glow)',
                            padding: '0.4rem',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <MapPin size={16} />
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                          <span style={{ fontSize: '0.925rem', fontWeight: '600', color: 'var(--text-primary)', display: 'block' }}>
                            {item.name}
                          </span>
                          {item.admin && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                              {item.admin}
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                        <span
                          style={{
                            fontSize: '0.675rem',
                            fontWeight: '600',
                            padding: '0.15rem 0.5rem',
                            borderRadius: 'var(--radius-full)',
                            background: isVillage ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-surface)',
                            color: isVillage ? '#10b981' : 'var(--text-accent)',
                            border: '1px solid var(--border-subtle)',
                          }}
                        >
                          {isVillage ? '🌾 Village' : item.type || 'City'}
                        </span>
                        <ArrowRight size={14} color="var(--text-muted)" />
                      </div>
                    </div>
                  );
                })
              ) : !isLoading ? (
                <div style={{ padding: '1.25rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No exact location matches found for "{query}". Press Enter to perform deep global resolution.
                </div>
              ) : null}
            </div>
          )}

          {/* Case 2: Input empty or focused - Show Recent Searches and Popular Places */}
          {query.trim().length < 2 && (
            <div>
              {/* Recent searches if available */}
              {history && history.length > 0 && (
                <div>
                  <div
                    style={{
                      padding: '0.6rem 1rem',
                      fontSize: '0.725rem',
                      fontWeight: '700',
                      color: 'var(--accent-cyan)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <History size={13} />
                    <span>Recent Searches</span>
                  </div>
                  {history.slice(0, 4).map((hItem) => (
                    <div
                      key={hItem.id}
                      onClick={() => handleSelectLocation(hItem.city_name)}
                      style={{
                        padding: '0.65rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        transition: 'background var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0, 240, 255, 0.08)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <History size={14} color="var(--text-muted)" />
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                          {hItem.city_name}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Search again</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Popular suggestions */}
              <div>
                <div
                  style={{
                    padding: '0.6rem 1rem',
                    fontSize: '0.725rem',
                    fontWeight: '700',
                    color: 'var(--accent-glow)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <Sparkles size={13} />
                  <span>Popular Locations</span>
                </div>
                {POPULAR_LOCATIONS.map((pop, pIdx) => {
                  const isHighlighted = highlightedIndex === pIdx;
                  return (
                    <div
                      key={pop.name}
                      onClick={() => handleSelectLocation(pop.name)}
                      onMouseEnter={() => setHighlightedIndex(pIdx)}
                      style={{
                        padding: '0.65rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        background: isHighlighted ? 'rgba(0, 240, 255, 0.12)' : 'transparent',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        transition: 'background var(--transition-fast)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <MapPin size={15} color="var(--accent-glow)" />
                        <div>
                          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)', display: 'block' }}>
                            {pop.name}
                          </span>
                          <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'block' }}>
                            {pop.admin}
                          </span>
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          background: 'var(--bg-surface)',
                          color: 'var(--text-secondary)',
                          padding: '0.15rem 0.5rem',
                          borderRadius: 'var(--radius-full)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        {pop.type}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick History Pills Underneath */}
      {history && history.length > 0 && !isOpen && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', overflowX: 'auto', paddingBottom: '4px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', flexShrink: 0 }}>
            <MapPin size={12} /> Recent:
          </span>
          {history.slice(0, 5).map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelectLocation(item.city_name)}
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
