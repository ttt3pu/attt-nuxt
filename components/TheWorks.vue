<template>
  <div class="the-works">
    <v-heading-lv2>Works</v-heading-lv2>

    <ul>
      <li
        class="the-works__item"
        v-for="item in $data.items"
        :key="item.heading"
      >
        <span>{{ item }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      items: [
        '複数案件での大規模サイトの構築、改修。いくつかの案件ではメインでフロントエンドを担当',
        '大規模サイトのコンポーネント作成。BEMを活用し多量のCSSを管理',
        'Vuex + Cookie / Web Storage + REST APIのやり取りで構築された、サイトの状態管理を実装',
        'ReactをベースとしたSPAサイト構築',
        'Storybookを利用したコンポーネントの管理。Story内でVue + Pugを活用できるようスタマイズ',
        '案件都合に合わせてビルド環境を細かくカスタマイズ（npm scripts、webpack、Scss、Storybook、Pug、PostCSS、ESLint、Stylelint、Babel、Cloudinaly Node.js SDK、Grunt、 etc...）',
        'レガシーなビルド環境（Grunt.js + ES5 + etc...）からモダンなビルド環境（webpack + Babel + ES6~ + etc...）への移行',
        'Git-flowに準じたバージョン管理',
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.the-works {
  margin-bottom: 48px;

  &__item {
    font-family: 'Noto Sans JP', sans-serif;
    color: #e2f1ff;
    display: flex;
    align-items: baseline;

    &:not(:last-child) {
      margin-bottom: 4px;
    }

    &::before {
      content: "";
      display: block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #ffb962;
      position: relative;
      bottom: 1px;
      margin-right: 12px;
      flex-shrink: 0;
    }
  }
}
</style>
