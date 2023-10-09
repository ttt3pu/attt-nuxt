import { PrismaClient } from '@prisma/client';

export default defineNuxtConfig({
  app: {
    head: {
      meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        types: ['@pinia/nuxt', '@types/node'],
      },
    },
  },

  css: ['@/assets/scss/common.scss'],

  plugins: ['./plugins/vue-gtag.ts'],

  components: true,

  modules: ['@nuxtjs/google-fonts', '@pinia/nuxt', '@nuxtjs/stylelint-module', '@nuxtjs/eslint-module'],

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
        nitroConfig.prerender?.routes?.push(`/blog/${post.slug}`);
      });
    },
  },
});
