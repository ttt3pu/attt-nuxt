<template>
  <div class="container">
    <div class="title-container">
      <div class="title-container__inner">
        <div class="title-container__inner-inner">
          <div class="title-container__logo">
            <the-logo />
          </div><!-- /title-container__logo -->

          <!-- <component
            :is="_latestPost.type === 'zenn' ? 'a' : 'nuxt-link'"
            class="latest-post"
            v-bind="_latestPost.type === 'zenn'
              ? {
                href: _latestPost.link,
                rel: 'noopener',
                target: '_blank',
              }
              : {
                to: `/blog/${_latestPost.link}`,
              }
            "
          >
            <span class="latest-post__meta">
              <span
                v-if="_latestPost.type === 'zenn'"
                class="latest-post__icn"
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
                class="latest-post__icn pencil"
                v-else
                decorative
              />

              <time class="latest-post__date" :datetime="_latestPost.date">{{ _latestPost.dateFormated }}</time>
            </span>

            <span class="latest-post__heading">{{ _latestPost.title }}</span>
          </component> -->
        </div>

        <div class="title-container__cat">
          <the-cat />
        </div>

        <AtScroll class="title-container__scroll" />
      </div>
    </div><!-- /title-container -->

    <div class="main-contents">
      <div class="main-contents__box">
        <the-posts />
      </div>

      <div class="main-contents__box">
        <the-profile />
      </div>

      <div class="main-contents__box">
        <the-works />
      </div>

      <div class="main-contents__box">
        <the-skillmap />
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

.latest-post {
  $this-item: &;

  display: block;

  @media (min-width: 769px) {
    padding: 0 var(--padding-lr-pc);
  }

  @media (max-width: 768px) {
    padding: 0 var(--padding-lr-sp);
  }

  &:hover {
    #{$this-item}__heading {
      text-decoration: underline;
      text-decoration-color: var(--txt-color-link-hover);
      text-underline-offset: 4px;
    }
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

.main-contents {
  max-width: var(--max-width);
  margin: 0 auto;

  @media (min-width: 769px) {
    padding: 0 var(--padding-lr-pc) 48px;
  }

  @media (max-width: 768px) {
    padding: 0 var(--padding-lr-sp) 48px;
  }

  &__box {
    margin-top: 60px;
    box-shadow: var(--box-shadow);
    background: var(--bg-color-lv2);

    @media (min-width: 769px) {
      padding: 60px calc(var(--padding-lr-pc) / 2);
    }

    @media (max-width: 768px) {
      padding: 40px calc(var(--padding-lr-sp) / 2);
    }
  }
}
</style>
