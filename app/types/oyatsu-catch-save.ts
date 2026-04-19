/** localStorage 用。§6.4: version で将来マイグレーション可能に */
export interface OyatsuCatchSave {
  version: number;
  highScore: number;
  totalPlays: number;
  achievements: Record<string, boolean>;
}
