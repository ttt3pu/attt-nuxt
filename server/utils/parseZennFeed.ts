import type { ZennPost } from '~/types';
import { DOMParser } from '@xmldom/xmldom';

export function parseZennFeed(xmlText: string): ZennPost[] {
  const domParsedZennPosts = new DOMParser().parseFromString(xmlText, 'text/xml');
  const zennPosts = domParsedZennPosts.documentElement?.getElementsByTagName('item');
  if (!zennPosts) {
    return [];
  }

  const transformedZennPosts = Array.prototype.slice.call(zennPosts).map((post) => {
    return {
      title: post.getElementsByTagName('title')[0]?.textContent ?? '',
      pubDate: post.getElementsByTagName('pubDate')[0]?.textContent ?? '',
      link: post.getElementsByTagName('link')[0]?.textContent ?? '',
    };
  }) as ZennPost[];

  return transformedZennPosts;
}
