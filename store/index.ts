import { defineStore } from 'pinia';
import { MergedPost, ZennPost } from '../types';
import { BlogPost } from '@prisma/client';
import { otherPosts } from '@/constants/otherPosts';

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
        link: row.link,
      }));

      const filteredBlogPosts: MergedPost[] = state.blogPosts.map((row) => ({
        type: 'blog',
        title: row.title,
        date: row.published_at.toString(),
        link: row.slug,
      }));

      const mergedPosts = [...filteredZennPosts, ...filteredBlogPosts, ...otherPosts];

      // 日付順に並び替え
      mergedPosts.sort((a, b) => +new Date(b.date) - +new Date(a.date));
      console.log({ mergedPosts });

      return mergedPosts;
    },
  },
});
