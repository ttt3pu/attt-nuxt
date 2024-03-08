<template>
  <ul class="mb-4 font-en flex flex-wrap" :size="size">
    <li v-for="(item, i) in items" :key="i" class="text-white mb-3 flex items-baseline">
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" :style="`fill: #${item.icnData.hex};`">
        <path :d="item.icnData.path" />
      </svg>

      <span>{{ item.heading }}</span>
      <span v-if="i !== items.length - 1" class="mr-3 ml-7 text-gray-500">/</span>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import type { SimpleIcon } from 'simple-icons';

defineProps({
  items: {
    required: true,
    type: Array as PropType<
      {
        heading: String;
        icnData: SimpleIcon;
      }[]
    >,
  },
  size: {
    required: true,
    type: Number as PropType<1 | 2 | 3>,
  },
});
</script>

<style lang="scss" scoped>
li {
  &:not(:last-child) {
    @apply mr-4;
  }

  span {
    @apply relative;
    @apply bottom-[5.5px];
  }
}

[size='1'] {
  li {
    @apply text-2xl;
  }

  svg {
    @apply w-9;
    @apply h-9;
    @apply mr-3;
    @apply relative;
    @apply top-[3px];
  }
}

[size='2'],
[size='3'] {
  li {
    @apply text-xl;
  }

  svg {
    @apply w-7;
    @apply h-7;
    @apply mr-3;
  }
}
</style>
