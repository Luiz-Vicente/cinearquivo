<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const { t } = useI18n()
const isNotFound = computed(() => props.error.statusCode === 404)

useHead({ title: () => (isNotFound.value ? t('errors.notFound') : t('errors.title')) })
</script>

<template>
  <NuxtLayout>
    <div class="container-page flex min-h-[70dvh] items-center justify-center pt-20">
      <BaseEmptyState
        :icon="isNotFound ? 'map-pin-off' : 'circle-alert'"
        :title="isNotFound ? t('errors.notFound') : t('errors.title')"
        :description="isNotFound ? undefined : t('errors.generic')"
      >
        <BaseButton
          icon="house"
          :label="t('errors.home')"
          @click="clearError({ redirect: '/' })"
        />
      </BaseEmptyState>
    </div>
  </NuxtLayout>
</template>
