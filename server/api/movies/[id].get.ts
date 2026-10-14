import type { MovieDetails } from '#shared/types/movie'

export default defineEventHandler((event): MovieDetails => {
  const entry = findMovie(Number(getRouterParam(event, 'id')))
  if (!entry) throw createError({ statusCode: 404, statusMessage: 'Movie not found' })
  return toDetails(entry, readLocale(event))
})
