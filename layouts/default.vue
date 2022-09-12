<template>
  <div class="page-wrapper">
    <div class="contents-wrapper">
      <slot />
    </div>

    <div class="copyright">
      <a href="https://domini.cat" target="_blank" rel="noopener">.cat is a domain intended to be used to highlight the Catalan language.(Not meow. 😼)</a><br>
      <a href="https://github.com/ttt3pu/attt" target="_blank" rel="noopener">Source code</a><br>
      <small>&copy; {{ _year }}, attt All rights reserved.</small>
    </div>
  </div>
</template>

<script lang="ts" setup>
const _year = computed(() => new Date().getFullYear());

if (process.client) {
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

useHead({
  htmlAttrs: {
    lang: 'ja',
  },
});
</script>

<style lang="scss" scoped>
.contents-wrapper {
  position: relative;
}

.copyright {
  font-family: var(--font-family-en);
  text-align: center;
  color: var(--txt-color-white);

  @media (min-width: 769px) {
    padding: 36px var(--padding-lr-pc);
  }

  @media (max-width: 768px) {
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
