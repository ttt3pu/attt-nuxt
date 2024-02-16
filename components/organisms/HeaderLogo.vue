<template>
  <div class="logo-area">
    <the-logo :mini="true" :is-active-logo="false" />
    <p v-if="route.path.startsWith('/admin')" class="text-white mb-6">( Admin )</p>

    <div class="flex gap-2 -ml-2">
      <NuxtLink
        v-for="breadcrumb in breadcrumbs"
        :key="breadcrumb.to"
        class="relative text-right font-en text-white flex items-center"
        :to="breadcrumb.to"
      >
        <icn-back class="relative w-6 h-6" />
        <span>{{ breadcrumb.name }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import icnBack from 'vue-material-design-icons/ChevronLeft.vue';
const route = useRoute();
const breadcrumbs = computed(() => [
  {
    to: '/',
    name: 'Main page',
  },
  ...(route.meta?.breadcrumbs?.length ? route.meta.breadcrumbs : []),
]);
</script>

<style lang="scss" scoped>
.logo-area {
  max-width: var(--max-width);
  margin: 0 auto;

  @media (width >= 769px) {
    padding: 48px var(--padding-lr-pc) 56px;
  }

  @media (width <= 768px) {
    padding: 32px var(--padding-lr-sp) 44px;
  }
}

/* stylelint-disable-next-line */
::v-deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
