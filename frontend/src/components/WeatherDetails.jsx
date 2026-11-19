import React from 'react';
import { Droplets, Wind, Gauge, Eye, Sunrise, Sunset, Compass } from 'lucide-react';

const WeatherDetails = ({ data }) => {
  if (!data || !data.metrics) return null;

  const { metrics, sun } = data;

  const formatTime = (epochSeconds) => {
    if (!epochSeconds) return '--:--';
    return new Date(epochSeconds * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCompassDirection = (deg) => {
    if (deg === undefined || deg === null) return 'N/A';
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round((deg % 360) / 22.5);
    return directions[index % 16];
  };

  const detailCards = [
    {
      id: 'humidity',
      label: 'Humidity',
      value: `${metrics.humidity}%`,
      subtext: metrics.dew_point !== undefined ? `Dew point: ${metrics.dew_point}°` : (metrics.humidity > 65 ? 'High moisture' : metrics.humidity < 35 ? 'Dry conditions' : 'Optimal humidity'),
      icon: <Droplets size={22} color="var(--accent-glow)" />,
    },
    {
      id: 'wind',
      label: 'Wind Speed',
      value: `${metrics.wind_speed} ${metrics.wind_unit || (data.temperature?.unit === '°F' ? 'mph' : 'km/h')}`,
      subtext: `${getCompassDirection(metrics.wind_deg)} (${metrics.wind_deg}°)`,
      icon: <Wind size={22} color="var(--accent-blue)" />,
    },
    {
      id: 'pressure',
      label: 'Atmospheric Pressure',
      value: `${metrics.pressure} hPa`,
      subtext: metrics.pressure >= 1013 ? 'Normal/High pressure' : 'Low barometric pressure',
      icon: <Gauge size={22} color="var(--accent-cyan)" />,
    },
    {
      id: 'visibility',
      label: 'Visibility',
      value: `${(metrics.visibility / 1000).toFixed(1)} km`,
      subtext: metrics.visibility >= 9000 ? 'Clear line of sight' : 'Hazy or reduced visibility',
      icon: <Eye size={22} color="#a855f7" />,
    },
    {
      id: 'sunrise',
      label: 'Sunrise',
      value: formatTime(sun?.sunrise),
      subtext: 'Dawn',
      icon: <Sunrise size={22} color="#f59e0b" />,
    },
    {
      id: 'sunset',
      label: 'Sunset',
      value: formatTime(sun?.sunset),
      subtext: 'Dusk',
      icon: <Sunset size={22} color="#f97316" />,
    },
  ];

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>
        Atmospheric Conditions &amp; Metrics
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {detailCards.map((card) => (
          <div
            key={card.id}
            className="glass-panel"
            style={{
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '120px',
              transition: 'transform var(--transition-fast), border-color var(--transition-fast)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                {card.label}
              </span>
              <div style={{ background: 'var(--bg-surface)', padding: '0.4rem', borderRadius: 'var(--radius-md)' }}>
                {card.icon}
              </div>
            </div>

            <div style={{ marginTop: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                {card.value}
              </span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                {card.subtext}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherDetails;

