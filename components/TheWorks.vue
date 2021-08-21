<template>
  <div class="the-works">
    <v-heading-lv2>Works</v-heading-lv2>

    <ul>
      <li
        class="the-works__item"
        v-for="item in data.items"
        :key="item.heading"
      >
        <h3 class="the-works__item__heading">{{ item.heading }}</h3>
        <p class="the-works__item__paragraph">{{ item.paragraph }}</p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, useContext } from "@nuxtjs/composition-api";

export default defineComponent({
  setup() {
    const data = reactive({
      items:  [
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
          paragraph: 'Storybookを活用し、多量のコンポーネントを管理しやすく運用しました。\nまた、Story内でVue + Pugを活用できるようにするなど、諸々のカスタマイズを実装しました。',
        },
        {
          heading: 'Vuex + Cookie / Web Storage + REST APIを活用した機能実装',
          paragraph: 'ユーザーごとのお気に入り機能など、サイトの状態を管理するような機能を複数案件で実装しました。',
        },
        {
          heading: 'ReactをベースとしたSPAサイト構築',
          paragraph: 'REST APIでデータをやり取りするような実装の、簡易版GAのようなサイトを構築しました。',
        },
        {
          heading: 'レガシーなビルド環境からモダンなビルド環境への移行',
          paragraph: '古めの技術で運用されていた案件を、運用しやすくするために、モダンなビルド環境へ移行を行いました。\n例）「Grunt.js + ES5 + etc...」 to 「webpack + Babel + ES6~ + etc...」',
        },
        {
          heading: 'Git-flowに準じたバージョン管理',
          paragraph: '複雑にリリース日が分かれるようなプロジェクトに携わり、細かくブランチを分けて管理、対応しました。',
        },
      ],
    });

    return {
      data,
    };
  },
});
</script>

<style lang="scss" scoped>
.the-works {
  &__item {
    font-family: var(--font-family--jp);

    &:not(:last-child) {
      margin-bottom: 24px;
    }

    &__heading {
      color: var(--secondary-color);
      font-weight: 400;
      font-size: 1.4rem;
      margin-bottom: 8px;
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
      padding: 5px 10px;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
      border-radius: 4px;
      padding-left: 16px;
      position: relative;
      white-space: pre-wrap;

      @media (min-width: 769px) {
        margin-left: 20px;
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
