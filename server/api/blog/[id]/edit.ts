import { prisma } from '#server/utils/prisma';
import { updateBlogPost } from '#server/utils/blogPost';
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

  const id = e.context.params!.id;

  const requestBody = await readBody(e);

  await updateBlogPost(prisma, Number(id), requestBody);

  await deployWebhook();
});
