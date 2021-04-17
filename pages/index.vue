<template>
  <div class="container">
    <div class="title-container">
      <div class="title-container__inner">
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
      </div><!-- /title-container__inner -->
    </div><!-- /title-container -->

    <div class="main-contents">
      <the-profile />
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

// .container {
// }

.title-container {
  padding: 48px #{(100 / 1980) * 100}vw;
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;

  @media (min-width: 769px) {
    position: fixed;
    top: 0;
    left: 0;
  }

  // @media (max-width: 768px) {
  // }
}

.title {
  @include line-height-crop;

  font-family: 'Poppins', sans-serif;
  display: block;
  font-weight: 400;
  font-size: 9rem;
  color: #e2f1ff;
  margin-bottom: 8px;
  position: relative;
  left: -12px;
}

.sns {
  display: flex;
  position: relative;
  z-index: 1;

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

.main-contents {
  flex-grow: 1;
  margin-right: 0;
  margin-left: auto;
  padding: 75px #{(100 / 1980) * 100}vw;

  @media (min-width: 769px) {
    max-width: #{(980 / 1600) * 100}vw;
  }

  @media (max-width: 768px) {
    padding-top: 0;
    padding-bottom: 200px;
  }
}
</style>
