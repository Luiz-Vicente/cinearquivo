import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n', '@nuxt/icon', '@vueuse/nuxt', '@nuxt/eslint'],

  // Layout components keep short names (AppHeader instead of LayoutAppHeader).
  components: [
    { path: '~/components/layout', pathPrefix: false },
    '~/components',
  ],
  devtools: { enabled: true },

  app: {
    head: {
      titleTemplate: '%s · CineArquivo',
      htmlAttrs: { class: 'bg-bg' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#C8102E' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' },
        { rel: 'icon', type: 'image/png', href: '/favicon-32.png', sizes: '32x32' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap',
        },
        { rel: 'preconnect', href: 'https://image.tmdb.org' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],
  compatibilityDate: '2026-10-01',

  vite: {
    plugins: [tailwindcss()],
  },

  typescript: {
    strict: true,
  },

  eslint: {
    config: { stylistic: true },
  },

  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'pt-BR',
    locales: [
      { code: 'pt-BR', language: 'pt-BR', name: 'Português', file: 'pt-BR.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'ca_locale',
      redirectOn: 'root',
      fallbackLocale: 'pt-BR',
    },
  },

  icon: {
    serverBundle: { collections: ['lucide'] },
  },
})
