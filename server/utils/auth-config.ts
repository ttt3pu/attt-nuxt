export function getGoogleOAuthConfig(env: NodeJS.ProcessEnv = process.env) {
  const baseURL = env.NUXT_AUTH_BASE_URL || env.NEXTAUTH_URL || env.AUTH_ORIGIN;
  let redirectURL: string | undefined;
  if (baseURL) {
    const url = new URL(baseURL);
    url.pathname = `${url.pathname.replace(/\/$/, '').replace(/\/api\/auth$/, '')}/api/auth/callback/google`;
    url.search = '';
    url.hash = '';
    redirectURL = url.toString();
  }
  return {
    clientId: env.AUTH_CLIENT_ID_GOOGLE,
    clientSecret: env.AUTH_CLIENT_SECRET_GOOGLE,
    redirectURL,
    scope: ['email', 'profile', 'openid'],
  };
}
