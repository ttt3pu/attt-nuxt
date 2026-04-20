/** localStorage 用。version で将来マイグレーション可能に */

/** インクリメンタル（おやつ工房）の永続ブロック */
export interface OyatsuIncrementalSave {
  /** 所持おやつ（小数あり） */
  treats: number;
  /** キッチ（主生産） */
  kitchenLevel: number;
  /** おやつ倉庫（副生産） */
  pantryLevel: number;
  /** お届け係（生産倍率） */
  deliveryLevel: number;
  /** 累計生産量（表示・実績・3 択トリガー用） */
  totalTreatsProduced: number;
  /** 3 択などで得た全体倍率（1 基準） */
  globalProductionMult: number;
  /** 猫のごきげん 0〜100 */
  mood: number;
  /** 次の VS 式 3 択が出る累計生産の閾値 */
  nextChoiceThreshold: number;
}

export interface OyatsuCatchSave {
  version: number;
  /** キャッチ時代の記録（互換のため保持） */
  highScore: number;
  totalPlays: number;
  achievements: Record<string, boolean>;
  bestCombo: number;
  /** v3 以降。未設定時はマージでデフォルト */
  incremental?: OyatsuIncrementalSave;
}
