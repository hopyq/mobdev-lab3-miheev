import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { FilmSearchPage } from '@/pages/film-search/FilmSearchPage';
import { FilmDetailsPage } from '@/pages/film-details/FilmDetailsPage';
import { LikedFilmsPage } from '@/pages/liked-films/LikedFilmsPage';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <nav style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#646cff' }}>Поиск фильмов</Link>
        <Link to="/liked" style={{ textDecoration: 'none', color: '#646cff' }}>Избранное</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<FilmSearchPage />} />
        <Route path="/film/:imdbID" element={<FilmDetailsPage />} />
        <Route path="/liked" element={<LikedFilmsPage />} />
      </Routes>
    </BrowserRouter>
  );
};