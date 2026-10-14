/**
 * Shared state persisted to localStorage. The server and the hydration pass
 * render the initial value; stored data is applied once the app is ready,
 * which avoids hydration mismatches. `ready` tells when stored data is in.
 */
export function usePersistentState<T>(key: string, init: () => T) {
  const state = useState<T>(key, init)
  const ready = useState(`${key}:ready`, () => false)

  if (import.meta.client && !ready.value) {
    onNuxtReady(() => {
      if (ready.value) return
      try {
        const stored = localStorage.getItem(key)
        if (stored) state.value = JSON.parse(stored) as T
      }
      catch {
        // Ignore unavailable storage or corrupted data.
      }
      ready.value = true
      watch(state, (value) => {
        try {
          localStorage.setItem(key, JSON.stringify(value))
        }
        catch {
          // Storage can be full or blocked (private mode).
        }
      }, { deep: true })
    })
  }

  /** Runs a client-side change once stored data is loaded, so it isn't overwritten. */
  function whenReady(change: () => void) {
    if (import.meta.server) return
    if (ready.value) return change()
    const stop = watch(ready, (isReady) => {
      if (!isReady) return
      stop()
      change()
    })
  }

  return { state, ready, whenReady }
}
