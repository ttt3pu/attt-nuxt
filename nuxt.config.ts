export default defineNuxtConfig({
  app: {
    head: {
      meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        // @FIXME
        // {
        //   rel: 'alternate',
        //   type: 'application/atom+xml',
        //   title: 'attt RSS feed',
        //   href: '/blog/feed.xml',
        // },
      ],
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

  modules: [
    '@nuxtjs/google-fonts',
    '@pinia/nuxt',
    '@nuxtjs/stylelint-module',
    '@nuxtjs/eslint-module',
    // '@nuxtjs/feed',
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

  // @FIXME
  // feed: [
  //   {
  //     path: '/blog/feed.xml',
  //     async create (feed) {
  //       feed.options = {
  //         title: 'attt',
  //         link: 'https://attt.hachiware.cat/blog/feed.xml',
  //       };

  //       const blogPosts = await axios.get('https://attt.microcms.io/api/v1/blog', {
  //         headers: { 'X-API-KEY': process.env.MICROCMS_API_KEY },
  //       });

  //       blogPosts.data.contents.forEach((post) => {
  //         feed.addItem({
  //           title: post.title,
  //           id: post.id,
  //           link: `https://attt.hachiware.cat/blog/${post.id}`,
  //           content: post.content,
  //           date: new Date(post.publishedAt),
  //         });
  //       });

  //       feed.addContributor({
  //         name: 'attt',
  //         link: process.env.BASE_URL,
  //       });
  //     },
  //     cacheTime: 1000 * 60 * 15,
  //     type: 'atom1',
  //   },
  // ],

  runtimeConfig: {
    MICROCMS_API_KEY: process.env.MICROCMS_API_KEY,
  },

  nitro: {
    preset: 'netlify',
  },
});
