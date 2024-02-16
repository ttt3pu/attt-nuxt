export default defineNuxtRouteMiddleware(async (event) => {
  const { getSession } = useAuth();

  const session = await getSession();
  const loginPath = '/admin/login';
  const loggedIn = session.user;
  const isAdmin = session.user?.email === 'ttt3pu@gmail.com';

  if (event.path === '/admin/login' && loggedIn && isAdmin) {
    return await navigateTo('/admin');
  }

  if (
    event.path.startsWith('/admin') &&
    event.path !== loginPath &&
    ((!loggedIn && event.path !== loginPath) || (loggedIn && !isAdmin))
  ) {
    return await navigateTo(loginPath);
  }
});
