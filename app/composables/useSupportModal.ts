/** Shared open state for the Pix support dialog. */
export function useSupportModal() {
  const open = useState('support-modal-open', () => false)
  return { open, show: () => (open.value = true) }
}
