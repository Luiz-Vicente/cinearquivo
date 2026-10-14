<script setup lang="ts">
const { t } = useI18n()
useSeoMeta({ title: () => t('catalog.moviesTitle'), description: () => t('catalog.moviesDescription') })
</script>

<template>
  <MovieBrowser
    kind="feature"
    :title="t('catalog.moviesTitle')"
    :description="t('catalog.moviesDescription')"
  />
</template>
