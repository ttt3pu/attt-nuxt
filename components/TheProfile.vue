<template>
  <div class="the-profile">
    <v-heading-lv2>Profile</v-heading-lv2>

    <p class="the-profile__paragraph" v-text="$t('profile')" />
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
    white-space: pre-wrap;
  }
}
</style>
