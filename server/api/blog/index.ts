import { PrismaClient } from '@prisma/client';

export default defineEventHandler(async () => {
  const prisma = new PrismaClient();
  const posts = await prisma.blogPost.findMany();

  return posts;
});
