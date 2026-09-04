import type { FishDefinition, FishKind } from '@/types/oyatsu-toss';

export const FISH_DEFINITIONS: Record<FishKind, FishDefinition> = {
  normal: {
    kind: 'normal',
    name: 'たいやき魚',
    color: '#4fc3f7',
    accentColor: '#0288d1',
    radius: 24,
    weight: 1.0,
    restitution: 0.85,
    scoreValue: 10,
    eatScoreBonus: 50,
  },
  speedy: {
    kind: 'speedy',
    name: 'すばやいサンマ',
    color: '#81c784',
    accentColor: '#388e3c',
    radius: 18,
    weight: 0.8,
    restitution: 0.95,
    scoreValue: 20,
    eatScoreBonus: 100,
  },
  gold: {
    kind: 'gold',
    name: '黄金のマグロ',
    color: '#ffd54f',
    accentColor: '#f57f17',
    radius: 26,
    weight: 1.1,
    restitution: 0.9,
    scoreValue: 50,
    eatScoreBonus: 250,
  },
  big: {
    kind: 'big',
    name: 'おおきなシャケ',
    color: '#ff8a65',
    accentColor: '#d84315',
    radius: 34,
    weight: 1.5,
    restitution: 0.75,
    scoreValue: 30,
    eatScoreBonus: 150,
  },
};

export const PHYSICS_CONFIG = {
  gravity: 0.28,
  airResistance: 0.992,
  paddleHitForce: 8.5,
  paddleSpeedMultiplier: 0.45,
  maxVx: 14,
  maxVy: 18,
  minVyOnHit: -7,
  wallBounceDamping: 0.75,
  paddleRadius: 36,
};

export const GAME_DURATION_SECONDS = 30;
export const HIGH_SCORE_STORAGE_KEY = 'attt_oyatsu_toss_highscore';
