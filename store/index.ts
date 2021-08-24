import RssParser from 'rss-parser';
import axios from 'axios';
import dayjs from 'dayjs';

import type {
  ZennPosts,
  BlogPosts,
} from '../types';

import {ActionTree} from 'vuex'

interface State {
  zennPosts: ZennPosts;
  blogPosts: BlogPosts;
  mergedPosts: BlogPosts;
}

export const state = (): State => {
  return {
    zennPosts: {items: []},
    blogPosts: [],
    mergedPosts: [],
  };
};

export const getters = {
  zennPosts(state: State) {
    return state.zennPosts;
  },
  blogPosts(state: State) {
    return state.blogPosts;
  },
  mergedPosts(state: State) {
    const filteredZennPosts = state.zennPosts.items.map((row) => ({
      type: 'zenn',
      title: row.title,
      date: row.pubDate,
      dateFormated: dayjs(row.pubDate).format('YYYY.MM.DD'),
      link: row.link,
    }));

    const filteredBlogPosts = state.blogPosts.map((row) => ({
      type: 'blog',
      title: row.title,
      date: row.publishedAt,
      dateFormated: dayjs(row.publishedAt).format('YYYY.MM.DD'),
      link: row.id,
    }));

    const mergedPosts = [
      ...filteredZennPosts,
      ...filteredBlogPosts,
    ];

    // 日付順に並び替え
    mergedPosts.sort((a, b) => + new Date(b.date) - + new Date(a.date));

    return mergedPosts;
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

    commit('blogPosts', blogPosts.data.contents);
  }
});
