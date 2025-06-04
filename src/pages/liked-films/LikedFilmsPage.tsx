import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFilmStore } from '@/features/film/model/filmStore';

export const LikedFilmsPage: React.FC = () => {
  const { likedFilms, unlikeFilm, defaultFilms } = useFilmStore();
  const navigate = useNavigate();

  const handleFilmClick = (imdbID: string) => {
    navigate(`/film/${imdbID}`);
  };

  // Получаем полную информацию о лайкнутых фильмах (из defaultFilms или API)
  const getFullFilmInfo = (imdbID: string) => {
    return defaultFilms.find(f => f.imdbID === imdbID) || likedFilms.find(f => f.imdbID === imdbID);
  };

  return (
    <div>
      <h1>Избранные фильмы</h1>
      
      {likedFilms.length === 0 ? (
        <p>У вас пока нет избранных фильмов.</p>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
          marginTop: '2rem'
        }}>
          {likedFilms.map((film) => {
            const fullFilm = getFullFilmInfo(film.imdbID) || film;
            return (
              <div key={film.imdbID} style={{ 
                border: '1px solid #444', 
                borderRadius: '8px', 
                padding: '1rem'
              }}>
                <img
                  src={fullFilm.Poster !== 'N/A' ? fullFilm.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'}
                  alt={fullFilm.Title}
                  onClick={() => handleFilmClick(film.imdbID)}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
                <div>
                  <h3 
                    onClick={() => handleFilmClick(film.imdbID)}
                    style={{ cursor: 'pointer' }}
                  >
                    {fullFilm.Title}
                  </h3>
                  <p>{fullFilm.Year}</p>
                  <button 
                    onClick={() => unlikeFilm(film.imdbID)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer',
                      color: 'red'
                    }}
                  >
                    ❌ Удалить из избранного
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};