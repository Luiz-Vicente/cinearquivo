<script setup lang="ts">
const { t } = useI18n()
const details = useDetailsModal()

const open = computed({
  get: () => details.current.value !== null,
  set: (value) => {
    if (!value) details.close()
  },
})
</script>

<template>
  <BaseModal
    v-model:open="open"
    :label="t('actions.moreInfo')"
  >
    <MovieDetails
      v-if="details.current.value"
      :id="details.current.value"
      :key="details.current.value"
    />
  </BaseModal>
</template>
