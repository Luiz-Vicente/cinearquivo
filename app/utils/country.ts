/** Codes TMDB still uses for countries that no longer exist; Intl doesn't name them. */
const HISTORICAL_COUNTRIES: Record<string, Record<string, string>> = {
  SU: { 'pt-BR': 'União Soviética', 'en': 'Soviet Union' },
  XC: { 'pt-BR': 'Tchecoslováquia', 'en': 'Czechoslovakia' },
  XG: { 'pt-BR': 'Alemanha Oriental', 'en': 'East Germany' },
  YU: { 'pt-BR': 'Iugoslávia', 'en': 'Yugoslavia' },
}

export function countryName(code: string, locale: string): string {
  const historical = HISTORICAL_COUNTRIES[code]?.[locale]
  if (historical) return historical
  try {
    return new Intl.DisplayNames([locale], { type: 'region' }).of(code) ?? code
  }
  catch {
    return code
  }
}
