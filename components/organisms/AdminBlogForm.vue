<template>
  <form @submit.prevent="emit('submit')">
    <AtomsContentsBox :color="2">
      <v-heading-lv2>{{ heading }}</v-heading-lv2>
      <div class="sticky right-0 top-4 flex justify-end -mt-16 gap-6">
        <button
          class="bg-white px-4 py-1 rounded shadow-md font-en w-24 flex justify-center border border-gray-950"
          type="button"
          @click="isActiveModal = true"
        >
          Preview
        </button>
        <button
          class="bg-primary px-4 py-1 rounded shadow-md font-en w-24 flex justify-center border border-gray-950"
          type="submit"
        >
          Save
        </button>
      </div>

      <div class="mb-4">
        <v-heading-lv3>Title</v-heading-lv3>
        <AtomsFormInput
          required="true"
          :model-value="modelValue.title"
          @update:model-value="updateModelValue('title', $event)"
        />
      </div>

      <div class="mb-4">
        <v-heading-lv3>Published at</v-heading-lv3>
        <AtomsFormDate
          required="true"
          :model-value="modelValue.published_at"
          @update:model-value="updateModelValue('published_at', $event)"
        />
      </div>

      <div class="mb-4">
        <v-heading-lv3>Content</v-heading-lv3>
        <AtomsFormTextArea
          required="true"
          :model-value="modelValue.content"
          @update:model-value="updateModelValue('content', $event)"
        />
      </div>
    </AtomsContentsBox>

    <div v-if="isActiveModal" class="z-10 fixed top-0 left-0 h-screen bg-black bg-opacity-50 w-full">
      <button class="w-full h-full opacity-0" @click="isActiveModal = false" />
      <div
        class="absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 overflow-y-scroll"
      >
        <OrganismsBlogPost
          class="min-h-full"
          :title="modelValue.title"
          :content="modelValue.content"
          :published-at="modelValue.published_at"
        />
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
const isActiveModal = ref(false);

type ModelValue = {
  title: string;
  published_at: Date;
  content: string;
};

const props = defineProps({
  heading: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Object as PropType<ModelValue>,
    required: true,
  },
});

const emit = defineEmits<{
  (e: 'update:modelValue', val: ModelValue): void;
  (e: 'submit'): void;
}>();

function updateModelValue(key: keyof ModelValue, val: ModelValue[typeof key]) {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: val,
  });
}
</script>
