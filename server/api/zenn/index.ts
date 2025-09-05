import type { ZennPost } from '@/types';
import { DOMParser } from '@xmldom/xmldom';
import dayjs from 'dayjs';

export default defineEventHandler(async () => {
  const today = dayjs(new Date()).format('YYYYMMDDhhmm');
  const zennPostsResponse = await fetch(`https://zenn.dev/attt/feed?${today}`).then((response) => response.text());
  const domParsedZennPosts = new DOMParser().parseFromString(zennPostsResponse, 'text/xml');
  const zennPosts = domParsedZennPosts.documentElement?.getElementsByTagName('item');
  const transformedZennPosts = Array.prototype.slice.call(zennPosts).map((post) => {
    return {
      title: post.getElementsByTagName('title')[0].textContent,
      pubDate: post.getElementsByTagName('pubDate')[0].textContent,
      link: post.getElementsByTagName('link')[0].textContent,
    };
  }) as ZennPost[];
  return transformedZennPosts;
});
