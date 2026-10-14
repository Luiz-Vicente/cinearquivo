import type { ContinueWatchingEntry, MovieSummary, PlaybackPosition } from '#shared/types/movie'

const MAX_ENTRIES = 24
/** Closer than this to the end counts as finished, so the credits don't keep a film around. */
const FINISHED_MARGIN = 60

export function useContinueWatching() {
  const { state: entries, ready, whenReady } = usePersistentState<ContinueWatchingEntry[]>('ca:continue-watching', () => [])

  const ids = computed(() => entries.value.map(entry => entry.id))
  const find = (id: number) => entries.value.find(entry => entry.id === id)

  function progressOf(id: number): number | undefined {
    const playback = find(id)?.playback
    return playback ? playback.position / playback.duration : undefined
  }

  /** Adds the watched fraction to films fetched for the row. */
  function withProgress(items: MovieSummary[]): MovieSummary[] {
    return items.map(item => ({ ...item, progress: progressOf(item.id) }))
  }

  /** Where to resume a film, if it was left halfway. */
  function resumePosition(id: number): number {
    const playback = find(id)?.playback
    return playback && playback.position < playback.duration - FINISHED_MARGIN ? playback.position : 0
  }

  function remove(id: number) {
    entries.value = entries.value.filter(entry => entry.id !== id)
  }

  function record(id: number) {
    whenReady(() => {
      const playback = find(id)?.playback
      entries.value = [{ id, updatedAt: Date.now(), playback }, ...entries.value.filter(entry => entry.id !== id)].slice(0, MAX_ENTRIES)
    })
  }

  /** Saves the player position; a finished film leaves Continue Watching. */
  function saveProgress(id: number, playback: PlaybackPosition) {
    whenReady(() => {
      if (!playback.duration) return
      if (playback.position >= playback.duration - FINISHED_MARGIN) return remove(id)
      const entry = find(id)
      if (entry) entry.playback = { position: Math.floor(playback.position), duration: Math.floor(playback.duration) }
    })
  }

  return { entries, ids, ready, progressOf, withProgress, resumePosition, record, remove, saveProgress }
}
