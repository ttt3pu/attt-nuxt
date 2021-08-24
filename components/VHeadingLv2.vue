<template>
  <h2 class="v-heading-lv2">
    <span class="v-heading-lv2__txt">
      <slot />
    </span>
  </h2>
</template>

<style lang="scss" scoped>
.v-heading-lv2 {
  margin-bottom: 16px;

  &__txt {
    @include line-height-crop;

    display: block;
    font-family: var(--font-family--en);
    color: var(--primary-color);
    font-weight: 500;
    font-size: 3rem;
    // margin-bottom: 16px;
  }

  // &::after {
  //   content: "";
  //   display: block;
  //   background-color: var(--primary-color);
  //   width: 100px;
  //   height: 2px;
  // }
}
</style>
