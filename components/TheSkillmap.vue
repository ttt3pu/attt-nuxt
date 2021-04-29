<template>
  <div class="the-skillmap">
    <v-heading-lv2>Skills</v-heading-lv2>

    <div
      class="item"
      v-for="item, i in $data.items"
      :key="item.heading"
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
            class="graph"
            :ref="`graph-${i}-${i2}`"
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

<script>
import icnHtml from 'simple-icons/icons/html5';
import icnPug from 'simple-icons/icons/pug';
import icnCss from 'simple-icons/icons/css3';
import icnSass from 'simple-icons/icons/sass';
import icnJs from 'simple-icons/icons/javascript';
import icnTs from 'simple-icons/icons/typescript';
import icnPhp from 'simple-icons/icons/php';
import icnVue from 'simple-icons/icons/vue-dot-js';
import icnJquery from 'simple-icons/icons/jquery';
import icnReact from 'simple-icons/icons/react';
import icnWebpack from 'simple-icons/icons/webpack';
import icnStorybook from 'simple-icons/icons/storybook';
import icnGrunt from 'simple-icons/icons/grunt';
import icnWordpress from 'simple-icons/icons/wordpress';
import icnIe from 'simple-icons/icons/internetexplorer';

export default {
  data () {
    return {
      items: [
        {
          heading: 'Languages',
          childItems: [
            {
              heading: 'HTML',
              icnPath: icnHtml.path,
              score: 100,
            },
            {
              heading: 'Pug',
              icnPath: icnPug.path,
              score: 100,
            },
            {
              heading: 'CSS',
              icnPath: icnCss.path,
              score: 100,
            },
            {
              heading: 'Scss',
              icnPath: icnSass.path,
              score: 100,
            },
            {
              heading: 'JavaScript',
              icnPath: icnJs.path,
              score: 100,
            },
            {
              heading: 'TypeScript',
              icnPath: icnTs.path,
              score: 25,
            },
            {
              heading: 'PHP',
              icnPath: icnPhp.path,
              score: 15,
            },
          ],
        },
        {
          heading: 'JavaScript frameworks',
          childItems: [
            {
              heading: 'Vue',
              icnPath: icnVue.path,
              score: 100,
            },
            {
              heading: 'jQuery',
              icnPath: icnJquery.path,
              score: 80,
            },
            {
              heading: 'React',
              icnPath: icnReact.path,
              score: 25,
            },
          ],
        },
        {
          heading: 'Frontend ops',
          childItems: [
            {
              heading: 'webpack',
              icnPath: icnWebpack.path,
              score: 100,
            },
            {
              heading: 'Stoybook',
              icnPath: icnStorybook.path,
              score: 75,
            },
            {
              heading: 'Grunt',
              icnPath: icnGrunt.path,
              score: 50,
            },
          ],
        },
        {
          heading: 'Other skills',
          childItems: [
            {
              heading: 'BEM',
              score: 100,
            },
            {
              heading: 'Accessibility / WAI-ARIA',
              score: 75,
            },
            {
              heading: 'WordPress',
              icnPath: icnWordpress.path,
              score: 15,
            },
            {
              heading: 'IE11 support 😇',
              icnPath: icnIe.path,
              score: 100,
            },
          ],
        },
      ]
    }
  },
  mounted: function() {
    this.$data.items.forEach((item, i) => {
      item.childItems.forEach((item2, i2) => {
        this.aos(i, i2);
      });
    });
  },
  methods: {
    aos: function(i, i2) {
      const observer = new IntersectionObserver((entries) => {
        for(const entry of entries){
          if (entry.isIntersecting){
            this.$set(this.$data.items[i]['childItems'][i2], 'isActive', true);
            observer.disconnect();
          }
        }
      }, {
        threshold: [0.25, 0.5]
      });

      observer.observe(this.$refs[`graph-${i}-${i2}`][0]);
    },
  },
}
</script>

<style lang="scss" scoped>
.the-skillmap {
  font-family: var(--font-family--en);

  .item {
    &:not(:last-child) {
      margin-bottom: 40px;
    }
  }

  li {
    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }
}

.graph {
  $thisGraph: &;

  overflow: hidden;
  position: relative;
  height: 30px;
  border-radius: 4px;
  background: var(--txt-color-white);
  box-shadow:
    inset 5px 5px 14px #d2e0ed,
    inset -5px -5px 14px #f2ffff,
    0 3px 6px rgba(0, 0, 0, 0.16);

  &[aria-hidden="true"] {
    #{$thisGraph}__inner {
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
