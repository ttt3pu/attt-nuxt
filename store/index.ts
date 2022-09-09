import dayjs from 'dayjs';
import { defineStore } from 'pinia';
import RssParser from 'rss-parser';
import {
  BlogPosts, ZennPosts,
} from '../types';

interface State {
  zennPosts: ZennPosts;
  blogPosts: BlogPosts;
}

export const usePostsStore = defineStore('posts', {
  state: (): State => ({
    zennPosts: { items: [] },
    blogPosts: [],
  }),
  getters: {
    mergedPosts (state) {
      const filteredZennPosts = state.zennPosts.items.map(row => ({
        type: 'zenn',
        title: row.title,
        date: row.pubDate,
        dateFormatted: dayjs(row.pubDate).format('YYYY.MM.DD'),
        link: row.link,
      }));

      const filteredBlogPosts = state.blogPosts.map(row => ({
        type: 'blog',
        title: row.title,
        date: row.publishedAt,
        dateFormatted: dayjs(row.publishedAt).format('YYYY.MM.DD'),
        link: row.id,
      }));

      const mergedPosts = [
        ...filteredZennPosts,
        ...filteredBlogPosts,
      ];

      // 日付順に並び替え
      mergedPosts.sort((a, b) => +new Date(b.date) - +new Date(a.date));

      return mergedPosts;
    },
  },
  actions: {
    async getPosts () {
      const today = dayjs(new Date()).format('YYYYMMDDhhmm');
      const zennPosts = await new RssParser<ZennPosts>().parseURL(`https://zenn.dev/attt/feed?${today}`);
      this.zennPosts = zennPosts;

      const blogPosts = await fetch('https://attt.microcms.io/api/v1/blog', {
        headers: { 'X-API-KEY': process.env.MICROCMS_API_KEY as string },
      }).then(response => response.json());

      this.blogPosts = blogPosts.data.contents;
    },
  },
});

export const useStore = defineStore('store', {
  actions: {
    async nuxtServerInit () {
      const postsStore = usePostsStore();
      await postsStore.getPosts();
    },
  },
});
