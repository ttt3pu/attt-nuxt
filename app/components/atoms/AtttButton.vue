<template>
  <NuxtLink :to="to" class="cursor-pointer radius font-en bg-white px-4 py-2 inline-flex">
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps({
  to: {
    type: String,
    required: true,
  },
});
</script>
