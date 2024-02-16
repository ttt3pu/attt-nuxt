import { getServerSession } from '#auth';

export default defineEventHandler(async (event) => {
  if (['/api/blog/create'].includes(event.path) || /\/api\/blog(.+)\/edit/.test(event.path)) {
    // FIXME: type errorになる
    //   型 'import("/home/attt/Projects/attt-nuxt/node_modules/.pnpm/h3@1.10.1/node_modules/h3/dist/index").H3Event<import("/home/attt/Projects/attt-nuxt/node_modules/.pnpm/h3@1.10.1/node_modules/h3/dist/index").EventHandlerRequest>' の引数を型 'import("/home/attt/Projects/attt-nuxt/node_modules/.pnpm/h3@1.8.2/node_modules/h3/dist/index").H3Event<import("/home/attt/Projects/attt-nuxt/node_modules/.pnpm/h3@1.8.2/node_modules/h3/dist/index").EventHandlerRequest>' のパラメーターに割り当てることはできません。
    // 'context.matchedRoute' の型は、これらの型同士で互換性がありません。ts(2345)
    const session = await getServerSession(event);
    const isAdmin = session?.user?.email === 'ttt3pu@gmail.com';

    if (!isAdmin) {
      throw createError({
        statusCode: 401,
      });
    }
  }
});
