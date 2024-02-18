import { usePostsStore } from '@/store';
import dayjs from 'dayjs';
import { DOMParser } from '@xmldom/xmldom';
import { type BlogPost } from '@prisma/client';

export async function useGetPosts() {
  const postsStore = usePostsStore();
  const blogPosts = await useFetch<BlogPost[]>('/api/blog');

  const today = dayjs(new Date()).format('YYYYMMDDhhmm');
  const zennPostsResponse = await fetch(`https://zenn.dev/attt/feed?${today}`).then((response) => response.text());
  const domParsedZennPosts = new DOMParser().parseFromString(zennPostsResponse, 'text/html');
  const zennPosts = domParsedZennPosts.documentElement.getElementsByTagName('item');
  const transformedZennPosts = Array.prototype.slice.call(zennPosts).map((post) => {
    return {
      title: post.getElementsByTagName('title')[0].textContent,
      pubDate: post.getElementsByTagName('pubDate')[0].textContent,
      link: post.getElementsByTagName('link')[0].textContent,
    };
  });

  postsStore.$patch({
    blogPosts: blogPosts.data.value!,
    zennPosts: transformedZennPosts,
  });
}
