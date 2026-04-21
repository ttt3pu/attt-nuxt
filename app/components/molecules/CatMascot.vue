<script setup lang="ts">
withDefaults(
  defineProps<{
    /** おやつキャッチ連動。未指定は idle */
    gameReaction?: 'idle' | 'happy' | 'hurt';
    /** true かつ幅が狭いとき: 工房表示中に約半サイズで右下に寄せる */
    spWorkshopCompact?: boolean;
  }>(),
  { gameReaction: 'idle', spWorkshopCompact: false },
);
</script>

<template>
  <div
    class="cat-mascot"
    :class="{
      'cat-mascot--react-happy': gameReaction === 'happy',
      'cat-mascot--react-hurt': gameReaction === 'hurt',
      'cat-mascot--sp-workshop-compact': spWorkshopCompact,
    }"
  >
    <!-- <img src="~/assets/mihon.png" alt> -->
    <div class="face-wrapper">
      <!-- face -->
      <div class="face">
        <div class="face-inner face-inner--l" />
        <div class="face-inner face-inner--r" />
        <div class="face-inner face-inner--c" />
        <div class="face-bg" />
      </div>
      <!-- ear -->
      <div class="ear ear--l" />
      <div class="ear ear--r" />
      <!-- eye -->
      <div class="eye eye--l" />
      <div class="eye eye--r" />
      <!-- nose -->
      <div class="nose" />
      <!-- marble -->
      <div class="marble" />
      <!-- mouth -->
      <div class="mouth">
        <div class="mouth-line" />
      </div>
      <!-- whisker -->
      <div class="whisker whisker--l">
        <span />
        <span />
        <span />
      </div>
      <div class="whisker whisker--r">
        <span />
        <span />
        <span />
      </div>
    </div>
    <!-- neck -->
    <div class="neck" />

    <template v-if="gameReaction === 'happy'">
      <span class="cat-mascot__heart cat-mascot__heart--1" aria-hidden="true">♥</span>
      <span class="cat-mascot__heart cat-mascot__heart--2" aria-hidden="true">♥</span>
      <span class="cat-mascot__heart cat-mascot__heart--3" aria-hidden="true">♥</span>
      <span class="cat-mascot__heart cat-mascot__heart--4" aria-hidden="true">♥</span>
    </template>

    <template v-if="gameReaction === 'hurt'">
      <!-- 見本画像は参考のみ（JPEG は透過不可のため未使用）。SVG で同系の「どんより渦」を描画 -->
      <span
        v-for="n in 5"
        :key="n"
        class="cat-mascot__gloom-spin"
        :class="`cat-mascot__gloom-spin--${n}`"
        aria-hidden="true"
      >
        <svg viewBox="0 0 64 80" class="cat-mascot__gloom-svg" xmlns="http://www.w3.org/2000/svg" focusable="false">
          <path
            class="cat-mascot__gloom-outline"
            d="M32 76 L24 72 L18 58 L22 42 L36 30 L48 34 L46 46 L38 52 L30 48 L32 40 L40 36 L44 44 L38 48 L32 44"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            class="cat-mascot__gloom-line"
            d="M32 76 L24 72 L18 58 L22 42 L36 30 L48 34 L46 46 L38 52 L30 48 L32 40 L40 36 L44 44 L38 48 L32 44"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@mixin cat-size($prop, $px) {
  @media (width >= 1601px) {
    #{$prop}: #{$px * 1.7}px;
  }

  // @media (max-width: 1600px) {
  //   #{$prop}: #{math.div($px, 1000) * 100}vw;
  // }

  @media (width <= 1600px) {
    #{$prop}: #{math.div($px, 800) * 100}vw;
  }

  @media (width <= 768px) {
    #{$prop}: #{math.div($px * 1.3, 768) * 100}vh;
  }

  @media (width <= 568px) {
    #{$prop}: #{math.div($px * 1.1, 768) * 100}vh;
  }
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.5;
}

.cat-mascot {
  overflow-x: hidden;

  @include cat-size(width, 500);
  @include cat-size(height, 500);

  &.cat-mascot--react-happy,
  &.cat-mascot--react-hurt {
    overflow: visible;
  }

  @media (width >= 769px) {
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: var(--z-cat-layer);
  }

  @media (width <= 768px) {
    position: absolute;
    bottom: -2px;
    right: calc(-25% - 3vh);
    z-index: var(--z-cat-layer);

    /* SP + 工房オープン: 約 1/2 に縮小。正確な数式は不可視マージン＋子の transform と相性が悪いので bottom/right で実測寄せ */
    &.cat-mascot--sp-workshop-compact {
      right: 0;
      bottom: -2px;
      transform: scale(0.5);
      transform-origin: bottom right;
    }
  }
}

