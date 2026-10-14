const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

export type TmdbImageKind = 'poster' | 'backdrop' | 'profile' | 'still' | 'logo'

/** Width-based sizes TMDB serves for each image kind, smallest first. */
const IMAGE_WIDTHS: Record<TmdbImageKind, number[]> = {
  poster: [185, 342, 500, 780],
  backdrop: [300, 780, 1280],
  profile: [185],
  still: [185, 300],
  logo: [185, 300, 500],
}

export function tmdbImageUrl(path: string, width: number | 'original'): string {
  return `${IMAGE_BASE_URL}/${width === 'original' ? 'original' : `w${width}`}${path}`
}

export function tmdbImageSrc(path: string, kind: TmdbImageKind): string {
  const widths = IMAGE_WIDTHS[kind]
  return tmdbImageUrl(path, widths[Math.min(1, widths.length - 1)]!)
}

export function tmdbImageSrcset(path: string, kind: TmdbImageKind): string {
  return IMAGE_WIDTHS[kind].map(width => `${tmdbImageUrl(path, width)} ${width}w`).join(', ')
}
