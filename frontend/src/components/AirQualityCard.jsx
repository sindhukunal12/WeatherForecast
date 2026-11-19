import React from 'react';
import { Wind, AlertTriangle, ShieldCheck, Info } from 'lucide-react';

const AirQualityCard = ({ aqiData }) => {
  if (!aqiData) return null;

  const { aqi, status, color, advisory, standard, cpcb_aqi, us_aqi, pm2_5, pm10, no2, so2, o3, co } = aqiData;

  // Percentage for progress bar (clamped 0 to 100)
  const barPercent = Math.min(Math.round((aqi / 300) * 100), 100);

  const pollutants = [
    { label: 'PM2.5', name: 'Fine Particles', value: `${pm2_5} µg/m³` },
    { label: 'PM10', name: 'Coarse Dust', value: `${pm10} µg/m³` },
    { label: 'NO₂', name: 'Nitrogen Dioxide', value: `${no2} µg/m³` },
    { label: 'SO₂', name: 'Sulphur Dioxide', value: `${so2} µg/m³` },
    { label: 'O₃', name: 'Ozone', value: `${o3} µg/m³` },
    { label: 'CO', name: 'Carbon Monoxide', value: `${co} µg/m³` },
  ];

  return (
    <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wind size={20} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Air Quality Index (AQI)
            </h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', marginTop: '0.2rem' }}>
            Real-time atmospheric pollutant concentrations &amp; health advisory
          </p>
        </div>

        {/* AQI Status Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            background: `${color}1a`,
            border: `1px solid ${color}4d`,
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: color }}>
            {status}
          </span>
        </div>
      </div>

      {/* Main AQI Gauge & Advisory Block */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', alignItems: 'center', marginBottom: '1.75rem' }}>
        {/* Left: Score Box */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '20px',
              background: 'var(--bg-surface)',
              border: `2px solid ${color}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 20px ${color}33`,
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: '2rem', fontWeight: '800', lineHeight: 1, color: color }}>
              {aqi}
            </span>
            <span style={{ fontSize: '0.625rem', fontWeight: '600', color: 'var(--text-muted)', marginTop: '2px', textAlign: 'center' }}>
              {standard ? standard.split(' ')[0] : 'AQI'}
            </span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                Air Condition: <span style={{ color }}>{status}</span>
              </span>
              <span style={{ fontSize: '0.725rem', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                {standard || 'National Standard'}
              </span>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.5 }}>
              {advisory}
            </p>
            {us_aqi !== undefined && cpcb_aqi !== undefined && (
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>National CPCB: <strong style={{ color: 'var(--text-primary)' }}>{cpcb_aqi}</strong></span>
                <span>&bull;</span>
                <span>US EPA: <strong style={{ color: 'var(--text-primary)' }}>{us_aqi}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Right: AQI Spectrum Meter */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
            <span>0 Good</span>
            <span>100 Moderate</span>
            <span>200 Unhealthy</span>
            <span>300+ Hazardous</span>
          </div>
          <div
            style={{
              height: '10px',
              borderRadius: '5px',
              background: 'linear-gradient(to right, #10b981 0%, #eab308 25%, #f97316 50%, #ef4444 70%, #8b5cf6 85%, #881337 100%)',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-4px',
                left: `calc(${barPercent}% - 6px)`,
                width: '12px',
                height: '18px',
                background: '#ffffff',
                border: '2px solid #0f172a',
                borderRadius: '3px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Pollutant Breakdown Matrix */}
      <div>
        <span style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'block' }}>
          Pollutant Concentrations
        </span>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {pollutants.map((p) => (
            <div
              key={p.label}
              style={{
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 0.85rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {p.label}
                </span>
              </div>
              <span style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--accent-glow)', display: 'block', marginTop: '0.2rem' }}>
                {p.value}
              </span>
              <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)', display: 'block' }}>
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AirQualityCard;

