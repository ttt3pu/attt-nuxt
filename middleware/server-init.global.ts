import { usePostsStore } from '~/store';

export default defineNuxtRouteMiddleware(async () => {
  const { $pinia } = useNuxtApp();
  const runtimeConfig = useRuntimeConfig();

  if (process.server) {
    const postsStore = usePostsStore($pinia);
    await postsStore.getPosts(runtimeConfig.MICROCMS_API_KEY);
  }
});
