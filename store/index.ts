import dayjs from 'dayjs';
import { defineStore } from 'pinia';
import RssParser from 'rss-parser';
import {
  BlogPost, MergedPost, ZennPost,
} from '../types';

interface State {
  zennPosts: {items: ZennPost[]};
  blogPosts: BlogPost[];
}

export const usePostsStore = defineStore('posts', {
  state: (): State => ({
    zennPosts: { items: [] },
    blogPosts: [],
  }),
  getters: {
    mergedPosts (state) {
      const filteredZennPosts: MergedPost[] = state.zennPosts.items.map(row => ({
        type: 'zenn',
        title: row.title,
        date: row.pubDate,
        dateFormatted: dayjs(row.pubDate).format('YYYY.MM.DD'),
        link: row.link,
      }));

      const filteredBlogPosts: MergedPost[] = state.blogPosts.map(row => ({
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
    async getPosts (microcmsApiKey: string) {
      const today = dayjs(new Date()).format('YYYYMMDDhhmm');
      const zennPosts = await new RssParser<{ items: ZennPost[] }>().parseURL(`https://zenn.dev/attt/feed?${today}`);
      this.zennPosts = zennPosts;

      const blogPosts = await fetch('https://attt.microcms.io/api/v1/blog', {
        headers: { 'X-API-KEY': microcmsApiKey },
      }).then(response => response.json());

      this.blogPosts = blogPosts.contents;
    },
  },
});
