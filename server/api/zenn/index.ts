import dayjs from 'dayjs';

export default defineEventHandler(async () => {
  const today = dayjs(new Date()).format('YYYYMMDDhhmm');
  const zennPostsResponse = await fetch(`https://zenn.dev/attt/feed?${today}`).then((response) => response.text());
  return parseZennFeed(zennPostsResponse);
});
