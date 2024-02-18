const baseURL = (() => {
  switch (process.env.BUILD_ID) {
    case undefined:
      return 'http://localhost:3000';
    case 'production':
      return process.env.URL;
    default:
      return process.env.DEPLOY_PRIME_URL?.replace('HEAD', process.env.SHORT_SHA as string);
  }
})();

export default defineNuxtConfig({
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
    '@nuxtjs/eslint-module',
    '@sidebase/nuxt-auth',
    'nuxt-typed-router',
    'nuxt-gtag',
    '@nuxtjs/tailwindcss',
  ],

  auth: {
    baseURL,
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

  features: {
    // NOTE: 設定しておかないとNetlifyのデプロイに失敗する
    // Error message
    // TypeError: pattern is too long
    // ref: https://answers.netlify.com/t/typeerror-pattern-is-too-long/98172
    inlineStyles: false,
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
  },

  nitro: {
    preset: 'netlify',
  },

  routeRules: {
    '/': { swr: true },
    '/blog/**': { swr: true },
    '/admin/**': { ssr: false },
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});
