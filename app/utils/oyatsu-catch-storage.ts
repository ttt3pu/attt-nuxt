import type { OyatsuCatchSave } from '~/types/oyatsu-catch-save';

export const OYATSU_CATCH_STORAGE_KEY = 'attt:oyatsu-catch';

export const defaultOyatsuCatchSave = (): OyatsuCatchSave => ({
  version: 1,
  highScore: 0,
  totalPlays: 0,
  achievements: {},
});

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
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

/** 1 プレイ終了時にハイスコア・累計・実績を更新して保存 */
export function persistAfterRun(previous: OyatsuCatchSave, score: number): OyatsuCatchSave {
  const next: OyatsuCatchSave = {
    ...previous,
    totalPlays: previous.totalPlays + 1,
    highScore: Math.max(previous.highScore, score),
    achievements: { ...previous.achievements },
  };
  next.achievements.first_play = true;
  if (score >= 100) {
    next.achievements.score_100 = true;
  }
  if (score >= 500) {
    next.achievements.score_500 = true;
  }
  saveOyatsuCatchSave(next);
  return next;
}
