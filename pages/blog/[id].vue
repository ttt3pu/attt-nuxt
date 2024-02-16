<template>
  <OrganismsBlogPost :title="title" :content="content" :published-at="published_at" />
</template>

<script setup lang="ts">
import { BlogPost } from '@prisma/client';

const route = useRoute('blog-id');
const response = await useFetch<BlogPost>(`/api/blog/${route.params.id}`);

if (!response.data.value) {
  showError({
    statusCode: 404,
  });
}

const { published_at, title, content } = response.data.value!;

useHead({
  title: `${title} | attt`,
});
</script>
