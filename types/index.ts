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
