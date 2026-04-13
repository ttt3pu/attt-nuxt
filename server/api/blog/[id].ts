import { prisma } from '~/server/utils/prisma';

export default defineEventHandler(async (e) => {
  const id = e.context.params!.id;

  const post = await prisma.blogPost.findUnique({
    where: {
      id: Number(id),
    },
  });

  return post;
});
