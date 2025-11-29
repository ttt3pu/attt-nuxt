<template>
  <div class="contents-box border-b border-gray-600" :data-color="color">
    <div class="contents-box__inner max-w mx-auto">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  color: {
    type: Number as PropType<1 | 2>,
    default: 1,
  },
});
</script>

<style scope lang="scss">
.contents-box {
  &[data-color='1'] {
    @apply bg-bg;
  }

  &[data-color='2'] {
    @apply bg-bg-300;
  }

  &__inner {
    @media (width >= 769px) {
      padding: 80px var(--padding-lr-pc);
    }

    @media (width <= 768px) {
      padding: 40px var(--padding-lr-sp);
    }
  }
}
</style>
