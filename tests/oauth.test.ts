import type { RequestEvent } from 'nuxt/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  clear: vi.fn(),
  redirect: vi.fn((_event: unknown, location: string) => location),
}));
vi.mock('nuxt/server', () => ({ sendRedirect: mocks.redirect }));

// OAuth 通信はプロバイダーの責務とし、アプリの成功・失敗時の振る舞いを検証する。
vi.stubGlobal('defineOAuthGoogleEventHandler', (options: unknown) => options);
vi.stubGlobal('replaceUserSession', mocks.replace);
vi.stubGlobal('clearUserSession', mocks.clear);
const { default: handler } = await import('../server/routes/auth/google.get');
const callbacks = handler as unknown as {
  onSuccess: (event: RequestEvent, result: { user: Record<string, unknown> }) => Promise<unknown>;
  onError: (event: RequestEvent) => Promise<unknown>;
};
const event = {} as RequestEvent;

beforeEach(() => vi.clearAllMocks());

describe('Google ログイン後のセッションと画面遷移', () => {
  it('確認済みメールでログインすると公開プロフィールだけを保存して管理画面へ移動すること', async () => {
    const user = {
      email: 'sample@example.com',
      email_verified: true,
      name: 'Sample User',
      picture: 'https://example.com/avatar.png',
      access_token: 'must-not-store',
    };
    expect(await callbacks.onSuccess(event, { user })).toBe('/admin');
    expect(mocks.replace).toHaveBeenCalledWith(event, {
      user: { email: user.email, name: user.name, image: user.picture },
    });
    expect(mocks.clear).not.toHaveBeenCalled();
  });

  it.each([
    { email: 'sample@example.com', email_verified: false },
    { email: 'sample@example.com' },
    { email: '', email_verified: true },
    { email_verified: true },
  ])('未確認または不正なメールではセッションを破棄してログイン失敗を表示すること（%j）', async (user) => {
    expect(await callbacks.onSuccess(event, { user })).toBe('/admin/login?error=oauth');
    expect(mocks.replace).not.toHaveBeenCalled();
    expect(mocks.clear).toHaveBeenCalledWith(event);
  });

  it('Google の認証に失敗すると以前のセッションを破棄してログイン画面に戻ること', async () => {
    expect(await callbacks.onError(event)).toBe('/admin/login?error=oauth');
    expect(mocks.clear).toHaveBeenCalledWith(event);
    expect(mocks.replace).not.toHaveBeenCalled();
  });
});
