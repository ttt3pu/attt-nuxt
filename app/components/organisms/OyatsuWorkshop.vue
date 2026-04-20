<script setup lang="ts">
import {
  defaultOyatsuCatchSave,
  loadOyatsuCatchSave,
} from '@/utils/oyatsu-catch-storage';
import type { OyatsuCatchSave } from '@/types/oyatsu-catch-save';
import type { OyatsuCatchCatReactionKind } from '@/types/oyatsu-catch';

const emit = defineEmits<{
  close: [];
  /** インクリではスクロールを隠さない想定で false を推奨 */
  playingChange: [playing: boolean];
  catReaction: [kind: OyatsuCatchCatReactionKind];
}>();

const save = ref<OyatsuCatchSave>(defaultOyatsuCatchSave());

const {
  treats,
  kitchenLevel,
  totalTreatsProduced,
  productionRate,
  nextKitchenCost,
  canAffordKitchen,
  hydrateFromSave,
  startLoop,
  stopLoop,
  flushSave,
  tryBuyKitchen,
} = useOyatsuIncremental(
  () => save.value,
  (next) => {
    save.value = next;
  },
);

const treatsDisplay = computed(() => Math.floor(treats.value).toLocaleString('ja-JP'));
const rateDisplay = computed(() => productionRate.value.toFixed(2));
const totalDisplay = computed(() => Math.floor(totalTreatsProduced.value).toLocaleString('ja-JP'));

onMounted(() => {
  save.value = loadOyatsuCatchSave();
  hydrateFromSave(save.value);
  startLoop();
  emit('playingChange', false);
});

onUnmounted(() => {
  flushSave();
  stopLoop();
  emit('playingChange', false);
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
</script>

<template>
  <div class="oyatsu-workshop" role="region" aria-label="おやつ工房">
    <div class="oyatsu-workshop__panel">
      <p class="oyatsu-workshop__lead">
        おやつがじわじわたまる。キッチを強化すると生産が早くなるよ。
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
          <dt class="oyatsu-workshop__dt">キッチ Lv</dt>
          <dd class="oyatsu-workshop__dd">{{ kitchenLevel }}</dd>
        </div>
        <div class="oyatsu-workshop__row oyatsu-workshop__row--sub">
          <dt class="oyatsu-workshop__dt">累計生産</dt>
          <dd class="oyatsu-workshop__dd">{{ totalDisplay }}</dd>
        </div>
      </dl>

      <div class="oyatsu-workshop__actions">
        <button
          type="button"
          class="oyatsu-workshop__btn oyatsu-workshop__btn--primary"
          :disabled="!canAffordKitchen"
          @click="onBuyKitchen"
        >
          キッチを強化（{{ nextKitchenCost.toLocaleString('ja-JP') }} おやつ）
        </button>
        <button type="button" class="oyatsu-workshop__btn" @click="onClose">閉じる</button>
      </div>

      <p v-if="save.highScore > 0 || save.totalPlays > 0" class="oyatsu-workshop__legacy">
        ※昔のキャッチ記録: ハイスコア {{ save.highScore }} / プレイ {{ save.totalPlays }}回
      </p>
    </div>
  </div>
</template>

<style scoped>
@reference "~/assets/css/tailwind.css";

.oyatsu-workshop {
  @apply flex flex-1 flex-col min-h-[min(52vh,420px)] min-w-0 px-4 pb-4 text-white font-jp;
}

.oyatsu-workshop__panel {
  @apply flex flex-1 flex-col gap-4 justify-center max-w-md mx-auto w-full;
}

.oyatsu-workshop__lead {
  @apply text-sm text-white/85 leading-relaxed;
}

.oyatsu-workshop__stats {
  @apply grid gap-2 text-sm rounded-lg border border-white/15 bg-white/5 px-4 py-3;
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

.oyatsu-workshop__actions {
  @apply flex flex-col sm:flex-row flex-wrap gap-3;
}

.oyatsu-workshop__btn {
  @apply cursor-pointer rounded px-5 py-2.5 text-sm font-jp border border-white/30 bg-white/5 text-white hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed;
}

.oyatsu-workshop__btn--primary {
  @apply border-primary bg-primary/20 text-primary hover:bg-primary/30;
}

.oyatsu-workshop__legacy {
  @apply text-[11px] text-white/40 leading-snug;
}
</style>
