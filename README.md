# CineArquivo

A streaming app for **public domain classic films**, played straight from the [Internet Archive](https://archive.org) with no ads. It has a familiar streaming UX (hero, rows, details modal, My List, Continue Watching that resumes where you stopped) and a popcorn-stand look: red and white stripes on a straw-cream base.

- **Films:** Internet Archive MP4 files in a native player.
- **Metadata:** [TMDB](https://www.themoviedb.org), baked into the catalog at build time in Portuguese and English. No API token is needed at runtime.
- **Stack:** Nuxt 4, TypeScript, Tailwind CSS v4 with `tailwind-variants`, `@nuxtjs/i18n` (pt-BR / en), `@nuxt/icon` (Lucide), VueUse, ESLint (stylistic).

## Getting started

Requires Node `>=22.22.3` (see `.nvmrc`) and pnpm.

```bash
pnpm install
pnpm dev               # http://localhost:3000
```

| Script | Description |
| --- | --- |
| `pnpm dev` | Development server |
| `pnpm build` / `pnpm preview` | Production build and local preview |
| `pnpm typecheck` | Type-check with vue-tsc |
| `pnpm lint` / `pnpm lint:fix` | ESLint (with stylistic rules) |
| `pnpm catalog` | Rebuilds the film catalog (needs `NUXT_TMDB_TOKEN` in `.env`) |

## The catalog

`pnpm catalog` writes `server/data/catalog.json` and `server/data/genres.json`. Upload licenses on the Internet Archive are self-declared and often wrong, so a film only gets in through one of these routes:

1. **Wikidata says it is public domain** (P6216) and links an Internet Archive item (P724), plus a TMDB id (P4947) or an IMDb id (P345).
2. **Public domain by age:** Wikidata links an Internet Archive item and a TMDB id, and the film was published 96 or more years ago (US rule: 95 years after publication).
3. **Public domain by age, found on the Internet Archive:** an item in a film collection matches a TMDB movie by exact title, year and runtime, and TMDB dates the release old enough.
4. **Brazilian and Portuguese films:** same as 3, but searched by language and subject across the whole Internet Archive, since they rarely sit in the big film collections.

Anything Wikidata marks as copyrighted is dropped, and a public domain mark limited to another country doesn't count. Every film needs a browser-playable MP4 that isn't a modern disc or web rip, nor a dubbed, subtitled or colorized version (those add new copyrighted work). Its length must match the TMDB runtime, so trailers and partial uploads stay out. When the film's identity is certain (Wikidata or an exact Portuguese title match), a surviving fragment is accepted and flagged as such. Responses are cached in `.cache/catalog`, so reruns are quick; use `pnpm catalog --fresh` to start over. The age rule moves forward every January 1st, so rerunning the script each year brings in a new batch of films.

## Project structure

```
app/
  assets/css/main.css     Design tokens (@theme), stripes utilities and base styles
  components/base/        Design system: BaseButton, BaseModal, BaseCarousel, ...
  components/movie/       Domain components built on the design system
  components/layout/      Header, bottom nav, footer, logo, language switcher
  composables/            Catalog API, My List, Continue Watching, details modal
  pages/                  Home, features, shorts, decades, Portuguese-language, search, my list, movie, watch, design-system
server/
  data/                   Generated catalog
  utils/catalog.ts        In-memory catalog: filters, search, facets, similar films
  api/                    home, movies, movies/[id], facets
scripts/build-catalog.mjs Catalog builder
shared/                   Types and utils used by both app and server
i18n/locales/             UI strings (pt-BR, en)
```

## Design system

Components use **semantic tokens** (`bg-surface`, `text-text-muted`, `bg-accent`, ...) defined in `app/assets/css/main.css`, never raw hex values. Variants are declared once per component with `tailwind-variants`. Browse every component at **`/design-system`**.

| Token | Value | Role |
| --- | --- | --- |
| `popcorn` | `#C8102E` | Accent / CTA |
| `cherry` | `#8E0F1F` | Accent hover |
| `cream` | `#FBF3E4` | App background |
| `straw` | `#F3E3C3` | Sunken surfaces |
| `butter` | `#F2C14E` | Highlights |
| `ink` | `#2A1A14` | Primary text |

Headings use Bebas Neue, and body text uses DM Sans.

## Notes

- My List and Continue Watching are stored in `localStorage` (no accounts).
- This product uses the TMDB API but is not endorsed or certified by TMDB.
- Public domain status follows US rules and Wikidata's records. It may differ in other countries.
