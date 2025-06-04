import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FilmShortInfo {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

interface FilmState {
  likedFilms: FilmShortInfo[];
  defaultFilms: FilmShortInfo[]; // Добавляем предустановленные фильмы
  likeFilm: (film: FilmShortInfo) => void;
  unlikeFilm: (imdbID: string) => void;
  isFilmLiked: (imdbID: string) => boolean;
}

// Предустановленные фильмы с картинками
const DEFAULT_FILMS: FilmShortInfo[] = [
  {
    Title: "Убийство в городе",
    Year: "2022",
    imdbID: "tt1234567",
    Type: "movie",
    Poster: "https://www.kino-teatr.ru/movie/posters/big/0/1/185910.jpg"
  },
  {
    Title: "Астрал",
    Year: "2010",
    imdbID: "tt1591095",
    Type: "movie",
    Poster: "https://upload.wikimedia.org/wikipedia/ru/6/61/Insidious_2011.jpg"
  },
  {
    Title: "Зверополис",
    Year: "2016",
    imdbID: "tt2948356",
    Type: "movie",
    Poster: "https://upload.wikimedia.org/wikipedia/ru/thumb/6/6c/Зверополис_2.jpg/330px-Зверополис_2.jpg"
  },
  {
    Title: "Тачки",
    Year: "2006",
    imdbID: "tt0317219",
    Type: "movie",
    Poster: "https://upload.wikimedia.org/wikipedia/ru/7/7c/Тачки_постер.jpg"
  }
];

export const useFilmStore = create<FilmState>()(
  persist(
    (set, get) => ({
      likedFilms: [],
      defaultFilms: DEFAULT_FILMS, // Инициализируем предустановленные фильмы
      likeFilm: (film) => set((state) => ({ likedFilms: [...state.likedFilms, film] })),
      unlikeFilm: (imdbID) =>
        set((state) => ({
          likedFilms: state.likedFilms.filter((film) => film.imdbID !== imdbID),
        })),
      isFilmLiked: (imdbID) => get().likedFilms.some((film) => film.imdbID === imdbID),
    }),
    {
      name: 'films-storage',
    }
  )
);