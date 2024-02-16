import { PrismaClient } from '@prisma/client';

export default defineEventHandler<{
  body: {
    content: string;
    title: string;
    published_at: string;
  };
}>(async (e) => {
  const prisma = new PrismaClient();

  const requestBody = await readBody(e);

  await prisma.blogPost.create({
    data: {
      content: requestBody.content,
      title: requestBody.title,
      published_at: requestBody.published_at,
    },
  });
});
