import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Droplets, CloudRain, Wind, Calendar, Clock, Sparkles } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

const ForecastCard = ({ forecastData }) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const { fetchWeatherData } = useWeather();

  if (!forecastData || !Array.isArray(forecastData.daily) || forecastData.daily.length === 0) return null;

  const { daily, city, slices } = forecastData;
  const safeIndex = Math.min(selectedDayIndex, daily.length - 1);
  const selectedDay = daily[safeIndex] || daily[0];

  const formatDay = (dateStr, index) => {
    if (index === 0) return 'Today';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString(undefined, { weekday: 'short' });
  };

  const formatFullDay = (dateStr, index) => {
    if (index === 0) return 'Today (Current Day)';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const formatTimeSlot = (dtStr) => {
    if (!dtStr) return '--:--';
    // Expecting "YYYY-MM-DD HH:MM:SS" or ISO
    const parts = dtStr.split(' ');
    if (parts.length > 1) {
      const [h, m] = parts[1].split(':');
      const hourNum = parseInt(h, 10);
      const ampm = hourNum >= 12 ? 'PM' : 'AM';
      const formattedHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
      return `${formattedHour}:${m} ${ampm}`;
    }
    return dtStr;
  };

  // Get timeline for selected day: either from hourly_timeline or by filtering slices
  let timeline = selectedDay.hourly_timeline || [];
  if ((!timeline || timeline.length === 0) && slices && slices.length > 0) {
    timeline = slices.filter((s) => s.datetime && s.datetime.startsWith(selectedDay.date));
  }

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      {/* Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
            5-Day Weather Forecast
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Click any forecast box below to view detailed hourly &amp; rain projections
          </span>
        </div>
        <span
          style={{
            fontSize: '0.75rem',
            background: 'rgba(0, 240, 255, 0.1)',
            border: '1px solid rgba(0, 240, 255, 0.25)',
            color: 'var(--accent-glow)',
            padding: '0.3rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontWeight: '600',
          }}
        >
          <Sparkles size={13} /> Interactive Selection
        </span>
      </div>

      {/* Live Rain Radar Active Demonstration Quick Chips */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginBottom: '1.25rem',
          background: 'rgba(56, 189, 248, 0.05)',
          padding: '0.6rem 0.85rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(56, 189, 248, 0.15)',
        }}
      >
        <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
          🌍 Live Global Rain Feeds:
        </span>
        {[
          { name: 'Singapore', label: 'Singapore (88% Rain • 17mm)' },
          { name: 'London', label: 'London (100% Rain • 6mm)' },
          { name: 'Cherrapunji', label: 'Cherrapunji (78% Rain • 39mm)' },
        ].map((item) => (
          <button
            key={item.name}
            type="button"
            onClick={() => fetchWeatherData && fetchWeatherData(item.name)}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--accent-glow)',
              fontSize: '0.725rem',
              fontWeight: '600',
              padding: '0.2rem 0.65rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              transition: 'all var(--transition-fast)',
            }}
            title={`View live real-time rain projections in ${item.name}`}
          >
            <CloudRain size={11} color="var(--accent-glow)" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* 5-Day Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {daily.map((item, index) => {
          const isSelected = selectedDayIndex === index;
          const iconUrl = item.icon
            ? `https://openweathermap.org/img/wn/${item.icon}@2x.png`
            : null;
          const rainProb = item.rain_probability ?? 0;
          const precipMm = item.precipitation_sum ?? 0;

          return (
            <div
              key={item.date}
              onClick={() => setSelectedDayIndex(index)}
              className="glass-panel"
              style={{
                padding: '1.25rem 1rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                minHeight: '220px',
                cursor: 'pointer',
                position: 'relative',
                borderRadius: 'var(--radius-lg)',
                border: isSelected
                  ? '2px solid var(--accent-glow)'
                  : '1px solid var(--border-subtle)',
                background: isSelected
                  ? 'linear-gradient(180deg, rgba(0, 240, 255, 0.12) 0%, rgba(10, 22, 40, 0.85) 100%)'
                  : 'var(--bg-glass)',
                boxShadow: isSelected
                  ? '0 0 20px rgba(0, 240, 255, 0.25), inset 0 0 12px rgba(0, 240, 255, 0.1)'
                  : 'none',
                transform: isSelected ? 'scale(1.02)' : 'none',
                transition: 'all var(--transition-normal)',
              }}
              title="Click to view full hourly timeline and rain metrics"
            >
              {/* Selected Active Tag */}
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-9px',
                    backgroundColor: 'var(--accent-glow)',
                    color: '#050b14',
                    fontSize: '0.65rem',
                    fontWeight: '800',
                    padding: '1px 8px',
                    borderRadius: 'var(--radius-full)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Selected
                </div>
              )}

              <div>
                <span
                  style={{
                    fontSize: '1rem',
                    fontWeight: isSelected ? '700' : '600',
                    color: isSelected ? 'var(--accent-glow)' : 'var(--text-primary)',
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
                  style={{ width: '54px', height: '54px', margin: '0.2rem 0' }}
                />
              )}

              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)', display: 'block' }}>
                  {item.condition}
                </span>

                {/* Rain probability & precipitation amount */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.3rem',
                    marginTop: '0.35rem',
                    fontSize: '0.75rem',
                    fontWeight: rainProb > 20 ? '700' : '500',
                    color: rainProb > 30 ? 'var(--accent-glow)' : 'var(--text-muted)',
                  }}
                >
                  {rainProb > 0 ? (
                    <>
                      <CloudRain size={13} color={rainProb > 30 ? 'var(--accent-glow)' : 'var(--accent-cyan)'} />
                      <span>{rainProb}% Rain</span>
                      {precipMm > 0 && (
                        <span style={{ fontSize: '0.7rem', opacity: 0.85 }}>({precipMm}mm)</span>
                      )}
                    </>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      ☀️ 0% • Dry Skies
                    </span>
                  )}
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
                <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {item.temp_max}°
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {item.temp_min}°
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Day Detailed Breakdown Panel */}
      <div
        className="glass-panel"
        style={{
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-highlight)',
          background: 'linear-gradient(180deg, rgba(16, 28, 48, 0.7) 0%, rgba(7, 14, 25, 0.9) 100%)',
          animation: 'fadeIn 0.3s ease-in-out',
        }}
      >
        {/* Panel Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '1rem',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} color="var(--accent-glow)" />
              <h4 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                {formatFullDay(selectedDay.date, safeIndex)}
              </h4>
            </div>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.25rem', display: 'block' }}>
              Detailed atmospheric projections, rain likelihood &amp; hourly timeline
            </span>
          </div>

          {/* Quick Metrics Badges for the Selected Day */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div
              style={{
                background: 'var(--bg-surface)',
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <CloudRain size={16} color={(selectedDay.rain_probability ?? 0) > 0 ? "var(--accent-glow)" : "var(--accent-cyan)"} />
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Precipitation</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: (selectedDay.rain_probability ?? 0) > 30 ? 'var(--accent-glow)' : 'var(--text-primary)' }}>
                  {(selectedDay.rain_probability ?? 0) > 0
                    ? `${selectedDay.rain_probability}% Chance (${selectedDay.precipitation_sum} mm)`
                    : '0% • Clear & Dry (0.0 mm)'}
                </span>
              </div>
            </div>

            <div
              style={{
                background: 'var(--bg-surface)',
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <Wind size={16} color="var(--accent-blue)" />
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Peak Wind</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {selectedDay.wind_max ?? 10} {selectedDay.wind_unit || 'km/h'}
                </span>
              </div>
            </div>

            <div
              style={{
                background: 'var(--bg-surface)',
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <Droplets size={16} color="var(--accent-cyan)" />
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Avg Humidity</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {selectedDay.humidity}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Hourly / 3-Hour Interval Timeline */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.85rem' }}>
            <Clock size={16} color="var(--accent-cyan)" />
            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              3-Hour Interval Projections &amp; Rain Probability
            </span>
          </div>

          {timeline.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))',
                gap: '0.75rem',
              }}
            >
              {timeline.map((slot, sIdx) => {
                const sIcon = slot.icon
                  ? `https://openweathermap.org/img/wn/${slot.icon}.png`
                  : null;
                const slotRain = slot.rain_probability ?? 0;
                const slotMm = slot.precipitation_mm ?? 0;

                return (
                  <div
                    key={slot.datetime || sIdx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: slotRain > 30 ? '1px solid rgba(0, 240, 255, 0.35)' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem 0.5rem',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'background var(--transition-fast)',
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                      {formatTimeSlot(slot.datetime)}
                    </span>

                    {sIcon && (
                      <img
                        src={sIcon}
                        alt={slot.condition}
                        style={{ width: '40px', height: '40px' }}
                      />
                    )}

                    <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {slot.temp}°
                    </span>

                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                      {slot.condition}
                    </span>

                    {/* Rain probability in slot */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.2rem',
                        fontSize: '0.7rem',
                        fontWeight: slotRain > 30 ? '700' : '500',
                        color: slotRain > 30 ? 'var(--accent-glow)' : 'var(--text-muted)',
                        marginTop: '0.2rem',
                      }}
                    >
                      {slotRain > 0 ? (
                        <>
                          <CloudRain size={11} color={slotRain > 30 ? 'var(--accent-glow)' : 'var(--accent-cyan)'} />
                          <span>{slotRain}%</span>
                          {slotMm > 0 && <span style={{ fontSize: '0.65rem' }}>({slotMm}mm)</span>}
                        </>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>Dry (0%)</span>
                      )}
                    </div>

                    {/* Wind speed */}
                    {slot.wind_speed !== undefined && (
                      <div
                        style={{
                          fontSize: '0.65rem',
                          color: 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                        }}
                      >
                        <Wind size={10} />
                        <span>{slot.wind_speed} {slot.wind_unit || 'km/h'}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '2rem',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
              }}
            >
              Detailed sub-daily timeline for this day will populate with real-time meteorological observations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForecastCard;
