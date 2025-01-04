import md from 'markdown-it';

const renderer = md();

export function useMd(content: string | ComputedRef<string>) {
  const renderedContent = computed(() => {
    const rendered = renderer.render(typeof content === 'string' ? content : content.value);
    return rendered.replace(/\[secret\](.*?)\[\/secret\]/g, (_, p1) => {
      const mosaic = '█'.repeat(p1.length);
      return `<span title="この内容を閲覧するにはアクセストークンが必要です。">${mosaic}</span>`;
    });
  });

  return {
    renderedContent,
  };
}
