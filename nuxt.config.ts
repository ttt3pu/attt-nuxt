import { PrismaClient } from '@prisma/client';

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

  plugins: ['./plugins/vue-gtag.ts'],

  components: true,

  modules: [
    '@nuxtjs/google-fonts',
    '@pinia/nuxt',
    '@nuxtjs/stylelint-module',
    '@nuxtjs/eslint-module',
    '@sidebase/nuxt-auth',
    'nuxt-typed-router',
  ],

  build: {},

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
  },

  runtimeConfig: {
    MICROCMS_API_KEY: process.env.MICROCMS_API_KEY,
  },

  nitro: {
    preset: 'netlify',
    debug: true,
    prerender: {
      crawlLinks: true,
      concurrency: 1,
    },
  },

  routeRules: {
    '/': { ssr: true, prerender: true },
    '/blog/**': { ssr: true, prerender: true },
  },

  hooks: {
    async 'nitro:config'(nitroConfig) {
      if (nitroConfig.dev) {
        return;
      }

      const prisma = new PrismaClient();
      const posts = await prisma.blogPost.findMany();

      posts.forEach((post) => {
        nitroConfig.prerender?.routes?.push(`/blog/${post.id}`);
      });
    },
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});
