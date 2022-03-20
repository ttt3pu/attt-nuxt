<template>
  <div class="the-posts">
    <v-heading-lv2>Posts</v-heading-lv2>

    <div
      role="list"
      class="the-posts__items"
    >
      <component
        :is="item.type === 'zenn' ? 'a' : 'nuxt-link'"
        v-for="(item, i) in _recentPosts"
        :key="i"
        role="listitem"
        class="item"
        v-bind="item.type === 'zenn'
          ? {
            href: item.link,
            rel: 'noopener',
            target: '_blank',
          }
          : {
            to: `/blog/${item.link}`,
          }
        "
      >
        <span class="item__meta">
          <span
            v-if="item.type === 'zenn'"
            class="item__icn"
          >
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path :d="icnZenn" />
            </svg>
          </span>

          <icn-pencil
            v-else
            class="item__icn pencil"
            decorative
          />

          <time class="item__date" :datetime="item.date">{{ item.dateFormated }}</time>
        </span>

        <span class="item__heading">{{ item.title }}</span>
      </component>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, useStore } from '@nuxtjs/composition-api';
import icnZennPath from 'simple-icons/icons/zenn';
// @ts-ignore
import icnPencil from 'vue-material-design-icons/Pencil.vue';
import { BlogPosts } from '../types';

export default defineComponent({
  components: {
    icnPencil,
  },
  setup () {
    const store = useStore();

    const icnZenn = ref(icnZennPath.path);
    const _mergedPosts = computed<BlogPosts>(() => store.getters.mergedPosts);

    const _recentPosts = computed<BlogPosts>(() => {
      const recentPosts = JSON.parse(JSON.stringify(_mergedPosts.value));

      // ブログの投稿を1個だけ一番前に持ってくる
      for (let i = 0; i < recentPosts.length; i++) {
        if (recentPosts[i].type === 'blog') {
          recentPosts.unshift(recentPosts[i]);
          recentPosts.splice(i + 1, 1);
          break;
        }
      }

      return recentPosts;
    });

    return {
      icnZenn,
      _mergedPosts,
      _recentPosts,
    };
  },
});
</script>

<style lang="scss" scoped>
.item {
  $this-item: &;

  display: block;

  &:hover {
    #{$this-item}__heading {
      text-decoration: underline;
      text-decoration-color: var(--txt-color-link-hover);
      text-underline-offset: 4px;
    }
  }

  &:not(:last-child) {
    padding-bottom: 16px;
    margin-bottom: 16px;
    border-bottom: 1px solid var(--gray-color);
  }

  &__meta {
    display: flex;
    align-items: baseline;
    color: var(--txt-color-white);
  }

  &__date {
    font-family: var(--font-family-en);
    font-size: 0.9rem;
  }

  &__icn {
    flex-shrink: 0;
    fill: currentcolor;
    width: 20px;
    height: 20px;
    display: inline-block;
    margin-right: 8px;
    position: relative;
    top: 2px;

    /* stylelint-disable-next-line */
    ::v-deep svg {
      width: 100%;
      height: 100%;
    }
  }

  &__heading {
    font-family: var(--font-family-jp);
    width: 100%;
    color: var(--txt-color-link);
  }
}
</style>
