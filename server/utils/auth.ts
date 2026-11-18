import type { H3Event } from 'h3';
import { createError } from 'h3';
import type { UserSession } from '#auth-utils';

import { ADMIN_EMAIL } from '../../shared/constants/auth';

export { ADMIN_EMAIL };

export function isAdminSession(session?: Pick<UserSession, 'user'> | null): boolean {
  return session?.user?.email === ADMIN_EMAIL;
}

export async function requireAdmin(event: H3Event): Promise<UserSession> {
  const session = await getUserSession(event);
  if (!isAdminSession(session)) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }
  return session;
}
