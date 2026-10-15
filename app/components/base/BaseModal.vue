<script setup lang="ts">
const open = defineModel<boolean>('open', { required: true })

withDefaults(defineProps<{
  label: string
  /** `sm` fits forms and short dialogs; `lg` fits rich content like title details. */
  size?: 'sm' | 'lg'
}>(), { size: 'lg' })

const { t } = useI18n()
const panel = useTemplateRef('panel')
const bodyLock = useScrollLock(import.meta.client ? document.body : null)
let previousFocus: HTMLElement | null = null

watch(open, async (isOpen) => {
  if (import.meta.server) return
  bodyLock.value = isOpen
  if (isOpen) {
    previousFocus = document.activeElement as HTMLElement | null
    await nextTick()
    panel.value?.focus()
  }
  else {
    previousFocus?.focus()
  }
}, { flush: 'post', immediate: true })

onKeyStroke('Escape', (event) => {
  // Escape inside an open listbox (BaseSelect) only closes that list.
  if ((event.target as Element | null)?.closest?.('[role="listbox"]')) return
  if (open.value) open.value = false
})

// Keeps keyboard focus inside the dialog.
function trapFocus(event: KeyboardEvent) {
  if (event.key !== 'Tab' || !panel.value) return
  const focusable = panel.value.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), select, input, textarea, iframe, [tabindex]:not([tabindex="-1"])',
  )
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (!first || !last) return
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  }
  else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

onBeforeUnmount(() => (bodyLock.value = false))
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
      enter-active-class="transition duration-300"
      leave-active-class="transition duration-200"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-50 overflow-y-auto bg-ink/60 backdrop-blur-sm"
        @click.self="open = false"
      >
        <div
          class="flex min-h-full items-start justify-center sm:px-6 sm:py-10"
          @click.self="open = false"
        >
          <div
            ref="panel"
            role="dialog"
            aria-modal="true"
            :aria-label="label"
            tabindex="-1"
            class="relative w-full animate-rise-in overflow-hidden bg-surface shadow-card ring-1 ring-border outline-none sm:rounded-3xl"
            :class="size === 'sm' ? 'max-w-lg sm:mt-[10vh]' : 'max-w-4xl'"
            @keydown="trapFocus"
          >
            <div class="absolute top-4 right-4 z-20">
              <BaseButton
                icon="x"
                icon-only
                variant="secondary"
                :label="t('actions.close')"
                @click="open = false"
              />
            </div>
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
