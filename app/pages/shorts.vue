<script setup lang="ts">
const { t } = useI18n()
useSeoMeta({ title: () => t('catalog.shortsTitle'), description: () => t('catalog.shortsDescription') })
</script>

<template>
  <MovieBrowser
    kind="short"
    :title="t('catalog.shortsTitle')"
    :description="t('catalog.shortsDescription')"
  />
</template>
