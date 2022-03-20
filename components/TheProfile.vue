<template>
  <div class="the-profile">
    <v-heading-lv2>Profile</v-heading-lv2>

    <p class="the-profile__paragraph">
      1996年生まれ、埼玉県出身＆在住です。<br>
      2017年から東京でフロントエンドエンジニアとして働いています。<br>
      Vue.jsをメインで扱っています。<br>
      休日はゲームしたり猫と遊んだりしてます。
    </p>
  </div>
</template>

<style lang="scss" scoped>
.the-profile {
  &__paragraph {
    color: var(--txt-color-white);
    font-family: var(--font-family-jp);
  }
}
</style>
