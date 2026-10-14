import type { H3Event } from 'h3'
import type { MovieKind, MovieQuery } from '#shared/types/movie'

function positiveInt(value: unknown): number | undefined {
  const number = Number(value)
  return Number.isInteger(number) && number > 0 ? number : undefined
}

function text(value: unknown, maxLength: number): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim().slice(0, maxLength) : undefined
}

/** Validated movie filters from the request query string. */
export function readMovieQuery(event: H3Event): MovieQuery {
  const query = getQuery(event)
  const ids = text(query.ids, 2000)
  return {
    kind: query.kind === 'feature' || query.kind === 'short' ? query.kind as MovieKind : undefined,
    genre: positiveInt(query.genre),
    decade: positiveInt(query.decade),
    q: text(query.q, 100),
    sort: isMovieSort(query.sort) ? query.sort : undefined,
    ids: ids && /^\d+(,\d+)*$/.test(ids) ? ids : undefined,
    page: positiveInt(query.page),
    pageSize: positiveInt(query.pageSize),
  }
}

export function readLocale(event: H3Event): Locale {
  return localeFrom(getQuery(event).lang)
}
