export default defineNuxtRouteMiddleware(async (to) => {
  const { getSession } = useAuth();

  const loginPath = '/admin/login';
  const session = await getSession();
  const isAdmin = session?.user?.email === 'ttt3pu@gmail.com';

  if (to.path === loginPath && isAdmin) {
    return await navigateTo('/admin');
  }

  if (to.path !== loginPath && !isAdmin) {
    return await navigateTo(loginPath);
  }
});
