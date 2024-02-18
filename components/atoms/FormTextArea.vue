<template>
  <textarea v-model="localModelValue" class="w-full px-4 py-2 h-96 bg-white rounded" />
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
