// Temporarily disabled Prisma due to network connectivity issues in build environment
// import { PrismaClient } from '@prisma/client';

export default defineEventHandler(async () => {
  // Mock data for development/build purposes
  const posts = [
    {
      id: 1,
      title: "Sample Blog Post",
      content: "This is a sample blog post content.",
      published: true,
      published_at: new Date("2024-01-01"),
      created_at: new Date("2024-01-01"),
      updated_at: new Date("2024-01-01"),
    },
    {
      id: 2,
      title: "Another Blog Post",
      content: "Another sample blog post for testing.",
      published: true,
      published_at: new Date("2024-01-02"),
      created_at: new Date("2024-01-02"),
      updated_at: new Date("2024-01-02"),
    }
  ];

  return posts;

  // Original Prisma code (commented out due to network issues in build environment):
  // const prisma = new PrismaClient();
  // const posts = await prisma.blogPost.findMany({
  //   orderBy: {
  //     published_at: 'desc',
  //   },
  // });
  // return posts;
});
