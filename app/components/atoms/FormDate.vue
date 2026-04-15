<script setup lang="ts">
import { VueDatePicker as Datepicker } from '@vuepic/vue-datepicker';

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
    <Datepicker v-model="localModelValue" :ui="{ input: 'input-class' }" />
  </div>
</template>

<style lang="scss">
@reference "tailwindcss";

.input-class {
  @apply bg-white py-2;
}
</style>
