<script lang="ts" setup>
const route = useRoute();

if (import.meta.client) {
  const setFillHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  setFillHeight();

  if (!navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/i)) {
    let beforeHeight = window.innerHeight;

    window.addEventListener('resize', () => {
      if (beforeHeight !== window.innerHeight) {
        beforeHeight = window.innerHeight;
        setFillHeight();
      }
    });
  }
}
</script>

<template>
  <div class="page-wrapper">
    <OrganismsHeaderLogo v-if="route.path !== '/'" />

    <div class="contents-wrapper">
      <slot />
    </div>

    <OrganismsGeneralFooter />
  </div>
</template>

<style lang="scss" scoped>
.contents-wrapper {
  position: relative;
}
</style>
