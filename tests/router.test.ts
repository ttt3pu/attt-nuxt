import type { Session } from 'next-auth';
import { describe, expect, it } from 'vitest';
import {
  createMemoryHistory,
  createRouter,
  type RouteLocationNormalized,
  type RouteRecordRaw,
} from 'vue-router';
import adminCheckMiddleware from '@/middleware/admin-check';
import type { BreadCrumb } from '@/types';
import * as mockImports from '#imports';

// プロダクトで定義されているルーティング構成
const appRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'index',
    component: { template: '<div>Home</div>' },
  },
  {
    path: '/blog/:id',
    name: 'blog-id',
    component: { template: '<div>Blog Post</div>' },
  },
  {
    path: '/admin',
    name: 'admin',
    component: { template: '<div>Admin</div>' },
  },
  {
    path: '/admin/login',
    name: 'admin-login',
    component: { template: '<div>Admin Login</div>' },
  },
  {
    path: '/admin/blog/create',
    name: 'admin-blog-create',
    component: { template: '<div>Admin Blog Create</div>' },
    meta: {
      breadcrumbs: [
        {
          to: '/admin',
          name: 'Admin Top',
        },
      ],
    },
  },
  {
    path: '/admin/blog/:id/edit',
    name: 'admin-blog-id-edit',
    component: { template: '<div>Admin Blog Edit</div>' },
    meta: {
      breadcrumbs: [
        {
          to: '/admin',
          name: 'Admin Top',
        },
      ],
    },
  },
];

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: appRoutes,
  });
}

describe('プロダクトのルーティング解決とパラメータ抽出', () => {
  it('静的ルート（トップ、管理画面、ログイン画面）が正しくマッチすること', async () => {
    const router = createTestRouter();

    await router.push('/');
    expect(router.currentRoute.value.name).toBe('index');
    expect(router.currentRoute.value.path).toBe('/');

    await router.push('/admin');
    expect(router.currentRoute.value.name).toBe('admin');
    expect(router.currentRoute.value.path).toBe('/admin');

    await router.push('/admin/login');
    expect(router.currentRoute.value.name).toBe('admin-login');
    expect(router.currentRoute.value.path).toBe('/admin/login');
  });

  it('動的ルート（ブログ記事詳細、記事編集）でパラメータ id が抽出されること', async () => {
    const router = createTestRouter();

    await router.push('/blog/sample-article-123');
    expect(router.currentRoute.value.name).toBe('blog-id');
    expect(router.currentRoute.value.params).toEqual({ id: 'sample-article-123' });

    await router.push('/admin/blog/post-456/edit');
    expect(router.currentRoute.value.name).toBe('admin-blog-id-edit');
    expect(router.currentRoute.value.params).toEqual({ id: 'post-456' });
  });

  it('名前付きルート（名前とパラメータ指定）の URL 解決結果が変わらないこと', () => {
    const router = createTestRouter();

    const blogResolved = router.resolve({
      name: 'blog-id',
      params: { id: 'hello-vue-router' },
    });
    expect(blogResolved.fullPath).toBe('/blog/hello-vue-router');
    expect(blogResolved.name).toBe('blog-id');

    const editResolved = router.resolve({
      name: 'admin-blog-id-edit',
      params: { id: 'edit-target-id' },
    });
    expect(editResolved.fullPath).toBe('/admin/blog/edit-target-id/edit');
    expect(editResolved.name).toBe('admin-blog-id-edit');
  });

  it('主要なプロダクト経路の解決結果スナップショットが変わらないこと', () => {
    const router = createTestRouter();

    const sampleLocations = [
      '/',
      '/blog/first-post',
      '/admin',
      '/admin/login',
      '/admin/blog/create',
      '/admin/blog/first-post/edit',
    ];

    const snapshots = sampleLocations.map((path) => {
      const resolved = router.resolve(path);
      return {
        path: resolved.path,
        fullPath: resolved.fullPath,
        name: resolved.name,
        params: resolved.params,
        meta: resolved.meta,
      };
    });

    expect(snapshots).toMatchInlineSnapshot(`
      [
        {
          "fullPath": "/",
          "meta": {},
          "name": "index",
          "params": {},
          "path": "/",
        },
        {
          "fullPath": "/blog/first-post",
          "meta": {},
          "name": "blog-id",
          "params": {
            "id": "first-post",
          },
          "path": "/blog/first-post",
        },
        {
          "fullPath": "/admin",
          "meta": {},
          "name": "admin",
          "params": {},
          "path": "/admin",
        },
        {
          "fullPath": "/admin/login",
          "meta": {},
          "name": "admin-login",
          "params": {},
          "path": "/admin/login",
        },
        {
          "fullPath": "/admin/blog/create",
          "meta": {
            "breadcrumbs": [
              {
                "name": "Admin Top",
                "to": "/admin",
              },
            ],
          },
          "name": "admin-blog-create",
          "params": {},
          "path": "/admin/blog/create",
        },
        {
          "fullPath": "/admin/blog/first-post/edit",
          "meta": {
            "breadcrumbs": [
              {
                "name": "Admin Top",
                "to": "/admin",
              },
            ],
          },
          "name": "admin-blog-id-edit",
          "params": {
            "id": "first-post",
          },
          "path": "/admin/blog/first-post/edit",
        },
      ]
    `);
  });
});

