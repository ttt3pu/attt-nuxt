export type FishKind = 'normal' | 'gold' | 'speedy' | 'big';

export interface FishDefinition {
  kind: FishKind;
  name: string;
  color: string;
  accentColor: string;
  radius: number;
  weight: number; // 物理の重さ係数
  restitution: number; // 反発係数
  scoreValue: number;
  eatScoreBonus: number;
}

export interface FishObject {
  id: number;
  kind: FishKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  radius: number;
  rotation: number;
  vRot: number;
  squashX: number;
  squashY: number;
  bounceCount: number;
  isAlive: boolean;
  eaten: boolean;
}

export interface ParticleObject {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  shape: 'circle' | 'star' | 'heart' | 'sparkle';
  rotation: number;
  vRot: number;
}

export interface ScorePopupObject {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  scale: number;
  life: number;
  maxLife: number;
}

export interface PaddleState {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  vx: number;
  vy: number;
  radius: number;
  isPressed: boolean;
  angle: number;
}

export type GameMode = 'timed' | 'endless';
export type GamePlayState = 'ready' | 'playing' | 'gameover';
