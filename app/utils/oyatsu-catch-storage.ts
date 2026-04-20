import type { OyatsuCatchSave, OyatsuIncrementalSave } from '~/types/oyatsu-catch-save';

export const OYATSU_CATCH_STORAGE_KEY = 'attt:oyatsu-catch';

export const defaultIncrementalSave = (): OyatsuIncrementalSave => ({
  treats: 0,
  kitchenLevel: 0,
  totalTreatsProduced: 0,
});

export const defaultOyatsuCatchSave = (): OyatsuCatchSave => ({
  version: 3,
  highScore: 0,
  totalPlays: 0,
  achievements: {},
  bestCombo: 0,
  incremental: defaultIncrementalSave(),
});

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function mergeIncremental(parsed: unknown): OyatsuIncrementalSave {
  const d = defaultIncrementalSave();
  if (!isRecord(parsed)) {
    return d;
  }
  if (typeof parsed.treats === 'number' && Number.isFinite(parsed.treats)) {
    d.treats = Math.max(0, parsed.treats);
  }
  if (typeof parsed.kitchenLevel === 'number' && Number.isFinite(parsed.kitchenLevel)) {
    d.kitchenLevel = Math.max(0, Math.floor(parsed.kitchenLevel));
  }
  if (typeof parsed.totalTreatsProduced === 'number' && Number.isFinite(parsed.totalTreatsProduced)) {
    d.totalTreatsProduced = Math.max(0, parsed.totalTreatsProduced);
  }
  return d;
}

/** localStorage から読み込み。破損時はデフォルト。 */
export function loadOyatsuCatchSave(): OyatsuCatchSave {
  if (!import.meta.client) {
    return defaultOyatsuCatchSave();
  }
  try {
    const raw = localStorage.getItem(OYATSU_CATCH_STORAGE_KEY);
    if (!raw) {
      return defaultOyatsuCatchSave();
    }
    const parsed: unknown = JSON.parse(raw);
    return mergeOyatsuCatchSave(parsed);
  } catch {
    return defaultOyatsuCatchSave();
  }
}

export function mergeOyatsuCatchSave(parsed: unknown): OyatsuCatchSave {
  const d = defaultOyatsuCatchSave();
  if (!isRecord(parsed)) {
    return d;
  }
  if (typeof parsed.version === 'number') {
    d.version = parsed.version;
  }
  if (typeof parsed.highScore === 'number' && Number.isFinite(parsed.highScore)) {
    d.highScore = Math.max(0, Math.floor(parsed.highScore));
  }
  if (typeof parsed.totalPlays === 'number' && Number.isFinite(parsed.totalPlays)) {
    d.totalPlays = Math.max(0, Math.floor(parsed.totalPlays));
  }
  if (isRecord(parsed.achievements)) {
    const next: Record<string, boolean> = {};
    for (const [k, v] of Object.entries(parsed.achievements)) {
      if (typeof v === 'boolean') {
        next[k] = v;
      }
    }
    d.achievements = next;
  }
  if (typeof parsed.bestCombo === 'number' && Number.isFinite(parsed.bestCombo)) {
    d.bestCombo = Math.max(0, Math.floor(parsed.bestCombo));
  }
  if (parsed.incremental !== undefined) {
    d.incremental = mergeIncremental(parsed.incremental);
  } else {
    d.incremental = defaultIncrementalSave();
  }
  if (d.version < 3) {
    d.version = 3;
  }
  return d;
}

export function saveOyatsuCatchSave(data: OyatsuCatchSave): void {
  if (!import.meta.client) {
    return;
  }
  try {
    localStorage.setItem(OYATSU_CATCH_STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* quota 等は握りつぶす */
  }
}

/** インクリメンタル状態だけをマージして保存（全体を保ったまま差し替え） */
export function persistIncrementalSlice(
  previous: OyatsuCatchSave,
  inc: OyatsuIncrementalSave,
): OyatsuCatchSave {
  const next: OyatsuCatchSave = {
    ...previous,
    version: Math.max(previous.version ?? 1, 3),
    incremental: { ...inc },
  };
  saveOyatsuCatchSave(next);
  return next;
}
