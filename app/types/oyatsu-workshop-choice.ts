/** VS 式 3 択の候補 ID（工房内） */
export type WorkshopChoiceId =
  | 'treat_rain'
  | 'recipe_note'
  | 'pantry_kit'
  | 'delivery_rush'
  | 'mood_song';

export interface WorkshopChoiceDef {
  id: WorkshopChoiceId;
  /** 短いラベル */
  label: string;
  /** 説明（1 行） */
  description: string;
}

export const WORKSHOP_CHOICE_POOL: WorkshopChoiceDef[] = [
  {
    id: 'treat_rain',
    label: 'おやつシャワー',
    description: '即時でおやつ +45',
  },
  {
    id: 'recipe_note',
    label: 'レシピメモ',
    description: '全体の生産 +6%（永続）',
  },
  {
    id: 'pantry_kit',
    label: '倉庫キット',
    description: 'おやつ倉庫が 1 段階アップ（無料）',
  },
  {
    id: 'delivery_rush',
    label: 'お届けラッシュ',
    description: 'お届け係が 1 段階アップ（無料）',
  },
  {
    id: 'mood_song',
    label: 'なでなでソング',
    description: 'ごきげん +30',
  },
];
