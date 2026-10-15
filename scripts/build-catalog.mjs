/**
 * Builds the CineArquivo catalog: public domain films playable from the Internet Archive,
 * with TMDB metadata baked in for every supported language.
 *
 * Upload licenses on the Internet Archive are self-declared and often wrong, so a film only
 * gets in through one of these routes:
 * 1. Wikidata marks it public domain (P6216) and links an Internet Archive item (P724),
 *    plus a TMDB id (P4947) or an IMDb id (P345) resolved through TMDB.
 * 2. Wikidata links an Internet Archive item and a TMDB id, and it was published up to
 *    PUBLIC_DOMAIN_YEAR: public domain in the US by age (95 years after publication).
 * 3. An Internet Archive film collection item matches a TMDB movie by exact title, year and
 *    runtime, and TMDB dates the release up to PUBLIC_DOMAIN_YEAR.
 * 4. Same as 3 for Brazilian and Portuguese films, found by language and subject anywhere on the
 *    Internet Archive (they rarely sit in the big film collections).
 * Anything Wikidata marks as copyrighted is dropped, and a public domain mark limited to another
 * country doesn't count. Each film also needs a browser-playable MP4 that isn't a modern disc or
 * web rip, nor a dubbed, subtitled or colorized version (those add new copyrighted work). Its
 * length must match the TMDB runtime, so trailers and partial uploads are skipped; when the
 * film's identity is certain (Wikidata or an exact Portuguese title match), a surviving fragment
 * is accepted and flagged as partial.
 *
 * Run with `pnpm catalog` (needs NUXT_TMDB_TOKEN). Responses are cached in `.cache/catalog`,
 * so reruns are fast; pass `--fresh` to start over.
 *
 * Outputs server/data/catalog.json and server/data/genres.json.
 */
import { createHash } from 'node:crypto'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'

const PUBLIC_DOMAIN_YEAR = new Date().getFullYear() - 96
const LOCALES = { 'pt-BR': { language: 'pt', region: 'BR' }, 'en': { language: 'en', region: 'US' } }
const SHORT_MAX_MINUTES = 40
const MIN_DURATION = 60
const RUNTIME_TOLERANCE = 0.4
/** Very short films get at least this much slack (minutes), since speeds vary between copies. */
const RUNTIME_SLACK = 2
/** A fragment must keep at least this share of the film to be worth showing. */
const MIN_FRAGMENT_SHARE = 0.15
const CONCURRENCY = 8
const CAST_SIZE = 8
const VIDEO_FORMATS = new Set(['h.264', 'h.264 HD', 'h.264 IA', 'MPEG4', '512Kb MPEG4'])
// Modern disc and web rips can carry newly recorded scores or restorations with their own rights.
// Dubs, translated subtitles and colorization are new works with their own rights.
const DERIVATIVE_PATTERN = /dublad|legendad|dubbed|subtitled|\bsubs?\b|colori[zds]|colorid/i
const RIP_PATTERN = /bd-?rip|blu-?ray|remux|web-?dl|web-?rip|hdrip|x26[45]|criterion|kino[\s._-]?lorber|masters[\s._-]?of[\s._-]?cinema|yify|yts|sadpanda|\bptp_/i
const ARCHIVE_COLLECTIONS = ['silent_films', 'feature_films', 'classic_cartoons', 'Comedy_Films', 'Film_Noir', 'SciFi_Horror', 'moviesandfilms']
const USER_AGENT = 'CineArquivo-catalog/1.0 (personal, non-commercial project)'
const CACHE_DIR = new URL('../.cache/catalog/', import.meta.url)

const COPYRIGHTED = 'FILTER NOT EXISTS { ?film wdt:P6216 wd:Q50423863 }'
// Public domain statements limited to another country (e.g. only in India) don't count.
const PUBLIC_DOMAIN_HERE = `?film p:P6216 ?status . ?status ps:P6216 wd:Q19652 .
    FILTER NOT EXISTS { ?status pq:P1001 ?where . FILTER(?where NOT IN (wd:Q30, wd:Q13780930)) }`
