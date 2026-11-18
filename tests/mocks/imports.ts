import type { UserSession } from '#auth-utils';
import { computed } from 'vue';

export function useRuntimeConfig() {
  return {};
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
  currentSession: null as UserSession | null,
};

export async function getUserSession() {
  return authMock.currentSession ?? { id: 'visitor' };
}

export function useUserSession() {
  return {
    user: computed(() => authMock.currentSession?.user),
    fetch: async () => {},
    clear: async () => {
      authMock.currentSession = null;
    },
  };
}

Object.assign(globalThis, {
  defineNuxtRouteMiddleware,
  navigateTo,
  useUserSession,
  useRuntimeConfig,
  createError,
});
