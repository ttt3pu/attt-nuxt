/** localStorage 用。version で将来マイグレーション可能に */
export interface OyatsuCatchSave {
  version: number;
  highScore: number;
  totalPlays: number;
  achievements: Record<string, boolean>;
  /** いずれかのプレイで記録した最大コンボ倍率（表示の ×N に対応） */
  bestCombo: number;
}
