import { prisma } from '#server/utils/prisma';

export default defineEventHandler(async () => {
  const posts = await prisma.blogPost.findMany({
    orderBy: {
      published_at: 'desc',
    },
  });

  return posts;
});
