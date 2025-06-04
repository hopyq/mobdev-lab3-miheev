import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/Button/Button';
import { Input } from '@/shared/components/Input/Input';
import { searchFilms } from '@/shared/api/omdbApi';
import { useFilmStore } from '@/features/film/model/filmStore';

export const FilmSearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [films, setFilms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { likeFilm, isFilmLiked, defaultFilms } = useFilmStore();

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setFilms(defaultFilms);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const data = await searchFilms(searchTerm);
      
      if (data.Response === 'True') {
        setFilms(data.Search);
      } else {
        setError(data.Error || 'Фильмы не найдены. Попробуйте изменить запрос.');
        setFilms([]);
      }
    } catch (err) {
      setError('Произошла ошибка при поиске фильмов. Проверьте соединение.');
      setFilms([]);
    } finally {
      setLoading(false);
    }
  };

  // При первой загрузке показываем дефолтные фильмы
  React.useEffect(() => {
    setFilms(defaultFilms);
  }, [defaultFilms]);

  const handleFilmClick = (imdbID: string) => {
    navigate(`/film/${imdbID}`);
  };

  return (
    <div>
      <h1>Поиск фильмов</h1>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Введите название фильма"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? 'Поиск...' : 'Найти'}
        </Button>
      </div>
      
      {error && <div style={{ color: 'red', margin: '1rem 0' }}>{error}</div>}
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem',
        marginTop: '2rem'
      }}>
        {films.map((film) => (
          <div key={film.imdbID} style={{ 
            border: '1px solid #444', 
            borderRadius: '8px', 
            padding: '1rem',
            transition: 'transform 0.3s',
            ':hover': { transform: 'translateY(-5px)' }
          }}>
            <img
              src={film.Poster !== 'N/A' ? film.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'}
              alt={film.Title}
              onClick={() => handleFilmClick(film.imdbID)}
              style={{ width: '100%', cursor: 'pointer' }}
            />
            <div>
              <h3 onClick={() => handleFilmClick(film.imdbID)} style={{ cursor: 'pointer' }}>{film.Title}</h3>
              <p>{film.Year}</p>
              <button
                onClick={() => isFilmLiked(film.imdbID) ? unlikeFilm(film.imdbID) : likeFilm(film)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  color: isFilmLiked(film.imdbID) ? 'red' : 'inherit'
                }}
              >
                {isFilmLiked(film.imdbID) ? '❤️ В избранном' : '🤍 Добавить в избранное'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};