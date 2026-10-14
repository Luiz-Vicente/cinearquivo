<script setup lang="ts">
const { t } = useI18n()
const { y } = useWindowScroll()
const scrolled = computed(() => y.value > 24)
const links = NAV_ITEMS.filter(item => !item.mobileOnly)
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow] duration-300"
    :class="scrolled ? 'bg-surface/95 shadow-card backdrop-blur-xl' : 'bg-linear-to-b from-bg via-bg/85 to-transparent'"
  >
    <!-- Popcorn stand awning. -->
    <div
      class="stripes h-2"
      aria-hidden="true"
    />
    <div class="container-page flex h-16 items-center gap-4 md:h-18 md:gap-8">
      <AppLogo />

      <nav
        :aria-label="t('nav.main')"
        class="hidden md:block"
      >
        <ul class="flex items-center gap-1">
          <li
            v-for="link in links"
            :key="link.to"
          >
            <NuxtLink
              :to="link.to"
              class="rounded-full px-3.5 py-2 text-sm font-semibold text-text-muted transition hover:text-accent"
              :exact-active-class="link.to === '/' ? '!bg-accent !text-on-accent' : undefined"
              :active-class="link.to === '/' ? undefined : '!bg-accent !text-on-accent'"
            >
              {{ t(link.labelKey) }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="ml-auto flex items-center gap-2">
        <BaseButton
          to="/search"
          variant="ghost"
          icon="search"
          icon-only
          :label="t('nav.search')"
          class="max-md:hidden"
        />
        <LanguageSwitcher />
      </div>
    </div>
  </header>
</template>
