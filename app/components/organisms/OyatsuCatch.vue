<script setup lang="ts">
import {
  defaultOyatsuCatchSave,
  loadOyatsuCatchSave,
  persistAfterRun,
} from '@/utils/oyatsu-catch-storage';
import type { OyatsuCatchSave } from '@/types/oyatsu-catch-save';

const emit = defineEmits<{
  close: [];
  /** プレイ中のみ true（親で scroll 表示制御などに使用） */
  playingChange: [playing: boolean];
}>();

const fieldRef = ref<HTMLElement | null>(null);
const fieldW = ref(320);
const fieldH = ref(400);

const {
  phase,
  score,
  lives,
  combo,
  items,
  basketCenterX,
  BASKET_WIDTH_RATIO,
  BASKET_HEIGHT_RATIO,
  BASKET_TOP_RATIO,
  startRound,
  resetToReady,
  onFieldPointerDown,
} = useOyatsuCatchGame(() => fieldRef.value);

const save = ref<OyatsuCatchSave>(defaultOyatsuCatchSave());
const showNewRecord = ref(false);

const basketW = computed(() => fieldW.value * BASKET_WIDTH_RATIO);
const basketH = computed(() => fieldH.value * BASKET_HEIGHT_RATIO);
const basketTop = computed(() => fieldH.value * BASKET_TOP_RATIO);

const reduceMotion = ref(false);

function updateFieldSize() {
  if (fieldRef.value) {
    fieldW.value = fieldRef.value.clientWidth;
    fieldH.value = fieldRef.value.clientHeight;
  }
}

onMounted(() => {
  save.value = loadOyatsuCatchSave();
  reduceMotion.value =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  nextTick(() => {
    updateFieldSize();
    basketCenterX.value = fieldW.value / 2;
  });
  window.addEventListener('resize', updateFieldSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateFieldSize);
  setBodyScrollLocked(false);
  emit('playingChange', false);
});

function setBodyScrollLocked(locked: boolean) {
  if (!import.meta.client) {
    return;
  }
  if (locked) {
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overscrollBehavior = 'none';
  } else {
    document.body.style.overflow = '';
    document.body.style.overscrollBehavior = '';
    document.documentElement.style.overscrollBehavior = '';
  }
}

watch(
  phase,
  (p) => {
    emit('playingChange', p === 'playing');
    setBodyScrollLocked(p === 'playing');
    if (p === 'gameover') {
      showNewRecord.value = score.value > save.value.highScore;
      save.value = persistAfterRun(save.value, score.value);
    }
  },
  { immediate: true },
);

function onStart() {
  showNewRecord.value = false;
  startRound();
  nextTick(() => {
    updateFieldSize();
    basketCenterX.value = fieldW.value / 2;
  });
}

function onClose() {
  resetToReady();
  emit('close');
}
</script>

