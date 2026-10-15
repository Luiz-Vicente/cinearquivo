import type { Facets } from '#shared/types/movie'

export default defineEventHandler((event): Facets => {
  const { kind, lusophone } = readMovieQuery(event)
  return facets(readLocale(event), kind, lusophone)
})
