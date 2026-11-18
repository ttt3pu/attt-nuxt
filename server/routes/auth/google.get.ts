import { sendRedirect } from 'nuxt/server';

export default defineOAuthGoogleEventHandler({
  config: {
    scope: ['email', 'profile', 'openid'],
  },
  async onSuccess(event, { user }) {
    // 管理者の判定に利用するため、Google によるメール確認を必須とする。
    if (user.email_verified !== true || typeof user.email !== 'string' || !user.email) {
      await clearUserSession(event);
      return sendRedirect(event, '/admin/login?error=oauth');
    }
    await replaceUserSession(event, {
      user: { email: user.email, name: user.name, image: user.picture },
    });
    return sendRedirect(event, '/admin');
  },
  async onError(event) {
    await clearUserSession(event);
    return sendRedirect(event, '/admin/login?error=oauth');
  },
});
