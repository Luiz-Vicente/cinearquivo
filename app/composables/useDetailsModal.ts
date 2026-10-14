/**
 * The details modal is driven by the `?details=123` query, so it is
 * shareable and the browser back button closes it.
 */
export function useDetailsModal() {
  const route = useRoute()
  const router = useRouter()

  const current = computed(() => {
    const id = Number(route.query.details)
    return Number.isInteger(id) && id > 0 ? id : null
  })

  function open(id: number) {
    router.push({ query: { ...route.query, details: id } })
  }

  function close() {
    const { details: _details, ...query } = route.query
    router.push({ query })
  }

  return { current, open, close }
}
