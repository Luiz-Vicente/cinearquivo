import type { Facets, Genre, MovieDetails, MovieKind, MovieQuery, MovieSummary, Paged } from '#shared/types/movie'
import catalogData from '../data/catalog.json'
import genreData from '../data/genres.json'

interface LocalizedText {
  title: string
  overview: string
  tagline: string
}

/** One film as written by `scripts/build-catalog.mjs`. */
export interface CatalogEntry {
  id: number
  originalTitle: string
  originalLanguage: string
  releaseDate: string | null
  year: number | null
  runtime: number
  kind: MovieKind
  genreIds: number[]
  rating: number
  votes: number
  posterPath: string | null
  backdropPath: string | null
  logos: Record<Locale, string | null>
  directors: string[]
  cast: string[]
  countries: string[]
  text: Record<Locale, LocalizedText>
  video: { identifier: string, file: string, height: number, duration: number }
  partial: boolean
  sources: string[]
}

const DEFAULT_PAGE_SIZE = 24
const MAX_PAGE_SIZE = 60
/** Below this many votes a TMDB rating is too noisy to rank by. */
const MIN_RATING_VOTES = 20

/** Sorted by TMDB votes: best known first. */
export const catalog = catalogData as CatalogEntry[]
const genres = genreData as Record<Locale, Genre[]>
const byId = new Map(catalog.map(entry => [entry.id, entry]))

// Accent-free titles in every language, for search.
const searchIndex = new Map(catalog.map(entry => [
  entry.id,
  normalizeText([entry.originalTitle, ...LOCALES.map(locale => entry.text[locale].title), ...entry.directors].join(' ')),
]))

export function isLusophone(entry: CatalogEntry): boolean {
  return entry.originalLanguage === 'pt' || entry.countries.some(country => country === 'BR' || country === 'PT')
}

export function localeFrom(value: unknown): Locale {
  return isLocale(value) ? value : 'pt-BR'
}

export function findMovie(id: number): CatalogEntry | undefined {
  return byId.get(id)
}

export function genreList(locale: Locale): Genre[] {
  return genres[locale]
}

export function toSummary(entry: CatalogEntry, locale: Locale): MovieSummary {
  return {
    id: entry.id,
    title: entry.text[locale].title,
    originalTitle: entry.originalTitle,
    year: entry.year,
    runtime: entry.runtime,
    kind: entry.kind,
    genreIds: entry.genreIds,
    rating: entry.rating,
    posterPath: entry.posterPath,
    backdropPath: entry.backdropPath,
    partial: entry.partial,
  }
}

/** Shares genres and era with the given film, closest first. */
function similarTo(entry: CatalogEntry, limit = 12): CatalogEntry[] {
  const decade = decadeOf(entry.year)
  return catalog
    .filter(other => other.id !== entry.id && other.kind === entry.kind)
    .map(other => ({
      other,
      score: other.genreIds.filter(genre => entry.genreIds.includes(genre)).length * 2
        + (decadeOf(other.year) === decade ? 1 : 0),
    }))
    .filter(({ score }) => score > 1)
    .sort((a, b) => b.score - a.score || b.other.votes - a.other.votes)
    .slice(0, limit)
    .map(({ other }) => other)
}

export function toDetails(entry: CatalogEntry, locale: Locale): MovieDetails {
  const genreNames = new Map(genres[locale].map(genre => [genre.id, genre.name]))
  return {
    ...toSummary(entry, locale),
    overview: entry.text[locale].overview,
    tagline: entry.text[locale].tagline,
    releaseDate: entry.releaseDate,
    logoPath: entry.logos[locale],
    genres: entry.genreIds.flatMap(id => genreNames.has(id) ? [{ id, name: genreNames.get(id)! }] : []),
    directors: entry.directors,
    cast: entry.cast,
    video: {
      url: archiveVideoUrl(entry.video.identifier, entry.video.file),
      pageUrl: archivePageUrl(entry.video.identifier),
      height: entry.video.height,
      duration: entry.video.duration,
    },
    similar: similarTo(entry).map(other => toSummary(other, locale)),
  }
}

function matchesSearch(entry: CatalogEntry, terms: string[]): boolean {
  const haystack = searchIndex.get(entry.id) ?? ''
  return terms.every(term => haystack.includes(term))
}

export function queryMovies(query: MovieQuery): CatalogEntry[] {
  if (query.ids) {
    return query.ids.split(',').map(Number).flatMap(id => byId.get(id) ?? [])
  }

  const terms = query.q ? normalizeText(query.q).split(' ').filter(Boolean) : []
  const countries = query.country?.split(',')
  const results = catalog.filter(entry =>
    (!query.kind || entry.kind === query.kind)
    && (!query.genre || entry.genreIds.includes(query.genre))
    && (!query.decade || decadeOf(entry.year) === query.decade)
    && (!countries || entry.countries.some(country => countries.includes(country)))
    && (!query.lusophone || isLusophone(entry))
    && (!terms.length || matchesSearch(entry, terms)))

  switch (query.sort) {
    case 'oldest':
      return results.toSorted((a, b) => (a.year ?? 9999) - (b.year ?? 9999))
    case 'newest':
      return results.toSorted((a, b) => (b.year ?? 0) - (a.year ?? 0))
    case 'rating':
      return results.toSorted((a, b) =>
        Number(b.votes >= MIN_RATING_VOTES) - Number(a.votes >= MIN_RATING_VOTES) || b.rating - a.rating)
    default:
      return results
  }
}

export function paginate(entries: CatalogEntry[], query: MovieQuery, locale: Locale): Paged<MovieSummary> {
  const pageSize = Math.min(Math.max(query.pageSize ?? DEFAULT_PAGE_SIZE, 1), MAX_PAGE_SIZE)
  const page = Math.max(query.page ?? 1, 1)
  return {
    page,
    totalPages: Math.ceil(entries.length / pageSize),
    totalResults: entries.length,
    results: entries.slice((page - 1) * pageSize, page * pageSize).map(entry => toSummary(entry, locale)),
  }
}

/** Genres, decades and countries that have films of the given kind. */
export function facets(locale: Locale, kind?: MovieKind, lusophone?: boolean): Facets {
  const entries = catalog.filter(entry => (!kind || entry.kind === kind) && (!lusophone || isLusophone(entry)))
  const genreCounts = new Map<number, number>()
  const decadeCounts = new Map<number, number>()
  const countryCounts = new Map<string, number>()
  for (const entry of entries) {
    entry.genreIds.forEach(id => genreCounts.set(id, (genreCounts.get(id) ?? 0) + 1))
    entry.countries.forEach(code => countryCounts.set(code, (countryCounts.get(code) ?? 0) + 1))
    const decade = decadeOf(entry.year)
    if (decade) decadeCounts.set(decade, (decadeCounts.get(decade) ?? 0) + 1)
  }
  return {
    genres: genres[locale]
      .filter(genre => (genreCounts.get(genre.id) ?? 0) > 0)
      .map(genre => ({ ...genre, count: genreCounts.get(genre.id)! })),
    decades: [...decadeCounts].sort(([a], [b]) => a - b).map(([decade, count]) => ({ decade, count })),
    countries: [...countryCounts].sort(([, a], [, b]) => b - a).map(([code, count]) => ({ code, count })),
  }
}
