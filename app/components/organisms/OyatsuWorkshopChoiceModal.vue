<script setup lang="ts">
import { oyatsuWorkshopRuntimeKey } from '@/composables/useOyatsuWorkshopRuntime';
import type { OyatsuCatchCatReactionKind } from '@/types/oyatsu-catch';
import type { WorkshopChoiceId } from '@/types/oyatsu-workshop-choice';

const emit = defineEmits<{
  catReaction: [kind: OyatsuCatchCatReactionKind];
}>();

const ws = inject(oyatsuWorkshopRuntimeKey);
if (!ws) {
  throw new Error('OyatsuWorkshopChoiceModal: oyatsuWorkshopRuntimeKey missing');
}

const { choiceModalOpen, choiceOptions, applyChoice, closeChoiceModal } = ws;

function onPickChoice(id: WorkshopChoiceId) {
  applyChoice(id);
  emit('catReaction', 'happy');
}

function onDeferChoice() {
  closeChoiceModal();
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="choiceModalOpen"
      class="oyatsu-workshop__choice-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="oyatsu-choice-title"
    >
      <div class="oyatsu-workshop__choice-card">
        <h2 id="oyatsu-choice-title" class="oyatsu-workshop__choice-title">おまけを選ぼう</h2>
        <p class="oyatsu-workshop__choice-lead">どれか 1 つだけ。猫のごきげんにも効くよ。</p>
        <ul class="oyatsu-workshop__choice-list">
          <li v-for="opt in choiceOptions" :key="opt.id">
            <button type="button" class="oyatsu-workshop__choice-btn" @click="onPickChoice(opt.id)">
              <span class="oyatsu-workshop__choice-label">{{ opt.label }}</span>
              <span class="oyatsu-workshop__choice-desc">{{ opt.description }}</span>
            </button>
          </li>
        </ul>
        <button type="button" class="oyatsu-workshop__choice-skip" @click="onDeferChoice">
          あとで
        </button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
@reference "~/assets/css/tailwind.css";

.oyatsu-workshop__choice-backdrop {
  @apply fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/55 backdrop-blur-[2px];
}

.oyatsu-workshop__choice-card {
  @apply w-full max-w-sm rounded-xl border border-white/20 bg-zinc-900/95 px-5 py-5 shadow-xl text-white;
}

.oyatsu-workshop__choice-title {
  @apply font-jp text-lg font-medium text-primary mb-1;
}

.oyatsu-workshop__choice-lead {
  @apply text-xs text-white/65 mb-4;
}

.oyatsu-workshop__choice-list {
  @apply list-none p-0 m-0 flex flex-col gap-2;
}

.oyatsu-workshop__choice-btn {
  @apply w-full text-left rounded-lg border border-white/15 bg-white/5 px-3 py-3 hover:bg-white/10 transition-colors;
}

.oyatsu-workshop__choice-label {
  @apply block font-jp text-sm text-white font-medium;
}

.oyatsu-workshop__choice-desc {
  @apply block text-xs text-white/60 mt-0.5;
}

.oyatsu-workshop__choice-skip {
  @apply mt-4 w-full text-center text-xs text-white/45 hover:text-white/70 py-2;
}
</style>
