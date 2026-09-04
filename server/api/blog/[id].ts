import { prisma } from '#server/utils/prisma';
import { findBlogPost } from '#server/utils/blogPost';

export default defineEventHandler(async (e) => {
  const id = e.context.params!.id;

  return await findBlogPost(prisma, Number(id));
});
