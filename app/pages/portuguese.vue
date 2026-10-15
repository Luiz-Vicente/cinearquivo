<script setup lang="ts">
const { t } = useI18n()
useSeoMeta({ title: () => t('catalog.portugueseTitle'), description: () => t('catalog.portugueseDescription') })
</script>

<template>
  <MovieBrowser
    lusophone
    :title="t('catalog.portugueseTitle')"
    :description="t('catalog.portugueseDescription')"
  />
</template>
