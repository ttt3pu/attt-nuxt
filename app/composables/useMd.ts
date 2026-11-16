import { renderArticleMarkdown } from '~/utils/renderMarkdown';

export function useMd(content: string | ComputedRef<string>) {
  const renderedContent = computed(() => renderArticleMarkdown(typeof content === 'string' ? content : content.value));
  return { renderedContent };
}
