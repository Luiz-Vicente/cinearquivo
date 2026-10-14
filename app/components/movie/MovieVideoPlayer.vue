<script setup lang="ts">
import type { PlaybackPosition } from '#shared/types/movie'

/** Native player for Internet Archive files. Reports its position so playback can resume. */
const props = withDefaults(defineProps<{
  src: string
  title: string
  /** Seconds to resume from. */
  startAt?: number
  /** Internet Archive page, offered when the file is slow to start. */
  pageUrl?: string
}>(), { startAt: 0, pageUrl: undefined })

const emit = defineEmits<{
  progress: [playback: PlaybackPosition]
  error: []
}>()

const SAVE_INTERVAL = 5
/** The Internet Archive sometimes stalls a request; after this long, offer a retry. */
const SLOW_AFTER = 20_000

const { t } = useI18n()
const video = useTemplateRef('video')
const loaded = ref(false)
const slow = ref(false)
const attempt = ref(0)
let lastSaved = 0

// Browsers hold off loading media in hidden tabs, so only count time while the page is visible.
const visibility = useDocumentVisibility()
const slowTimer = useTimeoutFn(() => {
  if (visibility.value === 'visible') slow.value = !loaded.value
}, SLOW_AFTER)
watch(visibility, (state) => {
  if (state === 'visible' && !loaded.value && !slow.value) slowTimer.start()
})

function start() {
  loaded.value = false
  slow.value = false
  lastSaved = 0
  slowTimer.start()
}

watch(() => props.src, start)

// A distinct URL per retry: Chrome holds a second request for the same URL until the first one finishes.
const source = computed(() => attempt.value ? `${props.src}?retry=${attempt.value}` : props.src)

/** Remounts the video element, which opens a fresh request. */
function retry() {
  attempt.value++
  start()
}

function onLoadedMetadata() {
  const element = video.value
  if (element && props.startAt > 0 && props.startAt < element.duration) element.currentTime = props.startAt
  loaded.value = true
  slow.value = false
  slowTimer.stop()
}

function report(force = false) {
  const element = video.value
  if (!element || !Number.isFinite(element.duration)) return
  if (!force && Math.abs(element.currentTime - lastSaved) < SAVE_INTERVAL) return
  lastSaved = element.currentTime
  emit('progress', { position: element.currentTime, duration: element.duration })
}

// Saves the latest position when leaving the page mid-playback.
onBeforeUnmount(() => report(true))
</script>

<template>
  <div class="relative size-full bg-player">
    <video
      ref="video"
      :key="source"
      :src="source"
      :aria-label="t('watch.playerTitle', { title })"
      class="absolute inset-0 size-full"
      controls
      autoplay
      playsinline
      preload="metadata"
      @loadedmetadata="onLoadedMetadata"
      @timeupdate="report()"
      @pause="report(true)"
      @ended="report(true)"
      @error="emit('error')"
    />
    <div
      v-if="!loaded"
      class="pointer-events-none absolute inset-0 z-[1] flex flex-col items-center justify-center gap-4 bg-player px-6 text-center text-on-player/70"
    >
      <BaseSpinner size="lg" />
      <span class="text-sm">{{ slow ? t('watch.slow') : t('watch.loading') }}</span>
      <div
        v-if="slow"
        class="pointer-events-auto flex flex-wrap justify-center gap-3"
      >
        <BaseButton
          icon="rotate-ccw"
          :label="t('actions.retry')"
          @click="retry"
        />
        <BaseButton
          v-if="pageUrl"
          :href="pageUrl"
          target="_blank"
          rel="noopener"
          icon="archive"
          variant="secondary"
          :label="t('watch.openOnArchive')"
        />
      </div>
    </div>
  </div>
</template>
