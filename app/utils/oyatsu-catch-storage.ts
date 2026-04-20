import type { OyatsuCatchSave, OyatsuIncrementalSave } from '~/types/oyatsu-catch-save';
import { evaluateWorkshopAchievements } from '@/utils/oyatsu-workshop-achievements';

export const OYATSU_CATCH_STORAGE_KEY = 'attt:oyatsu-catch';

/** 初回 3 択が出るまでの累計生産 */
const FIRST_CHOICE_AT_TOTAL = 42;

export const defaultIncrementalSave = (): OyatsuIncrementalSave => ({
  treats: 0,
  kitchenLevel: 0,
  pantryLevel: 0,
  deliveryLevel: 0,
  totalTreatsProduced: 0,
  globalProductionMult: 1,
  mood: 52,
  moodPeak: 52,
  nextChoiceThreshold: FIRST_CHOICE_AT_TOTAL,
  choicesCompleted: 0,
});

export const defaultOyatsuCatchSave = (): OyatsuCatchSave => ({
  version: 5,
  highScore: 0,
  totalPlays: 0,
  achievements: {},
  bestCombo: 0,
  workshopSessions: 0,
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
  if (typeof parsed.pantryLevel === 'number' && Number.isFinite(parsed.pantryLevel)) {
    d.pantryLevel = Math.max(0, Math.floor(parsed.pantryLevel));
  }
  if (typeof parsed.deliveryLevel === 'number' && Number.isFinite(parsed.deliveryLevel)) {
    d.deliveryLevel = Math.max(0, Math.floor(parsed.deliveryLevel));
  }
  if (typeof parsed.totalTreatsProduced === 'number' && Number.isFinite(parsed.totalTreatsProduced)) {
    d.totalTreatsProduced = Math.max(0, parsed.totalTreatsProduced);
  }
  if (typeof parsed.globalProductionMult === 'number' && Number.isFinite(parsed.globalProductionMult)) {
    d.globalProductionMult = Math.max(0.5, parsed.globalProductionMult);
  }
  if (typeof parsed.mood === 'number' && Number.isFinite(parsed.mood)) {
    d.mood = Math.min(100, Math.max(0, parsed.mood));
  }
  if (typeof parsed.moodPeak === 'number' && Number.isFinite(parsed.moodPeak)) {
    d.moodPeak = Math.min(100, Math.max(0, parsed.moodPeak));
  } else {
    d.moodPeak = Math.max(d.moodPeak, d.mood);
  }
  if (typeof parsed.nextChoiceThreshold === 'number' && Number.isFinite(parsed.nextChoiceThreshold)) {
    d.nextChoiceThreshold = Math.max(FIRST_CHOICE_AT_TOTAL, parsed.nextChoiceThreshold);
  }
  if (typeof parsed.choicesCompleted === 'number' && Number.isFinite(parsed.choicesCompleted)) {
    d.choicesCompleted = Math.max(0, Math.floor(parsed.choicesCompleted));
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
  if (typeof parsed.workshopSessions === 'number' && Number.isFinite(parsed.workshopSessions)) {
    d.workshopSessions = Math.max(0, Math.floor(parsed.workshopSessions));
  }
  if (parsed.incremental !== undefined) {
    d.incremental = mergeIncremental(parsed.incremental);
  } else {
    d.incremental = defaultIncrementalSave();
  }
  if (d.version < 3) {
    d.version = 3;
  }
  if (d.version < 4) {
    d.version = 4;
  }
  if (d.version < 5) {
    d.version = 5;
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

/** 工房を開くたびに呼ぶ（セッション计数 + 実績評価） */
export function recordWorkshopOpen(previous: OyatsuCatchSave): OyatsuCatchSave {
  const bumped: OyatsuCatchSave = {
    ...previous,
    workshopSessions: previous.workshopSessions + 1,
    version: Math.max(previous.version ?? 1, 5),
  };
  const next = evaluateWorkshopAchievements(bumped);
  saveOyatsuCatchSave(next);
  return next;
}

/** インクリメンタル状態だけをマージして保存（全体を保ったまま差し替え） */
export function persistIncrementalSlice(
  previous: OyatsuCatchSave,
  inc: OyatsuIncrementalSave,
): OyatsuCatchSave {
  const merged: OyatsuCatchSave = {
    ...previous,
    version: Math.max(previous.version ?? 1, 5),
    incremental: { ...inc },
  };
  const next = evaluateWorkshopAchievements(merged);
  saveOyatsuCatchSave(next);
  return next;
}
