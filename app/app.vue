<script setup lang="ts">
const head = useLocaleHead()
const { t } = useI18n()

useHead({
  htmlAttrs: { lang: () => head.value.htmlAttrs.lang },
})

useSeoMeta({
  description: () => t('seo.homeDescription'),
  ogSiteName: 'CineArquivo',
})
</script>

<template>
  <NuxtLoadingIndicator
    color="#C8102E"
    :height="3"
  />
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
