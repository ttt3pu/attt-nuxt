<template>
  <OrganismsBlogPost :title="title" :content="content" :published-at="published_at" />
</template>

<script setup lang="ts">
const route = useRoute('blog-id');
const response = await useFetch(`/api/blog/${route.params.id}`);

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
