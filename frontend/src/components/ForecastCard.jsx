import React from 'react';
import { ArrowUp, ArrowDown, Droplets } from 'lucide-react';

const ForecastCard = ({ forecastData }) => {
  if (!forecastData || !forecastData.daily) return null;

  const { daily, city } = forecastData;

  const formatDay = (dateStr, index) => {
    if (index === 0) return 'Today';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString(undefined, { weekday: 'short' });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
          5-Day Weather Forecast
        </h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Projected for {city}
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '1rem',
        }}
      >
        {daily.map((item, index) => {
          const iconUrl = item.icon
            ? `https://openweathermap.org/img/wn/${item.icon}@2x.png`
            : null;

          return (
            <div
              key={item.date}
              className="glass-panel"
              style={{
                padding: '1.25rem 1rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                minHeight: '210px',
                border: index === 0 ? '1px solid var(--border-highlight)' : '1px solid var(--border-subtle)',
                background: index === 0 ? 'var(--bg-glass-card)' : 'var(--bg-glass)',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '1rem',
                    fontWeight: index === 0 ? '700' : '600',
                    color: index === 0 ? 'var(--accent-glow)' : 'var(--text-primary)',
                    display: 'block',
                  }}
                >
                  {formatDay(item.date, index)}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {formatDate(item.date)}
                </span>
              </div>

              {iconUrl && (
                <img
                  src={iconUrl}
                  alt={item.condition}
                  style={{ width: '56px', height: '56px', margin: '0.25rem 0' }}
                />
              )}

              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)', display: 'block' }}>
                  {item.condition}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem', marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <Droplets size={12} color="var(--accent-glow)" /> {item.humidity}%
                </div>
              </div>

              {/* High & Low Temp */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginTop: '0.75rem',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid var(--border-subtle)',
                  width: '100%',
                }}
              >
                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {item.temp_max}°
                </span>
                <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  {item.temp_min}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ForecastCard;
