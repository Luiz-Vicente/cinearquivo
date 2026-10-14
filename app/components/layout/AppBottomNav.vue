<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()

function isActive(to: string) {
  return to === '/' ? route.path === '/' : route.path.startsWith(to)
}
</script>

<template>
  <nav
    :aria-label="t('nav.main')"
    class="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
  >
    <ul
      class="grid"
      :style="{ gridTemplateColumns: `repeat(${NAV_ITEMS.length}, minmax(0, 1fr))` }"
    >
      <li
        v-for="item in NAV_ITEMS"
        :key="item.to"
      >
        <NuxtLink
          :to="item.to"
          class="flex flex-col items-center gap-1 py-2 text-[0.625rem] font-medium transition"
          :class="isActive(item.to) ? 'text-accent' : 'text-text-muted'"
          :aria-current="isActive(item.to) ? 'page' : undefined"
        >
          <span
            class="flex h-7 w-12 items-center justify-center rounded-full transition"
            :class="isActive(item.to) ? 'bg-accent/15' : ''"
          >
            <BaseIcon
              :name="item.icon"
              size="1.25rem"
            />
          </span>
          {{ t(item.labelKey) }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
