<template>
  <div class="the-skillmap">
    <v-heading-lv2 class="h2">
      Skills
    </v-heading-lv2>

    <div
      v-for="item, i in items"
      :key="item.heading"
      class="item"
    >
      <v-heading-lv3>{{ item.heading }}</v-heading-lv3>

      <ul>
        <li
          v-for="childItem, i2 in item.childItems"
          :key="childItem.heading"
        >
          <v-heading-lv4 :icn-path="childItem.icnPath">
            {{ childItem.heading }}
          </v-heading-lv4>
          <div
            :ref="`graph-${i}-${i2}`"
            class="graph"
            :aria-hidden="!childItem.isActive"
          >
            <div class="graph__inner" :style="{'width': childItem.score + '%'}" />
            <span class="graph__text">{{ childItem.score === 0 ? 'Learning' : childItem.score + '%' }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, unref } from '@nuxtjs/composition-api';
import {
  siCss3,
  siGrunt,
  siHtml5,
  siJavascript,
  siJquery,
  siPhp,
  siPug,
  siReact,
  siSass,
  siStorybook,
  siTypescript,
  siVuedotjs,
  siWebpack,
  siWordpress,
} from 'simple-icons/icons';

export default defineComponent({
  setup () {
    const items = reactive([
      {
        heading: 'Languages',
        childItems: [
          {
            heading: 'HTML',
            icnPath: siHtml5.path,
            score: 100,
            isActive: false,
          },
          {
            heading: 'Pug',
            icnPath: siPug.path,
            score: 100,
            isActive: false,
          },
          {
            heading: 'CSS',
            icnPath: siCss3.path,
            score: 100,
            isActive: false,
          },
          {
            heading: 'Scss',
            icnPath: siSass.path,
            score: 100,
            isActive: false,
          },
          {
            heading: 'JavaScript',
            icnPath: siJavascript.path,
            score: 100,
            isActive: false,
          },
          {
            heading: 'TypeScript',
            icnPath: siTypescript.path,
            score: 25,
            isActive: false,
          },
          {
            heading: 'PHP',
            icnPath: siPhp.path,
            score: 15,
            isActive: false,
          },
        ],
      },
      {
        heading: 'JavaScript frameworks',
        childItems: [
          {
            heading: 'Vue',
            icnPath: siVuedotjs.path,
            score: 100,
            isActive: false,
          },
          {
            heading: 'jQuery',
            icnPath: siJquery.path,
            score: 80,
            isActive: false,
          },
          {
            heading: 'React',
            icnPath: siReact.path,
            score: 25,
            isActive: false,
          },
        ],
      },
      {
        heading: 'Frontend ops',
        childItems: [
          {
            heading: 'webpack',
            icnPath: siWebpack.path,
            score: 100,
            isActive: false,
          },
          {
            heading: 'Stoybook',
            icnPath: siStorybook.path,
            score: 75,
            isActive: false,
          },
          {
            heading: 'Grunt',
            icnPath: siGrunt.path,
            score: 50,
            isActive: false,
          },
        ],
      },
      {
        heading: 'Other skills',
        childItems: [
          {
            heading: 'BEM',
            score: 100,
            isActive: false,
          },
          {
            heading: 'Accessibility / WAI-ARIA',
            score: 75,
            isActive: false,
          },
          {
            heading: 'WordPress',
            icnPath: siWordpress.path,
            score: 15,
            isActive: false,
          },
        ],
      },
    ]);

    const itemsRefs = (() => {
      const result: {[key: string] : any} = {};

      items.forEach((item, i) => {
        item.childItems.forEach((_, i2) => {
          // eslint-disable-next-line
          return result[`graph-${i}-${i2}`] = ref<HTMLElement>();
        });
      });

      return result;
    })();

    const aos = (i: number, i2: number) => {
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            items[i].childItems[i2].isActive = true;
            observer.disconnect();
          }
        }
      }, {
        threshold: [0.25, 0.5],
      });

      observer.observe(itemsRefs[`graph-${i}-${i2}`].value[0]);
    };

    onMounted(() => {
      unref(items).forEach((item, i) => {
        item.childItems.forEach((_, i2) => {
          aos(i, i2);
        });
      });
    });

    return {
      ...{
        items,
        aos,
      },
      ...itemsRefs,
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
      margin-bottom: 36px;
    }
  }

  li {
    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }
}

.graph {
  $this-graph: &;

  overflow: hidden;
  position: relative;
  height: 30px;
  border-radius: 4px;
  background: var(--txt-color-white);

  &[aria-hidden="true"] {
    #{$this-graph}__inner {
      transform: scale(0, 1);
    }
  }

  &__inner {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: #ee8270;
    transform-origin: 0 50%;
    transition: transform 1s ease-in-out;
  }

  &__text {
    color: var(--txt-color-white);
    position: absolute;
    line-height: 30px;
    left: 16px;
    top: 0;
    text-shadow: 0 1px 3px rgba(#000, 0.3);
  }
}
</style>
