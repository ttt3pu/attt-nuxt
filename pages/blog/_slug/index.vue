<template>
  <main class="main">
    <the-logo :is-active-logo="false" />

    <nuxt-link
      class="back"
      :to="localePath('/')"
    >
      <icn-back class="back__icn" />
      <span>Main page</span>
    </nuxt-link>

    <div class="heading-container">
      <time
        class="date"
        :datetime="data.publishedAt"
      >{{ _publishedAtFormatted() }}</time>

      <h1 class="title">{{ data.title }}</h1>
    </div>

    <div
      class="post"
      v-html="data.content"
    />
  </main>
</template>

<script lang="ts">
import { defineComponent, useFetch, reactive, ref, useContext, useMeta } from "@nuxtjs/composition-api"
import axios from 'axios'
import dayjs from 'dayjs';
//@ts-ignore
import icnBack from 'vue-material-design-icons/ChevronLeft.vue';

export default defineComponent({
  components: {
    icnBack
  },
  head: {},
  setup() {
    const { $config, params, i18n, $md, $translate } = useContext();
    const metaTitle = useMeta().title;

    const data = reactive({
      publishedAt: new Date(),
      title: '',
      content: '',
    })

    useFetch(async () => {
      const response = await axios.get(`https://attt.microcms.io/api/v1/blog/${params.value.slug}`, {
        headers: {'X-API-KEY': $config.MICROCMS_API_KEY},
      });

      const locale = i18n.locale;

      const {publishedAt, title, content} = response.data;

      data.publishedAt = publishedAt;
      data.title = await (async () => {
        if (locale === 'ja') {
          return title;
        }

        return await $translate(title, locale);
      })();

      data.content = await (async () => {
        const renderedStr = $md.render(content);

        if (locale === 'ja') {
          return renderedStr;
        }

        return await $translate(renderedStr, locale);
      })();

      metaTitle.value = data.title;
    });

    const _publishedAtFormatted = ref(() => dayjs(data.publishedAt).format('YYYY.MM.DD'));

    return {
      data,
      _publishedAtFormatted,
    };
  },
});
</script>

<style lang="scss" scoped>
.main {
  max-width: calc(980px + #{(200 / 1980) * 100}vw);
  margin: 0 auto;

  @media (min-width: 769px) {
    padding: 48px #{(100 / 1980) * 100}vw;
  }

  @media (max-width: 768px) {
    padding: 24px #{(100 / 1980) * 100}vw;
  }
}

.back {
  position: relative;
  bottom: 16px;
  left: -8px;
  text-align: right;
  font-family: var(--font-family--en);
  color: var(--txt-color-white);
  display: flex;
  align-items: center;

  &__icn {
    width: 24px;
    height: 24px;
    bottom: 1px;
    position: relative;

    /* stylelint-disable-next-line */
    ::v-deep svg {
      width: 100%;
      height: 100%;
    }
  }
}

.heading-container {
  margin: 48px auto 32px;
  line-height: var(--line-height--heading);
}

.date {
  font-family: var(--font-family--en);
  color: var(--txt-color-white);
}

.title {
  font-family: var(--font-family--jp);
  font-size: 3rem;
  color: var(--primary-color);
}

.post {
  font-family: var(--font-family--jp);
  color: var(--txt-color-white);
  background-color: var(--bg-color--lv2);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);

  @media (min-width: 769px) {
    padding: 40px #{(50 / 1980) * 100}vw;
  }

  @media (max-width: 768px) {
    padding: 32px #{(100 / 1980) * 100}vw;
  }

  /* stylelint-disable-next-line */
  ::v-deep {
    a {
      color: var(--txt-color-link);
      text-decoration: none;

      &:hover {
        text-decoration: underline;
        text-decoration-color: var(--txt-color-link-hover);
        text-underline-offset: 4px;
      }
    }

    p {
      & + p {
        margin-top: 24px;
      }
    }
  }
}
</style>
