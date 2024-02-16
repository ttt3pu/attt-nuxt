<template>
  <input v-model="localModelValue" type="text" class="w-full px-4 py-2 bg-white rounded" />
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
});

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void;
}>();

const localModelValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
</script>
