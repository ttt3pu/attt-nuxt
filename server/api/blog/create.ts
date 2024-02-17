import { PrismaClient } from '@prisma/client';
import { getServerSession } from '#auth';

export default defineEventHandler<{
  body: {
    content: string;
    title: string;
    published_at: string;
  };
}>(async (e) => {
  const session = await getServerSession(e);
  const isAdmin = session?.user?.email === 'ttt3pu@gmail.com';

  if (!isAdmin) {
    throw createError({
      statusCode: 401,
    });
  }

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
