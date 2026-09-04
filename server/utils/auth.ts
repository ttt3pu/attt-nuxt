import type { H3Event } from 'h3';
import type { AuthOptions, Session } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { getServerSession } from '#auth';

export const ADMIN_EMAIL = 'ttt3pu@gmail.com';

export interface AuthEnv {
  AUTH_CLIENT_ID_GOOGLE?: string;
  AUTH_CLIENT_SECRET_GOOGLE?: string;
  AUTH_SECRET?: string;
  [key: string]: string | undefined;
}

export function createAuthOptions(env: AuthEnv = process.env): AuthOptions {
  type GoogleProviderFn = typeof GoogleProvider;
  const googleProvider = (
    'default' in GoogleProvider ? (GoogleProvider as unknown as { default: GoogleProviderFn }).default : GoogleProvider
  ) as GoogleProviderFn;

  return {
    providers: [
      googleProvider({
        clientId: env.AUTH_CLIENT_ID_GOOGLE || '',
        clientSecret: env.AUTH_CLIENT_SECRET_GOOGLE || '',
      }),
    ],
    secret: env.AUTH_SECRET,
  };
}

export const authOptions = createAuthOptions();

export function isAdminSession(session?: Session | null): boolean {
  return session?.user?.email === ADMIN_EMAIL;
}

const createHttpError = (err: { statusCode: number; statusMessage?: string }) => {
  if (typeof createError === 'function') {
    return createError(err);
  }
  const error = new Error(err.statusMessage || 'Error') as Error & { statusCode: number };
  error.statusCode = err.statusCode;
  return error;
};

export async function requireAdmin(event: H3Event): Promise<Session> {
  const session = await getServerSession(event);

  if (!isAdminSession(session)) {
    throw createHttpError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  return session!;
}
