<script setup lang="ts">
definePageMeta({
  validate: route => /^1[89]\d0$/.test(String(route.params.decade)),
})

const { t } = useI18n()
const route = useRoute('decades-decade')
const decade = computed(() => Number(route.params.decade))

useSeoMeta({ title: () => t('meta.decade', { decade: decade.value }) })
</script>

<template>
  <MovieBrowser
    :key="decade"
    :decade="decade"
    :title="t('meta.decade', { decade })"
    :description="t(`decades.d${decade}`, '')"
  />
</template>
