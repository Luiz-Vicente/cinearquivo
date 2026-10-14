<script setup lang="ts">
definePageMeta({
  validate: route => /^\d+$/.test(String(route.params.id)),
})

const route = useRoute('movie-id')
const id = computed(() => Number(route.params.id))
</script>

<template>
  <div class="mx-auto max-w-5xl pt-24 md:pt-28">
    <div class="overflow-hidden bg-surface shadow-card ring-1 ring-border md:rounded-3xl">
      <MovieDetails
        :id="id"
        :key="id"
        page
      />
    </div>
  </div>
</template>
