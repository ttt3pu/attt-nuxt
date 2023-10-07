<template>
  <div class="the-profile">
    <v-heading-lv2>Profile</v-heading-lv2>
    <p class="the-profile__paragraph">
      2017年から東京でフロントエンドエンジニアとして働いています。<br />
      Nuxt (Vue) をメインで扱っています。
    </p>

    <p class="the-profile__paragraph">
      出身＆在住 - 埼玉県<br />
      生年月日 - 1996.11.6<br />
      好きなもの - ゲーム 🎮 / 猫 😺 / 料理 👩‍🍳 / お酒 🍺 / etc...
    </p>

    <v-heading-lv3>Jobs</v-heading-lv3>
    <p class="the-profile__paragraph justify-left">
      2017 - 株式会社キノトロープ<br />
      2021 - メドピア株式会社
    </p>
  </div>
</template>

<style lang="scss" scoped>
.the-profile {
  @media (width >= 769px) {
    text-align: center;
  }

  &__paragraph {
    margin: 0 auto;
    color: var(--txt-color-white);
    font-family: var(--font-family-jp);

    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }
}

.justify-left {
  @media (width >= 769px) {
    text-align-last: left;
    width: fit-content;
  }
}
</style>
