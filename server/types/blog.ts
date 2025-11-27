// Type definitions for BlogPost that match the Prisma schema
// Used for both Prisma and mock mode

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  published_at: Date;
  created_at: Date;
  updated_at: Date | null;
}

export interface BlogPostCreateInput {
  title: string;
  content: string;
  published_at: string | Date;
}

export interface BlogPostUpdateInput {
  title?: string;
  content?: string;
  published_at?: string | Date;
  updated_at?: Date;
}
