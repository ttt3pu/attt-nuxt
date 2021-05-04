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

<script>
import TheLanguage from '~/components/TheLanguage.vue';

export default {
  components: { TheLanguage },
  head: function() {
    return {
      htmlAttrs: {
        lang: this.$i18n.locale,
      },
    };
  },
  created: function() {
    if (process.client) {
      const setFillHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      }

      let beforeHeight = window.innerHeight;

      window.addEventListener('resize', () => {
        if (beforeHeight !== window.innerHeight) {
          beforeHeight = window.innerHeight;
          setFillHeight();
        }
      });

      setFillHeight();
    }
  },
  computed: {
    _year: function() {
      return new Date().getFullYear();
    },
  },
}
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
