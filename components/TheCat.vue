<template>
  <div class="the-cat">
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

.the-cat {
  @include cat-size(width, 500);
  @include cat-size(height, 500);

  overflow-x: hidden;

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
  @include cat-size(top, 135);
  @include cat-size(left, 65);
  @include cat-size(width, 380);
  @include cat-size(height, 270);

  position: absolute;
  border-radius: 70% 70% 68% 68% / 85% 85% 57% 57%;
  overflow: hidden;
  box-shadow: 0 2px 9px rgba(#000, 0.1);
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
  @include cat-size(width, 380);
  @include cat-size(height, 200);

  position: absolute;
  z-index: var(--z-cat);
  background-color: #121212;
  border-radius: 50%;

  &--l {
    @include cat-size(top, -15);

    left: -50%;
  }

  &--r {
    @include cat-size(top, -15);

    transform: scale(-1, 1);
    left: 50%;
  }

  &--c {
    top: -39%;
  }
}

.ear {
  @include cat-size(border-width, 20);
  @include cat-size(width, 180);
  @include cat-size(height, 165);
  @include cat-size(top, 90);

  position: absolute;
  border-radius: 0% 100% 61% 39% / 0% 100% 0% 100%;
  background: radial-gradient(#cecece, #fff);
  border: solid #121212;
  box-shadow: 0 3px 6px rgba(#000, 0.16);

  &--l {
    @include cat-size(left, 60);

    transform: rotate(14deg);
  }

  &--r {
    @include cat-size(left, 270);

    transform: rotate(-14deg) scale(-1, 1);
  }
}

.eye {
  @include cat-size(width, 80);
  @include cat-size(height, 80);
  @include cat-size(top, 230);

  position: absolute;
  z-index: var(--z-cat-layer);
  background-color: #f8e042;
  border-radius: 50%;

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
  @include cat-size(width, 30);
  @include cat-size(height, 15);
  @include cat-size(top, 320);
  @include cat-size(left, 240);

  position: absolute;
  z-index: var(--z-cat);
  background-color: #fec6db;
  border-radius: 50% 50% 50% 50% / 76% 76% 24% 24%;
}

.marble {
  @include cat-size(width, 46);
  @include cat-size(height, 25);
  @include cat-size(top, 333);
  @include cat-size(left, 210);

  position: absolute;
  background-color: #121212;
  border-radius: 50% 50% 56% 44% / 65% 48% 52% 35%;
  transform: rotate(-14deg);
}

.mouth {
  @include cat-size(left, 256);
  @include cat-size(top, 360);

  position: absolute;

  &::before,
  &::after {
    @include cat-size(width, 30);
    @include cat-size(height, 5);

    position: absolute;
    display: block;
    content: '';
    background-color: #121212;
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
  @include cat-size(width, 5);
  @include cat-size(height, 30);
  @include cat-size(top, -30);
  @include cat-size(left, -2.5);

  position: absolute;
  background-color: #121212;
}

.whisker {
  @include cat-size(top, 340);

  position: absolute;
  z-index: var(--z-cat);

  span {
    @include cat-size(width, 80);
    @include cat-size(height, 3);

    position: absolute;
    background: #ddd;
    border-radius: 30%;

    &:first-child {
      @include cat-size(top, -20);

      transform: rotate(15deg);
    }

    &:last-child {
      @include cat-size(bottom, -25);

      transform: rotate(-15deg);
    }
  }

  &--l {
    @include cat-size(left, 80);

    transform: rotate(-7deg);
  }

  &--r {
    @include cat-size(left, 425);

    transform: scale(-1, 1) rotate(-7deg);
  }
}

.neck {
  @include cat-size(left, 156);
  @include cat-size(width, 200);
  @include cat-size(height, 168);

  bottom: 0;
  position: absolute;
  border-radius: 50% 50% 50% 50% / 100% 100% 0% 0%;
  background-color: #fff;
}
</style>
