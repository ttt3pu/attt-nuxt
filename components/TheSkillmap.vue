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
          <v-heading-lv4>{{ childItem.heading }}</v-heading-lv4>
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
export default {
  data () {
    return {
      items: [
        {
          heading: 'Languages',
          childItems: [
            {
              heading: 'HTML',
              score: 100,
            },
            {
              heading: 'Pug',
              score: 100,
            },
            {
              heading: 'CSS',
              score: 100,
            },
            {
              heading: 'SCSS',
              score: 100,
            },
            {
              heading: 'JavaScript',
              score: 100,
            },
            {
              heading: 'TypeScript',
              score: 25,
            },
            {
              heading: 'PHP',
              score: 15,
            },
          ],
        },
        {
          heading: 'JavaScript frameworks',
          childItems: [
            {
              heading: 'Vue',
              score: 100,
            },
            {
              heading: 'jQuery',
              score: 80,
            },
            {
              heading: 'React',
              score: 25,
            },
          ],
        },
        {
          heading: 'Frontend ops',
          childItems: [
            {
              heading: 'webpack',
              score: 100,
            },
            {
              heading: 'Stoybook',
              score: 75,
            },
            {
              heading: 'Grunt',
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
              score: 15,
            },
            {
              heading: 'IE11 support 😇',
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
