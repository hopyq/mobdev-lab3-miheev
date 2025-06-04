import axios from 'axios';

const API_KEY = '505480d7';
const BASE_URL = 'https://www.omdbapi.com/';

export const omdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    apikey: API_KEY,
    r: 'json', // формат ответа
    v: '1', // версия API
    type: 'movie', // только фильмы
  },
});

// Типы для ответов API
export interface FilmShortInfo {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface FilmFullInfo extends FilmShortInfo {
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Ratings: {
    Source: string;
    Value: string;
  }[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

export interface ApiResponse {
  Search: FilmShortInfo[];
  totalResults: string;
  Response: string;
  Error?: string;
}

// Функция для поиска фильмов с русской локализацией
export const searchFilms = async (title: string) => {
  const response = await omdbApi.get('', {
    params: {
      s: title,
      page: 1,
      y: '', // год (пустое значение - все годы)
      plot: 'short', // короткое описание
    }
  });
  return response.data;
};

// Функция для получения деталей фильма с русской локализацией
export const getFilmDetails = async (imdbID: string) => {
  const response = await omdbApi.get('', {
    params: {
      i: imdbID,
      plot: 'full', // полное описание
    }
  });
  return response.data;
};