<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  description?: string
}>()
</script>

<template>
  <div class="mx-auto flex max-w-md animate-fade-in flex-col items-center px-4 py-16 text-center">
    <div class="mb-5 flex size-16 items-center justify-center rounded-2xl bg-accent/10 text-accent ring-1 ring-accent/30">
      <BaseIcon
        :name="icon"
        size="1.75rem"
      />
    </div>
    <h2 class="text-3xl text-text">
      {{ title }}
    </h2>
    <p
      v-if="description"
      class="mt-2 text-sm text-text-muted"
    >
      {{ description }}
    </p>
    <div
      v-if="$slots.default"
      class="mt-6 flex flex-wrap justify-center gap-3"
    >
      <slot />
    </div>
  </div>
</template>
