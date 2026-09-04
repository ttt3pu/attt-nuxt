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
