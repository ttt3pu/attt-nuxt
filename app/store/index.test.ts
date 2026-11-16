import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { computed } from 'vue';
import { usePostsStore } from './index';
import { postsResponse } from '../../tests/fixtures/posts';
import { otherPosts } from '~/constants/otherPosts';

beforeEach(() => {
  setActivePinia(createPinia());
});

describe('トップページの記事一覧', () => {
  it('API のブログ記事と外部記事が固定記事と統合され、新しい日付順に表示用データになること', () => {
    const store = usePostsStore();
    store.$patch(structuredClone(postsResponse));

    expect(store.mergedPosts).toEqual([
      { type: 'blog', title: '最新のブログ検証記事', date: '2024-05-01T00:00:00.000Z', link: '42' },
      {
        type: 'zenn',
        title: '外部フィードの検証記事',
        date: 'Mon, 01 Apr 2024 00:00:00 GMT',
        link: 'https://example.com/articles/feed-sample',
      },
      { type: 'blog', title: 'ブログ一覧の検証記事', date: '2024-03-01T00:00:00.000Z', link: '41' },
      ...otherPosts,
    ]);
  });

  it('取得結果の差し替えが一覧の購読先にも反映され、空の結果で古い記事が残らないこと', () => {
    const store = usePostsStore();
    const displayedPosts = computed(() => store.mergedPosts);
    expect(displayedPosts.value).toEqual(otherPosts);

    store.$patch(structuredClone(postsResponse));
    expect(displayedPosts.value[0]?.title).toBe('最新のブログ検証記事');
    expect(displayedPosts.value).toHaveLength(3 + otherPosts.length);

    store.$patch({ blogPosts: [], zennPosts: [] });
    expect(displayedPosts.value).toEqual(otherPosts);
  });

  it('別のリクエストの記事一覧に前のリクエストの取得結果が混ざらないこと', () => {
    usePostsStore().$patch(structuredClone(postsResponse));
    const nextRequest = usePostsStore(createPinia());
    expect(nextRequest.blogPosts).toEqual([]);
    expect(nextRequest.zennPosts).toEqual([]);
    expect(nextRequest.mergedPosts).toEqual(otherPosts);
  });
});
