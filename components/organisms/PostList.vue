<script lang="ts" setup>
import dayjs from 'dayjs';
import { siZenn } from 'simple-icons';
import IcnPencilBox from 'vue-material-design-icons/PencilBox.vue';
import IcnPencilBoxMultiple from 'vue-material-design-icons/PencilBoxMultiple.vue';
import ChevronLeft from 'vue-material-design-icons/ChevronLeft.vue';
import ChevronRight from 'vue-material-design-icons/ChevronRight.vue';
import { NuxtLink } from '#components';
import { usePostsStore } from '~/store';

const PER_PAGE = 5;

const postsStore = usePostsStore();
const mergedPosts = computed(() => postsStore.mergedPosts);

const currentPage = ref(1);

const posts = computed(() => {
  const result = [...mergedPosts.value];

  // ブログの投稿を1個だけ一番前に持ってくる
  for (let i = 0; i < result.length; i++) {
    if (result[i].type === 'blog') {
      result.unshift(result[i]);
      result.splice(i + 1, 1);
      break;
    }
  }

  return result.slice((currentPage.value - 1) * PER_PAGE, currentPage.value * PER_PAGE);
});

const totalPage = computed(() => {
  return Math.ceil(mergedPosts.value.length / PER_PAGE);
});

const isDisabledPrevButton = computed(() => {
  return currentPage.value === 1;
});

const isDisabledNextButton = computed(() => {
  return currentPage.value === totalPage.value;
});

function onClickedPrevButton() {
  currentPage.value -= 1;
}

function onClickedNextButton() {
  currentPage.value += 1;
}
</script>

<template>
  <div>
    <v-heading-lv2>Posts</v-heading-lv2>

    <div role="list" class="mb-10">
      <component
        :is="item.type === 'zenn' ? 'a' : NuxtLink"
        v-for="(item, i) in posts"
        :key="i"
        role="listitem"
        class="item block"
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
        <span class="flex text-white">
          <span v-if="item.type === 'zenn'" class="item-icn w-[18px] h-[18px]">
            <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path :d="siZenn.path" />
            </svg>
          </span>

          <IcnPencilBoxMultiple v-else-if="item.type === 'other'" class="item-icn" decorative />

          <IcnPencilBox v-else class="item-icn" decorative />

          <time class="font-en" :datetime="item.date">{{ dayjs(item.date).format('YYYY.MM.DD') }}</time>
        </span>

        <span class="font-jp w-full text-link">{{ item.title }}</span>
      </component>
    </div>

    <div class="flex items-center justify-center h-10">
      <button
        class="pagination-button rounded-s-lg"
        aria-label="Prev"
        :disabled="isDisabledPrevButton"
        @click="onClickedPrevButton"
      >
        <ChevronLeft />
      </button>

      <span class="flex items-center justify-center px-4 h-10 leading-tight border-gray-600 bg-gray-600 text-white">
        {{ currentPage }} of {{ totalPage }}
      </span>

      <button
        class="pagination-button rounded-e-lg"
        aria-label="Next"
        :disabled="isDisabledNextButton"
        @click="onClickedNextButton"
      >
        <ChevronRight />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.item {
  @apply pb-4 mb-4 border-b border-b-gray-500;
}

.item-icn {
  @apply shrink-0 fill-current w-5 h-5 inline-block mr-2 relative top-1;

  /* stylelint-disable-next-line */
  ::v-deep(svg) {
    @apply absolute w-full h-full;
  }
}

.item:hover span:last-child {
  @apply underline decoration-link underline-offset-4;
}

.pagination-button {
  @apply flex items-center justify-center px-4 h-10 ms-0 leading-tight text-white bg-gray-800 transition border border-gray-600;

  &[disabled] {
    @apply cursor-not-allowed text-gray-600;
  }

  &:not([disabled]) {
    @apply hover:bg-gray-600;
  }
}
</style>
