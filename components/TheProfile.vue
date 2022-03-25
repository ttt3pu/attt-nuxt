<template>
  <div class="the-profile">
    <v-heading-lv2>Profile</v-heading-lv2>
    <p class="the-profile__paragraph">
      2017年から東京でフロントエンドエンジニアとして働いています。<br>
      Vue / Nuxt をメインで扱っています。<br>
      Tailwind とかも最近使ってますが、なんだかんだでCSSの手書き実装が好きです。
    </p>

    <p class="the-profile__paragraph">
      出身＆在住 - 埼玉県<br>
      生年月日 - 1996.11.6<br>
      好きなもの - ゲーム 🎮 / 猫 😺 / 料理 👩‍🍳 / ビール 🍺 / etc...
    </p>

    <v-heading-lv3>Jobs</v-heading-lv3>
    <p class="the-profile__paragraph">
      2017 - 株式会社キノトロープ<br>
      2021 - メドピア株式会社
    </p>
  </div>
</template>

<style lang="scss" scoped>
.the-profile {
  @media (min-width: 769px) {
    text-align: center;
  }

  &__paragraph {
    color: var(--txt-color-white);
    font-family: var(--font-family-jp);

    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }
}
</style>
