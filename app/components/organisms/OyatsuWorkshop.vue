<script setup lang="ts">
import {
  defaultOyatsuCatchSave,
  loadOyatsuCatchSave,
  recordWorkshopOpen,
} from '@/utils/oyatsu-catch-storage';
import type { OyatsuCatchSave } from '@/types/oyatsu-catch-save';
import type { OyatsuCatchCatReactionKind } from '@/types/oyatsu-catch';
import type { WorkshopChoiceId } from '@/types/oyatsu-workshop-choice';
import { WORKSHOP_ACHIEVEMENT_DEFS } from '@/types/oyatsu-workshop-achievements';

const emit = defineEmits<{
  close: [];
  playingChange: [playing: boolean];
  catReaction: [kind: OyatsuCatchCatReactionKind];
  /** 0〜100 猫のごきげん（右列マスコットと連動） */
  moodSync: [mood: number];
}>();

const save = ref<OyatsuCatchSave>(defaultOyatsuCatchSave());

const {
  treats,
  kitchenLevel,
  pantryLevel,
  deliveryLevel,
  totalTreatsProduced,
  globalProductionMult,
  mood,
  nextChoiceThreshold,
  productionRate,
  nextKitchenCost,
  nextPantryCost,
  nextDeliveryCost,
  canAffordKitchen,
  canAffordPantry,
  canAffordDelivery,
  choiceModalOpen,
  choiceOptions,
  hydrateFromSave,
  startLoop,
  stopLoop,
  flushSave,
  tryBuyKitchen,
  tryBuyPantry,
  tryBuyDelivery,
  applyChoice,
  closeChoiceModal,
} = useOyatsuIncremental(
  () => save.value,
  (next) => {
    save.value = next;
  },
);

const achievementDefs = WORKSHOP_ACHIEVEMENT_DEFS;

const treatsDisplay = computed(() =>
  treats.value < 10 ? treats.value.toFixed(1) : Math.floor(treats.value).toLocaleString('ja-JP'),
);
const rateDisplay = computed(() => productionRate.value.toFixed(2));
const totalDisplay = computed(() => Math.floor(totalTreatsProduced.value).toLocaleString('ja-JP'));
const moodDisplay = computed(() => Math.round(mood.value));
const multDisplay = computed(() => globalProductionMult.value.toFixed(2));

const achievementUnlockedCount = computed(
  () => achievementDefs.filter((d) => save.value.achievements[d.id]).length,
);

watch(
  mood,
  (m) => {
    emit('moodSync', m);
  },
  { immediate: true },
);

onMounted(() => {
  save.value = recordWorkshopOpen(loadOyatsuCatchSave());
  hydrateFromSave(save.value);
  startLoop();
  emit('playingChange', false);
});

onUnmounted(() => {
  flushSave();
  stopLoop();
  emit('playingChange', false);
  emit('moodSync', 50);
});

function onClose() {
  flushSave();
  stopLoop();
  emit('close');
}

function onBuyKitchen() {
  if (!tryBuyKitchen()) {
    return;
  }
  emit('catReaction', 'happy');
}

function onBuyPantry() {
  if (!tryBuyPantry()) {
    return;
  }
  emit('catReaction', 'happy');
}

function onBuyDelivery() {
  if (!tryBuyDelivery()) {
    return;
  }
  emit('catReaction', 'happy');
}

function onPickChoice(id: WorkshopChoiceId) {
  applyChoice(id);
  emit('catReaction', 'happy');
}

function onDeferChoice() {
  closeChoiceModal();
}
</script>

