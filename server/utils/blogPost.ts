import type { BlogPost, Prisma } from '@prisma/client';

type Db = Prisma.TransactionClient;

export type BlogPostInput = {
  title: string;
  content: string;
  published_at?: string | Date;
};

export function listBlogPosts(db: Db): Promise<BlogPost[]> {
  return db.blogPost.findMany({
    orderBy: {
      published_at: 'desc',
    },
  });
}

export function findBlogPost(db: Db, id: number): Promise<BlogPost | null> {
  return db.blogPost.findUnique({
    where: {
      id,
    },
  });
}

export function createBlogPost(db: Db, input: BlogPostInput): Promise<BlogPost> {
  return db.blogPost.create({
    data: {
      title: input.title,
      content: input.content,
      published_at: input.published_at ? new Date(input.published_at) : new Date(),
    },
  });
}

export function updateBlogPost(db: Db, id: number, input: BlogPostInput): Promise<BlogPost> {
  return db.blogPost.update({
    where: {
      id,
    },
    data: {
      title: input.title,
      content: input.content,
      published_at: input.published_at ? new Date(input.published_at) : undefined,
      updated_at: new Date(),
    },
  });
}

export function deleteBlogPost(db: Db, id: number): Promise<BlogPost> {
  return db.blogPost.delete({
    where: {
      id,
    },
  });
}
