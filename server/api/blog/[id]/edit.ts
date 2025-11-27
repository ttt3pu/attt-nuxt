import { getServerSession } from '#auth';
import { deployWebhook } from '~/utils/server/deployWebhook';
import { getBlogDatabase } from '~/server/utils/db';

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
  const db = getBlogDatabase();

  const requestBody = await readBody(e);

  await db.update({
    where: {
      id: Number(id),
    },
    data: {
      content: requestBody.content,
      title: requestBody.title,
      published_at: requestBody.published_at,
      updated_at: new Date(),
    },
  });

  await deployWebhook();
});
