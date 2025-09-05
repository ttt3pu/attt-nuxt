import { fileURLToPath } from 'url';

export default defineNuxtConfig({
  experimental: {
    typedPages: true,
  },

  alias: {
    '@resume': fileURLToPath(new URL('./packages/resume/src', import.meta.url)),
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'ja',
      },
      meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  typescript: {
    shim: false,
    tsConfig: {
      compilerOptions: {
        types: ['@pinia/nuxt', '@types/node'],
      },
    },
  },

  css: [
    '@/assets/scss/common.scss',
    'vue-toast-notification/dist/theme-sugar.css',
    '@vuepic/vue-datepicker/dist/main.css',
  ],

  components: true,

  modules: [
    '@nuxtjs/google-fonts',
    '@pinia/nuxt',
    '@nuxtjs/stylelint-module',
    '@sidebase/nuxt-auth',
    'nuxt-gtag',
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint',
  ],

  auth: {
    originEnvKey: 'NUXT_AUTH_BASE_URL',
  },

  gtag: {
    id: 'G-YY7ZSN9HY4',
  },

  googleFonts: {
    families: {
      Poppins: [400, 500],
      'Noto Sans JP': [400],
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
@use "sass:math";
@use "sass:color";
@use "~/assets/scss/mixins.scss" as *;
          `,
        },
      },
    },
    resolve: {
      alias: {
        // ref: https://github.com/prisma/prisma/issues/12504#issuecomment-1870563695
        '.prisma/client/index-browser': './node_modules/@prisma/client/index-browser.js',
      },
    },
    assetsInclude: ['packages/resume/**/*.md'],
  },

  routeRules: {
    '/': { prerender: true },
    '/blog/**': { prerender: true },
    '/admin/**': { ssr: false },
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    SECRET_TOKEN: '',
    DEPLOY_WEBHOOK_URL: '',
  },

  compatibilityDate: '2024-10-05',
});
