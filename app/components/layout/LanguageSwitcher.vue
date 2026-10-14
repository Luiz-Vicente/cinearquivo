<script setup lang="ts">
const { t, locale, locales, setLocale } = useI18n()

const options = computed(() => locales.value.map(entry => ({
  value: entry.code,
  label: entry.code === 'pt-BR' ? 'PT' : entry.code.toUpperCase(),
})))

const current = computed({
  get: () => locale.value,
  set: code => setLocale(code),
})
</script>

<template>
  <BaseSelect
    v-model="current"
    :options="options"
    :label="t('footer.language')"
    icon="languages"
  />
</template>
