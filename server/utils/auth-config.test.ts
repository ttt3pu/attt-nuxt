import { describe, expect, it } from 'vitest';
import { getGoogleOAuthConfig } from './auth-config';

describe('既存の Google 認証設定の引き継ぎ', () => {
  it('旧環境変数の認証情報と登録済みコールバック URL が引き継がれること', () => {
    expect(
      getGoogleOAuthConfig({
        AUTH_CLIENT_ID_GOOGLE: 'sample-client-id',
        AUTH_CLIENT_SECRET_GOOGLE: 'sample-client-secret',
        NUXT_AUTH_BASE_URL: 'https://example.com/api/auth',
        NEXTAUTH_URL: 'https://unused.example.com',
      }),
    ).toMatchObject({
      clientId: 'sample-client-id',
      clientSecret: 'sample-client-secret',
      redirectURL: 'https://example.com/api/auth/callback/google',
    });
  });

  it.each([
    { NEXTAUTH_URL: 'https://example.com' },
    { AUTH_ORIGIN: 'https://example.com/' },
    { NUXT_AUTH_BASE_URL: 'https://example.com/api/auth/' },
  ])('既存のオリジン設定から同じコールバック URL が生成されること（%j）', (env) => {
    expect(getGoogleOAuthConfig(env).redirectURL).toBe('https://example.com/api/auth/callback/google');
  });

  it('固定 URL が未設定なら現在のリクエスト URL を使用すること', () => {
    expect(getGoogleOAuthConfig({}).redirectURL).toBeUndefined();
  });
});
