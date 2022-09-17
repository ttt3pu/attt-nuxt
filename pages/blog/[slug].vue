<template>
  <div>
    <div class="logo-area">
      <the-logo :mini="true" :is-active-logo="false" />

      <NuxtLink
        class="back"
        to="/"
      >
        <icn-back class="back__icn" />
        <span>Main page</span>
      </NuxtLink>
    </div>

    <main class="main">
      <div class="main__inner">
        <div class="heading-container">
          <time
            class="date"
            :datetime="publishedAtRef"
          >{{ publishedAtFormatted }}</time>

          <h1 class="title">
            {{ titleRef }}
          </h1>
        </div>

        <div
          class="post"
          v-html="renderedContent"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import icnBack from 'vue-material-design-icons/ChevronLeft.vue';
import md from 'markdown-it';
import { BlogPost } from '@/types';
const route = useRoute();
const runtimeConfig = useRuntimeConfig();

const renderer = md();

const renderedContent = ref('');
const publishedAtRef = ref<string | null>(null);
const titleRef = ref('');

const response = await useFetch<BlogPost>(`https://attt.microcms.io/api/v1/blog/${route.params.slug}`, {
  headers: { 'X-API-KEY': runtimeConfig.MICROCMS_API_KEY },
});

const { publishedAt, title, content } = response.data.value!;

publishedAtRef.value = publishedAt;
titleRef.value = title;
renderedContent.value = renderer.render(content);

const publishedAtFormatted = computed(() => dayjs(publishedAtRef.value).format('YYYY.MM.DD'));

useHead({
  title: `${titleRef.value} | attt`,
});
</script>

<style lang="scss" scoped>
.logo-area {
  max-width: var(--max-width);
  margin: 0 auto;

  @media (min-width: 769px) {
    padding: 48px var(--padding-lr-pc) 56px;
  }

  @media (max-width: 768px) {
    padding: 32px var(--padding-lr-sp) 44px;
  }
}

.back {
  position: relative;
  left: -8px;
  text-align: right;
  font-family: var(--font-family-en);
  color: var(--txt-color-white);
  display: flex;
  align-items: center;

  &__icn {
    width: 24px;
    height: 24px;
    bottom: 1px;
    position: relative;

    /* stylelint-disable-next-line */
    ::v-deep(svg) {
      width: 100%;
      height: 100%;
    }
  }
}

.main {
  background-color: var(--bg-color-lv2);

  &__inner {
    max-width: var(--max-width);
    margin: 0 auto;

    @media (min-width: 769px) {
      padding: 80px var(--padding-lr-pc);
    }

    @media (max-width: 768px) {
      padding: 48px var(--padding-lr-sp);
    }
  }
}

.heading-container {
  margin-bottom: 32px;
  line-height: var(--line-height-heading);
}

.date {
  font-family: var(--font-family-en);
  color: var(--txt-color-white);
}

.title {
  font-family: var(--font-family-jp);
  font-size: 3rem;
  color: var(--primary-color);
}

.post {
  font-family: var(--font-family-jp);
  color: var(--txt-color-white);

  /* stylelint-disable-next-line */
  ::v-deep(a) {
    color: var(--txt-color-link);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
      text-decoration-color: var(--txt-color-link-hover);
      text-underline-offset: 4px;
    }
  }

  /* stylelint-disable-next-line */
  ::v-deep(p) {
    & + p {
      margin-top: 24px;
    }
  }
}
</style>
