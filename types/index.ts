export interface BlogPost {
  id: string,
  createdAt: string
  updatedAt: string
  publishedAt: string
  revisedAt: string
  title: string
  content: string
}

export type BlogPosts = Array<BlogPost>;

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

export interface ZennPosts {
  items: Array<ZennPost>
};
