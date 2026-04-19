export type OyatsuCatchItemKind = 'good' | 'bad';

export interface OyatsuCatchItem {
  id: number;
  /** 左端位置 (px) */
  x: number;
  /** 上端位置 (px) */
  y: number;
  kind: OyatsuCatchItemKind;
  /** 落下速度 (px / s) */
  vy: number;
  /** 辺長 (px、正方形扱い) */
  size: number;
}

export type OyatsuCatchPhase = 'ready' | 'playing' | 'gameover';
