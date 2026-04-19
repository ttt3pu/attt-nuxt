import type { OyatsuCatchItem, OyatsuCatchPhase } from '~/types/oyatsu-catch';

const INITIAL_LIVES = 3;
const BASKET_WIDTH_RATIO = 0.22;
const BASKET_HEIGHT_RATIO = 0.065;
const BASKET_TOP_RATIO = 0.86;
const ITEM_SIZE_RATIO = 0.09;
const COMBO_MAX = 5;
const BASE_SCORE = 10;

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function useOyatsuCatchGame(getFieldEl: () => HTMLElement | null) {
  const phase = ref<OyatsuCatchPhase>('ready');
  const score = ref(0);
  const lives = ref(INITIAL_LIVES);
  const combo = ref(1);
  const items = shallowRef<OyatsuCatchItem[]>([]);
  /** 受け皿中心の X (px、フィールド左端基準) */
  const basketCenterX = ref(0);

  let itemId = 0;
  let rafId = 0;
  let lastTime = 0;
  let spawnAccumulator = 0;
  let difficulty = 0;
  let elapsedPlaying = 0;

  function fieldSize() {
    const el = getFieldEl();
    if (!el) {
      return { w: 320, h: 400 };
    }
    return { w: el.clientWidth, h: el.clientHeight };
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

  function tick(now: number) {
    if (phase.value !== 'playing') {
      return;
    }
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;
    elapsedPlaying += dt;

    const { w, h } = fieldSize();
    const basketW = w * BASKET_WIDTH_RATIO;
    const basketH = h * BASKET_HEIGHT_RATIO;
    const basketTop = h * BASKET_TOP_RATIO;
    const basketLeft = basketCenterX.value - basketW / 2;

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
    let gameOver = false;

    for (const it of items.value) {
      const ny = it.y + it.vy * dt;
      const size = it.size;
      const caught = rectsOverlap(it.x, ny, size, size, basketLeft, basketTop, basketW, basketH);

      if (caught) {
        if (it.kind === 'good') {
          nextScore += BASE_SCORE * nextCombo;
          nextCombo = Math.min(COMBO_MAX, nextCombo + 1);
        } else {
          nextCombo = 1;
          nextLives -= 1;
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

  function syncBasketFromPointer(clientX: number) {
    const el = getFieldEl();
    if (!el) {
      return;
    }
    const rect = el.getBoundingClientRect();
    const { w } = fieldSize();
    const basketW = w * BASKET_WIDTH_RATIO;
    const x = clientX - rect.left;
    basketCenterX.value = clamp(x, basketW / 2, w - basketW / 2);
  }

  function onPlayingPointer(ev: PointerEvent) {
    if (phase.value !== 'playing') {
      return;
    }
    ev.preventDefault();
    syncBasketFromPointer(ev.clientX);
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
    syncBasketFromPointer(ev.clientX);
    attachGlobalPointer();
  }

  function startRound() {
    const { w } = fieldSize();
    phase.value = 'playing';
    score.value = 0;
    lives.value = INITIAL_LIVES;
    combo.value = 1;
    items.value = [];
    itemId = 0;
    spawnAccumulator = 0;
    difficulty = 0;
    elapsedPlaying = 0;
    basketCenterX.value = w / 2;
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

  return {
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
    stopLoop,
    onFieldPointerDown,
    fieldSize,
  };
}
