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
@function size($px) {
  // @return #{$px * 1.5}px;
  @return #{($px / 1400) * 100}vw;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.5;
}

.the-cat {
  // border: 1px solid #000;
  width: size(500);
  height: size(500);
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 2;
}

.face-wrapper {
  position: relative;
  z-index: 1;
  animation: cat-kunekune 15s infinite cubic-bezier(0.82, -0.005, 0.21, 1.13);
  transform: translateX(#{size(30)}) rotate(5deg);

  @keyframes cat-kunekune {
    50% {
      transform: translateX(#{size(-30)}) rotate(-5deg);
    }
  }
}

.face {
  position: absolute;
  // background-color: rgba(#fff, 0.5);
  border-radius: 70% 70% 68% 68% / 85% 85% 57% 57%;
  top: size(135);
  left: size(65);
  width: size(380);
  height: size(270);
  overflow: hidden;
  box-shadow: 0 2px 9px rgba(#000, 0.1);
}

.face-bg {
  width: 100%;
  height: 100%;

  &::before {
    content: "";
    display: block;
    position: absolute;
    background-color: #fff;
    width: 100%;
    height: 32%;
    bottom: 0;
  }

  &::after {
    content: "";
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
  z-index: 1;
  background-color: #121212;
  border-radius: 50%;
  width: size(380);
  height: size(200);

  &--l {
    left: -50%;
    top: size(-15);
  }

  &--r {
    transform: scale(-1, 1);
    left: 50%;
    top: size(-15);
  }

  &--c {
    top: -39%;
  }
}

.ear {
  position: absolute;
  border-radius: 0% 100% 61% 39% / 0% 100% 0% 100%;
  background: radial-gradient(#cecece, #fff);
  border: size(20) solid #121212;
  width: size(180);
  height: size(165);
  box-shadow: 0 3px 6px rgba(#000, 0.16);
  top: size(90);

  &--l {
    left: size(60);
    transform: rotate(14deg);
  }

  &--r {
    left: size(270);
    transform: rotate(-14deg) scale(-1, 1);
  }
}

.eye {
  position: absolute;
  z-index: 2;
  width: size(80);
  height: size(80);
  top: size(230);
  background-color: #f8e042;
  border-radius: 50%;

  &--l {
    left: size(140);
  }

  &--r {
    left: size(290);
  }

  &::before {
    content: "";
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
  z-index: 1;
  width: size(30);
  height: size(15);
  top: size(320);
  left: size(240);
  background-color: #fec6db;
  border-radius: 50% 50% 50% 50% / 76% 76% 24% 24%;
}

.marble {
  position: absolute;
  width: size(46);
  height: size(25);
  top: size(333);
  left: size(210);
  background-color: #121212;
  border-radius: 50% 50% 56% 44%/65% 48% 52% 35%;
  transform: rotate(-14deg);
}

.mouth {
  position: absolute;
  left: size(256);
  top: size(360);

  &::before,
  &::after {
    position: absolute;
    display: block;
    content: "";
    width: size(30);
    height: size(5);
    background-color: #121212;
  }

  &::before {
    left: calc(100% - #{size(1)});
    left: 100%;
    transform: rotate(15deg);
  }

  &::after {
    right: calc(100% - #{size(1)});
    right: 100%;
    transform: rotate(-15deg) scale(-1, 1);
  }
}

.mouth-line {
  position: absolute;
  background-color: #121212;
  width: size(5);
  height: size(30);
  top: size(-30);
  left: size(-2.5);
}

.whisker {
  position: absolute;
  top: size(340);
  z-index: 1;

  span {
    position: absolute;
    width: size(80);
    height: size(3);
    background: #ddd;
    border-radius: 30%;

    &:first-child {
      transform: rotate(15deg);
      top: size(-20);
    }

    &:last-child {
      transform: rotate(-15deg);
      bottom: size(-25);
    }
  }

  &--l {
    transform: rotate(-7deg);
    left: size(80);
  }

  &--r {
    transform: scale(-1, 1) rotate(-7deg);
    left: size(425);
  }
}

.neck {
  position: absolute;
  border-radius: 50% 50% 50% 50% / 100% 100% 0% 0%;
  background-color: #fff;
  left: size(156);
  top: size(330);
  width: size(200);
  height: size(168);
}
</style>
