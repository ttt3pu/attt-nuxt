<script setup lang="ts">
import PostList from '~/components/organisms/PostList.vue';
import { usePostsStore } from '~/store';
import { postsResponse } from '../../fixtures/posts';

const store = usePostsStore();
if (useRoute().query.empty !== '1') {
  store.$patch(structuredClone(postsResponse));
}
</script>

<template>
  <PostList />
</template>
