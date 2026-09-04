import { describe, expect, it, vi } from 'vitest';
import type { H3Event } from 'h3';
import type { Session } from 'next-auth';
import { NuxtAuthHandler } from '#auth';
import * as authServices from '#auth';
import { ADMIN_EMAIL, createAuthOptions, isAdminSession, requireAdmin } from './auth';

describe('認証設定の生成', () => {
  it('環境変数から Google OAuth プロバイダーと secret が設定された AuthOptions が生成されること', () => {
    const options = createAuthOptions({
      AUTH_CLIENT_ID_GOOGLE: 'dummy-google-client-id',
      AUTH_CLIENT_SECRET_GOOGLE: 'dummy-google-client-secret',
      AUTH_SECRET: 'dummy-auth-secret',
    });

    expect(options.secret).toBe('dummy-auth-secret');
    expect(options.providers).toHaveLength(1);
    const provider = options.providers[0] as unknown as {
      id: string;
      options: { clientId: string; clientSecret: string };
    };
    expect(provider.id).toBe('google');
    expect(provider.options.clientId).toBe('dummy-google-client-id');
    expect(provider.options.clientSecret).toBe('dummy-google-client-secret');
  });

  it('NuxtAuthHandler に AuthOptions を渡してイベントハンドラーが初期化されること', () => {
    const options = createAuthOptions({
      AUTH_CLIENT_ID_GOOGLE: 'test-client-id',
      AUTH_CLIENT_SECRET_GOOGLE: 'test-client-secret',
      AUTH_SECRET: 'test-secret',
    });
    const handler = NuxtAuthHandler(options);
    expect(typeof handler).toBe('function');
  });
});

describe('管理者セッションの判定', () => {
  it('管理者メールアドレスを持つセッションの場合は管理者として判定されること', () => {
    const session: Session = {
      user: {
        name: 'Admin User',
        email: ADMIN_EMAIL,
        image: 'https://example.com/avatar.png',
      },
      expires: '2026-12-31T23:59:59.999Z',
    };
    expect(isAdminSession(session)).toBe(true);
  });

  it('一般ユーザーのメールアドレスを持つセッションの場合は管理者として判定されないこと', () => {
    const session: Session = {
      user: {
        name: 'General User',
        email: 'general-user@example.com',
      },
      expires: '2026-12-31T23:59:59.999Z',
    };
    expect(isAdminSession(session)).toBe(false);
  });

  it('セッションが存在しない場合は管理者として判定されないこと', () => {
    expect(isAdminSession(null)).toBe(false);
    expect(isAdminSession(undefined)).toBe(false);
  });

  it('ユーザー情報やメールアドレスが存在しないセッションの場合は管理者として判定されないこと', () => {
    const sessionWithoutEmail: Session = {
      user: {
        name: 'No Email User',
      },
      expires: '2026-12-31T23:59:59.999Z',
    };
    expect(isAdminSession(sessionWithoutEmail)).toBe(false);
    expect(isAdminSession({ expires: '2026-12-31T23:59:59.999Z' } as Session)).toBe(false);
  });
});

describe('管理者権限の検証（サーバーサイドガード）', () => {
  it('管理者セッションが存在する場合はセッションがそのまま返ること', async () => {
    const adminSession: Session = {
      user: {
        name: 'Admin User',
        email: ADMIN_EMAIL,
      },
      expires: '2026-12-31T23:59:59.999Z',
    };

    vi.spyOn(authServices, 'getServerSession').mockResolvedValueOnce(adminSession);

    const dummyEvent = {} as H3Event;
    const result = await requireAdmin(dummyEvent);
    expect(result).toEqual(adminSession);
  });

  it('未ログイン（セッションが null）の場合は 401 エラーが送出されること', async () => {
    vi.spyOn(authServices, 'getServerSession').mockResolvedValueOnce(null);

    const dummyEvent = {} as H3Event;
    await expect(requireAdmin(dummyEvent)).rejects.toMatchObject({
      statusCode: 401,
    });
  });

  it('一般ユーザーセッションの場合は 401 エラーが送出されること', async () => {
    const generalSession: Session = {
      user: {
        name: 'General User',
        email: 'other@example.com',
      },
      expires: '2026-12-31T23:59:59.999Z',
    };

    vi.spyOn(authServices, 'getServerSession').mockResolvedValueOnce(generalSession);

    const dummyEvent = {} as H3Event;
    await expect(requireAdmin(dummyEvent)).rejects.toMatchObject({
      statusCode: 401,
    });
  });
});
