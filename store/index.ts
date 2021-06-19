import RssParser from 'rss-parser';
import axios from 'axios';
import translate from '../translate';
import type {
  ZennPosts,
  BlogPosts,
  BlogPost,
} from '../types';

import {ActionTree} from 'vuex'


interface State {
  zennPosts: ZennPosts
  blogPosts: BlogPosts
}

export const state = (): State => {
  return {
    zennPosts: {items: []},
    blogPosts: [],
  };
};

export const getters = {
  zennPosts(state: State) {
    return state.zennPosts;
  },
  blogPosts(state: State) {
    return state.blogPosts;
  },
};

export const mutations = {
  zennPosts (state: State, payload: ZennPosts) {
    state.zennPosts = payload;
  },
  blogPosts (state: State, payload: BlogPosts) {
    state.blogPosts = payload;
  },
};

const makeActions = <T extends ActionTree<State, unknown>>(actions: T): T => actions;

export const actions = makeActions({
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

      return await Promise.all(blogPosts.data.contents.map(async (row: BlogPost) => {
        return {
          ...row,
          ...{
            title: await translate({text: row.title, target: locale}),
          },
        };
      }));
    })();

    commit('blogPosts', result);
  }
});
