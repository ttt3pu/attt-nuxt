export interface BlogPost {
  id: string,
  createdAt: string
  updatedAt: string
  publishedAt: string
  revisedAt: string
  title: string
  content: string
}

export interface ZennPostSummary {
  title: string
  link: string
  pubDate: string
}

export interface ZennPost {
  creator: string
  title: string
  link: string
  pubDate: string
  enclosure: {
    url: string
    length: string
    type: string
  }
  'dc:creator':string
  content: string
  contentSnippet: string
  guid: string
  isoDate: string
}

export interface MergedPost {
  type: 'blog' | 'zenn';
  title: string;
  date: string;
  dateFormatted: string;
  link: string;
}
