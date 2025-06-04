import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFilmDetails } from '@/shared/api/omdbApi';
import { useFilmStore } from '@/features/film/model/filmStore';
import { Button } from '@/shared/components/Button/Button';

// Функция для перевода полей на русский
const translateField = (field: string) => {
  const translations: Record<string, string> = {
    'Title': 'Название',
    'Year': 'Год',
    'Rated': 'Рейтинг',
    'Released': 'Дата выхода',
    'Runtime': 'Продолжительность',
    'Genre': 'Жанр',
    'Director': 'Режиссер',
    'Writer': 'Сценарист',
    'Actors': 'Актеры',
    'Plot': 'Сюжет',
    'Language': 'Язык',
    'Country': 'Страна',
    'Awards': 'Награды',
    'Poster': 'Постер',
    'Ratings': 'Рейтинги',
    'Metascore': 'Metascore',
    'imdbRating': 'Рейтинг IMDb',
    'imdbVotes': 'Голосов на IMDb',
    'imdbID': 'ID IMDb',
    'Type': 'Тип',
    'DVD': 'Дата выхода DVD',
    'BoxOffice': 'Сборы',
    'Production': 'Производство',
    'Website': 'Сайт',
    'Response': 'Ответ'
  };

  return translations[field] || field;
};

export const FilmDetailsPage: React.FC = () => {
  const { imdbID } = useParams<{ imdbID: string }>();
  const [film, setFilm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { likeFilm, unlikeFilm, isFilmLiked, defaultFilms } = useFilmStore();

  useEffect(() => {
    const fetchFilmDetails = async () => {
      try {
        // Сначала проверяем дефолтные фильмы
        const defaultFilm = defaultFilms.find(f => f.imdbID === imdbID);
        if (defaultFilm) {
          setFilm(defaultFilm);
          return;
        }

        // Если не нашли в дефолтных, запрашиваем из API
        const data = await getFilmDetails(imdbID || '');
        
        if (data.Response === 'True') {
          setFilm(data);
        } else {
          setError(data.Error || 'Фильм не найден');
        }
      } catch (err) {
        setError('Произошла ошибка при загрузке фильма');
      } finally {
        setLoading(false);
      }
    };

    fetchFilmDetails();
  }, [imdbID, defaultFilms]);

  const handleLikeClick = () => {
    if (!film) return;
    
    if (isFilmLiked(film.imdbID)) {
      unlikeFilm(film.imdbID);
    } else {
      likeFilm({
        Title: film.Title,
        Year: film.Year,
        imdbID: film.imdbID,
        Type: film.Type,
        Poster: film.Poster,
      });
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;
  if (!film) return <div>Фильм не найден</div>;

  return (
    <div>
      <Button onClick={() => navigate(-1)}>Назад к поиску</Button>
      
      <div style={{ 
        display: 'flex', 
        gap: '2rem', 
        marginTop: '2rem',
        textAlign: 'left'
      }}>
        <div style={{ flex: '0 0 300px' }}>
          <img
            src={film.Poster !== 'N/A' ? film.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'}
            alt={film.Title}
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </div>
        
        <div style={{ flex: 1 }}>
          <h1>{film.Title} ({film.Year})</h1>
          
          <button
            onClick={handleLikeClick}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              color: isFilmLiked(film.imdbID) ? 'red' : 'inherit',
              fontSize: '1rem',
              marginBottom: '1rem'
            }}
          >
            {isFilmLiked(film.imdbID) ? '❤️ В избранном' : '🤍 Добавить в избранное'}
          </button>
          
          {Object.entries(film).map(([key, value]) => {
            // Пропускаем технические поля и поля, которые уже отобразили
            if (['Title', 'Year', 'Poster', 'Response', 'imdbID', 'Type'].includes(key)) return null;
            
            // Обрабатываем рейтинги отдельно
            if (key === 'Ratings') {
              return (
                <div key={key}>
                  <h3>{translateField(key)}:</h3>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {(value as any[]).map((rating, index) => (
                      <li key={index}>
                        <strong>{rating.Source}:</strong> {rating.Value}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }
            
            // Для остальных полей
            return (
              <p key={key}>
                <strong>{translateField(key)}:</strong> {value}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
};