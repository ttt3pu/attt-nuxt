import { describe, expect, it } from 'vitest';
import { renderArticleMarkdown, renderMarkdown } from './renderMarkdown';

const article = `## 開発記録
**試作版**の紹介です。

### 利用方法

詳細は[案内](https://example.com/guide)を参照。

<https://example.com>

- 設計
- 実装

1. 確認
1. 公開

[secret]非公開の案件名[/secret]
`;

describe('記事・プロフィール・職歴の本文表示', () => {
  it('本番相当の本文構造と閲覧制限の注記が維持されること', () => {
    expect(renderArticleMarkdown(article)).toMatchSnapshot();
  });
});

describe('スキル説明の表示', () => {
  it('段落と強調・リンクを表示し本文専用の閲覧制限変換を適用しないこと', () => {
    expect(
      renderMarkdown('**画面開発**を担当しています。\n\n[制作例](https://example.com/demo)\n\n[secret]補足[/secret]'),
    ).toMatchSnapshot();
    expect(renderMarkdown('')).toBe('');
  });
});

describe('保存された本文やスキル説明の安全な表示', () => {
  it.each([
    ['本文', renderArticleMarkdown],
    ['スキル説明', renderMarkdown],
  ] as const)('%s に含まれる HTML と危険なリンクが実行可能な要素にならないこと', (_, render) => {
    const html = render(
      '<script>alert(1)</script>\n\n<img src=x onerror=alert(1)>\n\n[開く](javascript:alert(1))\n\n[secret]<img src=x onerror=alert(1)>[/secret]',
    );
    expect(html).toMatchSnapshot();
    expect(html).not.toMatch(/<script|<img|href="javascript:/i);
  });
});