const QUERIES = {
  publicDomain: `SELECT ?tmdb (GROUP_CONCAT(DISTINCT ?ia; separator="|") AS ?items) WHERE {
    ${PUBLIC_DOMAIN_HERE}
    ?film wdt:P4947 ?tmdb ; wdt:P724 ?ia . ${COPYRIGHTED}
  } GROUP BY ?tmdb`,
  publicDomainImdb: `SELECT ?imdb (GROUP_CONCAT(DISTINCT ?ia; separator="|") AS ?items) WHERE {
    ${PUBLIC_DOMAIN_HERE}
    ?film wdt:P345 ?imdb ; wdt:P724 ?ia .
    FILTER NOT EXISTS { ?film wdt:P4947 ?tmdb } ${COPYRIGHTED}
  } GROUP BY ?imdb`,
  byAge: `SELECT ?tmdb (GROUP_CONCAT(DISTINCT ?ia; separator="|") AS ?items) WHERE {
    ?film wdt:P4947 ?tmdb ; wdt:P724 ?ia ; wdt:P577 ?date .
    FILTER(YEAR(?date) <= ${PUBLIC_DOMAIN_YEAR}) ${COPYRIGHTED}
  } GROUP BY ?tmdb`,
}

const token = process.env.NUXT_TMDB_TOKEN
if (!token) {
  console.error('NUXT_TMDB_TOKEN is not set.')
  process.exit(1)
}

if (process.argv.includes('--fresh')) await rm(CACHE_DIR, { recursive: true, force: true })
await mkdir(CACHE_DIR, { recursive: true })

/** Runs `task` once per key; the (small) result is kept on disk for later runs. */
async function cached(key, task) {
  const file = new URL(`${createHash('sha1').update(key).digest('hex')}.json`, CACHE_DIR)
  try {
    return JSON.parse(await readFile(file, 'utf8'))
  }
  catch {
    const value = await task()
    await writeFile(file, JSON.stringify(value ?? null))
    return value
  }
}

async function getJson(url, init = {}) {
  for (let attempt = 0; ; attempt++) {
    try {
      const response = await fetch(url, { ...init, headers: { 'User-Agent': USER_AGENT, ...init.headers } })
      if ((response.status === 429 || response.status >= 500) && attempt < 4) {
        await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1)))
        continue
      }
      if (response.status === 404) return null
      if (!response.ok) throw new Error(`${response.status} ${url}`)
      return await response.json()
    }
    catch (error) {
      if (attempt >= 3) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)))
    }
  }
}

function tmdb(path, query = {}) {
  const isApiKey = token.length === 32
  const params = new URLSearchParams({ ...query, ...(isApiKey ? { api_key: token } : {}) })
  return getJson(`https://api.themoviedb.org/3/${path}?${params}`, {
    headers: isApiKey ? {} : { Authorization: `Bearer ${token}` },
  })
}

async function mapLimit(items, task, label) {
  const results = Array.from({ length: items.length })
  let next = 0
  let done = 0
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (next < items.length) {
      const index = next++
      try {
        results[index] = await task(items[index])
      }
      catch (error) {
        console.warn(`  skip: ${error.message}`)
      }
      if (++done % 250 === 0) console.log(`  ${label}: ${done}/${items.length}`)
    }
  }))
  return results
}

function normalize(title) {
  return title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/^(the|a|an)\s+/, '')
    .replace(/[^a-z0-9]/g, '')
}

/**
 * "Nosferatu (1922) [HD]" → "Nosferatu", "1930 - Lábios sem beijos" → "Lábios sem beijos",
 * "Segredo do corcunda, O (Alberto Traversa, 1924)" → "O Segredo do corcunda"
 */
