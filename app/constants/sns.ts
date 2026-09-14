import { siGithub, siX, siZenn } from 'simple-icons';

export interface SnsItem {
  title: string;
  path: string;
  href: string;
}

export const snsItems: SnsItem[] = [
  {
    title: 'GitHub',
    path: siGithub.path,
    href: 'https://github.com/ttt3pu',
  },
  {
    title: 'Zenn',
    path: siZenn.path,
    href: 'https://zenn.dev/attt',
  },
  {
    title: 'X',
    path: siX.path,
    href: 'https://x.com/ttt3pu',
  },
];
