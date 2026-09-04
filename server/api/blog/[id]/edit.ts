import { prisma } from '#server/utils/prisma';
import { updateBlogPost } from '#server/utils/blogPost';
import { getServerSession } from '#auth';
import { deployWebhook } from '~/utils/server/deployWebhook';

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

  const id = e.context.params!.id;

  const requestBody = await readBody(e);

  await updateBlogPost(prisma, Number(id), requestBody);

  await deployWebhook();
});
