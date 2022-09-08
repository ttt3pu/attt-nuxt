import axios from 'axios';
import { defineNuxtConfig } from 'nuxt';

export default defineNuxtConfig({
  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  server: {
    host: '0.0.0.0',
    port: 8000,
  },

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'alternate',
        type: 'application/atom+xml',
        title: 'attt RSS feed',
        href: '/blog/feed.xml',
      },
    ],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '@/assets/scss/common.scss',
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    {
      src: '@/plugins/vue-clickaway',
      ssr: false,
    },
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    '@nuxtjs/stylelint-module',
    '@nuxtjs/eslint-module',
    '@pinia/nuxt',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    'nuxt-webfontloader',
    '@nuxtjs/feed',
    [
      '@nuxtjs/google-gtag',
      {
        id: 'G-YY7ZSN9HY4',
        debug: true,
      },
    ],
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  },

  webfontloader: {
    google: {
      families: [
        'Poppins:400,500',
        'Noto Sans JP:400&display=swap',
      ],
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import ~/assets/scss/mixins.scss',
        },
      },
    },
  },

  markdownit: {
    injected: true,
  },

  feed: [
    {
      path: '/blog/feed.xml',
      async create (feed) {
        feed.options = {
          title: 'attt',
          link: 'https://attt.hachiware.cat/blog/feed.xml',
        };

        const blogPosts = await axios.get('https://attt.microcms.io/api/v1/blog', {
          headers: { 'X-API-KEY': process.env.MICROCMS_API_KEY },
        });

        blogPosts.data.contents.forEach((post) => {
          feed.addItem({
            title: post.title,
            id: post.id,
            link: `https://attt.hachiware.cat/blog/${post.id}`,
            content: post.content,
            date: new Date(post.publishedAt),
          });
        });

        feed.addContributor({
          name: 'attt',
          link: process.env.BASE_URL,
        });
      },
      cacheTime: 1000 * 60 * 15,
      type: 'atom1',
    },
  ],

  privateRuntimeConfig: {
    MICROCMS_API_KEY: process.env.MICROCMS_API_KEY,
  },

  router: {
    middleware: ['server-init'],
  },

  bridge: {
    vite: true,
    meta: true,
  },
});
