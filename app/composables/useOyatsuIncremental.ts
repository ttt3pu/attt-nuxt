import type { OyatsuCatchSave, OyatsuIncrementalSave } from '~/types/oyatsu-catch-save';
import { defaultIncrementalSave, persistIncrementalSlice } from '@/utils/oyatsu-catch-storage';

/** 秒あたりの基礎生産（キッチレベル 0 のとき） */
const BASE_PRODUCTION = 0.12;
/** レベルごとの生産ボーナス係数 */
const PRODUCTION_PER_LEVEL = 0.1;
/** 次のレベル費用の底 */
const COST_BASE = 14;
/** 費用の指数（インクリ感を出すため緩め） */
const COST_GROWTH = 1.42;

function productionPerSecond(kitchenLevel: number): number {
  return BASE_PRODUCTION + kitchenLevel * PRODUCTION_PER_LEVEL;
}

export function costForNextKitchen(kitchenLevel: number): number {
  return Math.floor(COST_BASE * COST_GROWTH ** kitchenLevel);
}

export function useOyatsuIncremental(
  getSave: () => OyatsuCatchSave,
  onPersist: (next: OyatsuCatchSave) => void,
) {
  const treats = ref(0);
  const kitchenLevel = ref(0);
  const totalTreatsProduced = ref(0);

  let rafId = 0;
  let lastTs = 0;
  let saveTimer: ReturnType<typeof setTimeout> | null = null;

  function snapshotIncremental(): OyatsuIncrementalSave {
    return {
      treats: treats.value,
      kitchenLevel: kitchenLevel.value,
      totalTreatsProduced: totalTreatsProduced.value,
    };
  }

  function scheduleSave() {
    if (!import.meta.client) {
      return;
    }
    if (saveTimer !== null) {
      clearTimeout(saveTimer);
    }
    saveTimer = setTimeout(() => {
      saveTimer = null;
      const prev = getSave();
      const next = persistIncrementalSlice(prev, snapshotIncremental());
      onPersist(next);
    }, 400);
  }

  function applyLoaded(inc: OyatsuIncrementalSave) {
    treats.value = inc.treats;
    kitchenLevel.value = inc.kitchenLevel;
    totalTreatsProduced.value = inc.totalTreatsProduced;
  }

  function hydrateFromSave(save: OyatsuCatchSave) {
    applyLoaded(save.incremental ?? defaultIncrementalSave());
  }

  function tick(ts: number) {
    if (lastTs === 0) {
      lastTs = ts;
    }
    const dt = Math.min(0.25, (ts - lastTs) / 1000);
    lastTs = ts;

    const rate = productionPerSecond(kitchenLevel.value);
    const delta = rate * dt;
    treats.value += delta;
    totalTreatsProduced.value += delta;

    rafId = requestAnimationFrame(tick);
    scheduleSave();
  }

  function startLoop() {
    stopLoop();
    lastTs = 0;
    rafId = requestAnimationFrame(tick);
  }

  function stopLoop() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
    lastTs = 0;
    if (saveTimer !== null) {
      clearTimeout(saveTimer);
      saveTimer = null;
    }
  }

  function flushSave() {
    if (!import.meta.client) {
      return;
    }
    if (saveTimer !== null) {
      clearTimeout(saveTimer);
      saveTimer = null;
    }
    const prev = getSave();
    const next = persistIncrementalSlice(prev, snapshotIncremental());
    onPersist(next);
  }

  function tryBuyKitchen(): boolean {
    const cost = costForNextKitchen(kitchenLevel.value);
    if (treats.value < cost) {
      return false;
    }
    treats.value -= cost;
    kitchenLevel.value += 1;
    scheduleSave();
    return true;
  }

  const productionRate = computed(() => productionPerSecond(kitchenLevel.value));
  const nextKitchenCost = computed(() => costForNextKitchen(kitchenLevel.value));
  const canAffordKitchen = computed(() => treats.value >= nextKitchenCost.value);

  onUnmounted(() => {
    flushSave();
    stopLoop();
  });

  return {
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
    costForNextKitchen,
    productionPerSecond,
  };
}
