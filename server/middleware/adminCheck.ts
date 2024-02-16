import { getServerSession } from '#auth';

export default defineEventHandler(async (event) => {
  if (['/api/blog/create'].includes(event.path) || /\/api\/blog(.+)\/edit/.test(event.path)) {
    const session = await getServerSession(event);
    const isAdmin = session?.user?.email === 'ttt3pu@gmail.com';

    if (!isAdmin) {
      throw createError({
        statusCode: 401,
      });
    }
  }
});
