export type MovieKind = 'feature' | 'short'

export type MovieSort = 'popular' | 'oldest' | 'newest' | 'rating'

/** What cards and rows need. */
export interface MovieSummary {
  id: number
  title: string
  originalTitle: string
  year: number | null
  runtime: number
  kind: MovieKind
  genreIds: number[]
  rating: number
  posterPath: string | null
  backdropPath: string | null
  /** Watched fraction (0–1), added on the client for Continue Watching. */
  progress?: number
}

export interface Genre {
  id: number
  name: string
}

export interface MovieVideo {
  url: string
  /** Internet Archive item page, for attribution. */
  pageUrl: string
  height: number
  /** Seconds. */
  duration: number
}

export interface MovieDetails extends MovieSummary {
  overview: string
  tagline: string
  releaseDate: string | null
  logoPath: string | null
  genres: Genre[]
  directors: string[]
  cast: string[]
  video: MovieVideo
  similar: MovieSummary[]
}

export interface Paged<T> {
  page: number
  totalPages: number
  totalResults: number
  results: T[]
}

export interface MovieQuery {
  kind?: MovieKind
  genre?: number
  decade?: number
  q?: string
  sort?: MovieSort
  /** Comma-separated ids, returned in that order (My List, Continue Watching). */
  ids?: string
  page?: number
  pageSize?: number
}

export type HomeRow
  = | { type: 'featured' | 'shorts', items: MovieSummary[] }
    | { type: 'decade', decade: number, items: MovieSummary[] }
    | { type: 'genre', genre: Genre, items: MovieSummary[] }

export interface HomeFeed {
  hero: MovieDetails | null
  rows: HomeRow[]
}

export interface Facets {
  genres: (Genre & { count: number })[]
  decades: { decade: number, count: number }[]
}

export interface PlaybackPosition {
  /** Seconds. */
  position: number
  duration: number
}

export interface ContinueWatchingEntry {
  id: number
  updatedAt: number
  playback?: PlaybackPosition
}
