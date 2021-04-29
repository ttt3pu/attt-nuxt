<template>
  <h4 class="v-heading-lv4">
    <svg
      v-if="$props.icnPath"
      class="v-heading-lv4__icn"
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path :d="$props.icnPath" />
    </svg>

    <span><slot /></span>
  </h4>
</template>

<script>
export default {
  props: {
    icnPath: {
      type: String,
      default: null,
    },
  }
}
</script>

<style lang="scss" scoped>
.v-heading-lv4 {
  font-family: var(--font-family--en);
  color: var(--txt-color-white);
  font-weight: 400;
  font-size: 1.4rem;
  margin-bottom: 8px;
  display: flex;
  align-items: baseline;

  &__icn {
    fill: currentColor;
    width: 24px;
    height: 24px;
    margin-right: 8px;
    position: relative;
    top: 3px;
  }
}
</style>
