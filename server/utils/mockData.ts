import type { BlogPost } from '../types/blog';

// Mock data for development without database
export const mockBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'サンプル記事1',
    content: `# サンプル記事1

これはモックモードで表示されるサンプル記事です。

## 特徴

- データベース不要で開発可能
- ダミーデータを使用
- Docker不要

\`\`\`typescript
const greeting = 'Hello, World!';
console.log(greeting);
\`\`\`
`,
    published_at: new Date('2024-01-15'),
    created_at: new Date('2024-01-15'),
    updated_at: null,
  },
  {
    id: 2,
    title: 'サンプル記事2',
    content: `# サンプル記事2

これは2番目のサンプル記事です。

モックモードでは以下のような機能が使えます：

1. 記事一覧の表示
2. 記事詳細の表示
3. 記事の作成（メモリ内のみ）
4. 記事の編集（メモリ内のみ）

データベースがなくても動作確認ができます。
`,
    published_at: new Date('2024-02-20'),
    created_at: new Date('2024-02-20'),
    updated_at: new Date('2024-02-21'),
  },
  {
    id: 3,
    title: 'モックモードについて',
    content: `# モックモードについて

## 概要

このアプリケーションはモックモードをサポートしています。
\`pnpm dev:mock\` コマンドで起動すると、データベースなしで動作します。

## 使い方

1. 環境変数 \`MOCK_MODE=true\` を設定
2. \`pnpm dev:mock\` を実行
3. ブラウザで http://localhost:3000 にアクセス

## 注意事項

- データは永続化されません
- 再起動するとデータはリセットされます
`,
    published_at: new Date('2024-03-10'),
    created_at: new Date('2024-03-10'),
    updated_at: null,
  },
];

// In-memory storage for mock mode (to support create/update operations)
let mockData = [...mockBlogPosts];
let nextId = mockData.length + 1;

export function getMockBlogPosts(): BlogPost[] {
  return mockData.sort((a, b) => b.published_at.getTime() - a.published_at.getTime());
}

export function getMockBlogPostById(id: number): BlogPost | undefined {
  return mockData.find((post) => post.id === id);
}

export function createMockBlogPost(input: { title: string; content: string; published_at: string | Date }): BlogPost {
  const newPost: BlogPost = {
    id: nextId++,
    title: input.title,
    content: input.content,
    published_at: new Date(input.published_at),
    created_at: new Date(),
    updated_at: null,
  };
  mockData.push(newPost);
  return newPost;
}

export function updateMockBlogPost(
  id: number,
  input: { title?: string; content?: string; published_at?: string | Date; updated_at?: Date },
): BlogPost | undefined {
  const index = mockData.findIndex((post) => post.id === id);
  if (index === -1) return undefined;

  const updated: BlogPost = {
    ...mockData[index],
    ...(input.title && { title: input.title }),
    ...(input.content && { content: input.content }),
    ...(input.published_at && { published_at: new Date(input.published_at) }),
    updated_at: input.updated_at || new Date(),
  };

  mockData[index] = updated;
  return updated;
}

// Reset mock data (useful for testing)
export function resetMockData(): void {
  mockData = [...mockBlogPosts];
  nextId = mockData.length + 1;
}