<template>
  <div class="oyatsu-workshop" role="region" aria-label="おやつ工房">
    <MoleculesOyatsuWorkshopBackdrop :production-rate="productionRate" />
    <div class="oyatsu-workshop__panel">
      <p class="oyatsu-workshop__lead">
        おやつがじわじわたまるよ。施設を育てて、ときどきの「おまけ」で伸ばそう。
      </p>

      <dl class="oyatsu-workshop__stats">
        <div class="oyatsu-workshop__row">
          <dt class="oyatsu-workshop__dt">おやつ</dt>
          <dd class="oyatsu-workshop__dd" aria-live="polite">{{ treatsDisplay }}</dd>
        </div>
        <div class="oyatsu-workshop__row">
          <dt class="oyatsu-workshop__dt">生産 / 秒</dt>
          <dd class="oyatsu-workshop__dd">{{ rateDisplay }}</dd>
        </div>
        <div class="oyatsu-workshop__row">
          <dt class="oyatsu-workshop__dt">全体倍率</dt>
          <dd class="oyatsu-workshop__dd">×{{ multDisplay }}</dd>
        </div>
        <div class="oyatsu-workshop__row">
          <dt class="oyatsu-workshop__dt">ごきげん</dt>
          <dd class="oyatsu-workshop__dd oyatsu-workshop__dd--mood">{{ moodDisplay }}%</dd>
        </div>
        <div class="oyatsu-workshop__row oyatsu-workshop__row--sub">
          <dt class="oyatsu-workshop__dt">累計生産</dt>
          <dd class="oyatsu-workshop__dd">{{ totalDisplay }}</dd>
        </div>
      </dl>

      <div class="oyatsu-workshop__facilities">
        <p class="oyatsu-workshop__facilities-title">施設</p>
        <ul class="oyatsu-workshop__facility-list">
          <li class="oyatsu-workshop__facility">
            <span class="oyatsu-workshop__fname">キッチン Lv {{ kitchenLevel }}</span>
            <button
              type="button"
              class="oyatsu-workshop__btn oyatsu-workshop__btn--primary"
              :disabled="!canAffordKitchen"
              @click="onBuyKitchen"
            >
              強化 {{ nextKitchenCost.toLocaleString('ja-JP') }} おやつ
            </button>
          </li>
          <li class="oyatsu-workshop__facility">
            <span class="oyatsu-workshop__fname">おやつ倉庫 Lv {{ pantryLevel }}</span>
            <button
              type="button"
              class="oyatsu-workshop__btn oyatsu-workshop__btn--primary"
              :disabled="!canAffordPantry"
              @click="onBuyPantry"
            >
              強化 {{ nextPantryCost.toLocaleString('ja-JP') }} おやつ
            </button>
          </li>
          <li class="oyatsu-workshop__facility">
            <span class="oyatsu-workshop__fname">お届け係 Lv {{ deliveryLevel }}</span>
            <button
              type="button"
              class="oyatsu-workshop__btn oyatsu-workshop__btn--primary"
              :disabled="!canAffordDelivery"
              @click="onBuyDelivery"
            >
              強化 {{ nextDeliveryCost.toLocaleString('ja-JP') }} おやつ
            </button>
          </li>
        </ul>
      </div>

      <p class="oyatsu-workshop__choice-hint">
        累計生産が約 {{ Math.ceil(nextChoiceThreshold).toLocaleString('ja-JP') }} に達すると、おまけの 3 択が出るよ。
      </p>

      <details class="oyatsu-workshop__achievements">
        <summary class="oyatsu-workshop__achievements-summary">
          実績 {{ achievementUnlockedCount }} / {{ achievementDefs.length }}
          <span class="oyatsu-workshop__achievements-meta">（工房を開いた回数 {{ save.workshopSessions }}）</span>
        </summary>
        <ul class="oyatsu-workshop__achievements-list">
          <li
            v-for="def in achievementDefs"
            :key="def.id"
            class="oyatsu-workshop__achievements-item"
            :class="{ 'oyatsu-workshop__achievements-item--ok': save.achievements[def.id] }"
          >
            <span class="oyatsu-workshop__achievements-mark" aria-hidden="true">{{
              save.achievements[def.id] ? '✓' : '·'
            }}</span>
            <span class="oyatsu-workshop__achievements-text">
              <span class="oyatsu-workshop__achievements-title">{{ def.title }}</span>
              <span class="oyatsu-workshop__achievements-desc">{{ def.description }}</span>
            </span>
          </li>
        </ul>
      </details>

      <div class="oyatsu-workshop__actions">
        <button type="button" class="oyatsu-workshop__btn" @click="onClose">閉じる</button>
      </div>

      <p v-if="save.highScore > 0 || save.totalPlays > 0" class="oyatsu-workshop__legacy">
        ※昔のキャッチ記録: ハイスコア {{ save.highScore }} / プレイ {{ save.totalPlays }}回
      </p>
    </div>

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
  </div>
