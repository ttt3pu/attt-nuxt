import { prisma } from '#server/utils/prisma';
import { listBlogPosts } from '#server/utils/blogPost';

export default defineEventHandler(async () => {
  return await listBlogPosts(prisma);
});
