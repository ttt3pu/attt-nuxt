<script setup lang="ts">
import { useId } from 'vue';

const svgId = useId();

withDefaults(
  defineProps<{
    /** ゲーム連動。未指定は idle */
    gameReaction?: 'idle' | 'happy' | 'hurt';
  }>(),
  { gameReaction: 'idle' },
);
</script>

<template>
  <div
    class="cat-mascot"
    :class="{
      'cat-mascot--react-happy': gameReaction === 'happy',
      'cat-mascot--react-hurt': gameReaction === 'hurt',
    }"
  >
    <svg class="cat-mascot__drawing" viewBox="0 0 500 500" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient :id="`${svgId}-pupil`" x2="0" y2="1">
          <stop stop-color="#121212" />
          <stop offset="1" stop-color="#333" />
        </linearGradient>
        <radialGradient
          :id="`${svgId}-ear`"
          gradientUnits="userSpaceOnUse"
          cx="90"
          cy="82.5"
          r="93.841622"
          gradientTransform="translate(0 -13.915179) scale(1 1.168669)"
        >
          <stop stop-color="#cecece" />
          <stop offset="1" stop-color="#fff" />
        </radialGradient>
        <mask :id="`${svgId}-face`" maskUnits="userSpaceOnUse" x="0" y="0" width="500" height="500">
          <path
            fill="#fff"
            d="M 252.323944 135 H 257.676056 A 187.323944 161.619718 0 0 1 445 296.619718 V 296.619718 A 181.971831 108.380282 0 0 1 263.028169 405 H 246.971831 A 181.971831 108.380282 0 0 1 65 296.619718 V 296.619718 A 187.323944 161.619718 0 0 1 252.323944 135 Z"
          />
        </mask>
      </defs>
      <path fill="#fff" d="M156 500 A100 168 0 0 1 356 500 Z" />
      <!-- 元の高さ 0 の face-wrapper と同じ、(250, 0) を中心に傾ける。 -->
      <g class="cat-mascot__head">
        <g fill="#121212" class="cat-mascot__ears">
          <g transform="translate(60 90) rotate(14 90 82.5)">
            <path d="M0 0 A180 165 0 0 1 180 165 H70.2 A70.2 165 0 0 1 0 0 Z" />
            <path
              :fill="`url(#${svgId}-ear)`"
              d="M20.539433 21.199707 A160 145 0 0 1 160 165 L70.2 145 A50.2 145 0 0 1 20.539433 21.199707 Z"
            />
          </g>
          <g transform="translate(270 90) rotate(-14 90 82.5) translate(180 0) scale(-1 1)">
            <path d="M0 0 A180 165 0 0 1 180 165 H70.2 A70.2 165 0 0 1 0 0 Z" />
            <path
              :fill="`url(#${svgId}-ear)`"
              d="M20.539433 21.199707 A160 145 0 0 1 160 165 L70.2 145 A50.2 145 0 0 1 20.539433 21.199707 Z"
            />
          </g>
        </g>
        <!-- 下地と模様をまとめてマスクし、矩形の継ぎ目と輪郭の白い縁を防ぐ。 -->
        <g class="cat-mascot__face">
          <g :mask="`url(#${svgId}-face)`">
            <rect x="65" y="135" width="380" height="270" fill="#fff" />
            <g fill="#121212">
              <ellipse cx="65" cy="220" rx="190" ry="100" />
              <ellipse cx="445" cy="220" rx="190" ry="100" />
              <ellipse cx="255" cy="129.7" rx="190" ry="100" />
            </g>
          </g>
        </g>
        <g fill="#f8e042">
          <circle cx="180" cy="270" r="40" />
          <circle cx="330" cy="270" r="40" />
        </g>
        <g :fill="`url(#${svgId}-pupil)`">
          <circle cx="180" cy="270" r="26" />
          <circle cx="330" cy="270" r="26" />
        </g>
        <path
          fill="#121212"
          transform="rotate(-14 233 345.5)"
          d="M 233 333 H 233 A 23 12 0 0 1 256 345 V 345 A 25.760000 13 0 0 1 230.240000 358 H 230.240000 A 20.240000 8.750000 0 0 1 210 349.250000 V 349.250000 A 23 16.250000 0 0 1 233 333 Z"
        />
        <g transform="translate(256 360)" fill="#121212">
          <g class="mouth">
            <rect class="mouth-line" x="-2.5" y="-30" width="5" height="30" />
            <rect class="mouth-left" x="-30" width="30" height="5" />
            <rect class="mouth-right" width="30" height="5" />
          </g>
        </g>
        <path
          fill="#fec6db"
          d="M 255 320 H 255 A 15 11.400000 0 0 1 270 331.400000 V 331.400000 A 15 3.600000 0 0 1 255 335 H 255 A 15 3.600000 0 0 1 240 331.400000 V 331.400000 A 15 11.400000 0 0 1 255 320 Z"
        />
        <g fill="#ddd">
          <g
            v-for="side in ['left', 'right']"
            :key="side"
            :transform="side === 'left' ? 'translate(80 340) rotate(-7)' : 'translate(425 340) scale(-1 1) rotate(-7)'"
          >
            <rect y="-20" width="80" height="3" rx="24" ry="0.9" transform="rotate(15 40 -18.5)" />
            <rect width="80" height="3" rx="24" ry="0.9" />
            <rect y="22" width="80" height="3" rx="24" ry="0.9" transform="rotate(-15 40 23.5)" />
          </g>
        </g>
      </g>
    </svg>

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
  }
}

.cat-mascot__drawing {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.cat-mascot__head {
  transform-box: view-box;
  transform-origin: 250px 0;
  transform: translateX(25px) rotate(5deg);
  animation: cat-kunekune 15s infinite cubic-bezier(0.82, -0.005, 0.21, 1.13);
}

@keyframes cat-kunekune {
  50% {
    transform: translateX(-25px) rotate(-5deg);
  }
}

.cat-mascot__face {
  filter: drop-shadow(0 2px 4.5px rgb(0 0 0 / 10%));
}

.cat-mascot__ears {
  filter: drop-shadow(0 3px 3px rgb(0 0 0 / 16%));
}

.mouth,
.mouth-left,
.mouth-right,
.mouth-line {
  transition: transform 0.22s ease;
}

.mouth-left {
  transform-origin: -15px 2.5px;
  transform: rotate(-15deg);
}

.mouth-right {
  transform-origin: 15px 2.5px;
  transform: rotate(15deg);
}

.mouth-line {
  transform-origin: 0 0;
}

.cat-mascot--react-hurt {
  .mouth {
    transform: translateY(4px);
  }

  .mouth-left {
    transform: rotate(-26deg);
  }

  .mouth-right {
    transform: rotate(26deg);
  }

  .mouth-line {
    transform: scaleY(1.12);
  }
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
  .cat-mascot__head {
    animation: none;
  }

  .mouth,
  .mouth-left,
  .mouth-right,
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