.face-wrapper {
  position: relative;
  z-index: var(--z-cat);
  transform: translateX(5%) rotate(5deg);
  animation: cat-kunekune 15s infinite cubic-bezier(0.82, -0.005, 0.21, 1.13);

  /* stylelint-disable-next-line selector-type-no-unknown */
  *::-ms-backdrop,
  & {
    animation: none;
  }

  @keyframes cat-kunekune {
    50% {
      transform: translateX(-5%) rotate(-5deg);
    }
  }
}

.face {
  position: absolute;
  border-radius: 70% 70% 68% 68% / 85% 85% 57% 57%;
  overflow: hidden;
  box-shadow: 0 2px 9px rgba(#000, 0.1);

  @include cat-size(top, 135);
  @include cat-size(left, 65);
  @include cat-size(width, 380);
  @include cat-size(height, 270);
}

.face-bg {
  width: 100%;
  height: 100%;
  z-index: var(--z-cat);

  &::before {
    content: '';
    display: block;
    position: absolute;
    background-color: #fff;
    width: 100%;
    height: 32%;
    bottom: 0;
  }

  &::after {
    content: '';
    display: block;
    position: absolute;
    background-color: #fff;
    width: 90%;
    height: 33%;
    left: 5%;
    bottom: 32%;
  }
}

.face-inner {
  position: absolute;
  z-index: var(--z-cat);
  background-color: #121212;
  border-radius: 50%;

  @include cat-size(width, 380);
  @include cat-size(height, 200);

  &--l {
    left: -50%;

    @include cat-size(top, -15);
  }

  &--r {
    transform: scale(-1, 1);
    left: 50%;

    @include cat-size(top, -15);
  }

  &--c {
    top: -39%;
  }
}

.ear {
  position: absolute;
  border-radius: 0% 100% 61% 39% / 0% 100%;
  background: radial-gradient(#cecece, #fff);
  border: solid #121212;
  box-shadow: 0 3px 6px rgba(#000, 0.16);

  @include cat-size(border-width, 20);
  @include cat-size(width, 180);
  @include cat-size(height, 165);
  @include cat-size(top, 90);

  &--l {
    transform: rotate(14deg);

    @include cat-size(left, 60);
  }

  &--r {
    transform: rotate(-14deg) scale(-1, 1);

    @include cat-size(left, 270);
  }
}

.eye {
  position: absolute;
  z-index: var(--z-cat-layer);
  background-color: #f8e042;
  border-radius: 50%;

  @include cat-size(width, 80);
  @include cat-size(height, 80);
  @include cat-size(top, 230);

  &--l {
    @include cat-size(left, 140);
  }

  &--r {
    @include cat-size(left, 290);
  }

  &::before {
    content: '';
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 65%;
    height: 65%;
    background: linear-gradient(#121212, #333);
    border-radius: 50%;
  }
}

.nose {
  position: absolute;
  z-index: var(--z-cat);
  background-color: #fec6db;
  border-radius: 50% / 76% 76% 24% 24%;

  @include cat-size(width, 30);
  @include cat-size(height, 15);
  @include cat-size(top, 320);
  @include cat-size(left, 240);
}

.marble {
  position: absolute;
  background-color: #121212;
  border-radius: 50% 50% 56% 44% / 65% 48% 52% 35%;
  transform: rotate(-14deg);

  @include cat-size(width, 46);
  @include cat-size(height, 25);
  @include cat-size(top, 333);
  @include cat-size(left, 210);
}

.mouth {
  position: absolute;
  transition: transform 0.22s ease;

  @include cat-size(left, 256);
  @include cat-size(top, 360);

  &::before,
  &::after {
    position: absolute;
    display: block;
    content: '';
    background-color: #121212;
    transition: transform 0.22s ease;

    @include cat-size(width, 30);
    @include cat-size(height, 5);
  }

  &::before {
    left: 100%;
    transform: rotate(15deg);
  }

  &::after {
    right: 100%;
    transform: rotate(-15deg) scale(-1, 1);
  }
}

.mouth-line {
  position: absolute;
  background-color: #121212;
  transform-origin: bottom center;
  transition:
    transform 0.22s ease,
    opacity 0.22s ease;

  @include cat-size(width, 5);
  @include cat-size(height, 30);
  @include cat-size(top, -30);
  @include cat-size(left, -2.5);
}

.whisker {
  position: absolute;
  z-index: var(--z-cat);

  @include cat-size(top, 340);

  span {
    position: absolute;
    background: #ddd;
    border-radius: 30%;

    @include cat-size(width, 80);
    @include cat-size(height, 3);

    &:first-child {
      transform: rotate(15deg);

      @include cat-size(top, -20);
    }

    &:last-child {
      transform: rotate(-15deg);

      @include cat-size(bottom, -25);
    }
  }

  &--l {
    transform: rotate(-7deg);

    @include cat-size(left, 80);
  }

  &--r {
    transform: scale(-1, 1) rotate(-7deg);

    @include cat-size(left, 425);
  }
}

.neck {
  bottom: 0;
  position: absolute;
  border-radius: 50% / 100% 100% 0% 0%;
  background-color: #fff;

  @include cat-size(left, 156);
  @include cat-size(width, 200);
  @include cat-size(height, 168);
}

/* おやつキャッチ連動 — 喜びは口は通常のまま＋周囲ハート。怒りのみ口形状を変える */
.cat-mascot--react-hurt .mouth {
  transform: translateY(4px);

  &::before {
    transform: rotate(26deg);
  }

  &::after {
    transform: rotate(-26deg) scale(-1, 1);
  }
}

.cat-mascot--react-hurt .mouth-line {
  transform: scaleY(1.12);
}

/* 喜び：猫の周りのハート */
.cat-mascot__heart {
  position: absolute;
  z-index: 10;
  pointer-events: none;
  color: #fec6db;
  text-shadow: 0 0 6px rgb(249 248 113 / 45%);
  animation: cat-heart-float 0.9s ease-in-out infinite;

  @include cat-size(font-size, 42);
}

.cat-mascot__heart--1 {
  top: 4%;
  left: 8%;
  animation-delay: 0s;
}

.cat-mascot__heart--2 {
  top: 8%;
  right: 6%;
  animation-delay: 0.15s;
}

.cat-mascot__heart--3 {
  top: 38%;
  left: 2%;
  animation-delay: 0.3s;

  @include cat-size(font-size, 32);
}

.cat-mascot__heart--4 {
  top: 32%;
  right: 2%;
  animation-delay: 0.45s;

  @include cat-size(font-size, 36);
}

@keyframes cat-heart-float {
  0%,
  100% {
    transform: translateY(0) scale(1);
    opacity: 0.75;
  }

  50% {
    transform: translateY(-8px) scale(1.08);
    opacity: 1;
  }
}

/* 怒り：周囲の「どんより」渦（白縁＋紫線の SVG。猫の色は変えない） */
.cat-mascot__gloom-spin {
  position: absolute;
  z-index: 10;
  width: 18%;
  height: 22%;
  min-width: 2.5rem;
  min-height: 2.8rem;
  pointer-events: none;
  animation: cat-gloom-spin-float 2.2s ease-in-out infinite;
}

.cat-mascot__gloom-spin--1 {
  top: 3%;
  left: 2%;
  animation-delay: 0s;
}

.cat-mascot__gloom-spin--2 {
  top: 8%;
  right: 0%;
  animation-delay: 0.35s;
}

.cat-mascot__gloom-spin--3 {
  top: 36%;
  left: -2%;
  animation-delay: 0.15s;
}

.cat-mascot__gloom-spin--4 {
  top: 30%;
  right: -1%;
  animation-delay: 0.5s;
}

.cat-mascot__gloom-spin--5 {
  top: 52%;
  left: 14%;
  animation-delay: 0.75s;
}

.cat-mascot__gloom-svg {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.cat-mascot__gloom-outline {
  stroke: #fff;
  stroke-width: 10;
  paint-order: stroke fill;
}

.cat-mascot__gloom-line {
  stroke: #7d6b9a;
  stroke-width: 4;
}

@keyframes cat-gloom-spin-float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.82;
  }

  50% {
    transform: translate(2px, -4px) scale(1.04);
    opacity: 0.98;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mouth,
  .mouth::before,
  .mouth::after,
  .mouth-line {
    transition-duration: 0.01ms;
  }

  .cat-mascot__heart {
    animation: none;
    opacity: 0.9;
  }

  .cat-mascot__gloom-spin {
    animation: none;
    opacity: 0.88;
  }
}
</style>
