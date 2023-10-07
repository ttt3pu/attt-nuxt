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
  type: 'blog' | 'zenn';
  title: string;
  date: string;
  dateFormatted: string;
  link: string;
}