<template>
  <div class="oyatsu-catch" role="region" aria-label="おやつキャッチ">
    <div class="oyatsu-catch__hud">
      <div class="oyatsu-catch__stat" aria-live="polite">
        <span class="oyatsu-catch__label">スコア</span>
        <span class="oyatsu-catch__value">{{ score }}</span>
      </div>
      <div class="oyatsu-catch__stat">
        <span class="oyatsu-catch__label">コンボ</span>
        <span class="oyatsu-catch__value">×{{ combo }}</span>
      </div>
      <div class="oyatsu-catch__stat" aria-live="polite">
        <span class="oyatsu-catch__label">ライフ</span>
        <span class="oyatsu-catch__hearts" aria-hidden="true">
          <span v-for="i in 3" :key="i" class="oyatsu-catch__heart" :class="{ 'is-off': i > lives }">♥</span>
        </span>
        <span class="sr-only">{{ lives }}</span>
      </div>
    </div>

    <div
      ref="fieldRef"
      class="oyatsu-catch__field"
      @pointerdown="onFieldPointerDown"
    >
      <template v-if="phase === 'playing'">
        <div
          v-for="it in items"
          :key="it.id"
          class="oyatsu-catch__item"
          :class="{
            'oyatsu-catch__item--good': it.kind === 'good',
            'oyatsu-catch__item--bad': it.kind === 'bad',
            'oyatsu-catch__item--still': reduceMotion,
          }"
          :style="{
            width: `${it.size}px`,
            height: `${it.size}px`,
            transform: `translate(${it.x}px, ${it.y}px)`,
          }"
        />

        <div
          class="oyatsu-catch__basket"
          :style="{
            width: `${basketW}px`,
            height: `${basketH}px`,
            top: `${basketTop}px`,
            left: `${basketCenterX - basketW / 2}px`,
          }"
        />
      </template>

      <div v-else-if="phase === 'ready'" class="oyatsu-catch__panel">
        <p class="oyatsu-catch__hint">おやつを受け皿で受けよう。苦手なものはライフが減るよ。</p>
        <p class="oyatsu-catch__meta">ハイスコア {{ save.highScore }} · 累計プレイ {{ save.totalPlays }}回</p>
        <button type="button" class="oyatsu-catch__btn oyatsu-catch__btn--primary" @click="onStart">
          スタート
        </button>
      </div>

      <div v-else-if="phase === 'gameover'" class="oyatsu-catch__panel">
        <p class="oyatsu-catch__over" aria-live="assertive">ゲームオーバー</p>
        <p class="oyatsu-catch__scoreline">スコア {{ score }}</p>
        <p v-if="showNewRecord" class="oyatsu-catch__record">ハイスコア更新！</p>
        <div class="oyatsu-catch__actions">
          <button type="button" class="oyatsu-catch__btn oyatsu-catch__btn--primary" @click="onStart">
            もう一度
          </button>
          <button type="button" class="oyatsu-catch__btn" @click="onClose">閉じる</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "~/assets/css/tailwind.css";

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

.oyatsu-catch {
  @apply relative flex flex-col flex-1 min-h-[min(52vh,420px)] min-w-0 text-white font-jp;
}

.oyatsu-catch__hud {
  @apply flex flex-wrap items-center gap-3 px-4 py-3 text-sm;
}

.oyatsu-catch__stat {
  @apply flex items-center gap-2;
}

.oyatsu-catch__label {
  @apply text-white/70;
}

.oyatsu-catch__value {
  @apply font-en tabular-nums font-medium text-primary;
}

.oyatsu-catch__hearts {
  @apply tracking-widest text-lg text-rose-400;
}

.oyatsu-catch__heart.is-off {
  @apply text-white/25;
}

/* 背景・枠は付けず、ヒーロー（title-container）のグラデがそのまま見える */
.oyatsu-catch__field {
  @apply relative flex flex-1 flex-col min-h-[200px] mx-4 mb-4 overflow-hidden;

  touch-action: none;
  user-select: none;
}

/* 全面 absolute のオーバーレイは使わず、フィールド内のフローで配置する */
.oyatsu-catch__panel {
  @apply flex flex-1 flex-col items-center justify-center gap-3 px-4 py-8 text-center;
}

.oyatsu-catch__item {
  @apply absolute left-0 top-0 rounded-md shadow-md will-change-transform;

  transition: transform 0.05s linear;
}

.oyatsu-catch__item--still {
  transition: none;
}

.oyatsu-catch__item--good {
  @apply bg-gradient-to-br from-primary to-secondary;
}

.oyatsu-catch__item--bad {
  @apply bg-gradient-to-br from-zinc-600 to-zinc-800 ring-2 ring-tertiary/80;
}

.oyatsu-catch__basket {
  @apply absolute rounded-md border-2 border-white/40 bg-white/10 z-[2];
}

.oyatsu-catch__hint {
  @apply text-sm text-white/85 max-w-sm leading-relaxed;
}

.oyatsu-catch__meta {
  @apply text-xs text-white/55;
}

.oyatsu-catch__over {
  @apply font-en text-xl text-primary;
}

.oyatsu-catch__scoreline {
  @apply text-lg;
}

.oyatsu-catch__record {
  @apply text-sm text-secondary;
}

.oyatsu-catch__actions {
  @apply flex flex-wrap gap-3 justify-center mt-2;
}

.oyatsu-catch__btn {
  @apply cursor-pointer rounded px-5 py-2 text-sm font-jp border border-white/30 bg-white/5 text-white hover:bg-white/10 transition-colors;
}

.oyatsu-catch__btn--primary {
  @apply border-primary bg-primary/20 text-primary hover:bg-primary/30;
}
</style>
