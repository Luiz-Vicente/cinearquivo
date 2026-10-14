<script setup lang="ts">
import type { TmdbImageKind } from '~/utils/tmdbImage'

const props = withDefaults(defineProps<{
  /** TMDB file path (e.g. "/abc.jpg"). */
  path: string | null | undefined
  kind?: TmdbImageKind
  alt?: string
  /** `sizes` attribute for responsive loading. */
  sizes?: string
  eager?: boolean
  fit?: 'cover' | 'contain'
}>(), { kind: 'poster', alt: '', sizes: undefined, fit: 'cover' })

const failed = ref(false)
watch(() => props.path, () => (failed.value = false))

const fallbackIcon: Record<TmdbImageKind, string> = {
  poster: 'clapperboard',
  backdrop: 'clapperboard',
  still: 'tv',
  profile: 'user-round',
  logo: 'image',
}
</script>

<template>
  <img
    v-if="path && !failed"
    :src="tmdbImageSrc(path, kind)"
    :srcset="tmdbImageSrcset(path, kind)"
    :sizes="sizes"
    :alt="alt"
    :loading="eager ? 'eager' : 'lazy'"
    :fetchpriority="eager ? 'high' : undefined"
    decoding="async"
    class="size-full"
    :class="fit === 'cover' ? 'object-cover' : 'object-contain'"
    @error="failed = true"
  >
  <div
    v-else
    class="flex size-full items-center justify-center bg-linear-to-br from-surface-raised to-surface text-text-subtle"
    role="img"
    :aria-label="alt"
  >
    <BaseIcon
      :name="fallbackIcon[kind]"
      size="2rem"
    />
  </div>
</template>
