import type { Facets } from '#shared/types/movie'

export default defineEventHandler((event): Facets => facets(readMovieQuery(event).kind, readLocale(event)))
