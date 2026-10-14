export function useMyList() {
  const { state: ids, ready } = usePersistentState<number[]>('ca:my-list', () => [])

  const has = (id: number) => ids.value.includes(id)

  function remove(id: number) {
    ids.value = ids.value.filter(entry => entry !== id)
  }

  function toggle(id: number) {
    if (has(id)) remove(id)
    else ids.value = [id, ...ids.value]
  }

  return { ids, ready, has, toggle, remove }
}
