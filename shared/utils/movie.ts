import type { MovieSort } from '../types/movie'

export const LOCALES = ['pt-BR', 'en'] as const
export type Locale = typeof LOCALES[number]

export const MOVIE_SORTS: MovieSort[] = ['popular', 'oldest', 'newest', 'rating']

export function isLocale(value: unknown): value is Locale {
  return LOCALES.includes(value as Locale)
}

export function isMovieSort(value: unknown): value is MovieSort {
  return MOVIE_SORTS.includes(value as MovieSort)
}

export function decadeOf(year: number | null): number | null {
  return year ? Math.floor(year / 10) * 10 : null
}

/** Lowercase, accent-free and alphanumeric only, for forgiving search. */
export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export function formatRuntime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest ? `${hours} h ${rest} min` : `${hours} h`
}