</template>

<style scoped>
@reference "~/assets/css/tailwind.css";

.oyatsu-workshop {
  @apply relative isolate flex flex-1 flex-col min-h-[min(52vh,420px)] min-w-0 px-4 pb-4 text-white font-jp;
}

.oyatsu-workshop__panel {
  @apply relative z-10 flex flex-1 flex-col gap-3 justify-center max-w-md mx-auto w-full min-h-0 overflow-y-auto bg-transparent;
}

.oyatsu-workshop__lead {
  @apply text-sm text-white/85 leading-relaxed rounded-lg border border-white/12 bg-white/[0.07] backdrop-blur-md px-3 py-2.5;
}

.oyatsu-workshop__stats {
  @apply grid gap-2 text-sm rounded-lg border border-white/15 bg-white/[0.08] backdrop-blur-md px-4 py-3;
}

.oyatsu-workshop__row {
  @apply flex justify-between gap-4 items-baseline;
}

.oyatsu-workshop__row--sub {
  @apply text-white/70 text-xs pt-1 border-t border-white/10;
}

.oyatsu-workshop__dt {
  @apply text-white/65 shrink-0;
}

.oyatsu-workshop__dd {
  @apply font-en tabular-nums font-medium text-primary text-right;
}

.oyatsu-workshop__dd--mood {
  @apply text-secondary;
}

.oyatsu-workshop__facilities {
  @apply rounded-lg border border-white/12 bg-white/[0.08] backdrop-blur-md px-3 py-3;
}

.oyatsu-workshop__facilities-title {
  @apply text-xs text-white/55 mb-2;
}

.oyatsu-workshop__facility-list {
  @apply flex flex-col gap-2 list-none p-0 m-0;
}

.oyatsu-workshop__facility {
  @apply flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2;
}

.oyatsu-workshop__fname {
  @apply text-sm text-white/90;
}

.oyatsu-workshop__choice-hint {
  @apply text-xs text-white/50 leading-snug rounded-lg border border-white/10 bg-white/[0.06] backdrop-blur-md px-3 py-2;
}

.oyatsu-workshop__achievements {
  @apply rounded-lg border border-white/10 bg-white/[0.07] backdrop-blur-md px-3 py-2 text-sm;
}

.oyatsu-workshop__achievements-summary {
  @apply cursor-pointer font-jp text-white/85 text-sm list-none;
}

.oyatsu-workshop__achievements-meta {
  @apply text-xs text-white/45 font-normal;
}

.oyatsu-workshop__achievements-list {
  @apply mt-2 space-y-1.5 list-none p-0 m-0;
}

.oyatsu-workshop__achievements-item {
  @apply flex gap-2 text-xs text-white/45;
}

.oyatsu-workshop__achievements-item--ok {
  @apply text-white/80;
}

.oyatsu-workshop__achievements-mark {
  @apply shrink-0 w-4 text-primary font-en;
}

.oyatsu-workshop__achievements-text {
  @apply flex flex-col gap-0.5;
}

.oyatsu-workshop__achievements-title {
  @apply text-white/90;
}

.oyatsu-workshop__achievements-desc {
  @apply text-[11px] text-white/50;
}

.oyatsu-workshop__actions {
  @apply flex flex-wrap gap-3 pt-1 rounded-lg border border-white/12 bg-white/[0.06] backdrop-blur-md px-3 py-3;
}

.oyatsu-workshop__btn {
  @apply cursor-pointer rounded px-4 py-2 text-sm font-jp border border-white/30 bg-white/5 text-white hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed;
}

.oyatsu-workshop__btn--primary {
  @apply border-primary bg-primary/20 text-primary hover:bg-primary/30 shrink-0;
}

.oyatsu-workshop__legacy {
  @apply text-[11px] text-white/40 leading-snug rounded-md border border-white/8 bg-white/[0.05] backdrop-blur-sm px-2 py-1.5;
}

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
