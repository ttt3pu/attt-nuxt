import { getBlogDatabase } from '~/server/utils/db';

export default defineEventHandler(async () => {
  const db = getBlogDatabase();
  const posts = await db.findMany({
    orderBy: {
      published_at: 'desc',
    },
  });

  return posts;
});
