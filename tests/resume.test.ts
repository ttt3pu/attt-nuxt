import { afterAll, describe, expect, it, vi } from 'vitest';
import { createApp, defineEventHandler, readValidatedBody, toWebHandler } from 'h3';

vi.mock('@resume/profile.md', () => ({
  default:
    '# プロフィール\n\n公開の紹介文。\n\n所属: [secret]架空研究所[/secret]\n連絡先: [secret]sample@example.test[/secret]',
}));
vi.mock('@resume/jobs.md', () => ({
  default: '## 開発の経歴\n\n公開プロジェクトの説明。\n\n[secret]非公開案件[/secret]で開発を担当。',
}));

vi.stubGlobal('defineEventHandler', defineEventHandler);
vi.stubGlobal('readValidatedBody', readValidatedBody);
vi.stubGlobal('useRuntimeConfig', () => ({ SECRET_TOKEN: 'resume-test-token' }));
const { default: handler } = await import('../server/api/resume/index.post');
const request = toWebHandler(createApp().use('/api/resume', handler));

afterAll(() => vi.unstubAllGlobals());

async function post(body: unknown) {
  const response = await request(
    new Request('http://localhost/api/resume', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }),
  );
  return { status: response.status, body: await response.json() };
}

describe('職務経歴 API のトークン検証と秘密情報の公開', () => {
  it('正しいトークンの場合はプロフィールと職歴が伏せ字なしで返ること', async () => {
    expect(await post({ token: 'resume-test-token' })).toMatchSnapshot();
  });

  it.each([{}, { token: '' }, { token: 'wrong-token' }])(
    'トークン未入力または不一致の場合は秘密部分だけが伏せ字になること（%j）',
    async (body) => {
      expect(await post(body)).toMatchSnapshot();
    },
  );

  it.each([
    null,
    [],
    'resume-test-token',
    { token: null },
    { token: 123 },
    { token: ['resume-test-token'] },
    { token: {} },
  ])('不正な入力で秘密情報が公開されないこと（%j）', async (body) => {
    // 現行 API は safeParse の失敗でも 200 で伏せ字を返す。
    expect(await post(body)).toEqual(await post({}));
  });

  it('追加フィールドから公開判定を上書きできないこと', async () => {
    expect(await post({ token: 'wrong-token', isPassed: true })).toEqual(await post({}));
    expect(await post({ token: 'resume-test-token', extra: true })).toEqual(await post({ token: 'resume-test-token' }));
  });
});