function cleanTitle(title) {
  const clean = title
    .replace(/[([{].*?[)\]}]/g, '')
    .replace(/^\d{4}\s*[-–]\s*/, '')
    .replace(/\s*[-–]\s*(segundo\s+|primeiro\s+)?fragmento.*$/i, '')
    .replace(/\s+/g, ' ')
    .trim()
  const article = /^(.+),\s*(o|a|os|as|the)$/i.exec(clean)
  return article ? `${article[2]} ${article[1]}` : clean
}

const yearOf = date => Number(String(date ?? '').slice(0, 4)) || null

// ---------------------------------------------------------------- sources

/** tmdbId → { items: Set<identifier>, sources: Set<string> } */
const candidates = new Map()
function addCandidate(tmdbId, items, source) {
  if (!Number.isInteger(tmdbId) || tmdbId <= 0) return
  const entry = candidates.get(tmdbId) ?? { items: new Set(), sources: new Set() }
  items.forEach(item => entry.items.add(item))
  entry.sources.add(source)
  candidates.set(tmdbId, entry)
}

async function wikidata(query) {
  const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}`
  const data = await cached(`wikidata:${query}:${new Date().toISOString().slice(0, 10)}`, () =>
    getJson(url, { headers: { Accept: 'application/sparql-results+json' } }))
  return data.results.bindings
}

console.log(`Public domain cutoff: ${PUBLIC_DOMAIN_YEAR}`)

for (const row of await wikidata(QUERIES.publicDomain)) {
  addCandidate(Number(row.tmdb.value), row.items.value.split('|'), 'wikidata-pd')
}
console.log(`wikidata public domain: ${candidates.size}`)

const imdbRows = await wikidata(QUERIES.publicDomainImdb)
await mapLimit(imdbRows, async (row) => {
  const found = await cached(`find:${row.imdb.value}`, () => tmdb(`find/${row.imdb.value}`, { external_source: 'imdb_id' }))
  const movie = found?.movie_results?.[0]
  if (movie) addCandidate(movie.id, row.items.value.split('|'), 'wikidata-pd')
}, 'imdb')
console.log(`+ imdb only: ${candidates.size}`)

for (const row of await wikidata(QUERIES.byAge)) {
  addCandidate(Number(row.tmdb.value), row.items.value.split('|'), 'wikidata-age')
}
console.log(`+ wikidata by age: ${candidates.size}`)

const LUSOPHONE_FILTER = [
  'language:(por OR portuguese OR "português" OR portugues)',
  'subject:(brasil OR brazil OR brasileiro OR "cinema brasileiro" OR "brazilian cinema" OR portugal OR "cinema português" OR "cinema portugues")',
  'title:(BRA OR POR)',
].join(' OR ')

async function archiveSearch(filter) {
  const params = new URLSearchParams({
    q: `mediatype:movies AND (${filter}) AND year:[1880 TO ${PUBLIC_DOMAIN_YEAR}]`,
    rows: '20000',
    output: 'json',
  })
  for (const field of ['identifier', 'title', 'year']) params.append('fl[]', field)
  const data = await cached(`archive-search:${params}:${new Date().toISOString().slice(0, 10)}`, () =>
    getJson(`https://archive.org/advancedsearch.php?${params}`))
  return data.response.docs
}

/** Exact title + year match on TMDB, only for releases old enough to be public domain. */
async function matchArchiveItem(doc, source) {
  const rawTitle = String(Array.isArray(doc.title) ? doc.title[0] : doc.title ?? '')
  if (DERIVATIVE_PATTERN.test(rawTitle)) return
  const title = cleanTitle(rawTitle)
  const year = yearOf(doc.year)
  if (!title || !year || year > PUBLIC_DOMAIN_YEAR) return
  const wanted = normalize(title)
  if (!wanted) return

  const data = await cached(`search:${title}:${year}`, () => tmdb('search/movie', { query: title, year: String(year), include_adult: 'false' }))
  const movie = data?.results?.find((result) => {
    const released = yearOf(result.release_date)
    const sameTitle = normalize(result.title) === wanted || normalize(result.original_title ?? '') === wanted
    return sameTitle && released && released <= PUBLIC_DOMAIN_YEAR && Math.abs(released - year) <= 1
  })
  if (movie) addCandidate(movie.id, [doc.identifier], source)
}

