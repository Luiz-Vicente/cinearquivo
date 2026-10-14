<script setup lang="ts">
const { t } = useI18n()
const { data: facets, status } = useFacets(undefined)

useSeoMeta({ title: () => t('catalog.decadesTitle'), description: () => t('catalog.decadesDescription') })
</script>

<template>
  <div class="container-page space-y-8 pt-28 pb-10 md:pt-32">
    <div class="space-y-2">
      <BaseSectionHeader
        as="h1"
        :title="t('catalog.decadesTitle')"
      />
      <p class="max-w-2xl text-text-muted">
        {{ t('catalog.decadesDescription') }}
      </p>
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      <template v-if="status === 'pending' && !facets">
        <BaseSkeleton
          v-for="n in 8"
          :key="n"
          class="h-40"
        />
      </template>
      <NuxtLink
        v-for="entry in facets?.decades"
        :key="entry.decade"
        :to="`/decades/${entry.decade}`"
        class="group relative flex h-40 flex-col justify-between overflow-hidden rounded-2xl bg-surface p-5 shadow-card ring-1 ring-border transition duration-300 ease-snappy hover:-translate-y-1 hover:shadow-pop"
      >
        <div
          class="stripes-thin absolute inset-x-0 top-0 h-2"
          aria-hidden="true"
        />
        <span class="font-display text-6xl leading-none text-text transition group-hover:text-accent">
          {{ entry.decade }}
        </span>
        <span class="text-sm text-text-muted">
          {{ t('catalog.count', { n: entry.count }, entry.count) }}
        </span>
      </NuxtLink>
    </div>
  </div>
</template>
