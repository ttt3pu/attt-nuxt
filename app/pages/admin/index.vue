<script setup>
import dayjs from 'dayjs';
const res = await useFetch('/api/blog');
const posts = res.data.value;

definePageMeta({ middleware: 'admin-check' });
</script>

<template>
  <div>
    <AtomsContentsBox :color="2">
      <div class="flex justify-between items-start">
        <AtomsHeadingLv2>Posts</AtomsHeadingLv2>
        <AtomsAtttButton to="/admin/blog/create">New Post</AtomsAtttButton>
      </div>
      <div role="list">
        <NuxtLink v-for="(item, i) in posts" :key="i" :to="`/admin/blog/${item.id}/edit`" role="listitem" class="item">
          <span class="item__meta">
            <time class="item__date">{{ dayjs(item.published_at).format('YYYY.MM.DD') }}</time>
          </span>

          <span class="item__heading">{{ item.title }}</span>
        </NuxtLink>
      </div>
    </AtomsContentsBox>
  </div>
</template>

<style lang="scss" scoped>
.item {
  $this-item: &;

  display: block;

  &:hover {
    #{$this-item}__heading {
      text-decoration: underline;
      text-decoration-color: var(--txt-color-link-hover);
      text-underline-offset: 4px;
    }
  }

  &:not(:last-child) {
    padding-bottom: 16px;
    margin-bottom: 16px;
    border-bottom: 1px solid var(--gray-color);
  }

  &__meta {
    display: flex;
    color: var(--txt-color-white);
  }

  &__date {
    font-family: var(--font-family-en);
    font-size: 0.9rem;
  }

  &__heading {
    font-family: var(--font-family-jp);
    width: 100%;
    color: var(--txt-color-link);
  }
}
</style>
