<template>
  <div class="the-profile">
    <v-heading-lv2>Profile</v-heading-lv2>

    <p class="the-profile__paragraph">
      1996年生まれ、埼玉県出身＆在住です。<br>
      2017年から東京でフロントエンドエンジニアとして働いています。<br>
      Vue.jsをメインで扱っています。<br>
      「back-of-the-front-end」的な箇所を担当することが多く、機能面的な実装が得意です。<br>
      休日はゲームしたり猫と遊んだりしてます。
    </p>
  </div>
</template>

<style lang="scss" scoped>
.the-profile {
  &__paragraph {
    // background-color: #e2f1ff;
    // padding: 20px;
    // border-radius: 5px;
    // box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
    color: var(--txt-color-white);
    font-family: var(--font-family--jp);
  }
}
</style>
