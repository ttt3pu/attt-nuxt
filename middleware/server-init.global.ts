export default defineNuxtRouteMiddleware(async () => {
  if (process.server) {
    await useGetPosts();
  }
});
