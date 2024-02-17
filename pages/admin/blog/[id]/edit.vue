<template>
  <OrganismsAdminBlogForm v-model="localModelValue" heading="Edit Post" @submit="submit" />
</template>

<script setup lang="ts">
definePageMeta({
  breadcrumbs: [
    {
      to: '/admin',
      name: 'Admin Top',
    },
  ],
});

const route = useRoute('admin-blog-id-edit');
import type { BlogPost } from '@prisma/client';
import { useToast } from 'vue-toast-notification';
import { usePrismaErrorHandling } from '~/composables/usePrismaErrorHandling';

const $toast = useToast();
const response = await useFetch<BlogPost>(`/api/blog/${route.params.id}`);

if (!response.data.value) {
  showError({
    statusCode: 404,
  });
}

const { published_at, id, title, content } = response.data.value!;

const localModelValue = ref({
  published_at: new Date(published_at),
  title,
  content,
});

async function submit() {
  if (window.confirm('記事を更新します。よろしいですか？')) {
    try {
      await useFetch(`/api/blog/${id}/edit`, {
        method: 'POST',
        body: { ...localModelValue.value },
      });
      $toast.success('記事を更新しました');
    } catch (e) {
      usePrismaErrorHandling(e);
    }
  }
}
</script>
