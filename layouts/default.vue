<template>
  <div class="page-wrapper">
    <div class="background-gradation" />

    <the-cat />

    <div class="contents-wrapper">
      <Nuxt />
    </div>
  </div>
</template>

<style>
html {
  font-family: sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  line-height: 1.5;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.contents-wrapper {
  position: relative;
  z-index: 1;
}

.background-gradation {
  background: linear-gradient(to bottom, #2e3255, #001731);
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}
</style>
