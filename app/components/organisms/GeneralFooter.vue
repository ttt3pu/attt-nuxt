<script lang="ts" setup>
const year = computed(() => new Date().getFullYear());
</script>

<template>
  <div class="copyright bg-bg-500">
    <a href="https://github.com/ttt3pu/attt" target="_blank" rel="noopener">Source code</a><br />
    <small>&copy; {{ year }}, attt All rights reserved.</small>
  </div>
</template>

<style scoped lang="scss">
.copyright {
  font-family: var(--font-family-en);
  text-align: center;
  color: var(--txt-color-white);

  @media (width >= 769px) {
    padding: 36px var(--padding-lr-pc);
  }

  @media (width <= 768px) {
    padding: 24px var(--padding-lr-sp);
  }

  a,
  small {
    font-size: 0.8rem;
  }

  a {
    color: var(--txt-color-link);

    &:hover {
      text-decoration: underline;
      color: var(--txt-color-link-hover);
      text-decoration-color: var(--txt-color-link-hover);
      text-underline-offset: 4px;
    }
  }
}
</style>
