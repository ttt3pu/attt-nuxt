import { PrismaClient } from '@prisma/client';

export default defineEventHandler(async (e) => {
  const slug = e.context.params!.slug;
  const prisma = new PrismaClient();

  const post = await prisma.blogPost.findUnique({
    where: {
      slug,
    },
  });

  return post;
});
