import axios from 'axios';
import translatePost from './i18n';
import jaMessages from './i18n/ja';

export default async() => {
  const caMessages = await translatePost('ca');

  return {
    // Target (https://go.nuxtjs.dev/config-target)
    target: 'static',

    server: {
      host: '0.0.0.0',
      port: 8000
    },

    // Global page headers (https://go.nuxtjs.dev/config-head)
    head: {
      title: 'attt - Frontend engineer',
      titleTemplate: '%s | attt',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    },

    // Global CSS (https://go.nuxtjs.dev/config-css)
    css: [
      '@/assets/scss/common.scss',
    ],

    // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
    plugins: [
      '~/plugins/translate.js',
      {
        src: "@/plugins/vue-clickaway",
        ssr: false,
      },
    ],

    // Auto import components (https://go.nuxtjs.dev/config-components)
    components: true,

    // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
    buildModules: [
      // https://go.nuxtjs.dev/typescript
      '@nuxt/typescript-build',
      // https://go.nuxtjs.dev/stylelint
      '@nuxtjs/stylelint-module',
      '@nuxtjs/composition-api/module',
    ],

    // Modules (https://go.nuxtjs.dev/config-modules)
    modules: [
      // https://go.nuxtjs.dev/axios
      '@nuxtjs/axios',
      'nuxt-webfontloader',
      '@nuxtjs/style-resources',
      '@nuxtjs/markdownit',
      '@nuxtjs/feed',
      [
        '@nuxtjs/google-gtag',
        {
          id: 'G-YY7ZSN9HY4',
          debug: true,
        },
      ],
      [
        'nuxt-i18n',
        {
          vueI18nLoader: true,
          locales: ['ja', 'ca'],
          defaultLocale: 'ja',
          vueI18n: {
            fallbackLocale: 'ja',
            messages: {
              ja: jaMessages,
              ca: caMessages,
            },
            // pages: {
            //   'blog/_slug': false,
            // },
          },
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
        ]
      }
    },

    styleResources: {
    scss: [
      '~/assets/scss/mixins.scss',
      ],
    },

    markdownit: {
      injected: true
    },

    feed: [
      {
        path: '/blog/feed.xml',
        async create (feed) {
          feed.options = {
            title: 'attt',
            link: `https://attt.hachiware.cat/blog/feed.xml`,
          }

          const blogPosts = await axios.get('https://attt.microcms.io/api/v1/blog', {
            headers: {'X-API-KEY': process.env.MICROCMS_API_KEY},
          });

          blogPosts.data.contents.forEach((post) => {
            feed.addItem({
              title: post.title,
              id: post.id,
              link: `https://attt.hachiware.cat/blog/${post.slug}`,
              content: post.content,
              date: new Date(post.publishedAt),
            })
          })

          feed.addContributor({
            name: 'attt',
            link: process.env.BASE_URL
          })
        },
        cacheTime: 1000 * 60 * 15,
        type: 'atom1'
      }
    ],

    privateRuntimeConfig: {
      MICROCMS_API_KEY: process.env.MICROCMS_API_KEY,
    },
  };
}
