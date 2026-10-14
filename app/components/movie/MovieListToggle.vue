<script setup lang="ts">
const props = withDefaults(defineProps<{
  id: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'secondary' | 'outline'
}>(), { size: 'md', variant: 'secondary' })

const { t } = useI18n()
const myList = useMyList()
const inList = computed(() => myList.has(props.id))
</script>

<template>
  <BaseButton
    :variant="variant"
    :size="size"
    icon-only
    :icon="inList ? 'check' : 'plus'"
    :label="inList ? t('actions.removeFromList') : t('actions.addToList')"
    :aria-pressed="inList"
    @click.stop="myList.toggle(id)"
  />
</template>
