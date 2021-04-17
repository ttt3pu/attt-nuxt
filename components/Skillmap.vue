<template>
  <div class="skillmap">
    <div
      class="item"
      v-for="item in $data.items"
      :key="item.heading"
    >
      <h2>{{ item.heading }}</h2>

      <ul>
        <li v-for="childItem in item.childItems" :key="childItem.heading">
          <h3>{{ childItem.heading }}</h3>
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
              heading: 'Webpack',
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
              heading: 'Accessibility',
              score: 75,
            },
            {
              heading: 'IE11 support methods',
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
.skillmap {
  margin-right: 0;
  margin-left: auto;
  font-family: 'Poppins', sans-serif;
  // display: flex;
  // flex-wrap: wrap;
  // justify-content: space-between;

  .item {
    margin-bottom: 24px;
  }

  h2 {
    color: #ffb962;
    font-weight: 500;
    font-size: 2rem;
  }

  li {
    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }

  h3 {
    color: #e2f1ff;
    font-weight: 400;
    font-size: 1.4rem;
    margin-bottom: 8px;
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
