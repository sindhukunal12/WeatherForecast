import React from 'react';
import { useWeather } from '../context/WeatherContext';
import SearchBar from '../components/SearchBar';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';
import AirQualityCard from '../components/AirQualityCard';
import { MapPin, Globe, Clock, Wind, Droplets, Thermometer, Sun } from 'lucide-react';

const CityDetailsPage = () => {
  const { currentWeather, forecast, loading, error, refreshWeather } = useWeather();

  if (loading) {
    return (
      <div>
        <SearchBar />
        <LoadingSkeleton type="hero" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <SearchBar />
        <ErrorMessage message={error} onRetry={refreshWeather} />
      </div>
    );
  }

  if (!currentWeather) return null;

  const { city, admin, country, location_type, coordinates, temperature, condition, metrics, sun, aqi, timestamp } = currentWeather;
  const slices = forecast?.slices || [];

  return (
    <div>
      <SearchBar />

      {/* Header Info Banner */}
      <div className="glass-panel" style={{ padding: '1.75rem 2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <MapPin size={24} color="var(--accent-glow)" />
              <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>{city}</h2>
              {admin && (
                <span style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
                  ({admin})
                </span>
              )}
              {country && (
                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-accent)', background: 'var(--bg-surface)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  {country}
                </span>
              )}
              {location_type && location_type.includes('Village') && (
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
                  🌾 {location_type}
                </span>
              )}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Detailed Meteorological Breakdown, Short-Term Trend &amp; Air Quality
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ background: 'var(--bg-surface)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>Latitude</span>
              <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{coordinates?.lat}° N</span>
            </div>
            <div style={{ background: 'var(--bg-surface)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>Longitude</span>
              <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{coordinates?.lon}° E</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Hour Interval Predictive Timeline */}
      {slices.length > 0 && (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Clock size={18} color="var(--accent-glow)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>
              3-Hour Interval Short-Term Projections
            </h3>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '1rem',
              overflowX: 'auto',
              paddingBottom: '0.75rem',
            }}
          >
            {slices.map((slice, idx) => {
              const timeLabel = slice.datetime
                ? slice.datetime.split(' ')[1]?.substring(0, 5)
                : `${idx * 3}h`;
              const dateLabel = slice.datetime ? slice.datetime.split(' ')[0] : '';

              return (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-glass)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem 0.75rem',
                    minWidth: '110px',
                    textAlign: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                    {dateLabel ? dateLabel.substring(5) : ''}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', display: 'block' }}>
                    {timeLabel}
                  </span>

                  {slice.icon && (
                    <img
                      src={`https://openweathermap.org/img/wn/${slice.icon}.png`}
                      alt={slice.condition}
                      style={{ width: '40px', height: '40px', margin: '0.2rem auto' }}
                    />
                  )}

                  <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent-glow)', display: 'block' }}>
                    {slice.temp}°
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', textTransform: 'capitalize' }}>
                    {slice.condition}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Live Air Quality Index Card */}
      <AirQualityCard aqiData={aqi} />

      {/* Deep Thermal & Atmospheric Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Thermometer size={18} color="var(--accent-blue)" />
            <h4 style={{ fontSize: '1rem', fontWeight: '600' }}>Thermal Range</h4>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Current Temperature:</span>
              <span style={{ fontWeight: '700' }}>{temperature?.current} {temperature?.unit}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Apparent (Feels Like):</span>
              <span style={{ fontWeight: '600' }}>{temperature?.feels_like} {temperature?.unit}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Diurnal Minimum:</span>
              <span style={{ fontWeight: '600' }}>{temperature?.temp_min} {temperature?.unit}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Diurnal Maximum:</span>
              <span style={{ fontWeight: '600' }}>{temperature?.temp_max} {temperature?.unit}</span>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Wind size={18} color="var(--accent-cyan)" />
            <h4 style={{ fontSize: '1rem', fontWeight: '600' }}>Wind &amp; Pressure Vectors</h4>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Velocity:</span>
              <span style={{ fontWeight: '700' }}>{metrics?.wind_speed} {temperature?.unit === '°F' ? 'mph' : 'm/s'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Orientation / Degree:</span>
              <span style={{ fontWeight: '600' }}>{metrics?.wind_deg}°</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Sea-Level Pressure:</span>
              <span style={{ fontWeight: '600' }}>{metrics?.pressure} hPa</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Horizontal Visibility:</span>
              <span style={{ fontWeight: '600' }}>{(metrics?.visibility / 1000).toFixed(1)} km</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityDetailsPage;

