<template>
  <div class="the-skillmap">
    <v-heading-lv2 class="h2">
      Skills
    </v-heading-lv2>

    <v-heading-lv3>Main</v-heading-lv3>
    <ul>
      <li
        v-for="(item, i) in mainItems"
        :key="i"
      >
        <svg
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          :style="`fill: #${item.icnData.hex};`"
        >
          <path :d="item.icnData.path" />
        </svg>

        <span>{{ item.heading }}</span>
        <span v-if="i !== mainItems.length - 1" class="slash">/</span>
      </li>
    </ul>

    <v-heading-lv3>Sub</v-heading-lv3>
    <ul>
      <li
        v-for="(item, i) in subItems"
        :key="i"
      >
        <svg
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          :style="`fill: #${item.icnData.hex};`"
        >
          <path :d="item.icnData.path" />
        </svg>

        <span>{{ item.heading }}</span>
        <span v-if="i !== subItems.length - 1" class="slash">/</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api';
import {
  siCss3,
  siGrunt,
  siHtml5,
  siJavascript,
  siJest,
  siJquery,
  siNuxtdotjs,
  siPug,
  siReact,
  siSass,
  siStorybook,
  siTailwindcss,
  siTypescript,
  siVuedotjs,
  siWebpack,
} from 'simple-icons/icons';

export default defineComponent({
  setup () {
    const mainItems = ref([
      {
        heading: 'Vue',
        icnData: siVuedotjs,
      },
      {
        heading: 'Nuxt',
        icnData: siNuxtdotjs,
      },
      {
        heading: 'TypeScript',
        icnData: siTypescript,
      },
      {
        heading: 'JavaScript',
        icnData: siJavascript,
      },
      {
        heading: 'Jest',
        icnData: siJest,
      },
      {
        heading: 'HTML',
        icnData: siHtml5,
      },
      {
        heading: 'CSS',
        icnData: siCss3,
      },
      {
        heading: 'Scss',
        icnData: siSass,
      },
    ]);

    const subItems = ref([
      {
        heading: 'React',
        icnData: siReact,
      },
      {
        heading: 'Tailwind',
        icnData: siTailwindcss,
      },
      {
        heading: 'webpack',
        icnData: siWebpack,
      },
      {
        heading: 'Stoybook',
        icnData: siStorybook,
      },
      {
        heading: 'jQuery',
        icnData: siJquery,
      },
      {
        heading: 'Grunt',
        icnData: siGrunt,
      },
      {
        heading: 'Pug',
        icnData: siPug,
      },
    ]);

    return {
      mainItems,
      subItems,
    };
  },
});
</script>

<style lang="scss" scoped>
.h2 {
  margin-bottom: 16px;
}

.the-skillmap {
  font-family: var(--font-family-en);

  .item {
    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    margin-top: 8px;
  }

  li {
    &:not(:last-child) {
      margin-right: 16px;
    }

    font-family: var(--font-family-en);
    color: var(--txt-color-white);
    font-weight: 400;
    font-size: 1.4rem;
    margin-bottom: 8px;
    display: flex;
    align-items: baseline;

    span {
      position: relative;
      bottom: 5.5px;
    }

    svg {
      width: 32px;
      height: 32px;
      margin-right: 8px;
      position: relative;
      top: 3px;
    }
  }

  .slash {
    margin: 0 8px 0 16px;
  }
}
</style>
