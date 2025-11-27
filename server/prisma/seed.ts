import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample blog posts
  await prisma.blogPost.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: 'サンプル記事1',
      content: `# サンプル記事1

これはサンプル記事です。

## 特徴

- Nuxt 3で構築
- Tailwind CSSを使用
- TypeScriptで型安全

\`\`\`typescript
const greeting = 'Hello, World!';
console.log(greeting);
\`\`\`
`,
      published_at: new Date('2024-01-15'),
    },
  });

  await prisma.blogPost.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      title: 'サンプル記事2',
      content: `# サンプル記事2

これは2番目のサンプル記事です。

## 内容

1. 記事一覧の表示
2. 記事詳細の表示
3. 記事の作成
4. 記事の編集

Prismaでデータベースを管理しています。
`,
      published_at: new Date('2024-02-20'),
      updated_at: new Date('2024-02-21'),
    },
  });

  console.log('Seed data created successfully');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
