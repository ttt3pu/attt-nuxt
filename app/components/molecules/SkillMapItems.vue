<template>
  <ul class="skill-list mb-8 font-en grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
    <li
      v-for="(item, i) in items"
      :key="i"
      class="skill-card bg-bg-500 rounded-lg p-4 border border-gray-700 hover:border-secondary transition-colors"
    >
      <div class="skill-card__header flex items-center mb-3">
        <svg
          v-if="item.icnData"
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          class="w-8 h-8 mr-3 flex-shrink-0"
          :style="`fill: #${item.icnData.hex};`"
        >
          <path :d="item.icnData.path" />
        </svg>
        <div
          v-else
          class="w-8 h-8 mr-3 flex-shrink-0 rounded bg-gray-600 flex items-center justify-center"
        >
          <span class="text-gray-400 text-xs font-bold">{{ item.heading.charAt(0) }}</span>
        </div>
        <span class="text-white text-xl font-medium">{{ item.heading }}</span>
      </div>

      <div class="skill-card__proficiency mb-3">
        <div class="flex items-center gap-1">
          <span
            v-for="level in 5"
            :key="level"
            class="w-4 h-2 rounded-sm"
            :class="level <= item.proficiency ? 'bg-secondary' : 'bg-gray-600'"
          />
        </div>
      </div>

      <!-- eslint-disable-next-line vue/no-v-html -->
      <div
        class="skill-card__description text-white font-jp text-sm leading-relaxed opacity-80"
        v-html="renderedDescriptions[i]"
      />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import type { SimpleIcon } from 'simple-icons';
import type { CustomIcon } from '~/constants/awsIcons';
import md from 'markdown-it';

type SkillIconData = SimpleIcon | CustomIcon;

const props = defineProps({
  items: {
    required: true,
    type: Array as PropType<
      {
        heading: string;
        icnData?: SkillIconData;
        proficiency: number;
        description: string;
      }[]
    >,
  },
});

// Use markdown-it directly to render descriptions without creating nested computed refs
const mdRenderer = md();

const renderedDescriptions = computed(() => {
  return props.items.map((item) => {
    return mdRenderer.render(item.description);
  });
});
</script>

<style lang="scss" scoped>
.skill-card {
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgb(0 0 0 / 30%);
  }

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

/* stylelint-disable-next-line */
::v-deep(.skill-card__description) {
  p {
    margin: 0;
  }
}
</style>
