<template>
  <div class="page-wrapper">
    <div class="contents-wrapper">
      <Nuxt />
    </div>

    <div class="copyright">
      <a href="https://domini.cat" target="_blank" rel="noopener">.cat is a domain intended to be used to highlight the Catalan language.(Not meow. 😼)</a><br>
      <a href="https://github.com/ttt3pu/attt" target="_blank" rel="noopener">Source code</a><br>
      <small>&copy; {{_year}}, attt All rights reserved.</small>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "@nuxtjs/composition-api"

export default defineComponent({
  head() {
    return {
      htmlAttrs: {
        lang: 'ja',
      },
    };
  },
  setup() {
    const _year = computed(() => new Date().getFullYear());

    if (process.client) {
      const setFillHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      }

      setFillHeight();
    }

    return {
      _year,
    };
  },
});
</script>

<style lang="scss" scoped>
.contents-wrapper {
  position: relative;
}

.copyright {
  font-family: var(--font-family--en);
  text-align: center;
  color: var(--txt-color-white);
  padding-bottom: 16px;

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
