<template>
  <div class="the-logo">
    <NuxtLink to="/">
      <h1 class="title">
        attt
      </h1>
    </NuxtLink>

    <p v-if="props.isActiveLogo">
      Front End Developer
    </p>

    <ul
      v-if="props.isActiveLogo"
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

<script lang="ts" setup>
import { siGithub, siTwitter, siZenn } from 'simple-icons/icons';

const props = defineProps({
  isActiveLogo: {
    type: Boolean,
    default: true,
  },
});

const snsItems = ref([
  {
    title: 'GitHub',
    path: siGithub.path,
    href: 'https://github.com/ttt3pu',
  },
  {
    title: 'Zenn',
    path: siZenn.path,
    href: 'https://zenn.dev/attt',
  },
  {
    title: 'Twitter',
    path: siTwitter.path,
    href: 'https://twitter.com/ttt3pu',
  },
]);
</script>

<style lang="scss" scoped>
.title {
  font-family: var(--font-family-en);
  display: block;
  font-weight: 400;
  font-size: 10rem;
  color: var(--txt-color-white);
  margin-bottom: 0;
  position: relative;
  left: -12px;
  line-height: 0.9;
}

p {
  font-family: var(--font-family-en);
  color: var(--txt-color-white-lv2);
  margin-bottom: 16px;
  font-size: 1.2rem;
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
    filter: drop-shadow(0 3px 6px rgb(0 0 0 / 16%));

    &:hover {
      fill: color.adjust(#f4fb7f, $lightness: 20%);
    }
  }
}
</style>
