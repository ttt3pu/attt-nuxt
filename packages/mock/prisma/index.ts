// Mock BlogPost type (based on @prisma/client BlogPost)
export interface BlogPost {
  id: number;
  title: string;
  content: string;
  published_at: Date;
  created_at: Date;
  updated_at: Date;
}

// Mock PrismaClientKnownRequestError class
export class PrismaClientKnownRequestError extends Error {
  code: string;
  constructor(message: string, { code }: { code: string }) {
    super(message);
    this.code = code;
    this.name = 'PrismaClientKnownRequestError';
  }
}

// Mock Prisma namespace for error handling (for compatibility with usePrismaErrorHandling.ts)
export const Prisma = {
  PrismaClientKnownRequestError,
};

// Mock data
const mockBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Mock Blog Post 1',
    content: 'This is the first mock blog post content. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    published_at: new Date('2024-01-15'),
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2024-01-15'),
  },
  {
    id: 2,
    title: 'Mock Blog Post 2',
    content: 'This is the second mock blog post content. Development mode testing.',
    published_at: new Date('2024-02-20'),
    created_at: new Date('2024-02-20'),
    updated_at: new Date('2024-02-20'),
  },
  {
    id: 3,
    title: 'Mock Blog Post 3',
    content: 'Third mock post for testing purposes. Mock mode is working correctly!',
    published_at: new Date('2024-03-10'),
    created_at: new Date('2024-03-10'),
    updated_at: new Date('2024-03-10'),
  },
];

// Mock PrismaClient
export class PrismaClient {
  blogPost = {
    findMany: async (options?: { orderBy?: { published_at?: 'asc' | 'desc' } }) => {
      const posts = [...mockBlogPosts];
      if (options?.orderBy?.published_at === 'desc') {
        posts.sort((a, b) => b.published_at.getTime() - a.published_at.getTime());
      } else if (options?.orderBy?.published_at === 'asc') {
        posts.sort((a, b) => a.published_at.getTime() - b.published_at.getTime());
      }
      return posts;
    },
    findUnique: async (options: { where: { id: number } }) => {
      return mockBlogPosts.find((post) => post.id === options.where.id) || null;
    },
    create: async (options: { data: { title: string; content: string; published_at: string } }) => {
      const newPost: BlogPost = {
        id: mockBlogPosts.length + 1,
        title: options.data.title,
        content: options.data.content,
        published_at: new Date(options.data.published_at),
        created_at: new Date(),
        updated_at: new Date(),
      };
      mockBlogPosts.push(newPost);
      return newPost;
    },
    update: async (options: {
      where: { id: number };
      data: { title?: string; content?: string; published_at?: string; updated_at?: Date };
    }) => {
      const existingPost = mockBlogPosts.find((post) => post.id === options.where.id);
      if (!existingPost) {
        throw new PrismaClientKnownRequestError('Record not found', { code: 'P2025' });
      }
      const index = mockBlogPosts.indexOf(existingPost);
      const updatedPost: BlogPost = {
        id: existingPost.id,
        title: options.data.title ?? existingPost.title,
        content: options.data.content ?? existingPost.content,
        published_at: options.data.published_at ? new Date(options.data.published_at) : existingPost.published_at,
        created_at: existingPost.created_at,
        updated_at: options.data.updated_at || new Date(),
      };
      mockBlogPosts[index] = updatedPost;
      return updatedPost;
    },
  };
}
