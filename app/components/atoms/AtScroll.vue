<script setup lang="ts">
const scroll = () => {
  window.scrollTo(0, window.innerHeight);
};
</script>

<template>
  <button class="at-scroll" @click="scroll">
    <span class="at-scroll__txt">Scroll down</span>
    <i class="at-scroll__arr" />
  </button>
</template>

<style scoped>
.at-scroll {
  animation: sdb 2.5s infinite;
  background: none;
  border: none;
  text-align: center;
  outline: none;
  cursor: pointer;
}

.at-scroll__txt {
  color: var(--txt-color-white);
  writing-mode: vertical-rl;
  font-size: 1rem;
  margin-bottom: 8px;
}

.at-scroll__arr {
  position: relative;
  display: block;
  width: 12px;
  height: 12px;
  margin: 0 auto;
}

.at-scroll__arr::before,
.at-scroll__arr::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  top: 0;
  left: 0;
  display: block;
  border-left: 3px solid;
  border-bottom: 3px solid;
  transform: rotate(-45deg);
  margin-left: auto;
  margin-right: auto;
}

.at-scroll__arr::before {
  border-color: var(--txt-color-white);
  margin-top: -4px;
}

.at-scroll__arr::after {
  border-color: rgb(0 0 0 / 25%);
  filter: blur(4px);
  margin-top: -2px;
}

@keyframes sdb {
  0% {
    transform: rotate(0deg) translate(0, 0);
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  90%,
  100% {
    transform: rotate(0deg) translate(0, 20px);
    opacity: 0;
  }
}
</style>
