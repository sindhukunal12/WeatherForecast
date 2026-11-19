import React, { useState } from 'react';
import { MapPin, Heart, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

const CurrentWeather = ({ data }) => {
  const { isCityFavorite, addFavorite, removeFavorite, favorites } = useWeather();
  const [feedback, setFeedback] = useState('');

  if (!data) return null;

  const { city, country, temperature, condition, metrics, coordinates, timestamp } = data;
  const isFav = isCityFavorite(city);

  const handleFavoriteToggle = async () => {
    if (isFav) {
      const match = favorites.find((f) => f.city_name.toLowerCase() === city.toLowerCase());
      if (match) {
        await removeFavorite(match.id);
        setFeedback('Removed from favorites');
        setTimeout(() => setFeedback(''), 2500);
      }
    } else {
      const res = await addFavorite({
        city,
        country,
        coordinates,
      });
      setFeedback(res.message);
      setTimeout(() => setFeedback(''), 2500);
    }
  };

  const formattedDate = new Date(timestamp * 1000).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const iconUrl = condition?.icon
    ? `https://openweathermap.org/img/wn/${condition.icon}@2x.png`
    : null;

  return (
    <div
      className="glass-panel-glow"
      style={{
        position: 'relative',
        padding: '2rem 2.5rem',
        marginBottom: '2rem',
        overflow: 'hidden',
      }}
    >
      {/* Background Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-40%',
          right: '-10%',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <MapPin size={22} color="var(--accent-glow)" />
            <h2 style={{ fontSize: '1.85rem', fontWeight: '800', letterSpacing: '-0.025em', color: 'var(--text-primary)' }}>
              {city}
              {country && (
                <span style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
                  ({country})
                </span>
              )}
            </h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{formattedDate}</p>
        </div>

        {/* Favorite & Live Badge Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {feedback && (
            <span style={{ fontSize: '0.775rem', color: 'var(--accent-glow)', background: 'var(--bg-surface)', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-highlight)' }}>
              {feedback}
            </span>
          )}
          <button
            onClick={handleFavoriteToggle}
            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
            style={{
              background: isFav ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-surface)',
              border: `1px solid ${isFav ? 'var(--status-error)' : 'var(--border-subtle)'}`,
              color: isFav ? 'var(--status-error)' : 'var(--text-secondary)',
              padding: '0.55rem',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all var(--transition-fast)',
            }}
          >
            <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Main Temperature & Weather Info Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: '1.5rem', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {iconUrl && (
            <img
              src={iconUrl}
              alt={condition?.description || 'Weather condition'}
              style={{ width: '88px', height: '88px', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))' }}
            />
          )}
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <span style={{ fontSize: '3.75rem', fontWeight: '800', lineHeight: 1, letterSpacing: '-0.04em', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {temperature?.current}
              </span>
              <span style={{ fontSize: '1.75rem', fontWeight: '600', color: 'var(--text-accent)', marginLeft: '0.25rem' }}>
                {temperature?.unit}
              </span>
            </div>
            <p style={{ fontSize: '1.1rem', fontWeight: '500', textTransform: 'capitalize', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
              {condition?.description}
            </p>
          </div>
        </div>

        {/* High/Low & Feels Like Sub-card */}
        <div
          style={{
            background: 'var(--bg-glass)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            minWidth: '180px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Feels like:</span>
            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
              {temperature?.feels_like} {temperature?.unit}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <ArrowUp size={14} color="var(--status-error)" /> High:
            </span>
            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
              {temperature?.temp_max} {temperature?.unit}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <ArrowDown size={14} color="var(--accent-glow)" /> Low:
            </span>
            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
              {temperature?.temp_min} {temperature?.unit}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
