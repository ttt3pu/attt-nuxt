<template>
  <div class="container">
    <div class="title-container">
      <div class="title-container__inner">
        <div class="title-container__inner-inner">
          <div class="title-container__logo">
            <the-logo />
          </div><!-- /title-container__logo -->
        </div>

        <div class="title-container__cat">
          <the-cat />
        </div>

        <AtScroll class="title-container__scroll" />
      </div>
    </div><!-- /title-container -->

    <div class="main-contents">
      <div class="main-contents__box">
        <div class="main-contents__box__inner">
          <the-posts />
        </div>
      </div>

      <div class="main-contents__box">
        <div class="main-contents__box__inner">
          <the-profile />
        </div>
      </div>

      <div class="main-contents__box">
        <div class="main-contents__box__inner">
          <the-skillmap />
        </div>
      </div>

      <div class="main-contents__box">
        <div class="main-contents__box__inner">
          <the-works />
        </div>
      </div>
    </div><!-- /main-contents -->
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, useStore } from '@nuxtjs/composition-api';
import { siZenn } from 'simple-icons/icons';
// @ts-ignore
import { BlogPost, BlogPosts } from '../types';
import AtScroll from '@/components/atoms/AtScroll.vue';

export default defineComponent({
  components: {
    AtScroll,
  },
  setup () {
    const store = useStore();
    const icnZenn = ref(siZenn.path);
    const _mergedPosts = computed<BlogPosts>(() => store.getters.mergedPosts);
    const _latestPost = computed<BlogPost>(() => _mergedPosts.value && _mergedPosts.value[0]);

    return {
      icnZenn,
      _mergedPosts,
      _latestPost,
    };
  },
  head: {
    title: 'attt - Front End Developer',
  },
});
</script>

<style lang="scss" scoped>
.title-container {
  background: var(--bg-color-grad);
  border-bottom: 1px solid var(--color-gray);
  box-shadow: var(--box-shadow);
  height: calc(var(--vh) * 100);

  &__inner {
    max-width: var(--max-width);
    margin: 0 auto;
    position: relative;
    height: 100%;

    @media (min-width: 769px) {
      display: flex;
    }

    @media (max-width: 768px) {
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

    @media (min-width: 769px) {
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

    @media (min-width: 769px) {
      padding: 35px var(--padding-lr-pc) 40px;
    }

    @media (max-width: 768px) {
      padding: 16px var(--padding-lr-sp) 24px;
    }
  }

  &__scroll {
    position: absolute;
    z-index: var(--z-scroll);

    @media (min-width: 769px) {
      left: calc(var(--padding-lr-pc) - 4px);
      bottom: 80px;
    }

    @media (max-width: 768px) {
      left: calc(var(--padding-lr-sp) - 4px);
      bottom: 48px;
    }
  }

  &__cat {
    position: relative;
  }
}

.main-contents {
  &__box {
    background: var(--bg-color-lv1);
    border-bottom: 1px solid var(--color-gray);

    &:nth-child(even) {
      background: var(--bg-color-lv2);
    }

    &__inner {
      max-width: var(--max-width);
      margin: 0 auto;

      @media (min-width: 769px) {
        padding: 80px var(--padding-lr-pc);
      }

      @media (max-width: 768px) {
        padding: 40px var(--padding-lr-sp);
      }
    }
  }
}
</style>
