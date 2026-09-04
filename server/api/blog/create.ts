import { prisma } from '#server/utils/prisma';
import { createBlogPost } from '#server/utils/blogPost';
import { requireAdmin } from '#server/utils/auth';
import { deployWebhook } from '~/utils/server/deployWebhook';

export default defineEventHandler<{
  body: {
    content: string;
    title: string;
    published_at: string;
  };
}>(async (e) => {
  await requireAdmin(e);

  const requestBody = await readBody(e);

  await createBlogPost(prisma, requestBody);

  await deployWebhook();
});