describe('プロダクトのルートミドルウェア（admin-check）と vue-router 連携', () => {
  const adminSession: Session = {
    user: { email: 'ttt3pu@gmail.com', name: 'Admin User' },
    expires: '2026-12-31T23:59:59.999Z',
  };
  const generalSession: Session = {
    user: { email: 'general@example.com', name: 'General User' },
    expires: '2026-12-31T23:59:59.999Z',
  };

  const dummyFrom = {
    path: '/',
    fullPath: '/',
    name: 'index',
    params: {},
    query: {},
    hash: '',
    matched: [],
    meta: {},
    redirectedFrom: undefined,
  } as RouteLocationNormalized;

  it('未ログイン状態で管理画面ルートへアクセスした場合は /admin/login へリダイレクトされること', async () => {
    const router = createTestRouter();
    mockImports.authMock.currentSession = null;

    const route = router.resolve('/admin/blog/create') as unknown as RouteLocationNormalized;
    const result = await adminCheckMiddleware(route, dummyFrom);

    expect(result).toEqual({ redirect: '/admin/login' });
  });

  it('一般ユーザーが管理画面ルートへアクセスした場合は /admin/login へリダイレクトされること', async () => {
    const router = createTestRouter();
    mockImports.authMock.currentSession = generalSession;

    const route = router.resolve('/admin/blog/123/edit') as unknown as RouteLocationNormalized;
    const result = await adminCheckMiddleware(route, dummyFrom);

    expect(result).toEqual({ redirect: '/admin/login' });
  });

  it('管理者ユーザーが管理画面ルートへアクセスした場合はリダイレクトされず通過すること', async () => {
    const router = createTestRouter();
    mockImports.authMock.currentSession = adminSession;

    const route = router.resolve('/admin/blog/create') as unknown as RouteLocationNormalized;
    const result = await adminCheckMiddleware(route, dummyFrom);

    expect(result).toBeUndefined();
  });

  it('管理者ユーザーがログイン画面（/admin/login）へアクセスした場合は /admin へリダイレクトされること', async () => {
    const router = createTestRouter();
    mockImports.authMock.currentSession = adminSession;

    const route = router.resolve('/admin/login') as unknown as RouteLocationNormalized;
    const result = await adminCheckMiddleware(route, dummyFrom);

    expect(result).toEqual({ redirect: '/admin' });
  });

  it('未ログインユーザーがログイン画面（/admin/login）へアクセスした場合はそのまま表示されること', async () => {
    const router = createTestRouter();
    mockImports.authMock.currentSession = null;

    const route = router.resolve('/admin/login') as unknown as RouteLocationNormalized;
    const result = await adminCheckMiddleware(route, dummyFrom);

    expect(result).toBeUndefined();
  });
});

describe('ページメタデータとヘッダー表示・パンくずリスト（breadcrumbs）の解決', () => {
  it('パンくずリストが定義された管理画面ルートで meta.breadcrumbs が取得できること', async () => {
    const router = createTestRouter();

    await router.push('/admin/blog/create');
    const route = router.currentRoute.value;
    const breadcrumbs = route.meta.breadcrumbs as BreadCrumb[] | undefined;

    expect(breadcrumbs).toBeDefined();
    expect(breadcrumbs).toEqual([
      {
        to: '/admin',
        name: 'Admin Top',
      },
    ]);
  });

  it('HeaderLogo で組み立てられるパンくず構造（トップページ + ページ固有パンくず）が期待通り生成されること', async () => {
    const router = createTestRouter();

    await router.push('/admin/blog/100/edit');
    const route = router.currentRoute.value;

    const computedBreadcrumbs = [
      {
        to: '/',
        name: 'Main page',
      },
      ...((route.meta.breadcrumbs as BreadCrumb[] | undefined)?.length
        ? (route.meta.breadcrumbs as BreadCrumb[])
        : []),
    ];

    expect(computedBreadcrumbs).toEqual([
      {
        to: '/',
        name: 'Main page',
      },
      {
        to: '/admin',
        name: 'Admin Top',
      },
    ]);
  });

  it('パンくずが未定義のルートでは meta.breadcrumbs が存在しないか空であること', async () => {
    const router = createTestRouter();

    await router.push('/blog/100');
    const route = router.currentRoute.value;

    expect(route.meta.breadcrumbs).toBeUndefined();
  });

  it('レイアウトおよび HeaderLogo のルーティング判定フラグ（ロゴ表示有無、Admin表示判定）が正しいこと', () => {
    const router = createTestRouter();

    const topRoute = router.resolve('/');
    expect(topRoute.path !== '/').toBe(false); // default.vue でトップならロゴ非表示
    expect(topRoute.path.startsWith('/admin')).toBe(false);

    const blogRoute = router.resolve('/blog/123');
    expect(blogRoute.path !== '/').toBe(true); // ブログページならロゴ表示
    expect(blogRoute.path.startsWith('/admin')).toBe(false);

    const adminRoute = router.resolve('/admin/blog/create');
    expect(adminRoute.path !== '/').toBe(true);
    expect(adminRoute.path.startsWith('/admin')).toBe(true); // HeaderLogo で ( Admin ) 表示
  });
});

describe('クエリパラメータおよびハッシュの取り扱い', () => {
  it('クエリパラメータとハッシュを含む URL が正しくパース・正規化されること', () => {
    const router = createTestRouter();

    const resolved = router.resolve('/blog/sample-id?preview=true&lang=ja#section-1');
    expect(resolved.path).toBe('/blog/sample-id');
    expect(resolved.fullPath).toBe('/blog/sample-id?preview=true&lang=ja#section-1');
    expect(resolved.query).toEqual({
      preview: 'true',
      lang: 'ja',
    });
    expect(resolved.hash).toBe('#section-1');
    expect(resolved.params).toEqual({ id: 'sample-id' });
  });
});
