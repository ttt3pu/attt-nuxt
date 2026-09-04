import { describe, expect, it } from 'vitest';
import { parseZennFeed } from './parseZennFeed';

describe('Zenn 記事フィードのパース', () => {
  const dummyFeedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ユーザーのフィード</title>
    <link>https://example.com/user/feed</link>
    <description>ユーザーの記事一覧</description>
    <item>
      <title>Nuxt 3 と TypeScript で作る Web アプリケーション</title>
      <link>https://example.com/articles/sample-post-1</link>
      <pubDate>Mon, 01 Jan 2024 12:00:00 GMT</pubDate>
      <guid isPermaLink="true">https://example.com/articles/sample-post-1</guid>
      <description>サンプル記事の概要テキストです。</description>
    </item>
    <item>
      <title>Tailwind CSS &amp; Vite の活用テクニック &lt;2024年版&gt;</title>
      <link>https://example.com/articles/sample-post-2</link>
      <pubDate>Thu, 15 Feb 2024 09:30:00 GMT</pubDate>
      <guid isPermaLink="true">https://example.com/articles/sample-post-2</guid>
      <description>スタイル調整に関するテクニック紹介。</description>
    </item>
  </channel>
</rss>`;

  it('RSS フィード XML から記事一覧（タイトル・公開日時・リンク）が抽出されること', () => {
    const posts = parseZennFeed(dummyFeedXml);
    expect(posts).toMatchInlineSnapshot(`
      [
        {
          "link": "https://example.com/articles/sample-post-1",
          "pubDate": "Mon, 01 Jan 2024 12:00:00 GMT",
          "title": "Nuxt 3 と TypeScript で作る Web アプリケーション",
        },
        {
          "link": "https://example.com/articles/sample-post-2",
          "pubDate": "Thu, 15 Feb 2024 09:30:00 GMT",
          "title": "Tailwind CSS & Vite の活用テクニック <2024年版>",
        },
      ]
    `);
  });

  it('フィード内に記事（item 要素）が存在しない場合は空配列を返すこと', () => {
    const emptyFeedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>空のフィード</title>
    <link>https://example.com/feed</link>
  </channel>
</rss>`;

    const posts = parseZennFeed(emptyFeedXml);
    expect(posts).toEqual([]);
  });

  it('item 要素内のタグが欠損している場合でも空文字として安全に処理されること', () => {
    const incompleteFeedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <item>
      <title>タイトルのみの記事</title>
    </item>
  </channel>
</rss>`;

    const posts = parseZennFeed(incompleteFeedXml);
    expect(posts).toEqual([
      {
        title: 'タイトルのみの記事',
        pubDate: '',
        link: '',
      },
    ]);
  });
});
