<script setup lang="ts">
import { useToast } from 'vue-toast-notification';
import { usePrismaErrorHandling } from '~/composables/usePrismaErrorHandling';

definePageMeta({
  breadcrumbs: [
    {
      to: '/admin',
      name: 'Admin Top',
    },
  ],
});

definePageMeta({ middleware: 'admin-check' });

const $toast = useToast();

const localModelValue = ref({
  published_at: new Date(),
  title: '',
  content: '',
});

async function submit() {
  if (window.confirm('記事を作成します。よろしいですか？')) {
    try {
      await useFetch(`/api/blog/create`, {
        method: 'POST',
        body: { ...localModelValue.value },
      });
      $toast.success('記事を作成しました');
      return navigateTo('/admin');
    } catch (e) {
      usePrismaErrorHandling(e);
    }
  }
}
</script>

<template>
  <OrganismsAdminBlogForm v-model="localModelValue" heading="Create Post" @submit="submit" />
</template>
