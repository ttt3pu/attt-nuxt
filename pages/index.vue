<template>
  <div class="container">
    <div class="title-container">
      <div class="title-container__inner">
        <div class="title-container__logo">
          <the-logo />
        </div><!-- /title-container__logo -->
      </div>

      <div class="title-container__cat">
        <the-cat />
      </div>

      <AtScroll class="title-container__scroll" />
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
import AtScroll from '@/components/atoms/AtScroll.vue';
import { defineComponent } from "@nuxtjs/composition-api"

export default defineComponent({
  components: {
    AtScroll,
  },
  head: {
    title: 'attt - Frontend engineer',
  },
});
</script>

<style lang="scss" scoped>
.title-container {
  position: relative;
  height: calc(var(--vh) * 100);

  @media (min-width: 769px) {
    display: flex;
    max-width: 1600px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }

  &__inner {
    flex-grow: 1;
    height: 100%;
    display: flex;
    flex-direction: column;

    @media (min-width: 769px) {
      justify-content: center;
    }

    // @media (max-width: 768px) {
    // }
  }

  &__logo {
    display: flex;
    justify-content: space-between;
    position: relative;
    z-index: var(--z-title);
    margin-bottom: 32px;

    @media (min-width: 769px) {
      padding: 35px #{math.div(100, 1980) * 100}vw 40px;
    }

    @media (max-width: 768px) {
      padding: 16px #{math.div(100, 1980) * 100}vw 24px;
    }
  }

  &__scroll {
    position: absolute;
    z-index: var(--z-scroll);

    @media (min-width: 769px) {
      left: #{math.div(100, 1980) * 100}vw;
      bottom: 80px;
    }

    @media (max-width: 768px) {
      left: #{math.div(100, 1980) * 100}vw;
      bottom: 48px;
    }
  }

  &__cat {
    position: relative;
  }
}

.main-contents {
  position: relative;
  z-index: var(--z-title);

  @media (min-width: 769px) {
    padding: 0 #{math.div(100, 1980) * 100}vw 48px;
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
