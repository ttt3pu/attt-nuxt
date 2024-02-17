<template>
  <div>
    <div class="title-container">
      <div class="title-container__inner">
        <div class="title-container__inner-inner">
          <div class="title-container__logo">
            <the-logo />
          </div>
          <!-- /title-container__logo -->
        </div>

        <div class="title-container__cat">
          <the-cat />
        </div>

        <AtScroll class="title-container__scroll" />
      </div>
    </div>
    <!-- /title-container -->

    <div class="main-contents">
      <AtomsContentsBox>
        <the-posts :merged-posts="mergedPosts" />
      </AtomsContentsBox>

      <AtomsContentsBox :color="2">
        <the-profile />
      </AtomsContentsBox>

      <AtomsContentsBox>
        <the-skillmap />
      </AtomsContentsBox>
    </div>
    <!-- /main-contents -->
  </div>
</template>

<script lang="ts" setup>
import AtScroll from '@/components/atoms/AtScroll.vue';
import { usePostsStore } from '~/store';
const { $pinia } = useNuxtApp();
const postsStore = usePostsStore($pinia);
const mergedPosts = computed(() => postsStore.mergedPosts);

useHead({
  title: 'attt - Front End Developer',
});
</script>

<style lang="scss" scoped>
.title-container {
  background: linear-gradient(to top, #2e3255, #081025);
  border-bottom: 1px solid var(--color-gray);
  height: calc(var(--vh) * 100);

  &__inner {
    max-width: var(--max-width);
    margin: 0 auto;
    position: relative;
    height: 100%;

    @media (width >= 769px) {
      display: flex;
    }

    @media (width <= 768px) {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
    }
  }

  &__inner-inner {
    flex-grow: 1;
    height: 100%;
    display: flex;
    flex-direction: column;

    @media (width >= 769px) {
      justify-content: center;
    }

    // @media (max-width: 768px) {
    // }
  }

  &__logo {
    display: flex;
    justify-content: space-between;
    position: relative;
    z-index: var(--z-title);
    margin-bottom: 32px;

    @media (width >= 769px) {
      padding: 35px var(--padding-lr-pc) 40px;
    }

    @media (width <= 768px) {
      padding: 16px var(--padding-lr-sp) 24px;
    }
  }

  &__scroll {
    position: absolute;
    z-index: var(--z-scroll);

    @media (width >= 769px) {
      left: calc(var(--padding-lr-pc) - 4px);
      bottom: 80px;
    }

    @media (width <= 768px) {
      left: calc(var(--padding-lr-sp) - 4px);
      bottom: 48px;
    }
  }

  &__cat {
    position: relative;
  }
}
</style>
