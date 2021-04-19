<template>
  <div class="the-skillmap">
    <v-heading-lv2>Skills</v-heading-lv2>

    <div
      class="item"
      v-for="item in $data.items"
      :key="item.heading"
    >
      <v-heading-lv3>{{ item.heading }}</v-heading-lv3>

      <ul>
        <li v-for="childItem in item.childItems" :key="childItem.heading">
          <v-heading-lv4>{{ childItem.heading }}</v-heading-lv4>
          <div class="graph">
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
              score: 25,
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
              score: 25,
            },
            {
              heading: 'IE11 support 😇',
              score: 100,
            },
          ],
        },
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.the-skillmap {
  font-family: 'Poppins', sans-serif;

  .item {
    margin-bottom: 40px;
  }

  li {
    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }

  .graph {
    overflow: hidden;
    position: relative;
    height: 30px;
    border-radius: 4px;
    background: #e2f1ff;
    box-shadow:
      inset 5px 5px 14px #d2e0ed,
      inset -5px -5px 14px #f2ffff;

    &__inner {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      background: #ee8270;
    }

    &__text {
      color: #e2f1ff;
      position: absolute;
      line-height: 30px;
      left: 16px;
      top: 0;
    }
  }
}
</style>
