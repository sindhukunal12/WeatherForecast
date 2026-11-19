import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeather } from '../context/WeatherContext';
import FavoriteCard from '../components/FavoriteCard';
import { Heart, Search } from 'lucide-react';

const FavoritesPage = () => {
  const { favorites, fetchFavorites, removeFavorite, fetchWeatherData } = useWeather();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavorites(true);
  }, [fetchFavorites]);

  const handleSelectCity = (cityName) => {
    fetchWeatherData(cityName);
    navigate('/');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            Favorite Cities
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Bookmarked locations stored in SQLite database ({favorites.length} saved)
          </p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <Heart size={28} color="var(--status-error)" />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            No Favorite Cities Saved Yet
          </h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Search for any city on the dashboard and click the heart icon to save it here for quick one-click monitoring.
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.25rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--accent-gradient)',
              color: '#ffffff',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            <Search size={16} />
            <span>Go to Search Dashboard</span>
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {favorites.map((fav) => (
            <FavoriteCard
              key={fav.id}
              favorite={fav}
              onSelect={handleSelectCity}
              onRemove={removeFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;

