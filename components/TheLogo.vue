<template>
  <div class="the-logo">
    <nuxt-link
      :to="localePath('/')"
    >
      <h1 class="title">attt</h1>
    </nuxt-link>

    <ul
      v-if="$props.isActiveLogo"
      class="sns"
    >
      <li
        v-for="item in snsItems"
        :key="item.name"
        class="sns__item"
      >
        <a
          :href="item.href"
          target="_blank"
          rel="noopener"
          :title="item.title"
        >
          <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            class="sns__icn"
          >
            <path :d="item.path" />
          </svg>
        </a>
      </li><!-- /sns__item -->
    </ul><!-- /sns -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@nuxtjs/composition-api"
import icnGithub from 'simple-icons/icons/github';
import icnTwitter from 'simple-icons/icons/twitter';
import icnZenn from 'simple-icons/icons/zenn';

export default defineComponent({
  props: {
    isActiveLogo: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const snsItems = ref([
      {
        title: 'GitHub',
        path: icnGithub.path,
        href: 'https://github.com/ttt3pu',
      },
      {
        title: 'Zenn',
        path: icnZenn.path,
        href: 'https://zenn.dev/attt',
      },
      {
        title: 'Twitter',
        path: icnTwitter.path,
        href: 'https://twitter.com/ttt3pu',
      },
    ])

    return {
      snsItems,
    };
  },
});
</script>

<style lang="scss" scoped>
.title {
  font-family: var(--font-family--en);
  display: block;
  font-weight: 400;
  font-size: 9rem;
  color: #e2f1ff;
  margin-bottom: 8px;
  position: relative;
  left: -12px;
  line-height: 1;
}

.sns {
  display: flex;
  position: relative;
  z-index: var(--z-sns);

  &__item {
    width: 35px;

    &:not(:last-child) {
      margin-right: 16px;
    }
  }

  &__icn {
    width: 100%;
    fill: #f4fb7f;
    transition: fill 0.2s;
    filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.16));

    &:hover {
      fill: lighten(#f4fb7f, 20%);
    }
  }
}
</style>