const archiveDocs = await archiveSearch(`collection:(${ARCHIVE_COLLECTIONS.join(' OR ')})`)
console.log(`internet archive items up to ${PUBLIC_DOMAIN_YEAR}: ${archiveDocs.length}`)
await mapLimit(archiveDocs, doc => matchArchiveItem(doc, 'archive-age'), 'archive match')
console.log(`+ internet archive by age: ${candidates.size}`)

const lusophoneDocs = await archiveSearch(LUSOPHONE_FILTER)
console.log(`brazilian and portuguese items up to ${PUBLIC_DOMAIN_YEAR}: ${lusophoneDocs.length}`)
await mapLimit(lusophoneDocs, doc => matchArchiveItem(doc, 'archive-lusophone'), 'lusophone match')
console.log(`+ brazilian and portuguese: ${candidates.size}`)

// ---------------------------------------------------------------- details

const genreLists = Object.fromEntries(await Promise.all(Object.keys(LOCALES).map(async locale =>
  [locale, (await tmdb('genre/movie/list', { language: locale === 'en' ? 'en-US' : locale })).genres])))

/** Small summary of the playable MP4 files of an item; cached because metadata payloads are big. */
function archiveVideos(identifier) {
  return cached(`archive-files:${identifier}`, async () => {
    const data = await getJson(`https://archive.org/metadata/${encodeURIComponent(identifier)}`)
    if (!data?.files || data.is_dark || data.metadata?.['access-restricted-item']) return []
    return data.files
      .filter(file => file.name.toLowerCase().endsWith('.mp4') && VIDEO_FORMATS.has(file.format))
      .map(file => ({ identifier, file: file.name, height: Number(file.height) || 0, duration: Math.round(Number(file.length) || 0) }))
  })
}

function translation(movie, { language, region }) {
  const translations = movie.translations?.translations ?? []
  const match = translations.find(t => t.iso_639_1 === language && t.iso_3166_1 === region)
    ?? translations.find(t => t.iso_639_1 === language)
  return match?.data ?? {}
}

function pickLogo(movie, language) {
  const logos = movie.images?.logos ?? []
  return (logos.find(logo => logo.iso_639_1 === language) ?? logos.find(logo => logo.iso_639_1 === 'en'))?.file_path ?? null
}

