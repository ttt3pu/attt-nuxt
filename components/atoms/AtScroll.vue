<template>
  <button class="at-scroll" @click="scroll">
    <span class="at-scroll__txt">Scroll down</span>
    <i class="at-scroll__arr" />
  </button>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api"

export default defineComponent({
  setup() {
    const scroll = () => {
      window.scrollTo(0, window.innerHeight);
    };

    return {
      scroll,
    };
  },
});
</script>

<style lang="scss" scoped>
.at-scroll {
  $size: 12px;

  animation: sdb 2.5s infinite;
  background: none;
  border: none;
  text-align: center;
  outline: none;
  cursor: pointer;

  &__txt {
    color: var(--txt-color-white);
    writing-mode: vertical-rl;
    font-size: 1rem;
    margin-bottom: 8px;
  }

  &__arr {
    position: relative;
    display: block;
    width: $size;
    height: $size;
    margin: 0 auto;

    &::before,
    &::after {
      content: "";
      position: absolute;
      width: $size;
      height: $size;
      top: 0;
      left: 0;
      display: block;
      border-left: 3px solid;
      border-bottom: 3px solid;
      transform: rotate(-45deg);
      margin-left: auto;
      margin-right: auto;
    }

    &::before {
      border-color: var(--txt-color-white);
      margin-top: -4px;
    }

    &::after {
      border-color: rgba(#000, 0.25);
      filter: blur(4px);
      margin-top: -2px;
    }

    @keyframes sdb {
      0% {
        transform: rotate(-0deg) translate(0, 0);
        opacity: 0;
      }

      50% {
        opacity: 1;
      }

      90%,
      100% {
        transform: rotate(-0deg) translate(0, 20px);
        opacity: 0;
      }
    }
  }
}
</style>
