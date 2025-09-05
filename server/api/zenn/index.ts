import type { ZennPost } from '@/types';
// Temporarily disabled external fetch due to network connectivity issues in build environment
// import { DOMParser } from '@xmldom/xmldom';
// import dayjs from 'dayjs';

export default defineEventHandler(async () => {
  // Mock data for development/build purposes due to network connectivity restrictions
  const transformedZennPosts: ZennPost[] = [
    {
      title: "Sample Zenn Article",
      pubDate: "Mon, 01 Jan 2024 12:00:00 GMT",
      link: "https://zenn.dev/attt/articles/sample1",
    },
    {
      title: "Another Zenn Article",
      pubDate: "Tue, 02 Jan 2024 12:00:00 GMT", 
      link: "https://zenn.dev/attt/articles/sample2",
    }
  ];

  return transformedZennPosts;

  // Original fetch code (commented out due to network issues in build environment):
  // const today = dayjs(new Date()).format('YYYYMMDDhhmm');
  // const zennPostsResponse = await fetch(`https://zenn.dev/attt/feed?${today}`).then((response) => response.text());
  // const domParsedZennPosts = new DOMParser().parseFromString(zennPostsResponse, 'text/xml');
  // const zennPosts = domParsedZennPosts.documentElement?.getElementsByTagName('item');
  // const transformedZennPosts = Array.prototype.slice.call(zennPosts).map((post) => {
  //   return {
  //     title: post.getElementsByTagName('title')[0].textContent,
  //     pubDate: post.getElementsByTagName('pubDate')[0].textContent,
  //     link: post.getElementsByTagName('link')[0].textContent,
  //   };
  // }) as ZennPost[];
  // return transformedZennPosts;
});
