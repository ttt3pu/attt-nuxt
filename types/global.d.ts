declare module 'vue-material-design-icons/*.vue';

declare module '*.md' {
  const content: string;
  export default content;
}

// Override @prisma/client when submodules are not available (for CI)
declare module '@prisma/client' {
  export interface BlogPost {
    id: number;
    created_at: Date;
    updated_at: Date;
    published_at: string;
    title: string;
    content: string;
  }

  export declare class PrismaClient {
    blogPost: {
      findMany: (args?: {
        orderBy?: { [key: string]: 'asc' | 'desc' };
        where?: Record<string, unknown>;
      }) => Promise<BlogPost[]>;
      findUnique: (args: { where: { id: number } }) => Promise<BlogPost | null>;
      create: (args: { data: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'> & { updated_at?: Date } }) => Promise<BlogPost>;
      update: (args: { where: { id: number }; data: Partial<BlogPost> & { updated_at?: Date } }) => Promise<BlogPost>;
      delete: (args: { where: { id: number } }) => Promise<BlogPost>;
    };

    constructor();
    $disconnect(): Promise<void>;
  }

  export declare namespace Prisma {
    export class PrismaClientKnownRequestError extends Error {
      code: string;
      message: string;
      constructor(message: string, options: { code: string });
    }
  }
}
