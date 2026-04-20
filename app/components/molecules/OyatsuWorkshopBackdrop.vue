<script setup lang="ts">
import { toValue, type MaybeRefOrGetter } from 'vue';
import { randomOyatsuFishColors } from '@/utils/oyatsu-fish-colors';

const props = defineProps<{
  /** 生産 / 秒（密度・落下時間の目安に使う） */
  productionRate: MaybeRefOrGetter<number>;
}>();

const productionRateValue = computed(() => Math.max(0, toValue(props.productionRate)));

const mounted = ref(false);
const reducedMotion = ref(false);
const tabHidden = ref(false);
const isMobile = ref(false);

const maxFish = computed(() => (isMobile.value ? 12 : 24));

const fishCount = computed(() => {
  const max = maxFish.value;
  const r = productionRateValue.value;
  return Math.min(max, Math.max(6, Math.floor(6 + 6 * Math.log(1 + r))));
});

type FishInst = {
  id: string;
  fill: string;
  stroke: string;
  leftPct: number;
  delayMs: number;
  durationS: number;
  driftPx: number;
  size: number;
  /** 元 SVG は右向き想定。0〜360° でランダムに向きを変える */
  angleDeg: number;
};

const fishes = ref<FishInst[]>([]);

function makeId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** 匹ごとに SVG の一辺（px）。狭い画面は上限を抑える */
function randomFishSizePx(compact: boolean): number {
  if (compact) {
    return 18 + Math.random() * 24;
  }
  return 22 + Math.random() * 36;
}

function rebuildFish() {
  const n = fishCount.value;
  const list: FishInst[] = [];
  const rate = productionRateValue.value;
  for (let i = 0; i < n; i++) {
    const c = randomOyatsuFishColors();
    const durationBase = 15 + Math.random() * 9;
    const speedBoost = Math.min(4, Math.log(1 + rate) * 0.35);
    list.push({
      id: makeId(),
      fill: c.fill,
      stroke: c.stroke,
      leftPct: 4 + Math.random() * 88,
      delayMs: Math.random() * 15000,
      durationS: Math.max(10, durationBase - speedBoost),
      driftPx: (Math.random() - 0.5) * 72,
      size: randomFishSizePx(isMobile.value),
      angleDeg: Math.random() * 360,
    });
  }
  fishes.value = list;
}

let mqMobile: MediaQueryList | null = null;

function onVisibility() {
  tabHidden.value = document.visibilityState === 'hidden';
}

function onMqMobile(e: MediaQueryListEvent) {
  isMobile.value = e.matches;
}

onMounted(() => {
  mounted.value = true;
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  mqMobile = window.matchMedia('(max-width: 768px)');
  isMobile.value = mqMobile.matches;
  mqMobile.addEventListener('change', onMqMobile);
  tabHidden.value = document.visibilityState === 'hidden';
  document.addEventListener('visibilitychange', onVisibility);
  rebuildFish();
});

onUnmounted(() => {
  document.removeEventListener('visibilitychange', onVisibility);
  mqMobile?.removeEventListener('change', onMqMobile);
});

watch([fishCount, isMobile], () => {
  if (mounted.value) {
    rebuildFish();
  }
});
</script>

<template>
  <div
    v-if="mounted && !reducedMotion"
    class="oyatsu-workshop-backdrop"
    :class="{ 'oyatsu-workshop-backdrop--paused': tabHidden }"
    aria-hidden="true"
  >
    <div
      v-for="fish in fishes"
      :key="fish.id"
      class="oyatsu-workshop-backdrop__fish"
      :style="{
        '--left': `${fish.leftPct}%`,
        '--delay': `${fish.delayMs}ms`,
        '--dur': `${fish.durationS}s`,
        '--drift': `${fish.driftPx}px`,
      }"
    >
      <AtomsOyatsuFish
        class="oyatsu-workshop-backdrop__svg"
        :fill="fish.fill"
        :stroke="fish.stroke"
        :size="fish.size"
        :style="{ transform: `rotate(${fish.angleDeg}deg)` }"
      />
    </div>
  </div>
</template>

<style scoped>
@reference "~/assets/css/tailwind.css";

.oyatsu-workshop-backdrop {
  @apply pointer-events-none absolute inset-0 z-0 overflow-hidden;
}

.oyatsu-workshop-backdrop--paused .oyatsu-workshop-backdrop__fish {
  animation-play-state: paused;
}

.oyatsu-workshop-backdrop__fish {
  position: absolute;
  top: -15%;
  left: var(--left);
  opacity: 0.32;
  animation: oyatsu-fish-fall var(--dur) linear var(--delay) infinite;
}

.oyatsu-workshop-backdrop__svg {
  display: block;
  transform-origin: center center;
}

@keyframes oyatsu-fish-fall {
  0% {
    transform: translateX(-50%) translate3d(0, -18vh, 0);
  }
  100% {
    transform: translateX(-50%) translate3d(var(--drift), 120vh, 0);
  }
}
</style>
