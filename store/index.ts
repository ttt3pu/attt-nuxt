import dayjs from 'dayjs';
import { defineStore } from 'pinia';
import { DOMParser } from 'xmldom';
import { BlogPost, MergedPost, ZennPost } from '../types';

interface State {
  zennPosts: ZennPost[];
  blogPosts: BlogPost[];
}

export const usePostsStore = defineStore('posts', {
  state: (): State => ({
    zennPosts: [],
    blogPosts: [],
  }),
  getters: {
    mergedPosts(state) {
      const filteredZennPosts: MergedPost[] = state.zennPosts.map((row) => ({
        type: 'zenn',
        title: row.title,
        date: row.pubDate,
        dateFormatted: dayjs(row.pubDate).format('YYYY.MM.DD'),
        link: row.link,
      }));

      const filteredBlogPosts: MergedPost[] = state.blogPosts.map((row) => ({
        type: 'blog',
        title: row.title,
        date: row.publishedAt,
        dateFormatted: dayjs(row.publishedAt).format('YYYY.MM.DD'),
        link: row.id,
      }));

      const mergedPosts = [...filteredZennPosts, ...filteredBlogPosts];

      // 日付順に並び替え
      mergedPosts.sort((a, b) => +new Date(b.date) - +new Date(a.date));

      return mergedPosts;
    },
  },
  actions: {
    async getPosts(microcmsApiKey: string) {
      const today = dayjs(new Date()).format('YYYYMMDDhhmm');
      const zennPostsResponse = await fetch(`https://zenn.dev/attt/feed?${today}`).then((response) => response.text());
      const domParsedZennPosts = new DOMParser().parseFromString(zennPostsResponse, 'text/html');
      const zennPosts = domParsedZennPosts.documentElement.getElementsByTagName('item');
      this.zennPosts = Array.prototype.slice.call(zennPosts).map((post) => {
        return {
          title: post.getElementsByTagName('title')[0].textContent,
          pubDate: post.getElementsByTagName('pubDate')[0].textContent,
          link: post.getElementsByTagName('link')[0].textContent,
        };
      });

      const blogPosts = await fetch('https://attt.microcms.io/api/v1/blog', {
        headers: { 'X-MICROCMS-API-KEY': microcmsApiKey },
      }).then((response) => response.json());

      this.blogPosts = blogPosts.contents;
    },
  },
});
