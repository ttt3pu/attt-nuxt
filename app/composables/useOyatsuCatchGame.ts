import type { OyatsuCatchGameHooks, OyatsuCatchItem, OyatsuCatchPhase } from '~/types/oyatsu-catch';

const INITIAL_LIVES = 3;
/** フィールドの短辺に対する半分の基準（当たり判定・見た目の基準） */
const CARRIER_HALF_BASE_RATIO = 0.052;
/** M1 固定パワー: Lv1 到達後、当たり判定を広げる（実装しやすい強化） */
const POWER_HITBOX_WIDEN = 1.32;
const ITEM_SIZE_RATIO = 0.09;
const COMBO_MAX = 5;
const BASE_SCORE = 10;
/** ラン内 Lv1 までに必要な XP（M1 は Lv1 のみ） */
const XP_FOR_LEVEL_1 = 80;

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function useOyatsuCatchGame(
  getFieldEl: () => HTMLElement | null,
  hooks?: OyatsuCatchGameHooks,
) {
  const phase = ref<OyatsuCatchPhase>('ready');
  const score = ref(0);
  const lives = ref(INITIAL_LIVES);
  const combo = ref(1);
  const items = shallowRef<OyatsuCatchItem[]>([]);
  /** 運搬側スプライト中心 X（フィールド左端基準 px） */
  const carrierCenterX = ref(0);
  /** 運搬側スプライト中心 Y（フィールド上端基準 px） */
  const carrierCenterY = ref(0);
  /** 0 のとき未昇格、1 で Lv1（M1 はここまで） */
  const playerLevel = ref(0);
  /** Lv1 未満のときのみ加算 */
  const xp = ref(0);
  /** 0〜1、ラン中のみ（永続しない） */
  const mood01 = ref(0.5);
  /** このプレイで到達した最大コンボ倍率（保存用） */
  const runPeakCombo = ref(1);

  let itemId = 0;
  let rafId = 0;
  let lastTime = 0;
  let spawnAccumulator = 0;
  let difficulty = 0;
  let elapsedPlaying = 0;

  const hitboxWidenMult = computed(() => (playerLevel.value >= 1 ? POWER_HITBOX_WIDEN : 1));

  function fieldSize() {
    const el = getFieldEl();
    if (!el) {
      return { w: 320, h: 400 };
    }
    return { w: el.clientWidth, h: el.clientHeight };
  }

  /** 当たり判定用の正方形の半辺長（px） */
  function carrierHalfPx() {
    const { w, h } = fieldSize();
    const m = Math.min(w, h);
    return m * CARRIER_HALF_BASE_RATIO * hitboxWidenMult.value;
  }

  function spawnIntervalSec() {
    return Math.max(0.35, 1.05 - difficulty * 0.04);
  }

  function badChance() {
    return Math.min(0.4, 0.1 + score.value * 0.0012 + difficulty * 0.015);
  }

  function spawnItem() {
    const { w, h } = fieldSize();
    if (w < 16 || h < 16) {
      return;
    }
    const size = Math.max(24, w * ITEM_SIZE_RATIO);
    const x = Math.random() * (w - size);
    const kind = Math.random() < badChance() ? 'bad' : 'good';
    const vy = 160 + Math.random() * 120 + difficulty * 10;
    items.value = [
      ...items.value,
      {
        id: ++itemId,
        x,
        y: -size,
        kind,
        vy,
        size,
      },
    ];
  }

  function rectsOverlap(
    ax: number,
    ay: number,
    aw: number,
    ah: number,
    bx: number,
    by: number,
    bw: number,
    bh: number,
  ) {
    return ax + aw > bx && ax < bx + bw && ay + ah > by && ay < by + bh;
  }

  function applyMoodGood(comboBefore: number, scoreAfter: number) {
    const gain =
      0.042 + comboBefore * 0.022 + Math.min(0.07, scoreAfter * 0.00012);
    mood01.value = clamp(mood01.value + gain, 0, 1);
  }

  function applyMoodBad() {
    mood01.value = clamp(mood01.value - 0.17, 0, 1);
  }

  function tick(now: number) {
    if (phase.value !== 'playing') {
      return;
    }
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;
    elapsedPlaying += dt;

    const { h } = fieldSize();
    const half = carrierHalfPx();
    const cx = carrierCenterX.value;
    const cy = carrierCenterY.value;
    const left = cx - half;
    const top = cy - half;
    const sizeBox = half * 2;

    difficulty = Math.min(18, elapsedPlaying * 0.12 + score.value * 0.02);

    spawnAccumulator += dt;
    const interval = spawnIntervalSec();
    while (spawnAccumulator >= interval) {
      spawnAccumulator -= interval;
      spawnItem();
    }

    const nextItems: OyatsuCatchItem[] = [];
    let nextLives = lives.value;
    let nextScore = score.value;
    let nextCombo = combo.value;
    let nextXp = xp.value;
    let nextLevel = playerLevel.value;
    let gameOver = false;

    for (const it of items.value) {
      const ny = it.y + it.vy * dt;
      const size = it.size;
      const caught = rectsOverlap(it.x, ny, size, size, left, top, sizeBox, sizeBox);

      if (caught) {
        if (it.kind === 'good') {
          const comboForScore = nextCombo;
          nextScore += BASE_SCORE * comboForScore;
          nextCombo = Math.min(COMBO_MAX, nextCombo + 1);
          applyMoodGood(comboForScore, nextScore);
          if (nextLevel === 0) {
            nextXp += 10 + comboForScore * 3;
            if (nextXp >= XP_FOR_LEVEL_1) {
              nextLevel = 1;
            }
          }
          hooks?.onGoodCatch?.();
        } else {
          nextCombo = 1;
          nextLives -= 1;
          applyMoodBad();
          hooks?.onBadCatch?.();
          if (nextLives <= 0) {
            gameOver = true;
          }
        }
        continue;
      }

      if (ny > h + size) {
        if (it.kind === 'good') {
          nextCombo = 1;
        }
        continue;
      }

      nextItems.push({ ...it, y: ny });
    }

    items.value = nextItems;
    score.value = nextScore;
    lives.value = nextLives;
    combo.value = nextCombo;
    xp.value = nextXp;
    playerLevel.value = nextLevel;
    runPeakCombo.value = Math.max(runPeakCombo.value, nextCombo);

    if (gameOver) {
      phase.value = 'gameover';
      items.value = [];
      cancelAnimationFrame(rafId);
      rafId = 0;
      detachPointer?.();
      detachPointer = null;
      return;
    }

    rafId = requestAnimationFrame(tick);
  }

  function syncCarrierFromPointer(clientX: number, clientY: number) {
    const el = getFieldEl();
    if (!el) {
      return;
    }
    const rect = el.getBoundingClientRect();
    const { w, h } = fieldSize();
    const half = carrierHalfPx();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    carrierCenterX.value = clamp(x, half, w - half);
    carrierCenterY.value = clamp(y, half, h - half);
  }

  function onPlayingPointer(ev: PointerEvent) {
    if (phase.value !== 'playing') {
      return;
    }
    ev.preventDefault();
    syncCarrierFromPointer(ev.clientX, ev.clientY);
  }

  let detachPointer: (() => void) | null = null;

  function attachGlobalPointer() {
    detachPointer?.();
    const move = (e: PointerEvent) => onPlayingPointer(e);
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      detachPointer = null;
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    detachPointer = up;
  }

  function onFieldPointerDown(ev: PointerEvent) {
    if (phase.value !== 'playing') {
      return;
    }
    (ev.currentTarget as HTMLElement).setPointerCapture?.(ev.pointerId);
    syncCarrierFromPointer(ev.clientX, ev.clientY);
    attachGlobalPointer();
  }

  function startRound() {
    const { w, h } = fieldSize();
    phase.value = 'playing';
    score.value = 0;
    lives.value = INITIAL_LIVES;
    combo.value = 1;
    items.value = [];
    itemId = 0;
    spawnAccumulator = 0;
    difficulty = 0;
    elapsedPlaying = 0;
    xp.value = 0;
    playerLevel.value = 0;
    mood01.value = 0.5;
    runPeakCombo.value = 1;
    carrierCenterX.value = w / 2;
    carrierCenterY.value = h * 0.58;
    lastTime = performance.now();
    if (rafId) {
      cancelAnimationFrame(rafId);
    }
    rafId = requestAnimationFrame(tick);
  }

  function stopLoop() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
    detachPointer?.();
    detachPointer = null;
  }

  function resetToReady() {
    stopLoop();
    phase.value = 'ready';
    items.value = [];
  }

  onUnmounted(() => {
    stopLoop();
  });

  const xpToLevel1 = XP_FOR_LEVEL_1;

  const xpBarRatio = computed(() =>
    playerLevel.value >= 1 ? 1 : clamp(xp.value / xpToLevel1, 0, 1),
  );

  return {
    phase,
    score,
    lives,
    combo,
    items,
    carrierCenterX,
    carrierCenterY,
    playerLevel,
    xp,
    xpToLevel1,
    xpBarRatio,
    mood01,
    runPeakCombo,
    hitboxWidenMult,
    CARRIER_HALF_BASE_RATIO,
    POWER_HITBOX_WIDEN,
    startRound,
    resetToReady,
    stopLoop,
    onFieldPointerDown,
    fieldSize,
  };
}
