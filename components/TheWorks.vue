<template>
  <div class="the-works">
    <v-heading-lv2>Works</v-heading-lv2>

    <ul>
      <li
        v-for="item in data.items"
        :key="item.heading"
        class="the-works__item"
      >
        <h3 class="the-works__item__heading">
          {{ item.heading }}
        </h3>
        <p class="the-works__item__paragraph">
          <span class="the-works__item__paragraph__inner">{{ item.paragraph }}</span>
        </p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
const data = reactive({
  items: [
    {
      heading: '複数案件での大規模サイトの構築、改修',
      paragraph: '数々の数百～数千ページ単位の大規模サイト制作に、フロントエンド担当として携わりました。',
    },
    {
      heading: 'Node.jsを用いたビルド環境周りの初期構築・カスタマイズ',
      paragraph: '数々の案件で、ビルド環境の構築や、案件都合に合わせた細かいカスタマイズを行いました。\n特にwebpack.config周りの構築・運用は数多く行いました。\n例) npm scripts、webpack、Scss、Storybook、Pug、PostCSS、ESLint、Stylelint、Babel、Cloudinaly Node.js SDK、Grunt、 etc...',
    },
    {
      heading: 'Storybook環境の構築＆活用',
      paragraph: 'Storybookを活用し、多量のコンポーネントを管理しやすく運用しました。\nバニラでの使用だけでなく、案件の条件に応じて数々のカスタマイズも実装しました。',
    },
    {
      heading: 'Vuex + Cookie / Web Storage + REST APIを活用した機能実装',
      paragraph: '複雑な状態管理が必要となる実装を複数案件で対応しました。',
    },
    {
      heading: 'ReactをベースとしたSPAサイト構築',
      paragraph: 'REST APIでデータをやり取りする、簡易版GAのようなサイトを構築しました。',
    },
    {
      heading: 'レガシーなビルド環境からモダンなビルド環境への移行',
      paragraph: 'いくつかの案件で技術移行を対応しました。結果として、表示速度の改善、業務効率化や、不具合発生率の軽減、その他多くのメリットを生み出すことができました。\n例）「Grunt.js + ES5 + etc...」 to 「webpack + Babel + ES6~ + etc...」',
    },
    {
      heading: 'Git-flowに準じたバージョン管理',
      paragraph: '複雑にリリース日が分かれるような、適切なGitフローの知識が必要とされるプロジェクトに複数携わりました。',
    },
  ],
});
</script>

<style lang="scss" scoped>
.the-works {
  &__item {
    font-family: var(--font-family-jp);

    &:not(:last-child) {
      margin-bottom: 28px;
    }

    &__heading {
      color: var(--secondary-color);
      font-weight: 400;
      font-size: 1.4rem;
      margin-bottom: 16px;
      display: flex;
      align-items: baseline;

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

    &__paragraph {
      background-color: var(--tertiary-color);
      color: var(--txt-color-white);
      border-radius: 4px;
      position: relative;

      &__inner {
        white-space: pre-wrap;
      }

      @media (min-width: 769px) {
        padding: 8px 32px;
        margin-left: 20px;
      }

      @media (max-width: 769px) {
        padding: 8px 16px;
      }

      &::before {
        content: "";
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 4px;
        background-color: var(--txt-color-white);
      }
    }
  }
}
</style>
