import { PrismaClient } from '@prisma/client';

export default defineEventHandler(async (e) => {
  const id = e.context.params!.id;
  const prisma = new PrismaClient();

  const post = await prisma.blogPost.findUnique({
    where: {
      id: Number(id),
    },
  });

  return post;
});
