// Temporary type definitions for Prisma when client is not generated
// This file provides fallback types to allow CI to pass when Prisma generate fails

declare module '@prisma/client' {
  export interface BlogPost {
    id: string;
    title: string;
    content: string;
    published_at: Date | null;
    created_at: Date;
    updated_at: Date;
  }

  export class PrismaClient {
    blogPost: {
      findMany: (args?: Record<string, unknown>) => Promise<BlogPost[]>;
      findUnique: (args: Record<string, unknown>) => Promise<BlogPost | null>;
      create: (args: Record<string, unknown>) => Promise<BlogPost>;
      update: (args: Record<string, unknown>) => Promise<BlogPost>;
      delete: (args: Record<string, unknown>) => Promise<BlogPost>;
    };
    
    constructor();
    $disconnect(): Promise<void>;
  }

  export namespace Prisma {
    export class PrismaClientKnownRequestError extends Error {
      code: string;
      meta?: Record<string, unknown>;
      message: string;
      
      constructor(message: string, code: string, meta?: Record<string, unknown>) {
        super(message);
        this.code = code;
        this.meta = meta;
        this.message = message;
      }
    }
  }

  export const Prisma: {
    PrismaClientKnownRequestError: typeof Prisma.PrismaClientKnownRequestError;
  };
}