import type { HomeFeed, HomeRow } from '#shared/types/movie'

const ROW_SIZE = 18
const MIN_ROW_SIZE = 6
const HERO_POOL = 40
const DECADES = [1910, 1920, 1930, 1940, 1950, 1960]
/** Horror, comedy, sci-fi, mystery, western, romance. */
const GENRE_ROWS = [27, 35, 878, 9648, 37, 10749]

export default defineEventHandler((event): HomeFeed => {
  const locale = readLocale(event)
  const summaries = (entries: CatalogEntry[]) => entries.slice(0, ROW_SIZE).map(entry => toSummary(entry, locale))
  const features = catalog.filter(entry => entry.kind === 'feature')

  // Rotates daily among the best known features, the same for everyone.
  const heroPool = features.filter(entry => entry.backdropPath && entry.text[locale].overview).slice(0, HERO_POOL)
  const hero = heroPool[Math.floor(Date.now() / 86_400_000) % heroPool.length]

  const genreNames = new Map(genreList(locale).map(genre => [genre.id, genre]))
  const rows: HomeRow[] = [
    { type: 'featured', items: summaries(features) },
    { type: 'shorts', items: summaries(catalog.filter(entry => entry.kind === 'short')) },
    ...DECADES.map(decade => ({
      type: 'decade' as const,
      decade,
      items: summaries(features.filter(entry => decadeOf(entry.year) === decade)),
    })),
    ...GENRE_ROWS.flatMap(id => genreNames.has(id)
      ? [{ type: 'genre' as const, genre: genreNames.get(id)!, items: summaries(features.filter(entry => entry.genreIds.includes(id))) }]
      : []),
  ]

  return {
    hero: hero ? toDetails(hero, locale) : null,
    rows: rows.filter(row => row.items.length >= MIN_ROW_SIZE),
  }
})
