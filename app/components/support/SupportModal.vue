<script setup lang="ts">
const { t } = useI18n()
const { open } = useSupportModal()
</script>

<template>
  <BaseModal
    v-model:open="open"
    :label="t('support.title')"
    size="sm"
  >
    <div
      class="stripes h-3"
      aria-hidden="true"
    />
    <div class="space-y-8 p-6 md:p-8">
      <SupportIntro compact />
      <SupportPix />
    </div>
  </BaseModal>
</template>
