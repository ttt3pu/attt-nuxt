<template>
  <div class="the-profile">
    <v-heading-lv2>Profile</v-heading-lv2>
    <p>
      2017年から東京でフロントエンドエンジニアとして働いています。<br />
      Nuxt (Vue) をメインで扱っています。
    </p>

    <p>
      出身＆在住 - 埼玉県<br />
      生年月日 - 1996.11.6<br />
      好きなもの - ゲーム 🎮 / 猫 😺 / 料理 👩‍🍳 / お酒 🍺 / etc...
    </p>

    <v-heading-lv3>Jobs</v-heading-lv3>
    <p class="justify-left">
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
}

p {
  @apply mx-auto text-white font-jp [&:not(:last-child)]:mb-4;
}

.justify-left {
  @media (width >= 769px) {
    text-align-last: left;
    width: fit-content;
  }
}
</style>
