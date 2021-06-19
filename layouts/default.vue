<template>
  <div class="page-wrapper">
    <div class="contents-wrapper">
      <the-language />
      <Nuxt />
    </div>

    <div class="copyright">
      <a href="https://github.com/ttt3pu/attt" target="_blank" rel="noopener">Source code</a><br>
      <small>&copy; {{_year}}, attt All rights reserved.</small>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "@nuxtjs/composition-api"
import TheLanguage from '~/components/TheLanguage.vue';

export default defineComponent({
  components: { TheLanguage },
  head() {
    return {
      htmlAttrs: {
        lang: this.$i18n.locale,
      },
    };
  },
  setup() {
    const _year = computed(() => new Date().getFullYear());

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
    font-size: 0.9rem;
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
