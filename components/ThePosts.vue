<template>
  <div class="the-posts">
    <v-heading-lv2>Posts</v-heading-lv2>

    <div role="list" class="the-posts__items">
      <component
        :is="item.type === 'zenn' ? 'a' : NuxtLink"
        v-for="(item, i) in recentPosts"
        :key="i"
        role="listitem"
        class="item"
        v-bind="
          item.type === 'blog'
            ? {
                to: `/blog/${item.link}`,
              }
            : {
                href: item.link,
                rel: 'noopener',
                target: '_blank',
              }
        "
      >
        <span class="item__meta">
          <span v-if="item.type === 'zenn'" class="item__icn zenn">
            <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path :d="icnZenn" />
            </svg>
          </span>

          <IcnPencilBoxMultiple v-else-if="item.type === 'other'" class="item__icn" decorative />

          <IcnPencilBox v-else class="item__icn" decorative />

          <time class="item__date" :datetime="item.date">{{ dayjs(item.date).format('YYYY.MM.DD') }}</time>
        </span>

        <span class="item__heading">{{ item.title }}</span>
      </component>
    </div>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { siZenn } from 'simple-icons';
import IcnPencilBox from 'vue-material-design-icons/PencilBox.vue';
import IcnPencilBoxMultiple from 'vue-material-design-icons/PencilBoxMultiple.vue';
import type { MergedPost } from '~/types';
import { NuxtLink } from '#components';

const props = defineProps<{
  mergedPosts: MergedPost[];
}>();

const icnZenn = ref(siZenn.path);

const recentPosts = computed(() => {
  const recentPosts = JSON.parse(JSON.stringify(props.mergedPosts));

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
    ::v-deep(svg) {
      position: absolute;
      width: 100%;
      height: 100%;
    }
  }

  .zenn {
    width: 18px;
    height: 18px;
  }

  &__heading {
    font-family: var(--font-family-jp);
    width: 100%;
    color: var(--txt-color-link);
  }
}
</style>
