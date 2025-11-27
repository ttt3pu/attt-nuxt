import type { BlogPost, BlogPostCreateInput, BlogPostUpdateInput } from '../types/blog';
import { getMockBlogPosts, getMockBlogPostById, createMockBlogPost, updateMockBlogPost } from './mockData';

// Check if we're in mock mode
export function isMockMode(): boolean {
  return process.env.MOCK_MODE === 'true';
}

// Database interface for blog operations
export interface BlogDatabase {
  findMany(options?: { orderBy?: { published_at: 'asc' | 'desc' } }): Promise<BlogPost[]>;
  findUnique(options: { where: { id: number } }): Promise<BlogPost | null>;
  create(options: { data: BlogPostCreateInput }): Promise<BlogPost>;
  update(options: { where: { id: number }; data: BlogPostUpdateInput }): Promise<BlogPost>;
}

// Mock implementation
class MockBlogDatabase implements BlogDatabase {
  async findMany(options?: { orderBy?: { published_at: 'asc' | 'desc' } }): Promise<BlogPost[]> {
    const posts = getMockBlogPosts();
    if (options?.orderBy?.published_at === 'asc') {
      return posts.reverse();
    }
    return posts;
  }

  async findUnique(options: { where: { id: number } }): Promise<BlogPost | null> {
    return getMockBlogPostById(options.where.id) || null;
  }

  async create(options: { data: BlogPostCreateInput }): Promise<BlogPost> {
    return createMockBlogPost(options.data);
  }

  async update(options: { where: { id: number }; data: BlogPostUpdateInput }): Promise<BlogPost> {
    const result = updateMockBlogPost(options.where.id, options.data);
    if (!result) {
      throw new Error(`BlogPost with id ${options.where.id} not found`);
    }
    return result;
  }
}

// Prisma implementation
class PrismaBlogDatabase implements BlogDatabase {
  private prismaClient: import('@prisma/client').PrismaClient | null = null;

  private async getClient(): Promise<import('@prisma/client').PrismaClient> {
    if (!this.prismaClient) {
      const { PrismaClient } = await import('@prisma/client');
      this.prismaClient = new PrismaClient();
    }
    return this.prismaClient;
  }

  async findMany(options?: { orderBy?: { published_at: 'asc' | 'desc' } }): Promise<BlogPost[]> {
    const client = await this.getClient();
    const posts = await client.blogPost.findMany({
      orderBy: options?.orderBy,
    });
    return posts as BlogPost[];
  }

  async findUnique(options: { where: { id: number } }): Promise<BlogPost | null> {
    const client = await this.getClient();
    const post = await client.blogPost.findUnique({
      where: options.where,
    });
    return post as BlogPost | null;
  }

  async create(options: { data: BlogPostCreateInput }): Promise<BlogPost> {
    const client = await this.getClient();
    const post = await client.blogPost.create({
      data: options.data,
    });
    return post as BlogPost;
  }

  async update(options: { where: { id: number }; data: BlogPostUpdateInput }): Promise<BlogPost> {
    const client = await this.getClient();
    const post = await client.blogPost.update({
      where: options.where,
      data: options.data,
    });
    return post as BlogPost;
  }
}

// Singleton instances
let mockDb: MockBlogDatabase | null = null;
let prismaDb: PrismaBlogDatabase | null = null;

// Factory function to get the appropriate database
export function getBlogDatabase(): BlogDatabase {
  if (isMockMode()) {
    if (!mockDb) {
      mockDb = new MockBlogDatabase();
    }
    return mockDb;
  }

  if (!prismaDb) {
    prismaDb = new PrismaBlogDatabase();
  }
  return prismaDb;
}
