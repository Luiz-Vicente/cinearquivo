<script setup lang="ts">
/** `compact` fits the dialog: smaller type, always left-aligned. */
defineProps<{ compact?: boolean }>()

const { t } = useI18n()
</script>

<template>
  <div
    class="space-y-4"
    :class="compact ? 'pr-10' : 'max-md:text-center'"
  >
    <div class="inline-flex size-14 items-center justify-center rounded-2xl bg-accent text-on-accent shadow-pop-sm">
      <BaseIcon
        name="heart-handshake"
        size="1.75em"
      />
    </div>
    <h2
      class="font-display text-3xl text-text"
      :class="{ 'md:text-5xl': !compact }"
    >
      {{ t('support.title') }}
    </h2>
    <p
      class="max-w-xl text-text-muted"
      :class="{ 'max-md:mx-auto md:text-lg': !compact }"
    >
      {{ t('support.text') }}
    </p>
  </div>
</template>
