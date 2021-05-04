<template>
  <div
    class="the-language"
    v-on-clickaway="onClickaway"
  >
    <button
      class="the-language__current"
      @click="$data.isOpen = !$data.isOpen"
      :aria-expanded="$data.isOpen"
    >{{ $i18n.locale }}</button>

    <nuxt-link
      v-for="locale in _availableLocales"
      :key="locale"
      :to="switchLocalePath(locale)"
      :aria-hidden="!$data.isOpen"
    >
      {{ locale }}
    </nuxt-link>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      isOpen: false,
    };
  },
  computed: {
    _availableLocales: function() {
      return this.$i18n.locales.filter((locale) => locale !== this.$i18n.locale);
    },
  },
  methods: {
    onClickaway: function() {
      this.$data.isOpen = false;
    },
    // returnLocale: function(locale) {
    //   switch(locale) {
    //     case 'ca': return 'català';
    //     default: return '日本語';
    //   }
    // },
  },
};
</script>

<style lang="scss" scoped>
.the-language {
  top: 16px;
  right: 24px;
  z-index: var(--z-language);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);

  @media (min-width: 769px) {
    position: fixed;
  }

  @media (max-width: 768px) {
    position: absolute;
  }

  &__current {
    font: inherit;
    border: none;

    &[aria-expanded="true"] {
      &::after {
        transform: rotate(180deg);
      }
    }

    &::after {
      margin-left: 8px;
      content: "";
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 8px 6px 0;
      border-color: var(--bg-color--lv1) transparent transparent transparent;
      transition: transform 0.2s;
    }
  }

  a {
    border-top: 1px solid var(--bg-color--lv1);
    transition: 0.2s;

    &[aria-hidden="true"] {
      display: none;
    }

    // stylelint-disable no-descending-specificity
    &:not([aria-hidden="true"]) {
      animation: fade-in 0.2s;

      @keyframes fade-in {
        0% {
          opacity: 0;
          transform: translateY(-8px);
        }

        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
    }
  }

  &__current,
  a {
    display: flex;
    align-items: center;
    font-family: var(--font-family--en);
    color: var(--bg-color--lv1);
    cursor: pointer;
    padding: 4px 16px;
    text-decoration: none;
    background-color: var(--txt-color-white);
    width: 100%;
    font-size: 0.9rem;

    &:hover {
      background-color: var(--txt-color-white--hover);
    }
  }
}
</style>
