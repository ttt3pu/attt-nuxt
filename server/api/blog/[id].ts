import { getBlogDatabase } from '~/server/utils/db';

export default defineEventHandler(async (e) => {
  const id = e.context.params!.id;
  const db = getBlogDatabase();

  const post = await db.findUnique({
    where: {
      id: Number(id),
    },
  });

  return post;
});