async function buildEntry([tmdbId, { items, sources }]) {
  const movie = await cached(`movie:${tmdbId}`, () => tmdb(`movie/${tmdbId}`, {
    language: 'en-US',
    append_to_response: 'credits,images,translations',
    include_image_language: 'en,pt,null',
  }))
  if (!movie || movie.adult) return null

  const year = yearOf(movie.release_date)
  // Without Wikidata's public domain mark, the TMDB date must also prove the film is old enough.
  if (!sources.has('wikidata-pd') && (!year || year > PUBLIC_DOMAIN_YEAR)) return null
  // Matched by title only: the runtime is what confirms it is the same film.
  if (sources.size === 1 && sources.has('archive-age') && !movie.runtime) return null

  const matchesRuntime = duration => movie.runtime
    ? Math.abs(duration / 60 - movie.runtime) <= Math.max(movie.runtime * RUNTIME_TOLERANCE, RUNTIME_SLACK)
    && duration >= movie.runtime * 60 / 2
    : duration >= MIN_DURATION

  const playable = (await Promise.all([...items].map(item => archiveVideos(item).catch(() => []))))
    .flat()
    .filter(video => !RIP_PATTERN.test(`${video.identifier} ${video.file}`) && !DERIVATIVE_PATTERN.test(video.file))
  const complete = playable
    .filter(video => matchesRuntime(video.duration))
    .sort((a, b) => b.height - a.height || b.duration - a.duration)

  // Many silent films only survive in fragments; show them when we know which film it is.
  const identityKnown = !(sources.size === 1 && sources.has('archive-age'))
  const fragments = identityKnown && movie.runtime
    ? playable
        // Longer than the film is a compilation or another cut, not a fragment.
        .filter(video => video.duration >= Math.max(MIN_DURATION, movie.runtime * 60 * MIN_FRAGMENT_SHARE)
          && video.duration < movie.runtime * 60)
        .sort((a, b) => b.duration - a.duration || b.height - a.height)
    : []
  const video = complete[0] ?? fragments[0]
  if (!video) return null
  const partial = !complete.length

  const runtime = movie.runtime || Math.round(video.duration / 60)
  const english = { title: movie.title, overview: movie.overview, tagline: movie.tagline || '' }
  const text = Object.fromEntries(Object.entries(LOCALES).map(([locale, info]) => {
    if (locale === 'en') return [locale, english]
    const data = translation(movie, info)
    // A film already in this language needs no translation: keep its own title.
    const ownTitle = movie.original_language === info.language ? movie.original_title : ''
    return [locale, {
      title: data.title || ownTitle || english.title,
      overview: data.overview || english.overview,
      tagline: data.tagline || '',
    }]
  }))

  return {
    id: tmdbId,
    originalTitle: movie.original_title,
    originalLanguage: movie.original_language,
    releaseDate: movie.release_date || null,
    year,
    runtime,
    kind: runtime < SHORT_MAX_MINUTES ? 'short' : 'feature',
    genreIds: movie.genres.map(genre => genre.id),
    rating: Math.round((movie.vote_average ?? 0) * 10) / 10,
    votes: movie.vote_count ?? 0,
    posterPath: movie.poster_path,
    backdropPath: movie.backdrop_path,
    logos: { 'pt-BR': pickLogo(movie, 'pt'), 'en': pickLogo(movie, 'en') },
    directors: (movie.credits?.crew ?? []).filter(person => person.job === 'Director').map(person => person.name),
    cast: (movie.credits?.cast ?? []).slice(0, CAST_SIZE).map(person => person.name),
    countries: (movie.production_countries ?? []).map(country => country.iso_3166_1),
    text,
    video,
    partial,
    sources: [...sources].sort(),
  }
}

const entries = await mapLimit([...candidates], buildEntry, 'details')
const isLusophone = entry => entry.countries.some(country => country === 'BR' || country === 'PT') || entry.originalLanguage === 'pt'
// Films without any artwork make poor cards; Brazilian and Portuguese ones are rare enough to keep anyway.
const catalog = entries
  .filter(entry => entry && (entry.posterPath || entry.backdropPath || isLusophone(entry)))
  .sort((a, b) => b.votes - a.votes || a.id - b.id)

const usedGenres = new Set(catalog.flatMap(entry => entry.genreIds))
const genres = Object.fromEntries(Object.entries(genreLists).map(([locale, list]) =>
  [locale, list.filter(genre => usedGenres.has(genre.id))]))

await mkdir(new URL('../server/data/', import.meta.url), { recursive: true })
await writeFile(new URL('../server/data/catalog.json', import.meta.url), `${JSON.stringify(catalog)}\n`)
await writeFile(new URL('../server/data/genres.json', import.meta.url), `${JSON.stringify(genres, null, 2)}\n`)

const count = predicate => catalog.filter(predicate).length
console.log(`\n${catalog.length} films: ${count(e => e.kind === 'feature')} features, ${count(e => e.kind === 'short')} shorts`)
console.log(`  partial copies: ${count(e => e.partial)}, brazilian or portuguese: ${count(isLusophone)}`)
for (const source of ['wikidata-pd', 'wikidata-age', 'archive-age', 'archive-lusophone']) {
  console.log(`  via ${source}: ${count(e => e.sources.includes(source))} (only: ${count(e => e.sources.length === 1 && e.sources[0] === source)})`)
}
