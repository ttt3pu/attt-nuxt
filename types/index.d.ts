export type BreadCrumb = {
  to: TypedRouteLocationRawFromName<RoutesNamesList, string>;
  name: string;
};

declare module '#app' {
  interface PageMeta {
    breadcrumbs?: BreadCrumb[];
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    breadcrumbs?: BreadCrumb[];
  }
}

// It is always important to ensure you import/export something when augmenting a type
export {};

export interface BlogPost {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  content: string;
}

export interface ZennPost {
  title: string;
  link: string;
  pubDate: string;
}

export interface MergedPost {
  type: 'blog' | 'zenn' | 'other';
  title: string;
  date: string;
  link: string;
}
