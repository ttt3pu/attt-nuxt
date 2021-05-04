import RssParser from 'rss-parser';
import axios from 'axios';
import translate from '../translate';

export const state = async () => {
  return {
    zennPosts: [],
    blogPosts: [],
  };
};

export const getters = {
  zennPosts: function(state) {
    return state.zennPosts;
  },
  blogPosts: function(state) {
    return state.blogPosts;
  },
};

export const mutations = {
  zennPosts (state, payload) {
    state.zennPosts = payload;
  },
  blogPosts (state, payload) {
    state.blogPosts = payload;
  },
};

export const actions = {
  async nuxtServerInit({commit}) {
    const zennPosts = await new RssParser().parseURL('https://zenn.dev/attt/feed');
    commit('zennPosts', zennPosts);

    const blogPosts = await axios.get('https://attt.microcms.io/api/v1/blog', {
      headers: {'X-API-KEY': process.env.MICROCMS_API_KEY},
    });

    const locale = this.$i18n.locale;

    const result = await (async () => {
      if (locale === 'ja') {
        return blogPosts.data.contents;
      }

      return await Promise.all(blogPosts.data.contents.map(async (row) => {
        return {
          ...row,
          ...{
            title: await translate(row.title, locale),
          },
        };
      }));
    })();

    commit('blogPosts', result);
  }
};
