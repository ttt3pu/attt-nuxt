<template>
  <div class="container">
    <div class="title-container">
      <div class="title-container__inner">
        <div>
          <h1 class="title">attt</h1>

          <ul class="sns">
            <li
              v-for="item in $data.snsItems"
              :key="item.name"
              class="sns__item"
            >
              <a
                :href="item.href"
                target="_blank"
                rel="noopener"
                :title="item.title"
              >
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  class="sns__icn"
                >
                  <path :d="item.path" />
                </svg>
              </a>
            </li><!-- /sns__item -->
          </ul><!-- /sns -->
        </div>
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
      <the-profile />
      <the-works />
      <the-skillmap />
    </div><!-- /main-contents -->
  </div>
</template>

<script>
import icnGithub from 'simple-icons/icons/github';
import icnTwitter from 'simple-icons/icons/twitter';
import icnZenn from 'simple-icons/icons/zenn';

export default {
  data: function() {
    return {
      snsItems: [
        {
          title: 'GitHub',
          path: icnGithub.path,
          href: 'https://github.com/ttt3pu',
        },
        {
          title: 'Zenn',
          path: icnZenn.path,
          href: 'https://zenn.dev/attt',
        },
        {
          title: 'Twitter',
          path: icnTwitter.path,
          href: 'https://twitter.com/ttt3pu',
        },
      ],
    };
  },
  methods: {
    scroll: function() {
      window.scrollTo(0, window.innerHeight);
    },
  },
};
</script>

<style lang="scss" scoped>
@mixin line-height-crop($line-height: 1.5) {
  &::before {
    display: block;
    width: 0;
    height: 0;
    margin-top: calc((1 - #{$line-height}) * 0.5em);
    content: "";
  }

  &::after {
    display: block;
    width: 0;
    height: 0;
    margin-bottom: calc((1 - #{$line-height}) * 0.5em);
    content: "";
  }
}

.title-container {
  position: relative;

  @media (min-width: 769px) {
    padding: #{(80 / 1980) * 100}vh #{(100 / 1980) * 100}vw 0;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
  }

  @media (max-width: 768px) {
    padding: #{(48 / 1980) * 100}vh #{(100 / 1980) * 100}vw 0;
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

.title {
  font-family: 'Poppins', sans-serif;
  display: block;
  font-weight: 400;
  font-size: 9rem;
  color: #e2f1ff;
  margin-bottom: 8px;
  position: relative;
  left: -12px;
  line-height: 1;
}

.sns {
  display: flex;
  position: relative;
  z-index: var(--z-sns);

  &__item {
    width: 35px;

    &:not(:last-child) {
      margin-right: 16px;
    }
  }

  &__icn {
    width: 100%;
    fill: #f4fb7f;
    transition: fill 0.2s;

    &:hover {
      fill: lighten(#f4fb7f, 20%);
    }
  }
}

.scroll {
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
    left: #{(200 / 1980) * 100}vw;
    bottom: 56px;
  }

  &__arr {
    position: relative;
    display: block;
    width: 24px;
    height: 24px;
    margin: 0 auto;

    &::before,
    &::after {
      content: "";
      position: absolute;
      width: 24px;
      height: 24px;
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
    font-family: 'Poppins', sans-serif;
    font-size: 24px;
  }
}

.main-contents {
  flex-grow: 1;
  margin-right: 0;
  margin-left: auto;
  background-color: #3c3b5c;
  // background: #001731;

  @media (min-width: 769px) {
    max-width: #{(980 / 1600) * 100}vw;
    padding: 75px #{(100 / 1980) * 100}vw;
  }

  @media (max-width: 768px) {
    padding: 48px #{(100 / 1980) * 100}vw;
  }
}
</style>
