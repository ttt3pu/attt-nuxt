import md from 'markdown-it';

const renderer = md();

export function renderMarkdown(content: string): string {
  return renderer.render(content);
}

export function renderArticleMarkdown(content: string): string {
  return renderMarkdown(content).replace(/\[secret\](.*?)\[\/secret\]/g, (_, p1) => {
    return `<span title="この内容を閲覧するにはアクセストークンが必要です。">${p1}</span>`;
  });
}
