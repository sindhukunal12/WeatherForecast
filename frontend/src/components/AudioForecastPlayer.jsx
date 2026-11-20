import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Square, Play, Pause, Sparkles, Mic } from 'lucide-react';

const AudioForecastPlayer = ({ weatherData, forecastData }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // When weatherData changes, stop any ongoing speech from the previous city
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  }, [weatherData?.city]);

  if (!isSupported || !weatherData) return null;

  const buildSpeechNarrative = () => {
    const { city, admin, country, temperature, condition, metrics, rain, aqi } = weatherData;

    // Determine greeting
    const currentHour = new Date().getHours();
    let greeting = 'Hello';
    if (currentHour < 12) greeting = 'Good morning';
    else if (currentHour < 17) greeting = 'Good afternoon';
    else greeting = 'Good evening';

    const locationText = admin ? `${city}, in ${admin}` : country ? `${city}, ${country}` : city;
    const tempUnit = temperature?.unit === '°F' ? 'degrees Fahrenheit' : 'degrees Celsius';
    const windUnit = metrics?.wind_unit || (temperature?.unit === '°F' ? 'miles per hour' : 'kilometers per hour');

    let text = `${greeting}! Here is your live audio weather briefing for ${locationText}. `;

    // Current condition
    text += `Currently, the sky has ${condition?.description || 'clear skies'}, with a temperature of ${Math.round(temperature?.current || 0)} ${tempUnit}. `;
    text += `It feels like ${Math.round(temperature?.feels_like || temperature?.current || 0)} degrees. `;

    // Precipitation & Rain
    if (rain && rain.probability > 0) {
      text += `Rain probability today is ${rain.probability} percent, with approximately ${rain.expected_today_mm || 0} millimeters of rain volume projected. `;
    } else {
      text += `Skies are dry with zero percent likelihood of precipitation today. `;
    }

    // Atmospheric metrics
    text += `Relative humidity is at ${metrics?.humidity || 50} percent, and the wind is blowing at ${metrics?.wind_speed || 0} ${windUnit}. `;

    // Air Quality Index
    if (aqi && aqi.aqi) {
      text += `The Air Quality Index is currently ${aqi.aqi}, indicating ${aqi.status} air quality. `;
      if (aqi.advisory) {
        text += `${aqi.advisory} `;
      }
    }

    // 5-Day Forecast highlight
    if (forecastData && forecastData.daily && forecastData.daily.length > 1) {
      const tomorrow = forecastData.daily[1];
      text += `Looking ahead to tomorrow, expect ${tomorrow.condition} with high temperatures reaching ${Math.round(tomorrow.temp_max)} degrees and lows of ${Math.round(tomorrow.temp_min)} degrees. `;
    }

    text += `Stay safe, stay comfortable, and enjoy your day!`;
    return text;
  };

  const handleStartSpeech = () => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const narrative = buildSpeechNarrative();
    const utterance = new SpeechSynthesisUtterance(narrative);
    utteranceRef.current = utterance;

    // Configure audio voice and pacing
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Natural') ||
          v.name.includes('Google') ||
          v.name.includes('Samantha') ||
          v.name.includes('Zira') ||
          v.name.includes('Female') ||
          v.name.includes('English'))
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
      {!isPlaying ? (
        <button
          type="button"
          onClick={handleStartSpeech}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.45rem 0.95rem',
            borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.12) 0%, rgba(56, 189, 248, 0.08) 100%)',
            border: '1px solid rgba(0, 240, 255, 0.35)',
            color: 'var(--accent-glow)',
            fontSize: '0.825rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            boxShadow: '0 2px 8px rgba(0, 240, 255, 0.15)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 240, 255, 0.22) 0%, rgba(56, 189, 248, 0.18) 100%)';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 240, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 240, 255, 0.12) 0%, rgba(56, 189, 248, 0.08) 100%)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 240, 255, 0.15)';
          }}
          title="Listen to spoken audio weather report for this location"
        >
          <Volume2 size={16} />
          <span>Tell Weather (Audio)</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleStopSpeech}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.45rem 1rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid var(--status-error)',
            color: 'var(--status-error)',
            fontSize: '0.825rem',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 0 15px rgba(239, 68, 68, 0.35)',
            transition: 'all var(--transition-fast)',
          }}
          title="Stop spoken audio"
        >
          {/* Animated sound wave bars */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', height: '14px' }}>
            <span
              style={{
                display: 'inline-block',
                width: '3px',
                height: '100%',
                background: 'var(--status-error)',
                borderRadius: '2px',
                animation: 'pulse 0.6s infinite ease-in-out alternate',
              }}
            />
            <span
              style={{
                display: 'inline-block',
                width: '3px',
                height: '60%',
                background: 'var(--status-error)',
                borderRadius: '2px',
                animation: 'pulse 0.4s infinite ease-in-out alternate',
              }}
            />
            <span
              style={{
                display: 'inline-block',
                width: '3px',
                height: '80%',
                background: 'var(--status-error)',
                borderRadius: '2px',
                animation: 'pulse 0.7s infinite ease-in-out alternate',
              }}
            />
          </div>
          <Square size={13} fill="currentColor" />
          <span>Stop Audio</span>
        </button>
      )}
    </div>
  );
};

export default AudioForecastPlayer;
