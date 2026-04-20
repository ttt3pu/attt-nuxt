/** localStorage 用。version で将来マイグレーション可能に */

/** インクリメンタル（おやつ工房）の永続ブロック */
export interface OyatsuIncrementalSave {
  /** 所持おやつ（小数あり） */
  treats: number;
  /** おやつキッチのレベル（0 から。上げるほど生産増） */
  kitchenLevel: number;
  /** 累計生産量（表示・実績用） */
  totalTreatsProduced: number;
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
