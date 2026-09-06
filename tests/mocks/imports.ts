import type { Session } from 'next-auth';

export function useRuntimeConfig() {
  return {
    public: {
      auth: {
        provider: {
          type: 'authjs',
          trustHost: false,
        },
        baseURL: 'http://localhost:3000/api/auth',
        originEnvKey: 'NUXT_AUTH_BASE_URL',
      },
    },
  };
}

export function createError(err: { statusCode?: number; statusMessage?: string; message?: string }) {
  const error = new Error(err.statusMessage || err.message || 'Error');
  return Object.assign(error, err);
}

export function defineNuxtRouteMiddleware<T>(fn: T): T {
  return fn;
}

export function navigateTo(to: string) {
  return { redirect: to };
}

export const authMock = {
  currentSession: null as Session | null,
};

export function useAuth() {
  return {
    getSession: async () => authMock.currentSession,
    signOut: async () => {},
  };
}

// Nuxt の auto-imports をグローバルスコープに登録
Object.assign(globalThis, {
  defineNuxtRouteMiddleware,
  navigateTo,
  useAuth,
  useRuntimeConfig,
  createError,
});
