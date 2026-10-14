import type { MovieSummary, Paged } from '#shared/types/movie'

export default defineEventHandler((event): Paged<MovieSummary> => {
  const query = readMovieQuery(event)
  return paginate(queryMovies(query), query, readLocale(event))
})
