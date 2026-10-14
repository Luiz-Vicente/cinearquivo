<script setup lang="ts">
const { t } = useI18n()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-16 text-sm text-text-muted">
    <div
      class="stripes-thin h-1.5 opacity-80"
      aria-hidden="true"
    />
    <div class="container-page py-10">
      <div class="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div class="max-w-sm space-y-3">
          <AppLogo variant="full" />
          <p>{{ t('brand.tagline') }}</p>
        </div>
        <div class="grid max-w-xl gap-6 sm:grid-cols-2">
          <div class="space-y-1.5">
            <a
              href="https://archive.org"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-2 font-semibold text-text hover:text-accent"
            >
              <BaseIcon name="archive" />
              Internet Archive
            </a>
            <p class="text-xs text-text-subtle">
              {{ t('footer.archiveNotice', { year: year - 96 }) }}
            </p>
          </div>
          <div class="space-y-1.5">
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-2 font-semibold text-text hover:text-accent"
            >
              <BaseIcon name="database" />
              TMDB
            </a>
            <p class="text-xs text-text-subtle">
              {{ t('footer.tmdbNotice') }}
            </p>
          </div>
        </div>
      </div>
      <p class="mt-8 text-xs text-text-subtle">
        © {{ year }} CineArquivo · {{ t('footer.rights') }}
      </p>
    </div>
  </footer>
</template>
