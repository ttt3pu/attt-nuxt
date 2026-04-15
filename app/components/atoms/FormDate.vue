<script setup lang="ts">
import { VueDatePicker } from '@vuepic/vue-datepicker';

const props = defineProps({
  modelValue: {
    type: Date,
    required: true,
  },
});

const emit = defineEmits<{
  (e: 'update:modelValue', val: Date): void;
}>();

const localModelValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
</script>

<template>
  <div>
    <VueDatePicker v-model="localModelValue" :ui="{ input: 'input-class' }" />
  </div>
</template>

<style lang="scss">
.input-class {
  @apply bg-white py-2;
}
</style>
