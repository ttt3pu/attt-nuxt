<template>
  <div class="page-wrapper">
    <div class="background-gradation" />

    <div class="contents-wrapper">
      <Nuxt />

    </div>
  </div>
</template>

<script>
export default {
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
}
</script>

<style lang="scss">
@mixin z-map($z-map) {
  $before-index: -1;

  @each $name, $value in $z-map {
    $result-z: null;

    @if $value == auto {
      $result-z: $before-index + 1;
    }

    @else {
      $result-z: $value;
    }

    $before-index: $result-z;

    #{$name}: $result-z;
  }
}

html {
  font-family: sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  line-height: 1.875;
  scroll-behavior: smooth;

  --vh: 1vh;

  @include z-map((
    --z-init: auto,
    --z-contents-wrapper: auto,
    --z-cat: auto,
    --z-cat-layer: auto,
    --z-title: auto,
    --z-sns: auto,
    --z-scroll: auto,
  ));
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.contents-wrapper {
  position: relative;
  z-index: var(--z-contents-wrapper);
}

.background-gradation {
  background: #2e3255;

  /* background: linear-gradient(to bottom, #2e3255, #001731); */
  height: 100vh;
  height: calc(var(--vh) * 100);
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: var(--z-init);
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}
</style>
