import { NuxtAuthHandler } from '#auth';
import GithubProvider from 'next-auth/providers/github';

export default NuxtAuthHandler({
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GithubProvider.default({
      clientId: process.env.AUTH_CLIENT_ID,
      clientSecret: process.env.AUTH_CLIENT_SECRET,
    }),
  ],
  secret: process.env.AUTH_SECRET,
});
