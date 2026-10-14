export const ARCHIVE_BASE_URL = 'https://archive.org'

export function archiveVideoUrl(identifier: string, file: string): string {
  const path = [identifier, ...file.split('/')].map(encodeURIComponent).join('/')
  return `${ARCHIVE_BASE_URL}/download/${path}`
}

export function archivePageUrl(identifier: string): string {
  return `${ARCHIVE_BASE_URL}/details/${encodeURIComponent(identifier)}`
}
