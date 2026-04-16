<script setup lang="ts">
import dayjs from 'dayjs';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  publishedAt: {
    type: [String, Date],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const { renderedContent } = useMd(props.content);
const publishedAtFormatted = computed(() => dayjs(props.publishedAt).format('YYYY.MM.DD'));
</script>

<template>
  <main class="main bg-bg-300">
    <div class="main__inner">
      <div class="mb-12">
        <time class="mb-4 block font-en text-white" :datetime="publishedAtFormatted">{{ publishedAtFormatted }}</time>

        <h1 class="font-jp text-5xl font-bold text-primary">
          {{ title }}
        </h1>
      </div>

      <!-- eslint-disable vue/no-v-html -->
      <div class="post" v-html="renderedContent" />
      <!-- eslint-enable vue/no-v-html -->
    </div>
  </main>
</template>

<style scoped>
@reference "~/assets/css/tailwind.css";

.main__inner {
  max-width: var(--max-width);
  margin: 0 auto;
}

@media (width >= 769px) {
  .main__inner {
    padding: 80px var(--padding-lr-pc);
  }
}

@media (width <= 768px) {
  .main__inner {
    padding: 48px var(--padding-lr-sp);
  }
}

.post {
  font-family: var(--font-family-jp);
  color: var(--txt-color-white);
}

/* stylelint-disable-next-line */
:deep(.post > *) {
  @apply mt-6;
}

/* stylelint-disable-next-line */
:deep(a) {
  color: var(--txt-color-link);
  text-decoration: none;
}

/* stylelint-disable-next-line */
:deep(a):hover {
  text-decoration: underline;
  text-decoration-color: var(--txt-color-link-hover);
  text-underline-offset: 4px;
}

/* stylelint-disable-next-line */
:deep(ol) {
  @apply list-decimal pl-6;
}

/* stylelint-disable-next-line */
:deep(ul) {
  @apply list-disc pl-6;
}
</style>
