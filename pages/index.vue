<template>
  <div class="container">
    <div class="title-container">
      <div class="title-container__inner">
        <the-logo />
      </div><!-- /title-container__inner -->

      <div class="title-container__cat">
        <the-cat />
      </div>

      <button class="scroll" @click="scroll">
        <!-- <span class="scroll__txt">Scroll</span> -->
        <i class="scroll__arr" />
      </button>
    </div><!-- /title-container -->

    <div class="main-contents">
      <div class="main-contents__box">
        <the-profile />
      </div>

      <div class="main-contents__box">
        <the-posts />
      </div>

      <div class="main-contents__box">
        <the-works />
      </div>

      <div class="main-contents__box">
        <the-skillmap />
      </div>
    </div><!-- /main-contents -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api"

export default defineComponent({
  head: {
    title: 'attt - Frontend engineer',
  },
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
.title-container {
  position: relative;

  @media (min-width: 769px) {
    padding: 40px #{math.div(100, 1980) * 100}vw;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
  }

  @media (max-width: 768px) {
    padding: 24px #{math.div(100, 1980) * 100}vw 0;
    height: 100vh;
    height: calc(var(--vh) * 100);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }

  &__cat {
    // flex-shrink: 0;
    position: relative;
  }

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: var(--z-title);
  }
}

.scroll {
  $size: 32px;

  background: none;
  border: none;
  text-align: center;
  outline: none;
  cursor: pointer;
  z-index: var(--z-scroll);

  @media (min-width: 769px) {
    display: none;
  }

  @media (max-width: 768px) {
    position: absolute;
    left: #{math.div(200, 1980) * 100}vw;
    bottom: calc(#{$size} * 2);
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
      animation: sdb 1.5s infinite;
      margin-left: auto;
      margin-right: auto;
    }

    &::before {
      border-color: #f4fb7f;
      margin-top: -4px;
    }

    &::after {
      border-color: rgba(#000, 0.25);
      filter: blur(4px);
      margin-top: -2px;
    }

    @keyframes sdb {
      0% {
        transform: rotate(-45deg) translate(0, 0);
        opacity: 0;
      }

      50% {
        opacity: 1;
      }

      100% {
        transform: rotate(-45deg) translate(-20px, 20px);
        opacity: 0;
      }
    }
  }

  &__txt {
    display: block;
    color: #f4fb7f;
    font-family: var(--font-family--en);
    font-size: 24px;
  }
}

.main-contents {
  flex-grow: 1;
  margin-right: 0;
  margin-left: auto;
  // background-color: #3c3b5c;

  @media (min-width: 769px) {
    max-width: #{math.div(980, 1600) * 100}vw;
    padding: 75px #{math.div(100, 1980) * 100}vw 48px;
  }

  @media (max-width: 768px) {
    padding: 0 #{math.div(100, 1980) * 100}vw 48px;
  }

  &__box {
    background-color: var(--bg-color--lv2);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);

    &:not(:last-child) {
      margin-bottom: 48px;
    }

    @media (min-width: 769px) {
      padding: 40px #{math.div(50, 1980) * 100}vw;
    }

    @media (max-width: 768px) {
      padding: 32px #{math.div(100, 1980) * 100}vw;
    }
  }
}
</style>
