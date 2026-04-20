import type { OyatsuCatchSave, OyatsuIncrementalSave } from '~/types/oyatsu-catch-save';
import type { WorkshopChoiceDef, WorkshopChoiceId } from '~/types/oyatsu-workshop-choice';
import { WORKSHOP_CHOICE_POOL } from '~/types/oyatsu-workshop-choice';
import { defaultIncrementalSave, persistIncrementalSlice } from '@/utils/oyatsu-catch-storage';

const BASE_KITCHEN = 0.12;
const PER_KITCHEN = 0.1;
const PER_PANTRY = 0.055;
const PER_DELIVERY_MULT = 0.065;

const COST_K_BASE = 14;
const COST_K_GROW = 1.42;
const COST_P_BASE = 22;
const COST_P_GROW = 1.38;
const COST_D_BASE = 38;
const COST_D_GROW = 1.34;

/** 3 択を消化したあと、次の閾値までの累計生産の目安 */
const CHOICE_GAP_TOTAL = 115;

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function shufflePickThree(): WorkshopChoiceDef[] {
  const pool = [...WORKSHOP_CHOICE_POOL];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j]!, pool[i]!];
  }
  return pool.slice(0, 3);
}

export function costForKitchen(kitchenLevel: number): number {
  return Math.floor(COST_K_BASE * COST_K_GROW ** kitchenLevel);
}

export function costForPantry(pantryLevel: number): number {
  return Math.floor(COST_P_BASE * COST_P_GROW ** pantryLevel);
}

export function costForDelivery(deliveryLevel: number): number {
  return Math.floor(COST_D_BASE * COST_D_GROW ** deliveryLevel);
}

function baseProductionPerSecond(
  kitchenLevel: number,
  pantryLevel: number,
  deliveryLevel: number,
): number {
  const base = BASE_KITCHEN + kitchenLevel * PER_KITCHEN + pantryLevel * PER_PANTRY;
  const deliveryMult = 1 + deliveryLevel * PER_DELIVERY_MULT;
  return base * deliveryMult;
}

export function useOyatsuIncremental(
  getSave: () => OyatsuCatchSave,
  onPersist: (next: OyatsuCatchSave) => void,
) {
  const treats = ref(0);
  const kitchenLevel = ref(0);
  const pantryLevel = ref(0);
  const deliveryLevel = ref(0);
  const totalTreatsProduced = ref(0);
  const globalProductionMult = ref(1);
  const mood = ref(52);
  const nextChoiceThreshold = ref(42);

  const choiceModalOpen = ref(false);
  const choiceOptions = ref<WorkshopChoiceDef[]>([]);

  let rafId = 0;
  let lastTs = 0;
  let saveTimer: ReturnType<typeof setTimeout> | null = null;

  function snapshotIncremental(): OyatsuIncrementalSave {
    return {
      treats: treats.value,
      kitchenLevel: kitchenLevel.value,
      pantryLevel: pantryLevel.value,
      deliveryLevel: deliveryLevel.value,
      totalTreatsProduced: totalTreatsProduced.value,
      globalProductionMult: globalProductionMult.value,
      mood: mood.value,
      nextChoiceThreshold: nextChoiceThreshold.value,
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
    pantryLevel.value = inc.pantryLevel;
    deliveryLevel.value = inc.deliveryLevel;
    totalTreatsProduced.value = inc.totalTreatsProduced;
    globalProductionMult.value = inc.globalProductionMult;
    mood.value = inc.mood;
    nextChoiceThreshold.value = inc.nextChoiceThreshold;
  }

  function hydrateFromSave(save: OyatsuCatchSave) {
    applyLoaded(save.incremental ?? defaultIncrementalSave());
  }

  const productionRate = computed(() => {
    const r = baseProductionPerSecond(kitchenLevel.value, pantryLevel.value, deliveryLevel.value);
    return r * globalProductionMult.value;
  });

  const nextKitchenCost = computed(() => costForKitchen(kitchenLevel.value));
  const nextPantryCost = computed(() => costForPantry(pantryLevel.value));
  const nextDeliveryCost = computed(() => costForDelivery(deliveryLevel.value));

  const canAffordKitchen = computed(() => treats.value >= nextKitchenCost.value);
  const canAffordPantry = computed(() => treats.value >= nextPantryCost.value);
  const canAffordDelivery = computed(() => treats.value >= nextDeliveryCost.value);

  function maybeOpenChoiceModal() {
    if (choiceModalOpen.value) {
      return;
    }
    if (totalTreatsProduced.value < nextChoiceThreshold.value) {
      return;
    }
    choiceOptions.value = shufflePickThree();
    choiceModalOpen.value = true;
  }

  function tick(ts: number) {
    if (lastTs === 0) {
      lastTs = ts;
    }
    const dt = Math.min(0.25, (ts - lastTs) / 1000);
    lastTs = ts;

    const rate = productionRate.value;
    const delta = rate * dt;
    treats.value += delta;
    totalTreatsProduced.value += delta;

    mood.value = clamp(
      mood.value + delta * 0.12 - 0.18 * dt,
      0,
      100,
    );

    maybeOpenChoiceModal();

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
    const cost = costForKitchen(kitchenLevel.value);
    if (treats.value < cost) {
      return false;
    }
    treats.value -= cost;
    kitchenLevel.value += 1;
    mood.value = clamp(mood.value + 4, 0, 100);
    scheduleSave();
    return true;
  }

  function tryBuyPantry(): boolean {
    const cost = costForPantry(pantryLevel.value);
    if (treats.value < cost) {
      return false;
    }
    treats.value -= cost;
    pantryLevel.value += 1;
    mood.value = clamp(mood.value + 3, 0, 100);
    scheduleSave();
    return true;
  }

  function tryBuyDelivery(): boolean {
    const cost = costForDelivery(deliveryLevel.value);
    if (treats.value < cost) {
      return false;
    }
    treats.value -= cost;
    deliveryLevel.value += 1;
    mood.value = clamp(mood.value + 3, 0, 100);
    scheduleSave();
    return true;
  }

  function applyChoice(id: WorkshopChoiceId) {
    switch (id) {
      case 'treat_rain':
        treats.value += 45;
        break;
      case 'recipe_note':
        globalProductionMult.value *= 1.06;
        break;
      case 'pantry_kit':
        pantryLevel.value += 1;
        break;
      case 'delivery_rush':
        deliveryLevel.value += 1;
        break;
      case 'mood_song':
        mood.value = clamp(mood.value + 30, 0, 100);
        break;
      default:
        break;
    }
    nextChoiceThreshold.value = totalTreatsProduced.value + CHOICE_GAP_TOTAL;
    choiceModalOpen.value = false;
    choiceOptions.value = [];
    scheduleSave();
  }

  function closeChoiceModal() {
    choiceModalOpen.value = false;
    choiceOptions.value = [];
    nextChoiceThreshold.value = totalTreatsProduced.value + CHOICE_GAP_TOTAL;
    scheduleSave();
  }

  onUnmounted(() => {
    flushSave();
    stopLoop();
  });

  return {
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
    costForKitchen,
    costForPantry,
    costForDelivery,
  };
}
