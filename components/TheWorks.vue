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
    const { i18n } = useContext();

    const data = reactive({
      items: i18n.t('works'),
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
