import type { OyatsuCatchSave } from '~/types/oyatsu-catch-save';

export interface WorkshopAchievementDef {
  id: string;
  title: string;
  description: string;
  check: (save: OyatsuCatchSave) => boolean;
}

export const WORKSHOP_ACHIEVEMENT_DEFS: WorkshopAchievementDef[] = [
  {
    id: 'ws_first',
    title: '工房のドア',
    description: 'おやつ工房を開いた',
    check: (s) => s.workshopSessions >= 1,
  },
  {
    id: 'ws_regular',
    title: '常連さん',
    description: '工房を 10 回開いた',
    check: (s) => s.workshopSessions >= 10,
  },
  {
    id: 'produce_1k',
    title: 'おやつ 1,000 個分',
    description: '累計生産が 1,000 に達した',
    check: (s) => (s.incremental?.totalTreatsProduced ?? 0) >= 1000,
  },
  {
    id: 'produce_25k',
    title: 'おやつ工場',
    description: '累計生産が 25,000 に達した',
    check: (s) => (s.incremental?.totalTreatsProduced ?? 0) >= 25000,
  },
  {
    id: 'kitchen_8',
    title: '板前の片鱗',
    description: 'キッチ Lv8 以上',
    check: (s) => (s.incremental?.kitchenLevel ?? 0) >= 8,
  },
  {
    id: 'choice_first',
    title: 'おまけの味',
    description: '3 択のおまけを 1 回選んだ',
    check: (s) => (s.incremental?.choicesCompleted ?? 0) >= 1,
  },
  {
    id: 'mood_peak_95',
    title: 'ごきげん最高',
    description: 'ごきげんの記録が 95 以上',
    check: (s) => (s.incremental?.moodPeak ?? 0) >= 95,
  },
  {
    id: 'triple_lv3',
    title: '三種そろい',
    description: 'キッチ・倉庫・お届けがすべて Lv3 以上',
    check: (s) => {
      const i = s.incremental;
      if (!i) {
        return false;
      }
      return i.kitchenLevel >= 3 && i.pantryLevel >= 3 && i.deliveryLevel >= 3;
    },
  },
];
