export default defineNuxtRouteMiddleware(async (to) => {
  const { user, fetch } = useUserSession();

  const loginPath = '/admin/login';
  await fetch();
  const isAdmin = user.value?.email === 'ttt3pu@gmail.com';

  if (to.path === loginPath && isAdmin) {
    return await navigateTo('/admin');
  }

  if (to.path !== loginPath && !isAdmin) {
    return await navigateTo(loginPath);
  }
});
