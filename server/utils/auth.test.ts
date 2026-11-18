import { describe, expect, it, vi } from 'vitest';
import type { H3Event } from 'h3';
import type { UserSession as Session } from '#auth-utils';
import { ADMIN_EMAIL, isAdminSession, requireAdmin } from './auth';

const getUserSessionMock = vi.fn();
vi.stubGlobal('getUserSession', getUserSessionMock);

describe('管理者セッションの判定', () => {
  it('管理者メールアドレスを持つセッションの場合は管理者として判定されること', () => {
    const session: Session = {
      user: {
        name: 'Admin User',
        email: ADMIN_EMAIL,
        image: 'https://example.com/avatar.png',
      },
      id: 'test-session',
    };
    expect(isAdminSession(session)).toBe(true);
  });

  it('一般ユーザーのメールアドレスを持つセッションの場合は管理者として判定されないこと', () => {
    const session: Session = {
      user: {
        name: 'General User',
        email: 'general-user@example.com',
      },
      id: 'test-session',
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
        email: '',
      },
      id: 'test-session',
    };
    expect(isAdminSession(sessionWithoutEmail)).toBe(false);
    expect(isAdminSession({ id: 'test-session' } as Session)).toBe(false);
  });
});

describe('管理者権限の検証（サーバーサイドガード）', () => {
  it('管理者セッションが存在する場合はセッションがそのまま返ること', async () => {
    const adminSession: Session = {
      user: {
        name: 'Admin User',
        email: ADMIN_EMAIL,
      },
      id: 'test-session',
    };

    getUserSessionMock.mockResolvedValueOnce(adminSession);

    const dummyEvent = {} as H3Event;
    const result = await requireAdmin(dummyEvent);
    expect(result).toEqual(adminSession);
  });

  it('未ログイン（セッションが null）の場合は 401 エラーが送出されること', async () => {
    getUserSessionMock.mockResolvedValueOnce({ id: 'visitor' });

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
      id: 'test-session',
    };

    getUserSessionMock.mockResolvedValueOnce(generalSession);

    const dummyEvent = {} as H3Event;
    await expect(requireAdmin(dummyEvent)).rejects.toMatchObject({
      statusCode: 401,
    });
  });
});
