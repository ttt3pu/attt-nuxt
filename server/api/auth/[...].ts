import { NuxtAuthHandler } from '#auth';
import GoogleProvider from 'next-auth/providers/google';

export default NuxtAuthHandler({
  providers: [
    // @ts-expect-error - You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GoogleProvider.default({
      clientId: process.env.AUTH_CLIENT_ID_GOOGLE!,
      clientSecret: process.env.AUTH_CLIENT_SECRET_GOOGLE!,
    }),
  ],
  secret: process.env.AUTH_SECRET,
});
