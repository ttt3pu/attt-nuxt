import md from 'markdown-it';

const renderer = md();

export function useMd(content: string | ComputedRef<string>) {
  const renderedContent = computed(() => {
    const rendered = renderer.render(typeof content === 'string' ? content : content.value);

    return rendered.replace(/\[secret\](.*?)\[\/secret\]/g, (_, p1) => {
      return `<span title="この内容を閲覧するにはアクセストークンが必要です。">${p1}</span>`;
    });
  });
  return {
    renderedContent,
  };
}
