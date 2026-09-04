import { describe, expect, it } from 'vitest';
import { FISH_DEFINITIONS, PHYSICS_CONFIG } from '@/constants/oyatsu-toss';
import type { FishKind } from '@/types/oyatsu-toss';

describe('お魚トスゲーム（OyatsuToss）の定数と物理設定', () => {
  it('すべての魚種（normal, speedy, gold, big）の定義が正しく揃っていること', () => {
    const kinds: FishKind[] = ['normal', 'speedy', 'gold', 'big'];
    for (const kind of kinds) {
      const def = FISH_DEFINITIONS[kind];
      expect(def).toBeDefined();
      expect(def.name).toBeTruthy();
      expect(def.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(def.radius).toBeGreaterThan(0);
      expect(def.weight).toBeGreaterThan(0);
      expect(def.restitution).toBeGreaterThan(0);
      expect(def.scoreValue).toBeGreaterThan(0);
      expect(def.eatScoreBonus).toBeGreaterThan(def.scoreValue);
    }
  });

  it('物理パラメータ（重力、減衰、パドル反発力など）が正しく定義されていること', () => {
    expect(PHYSICS_CONFIG.gravity).toBeGreaterThan(0);
    expect(PHYSICS_CONFIG.airResistance).toBeLessThan(1);
    expect(PHYSICS_CONFIG.airResistance).toBeGreaterThan(0.9);
    expect(PHYSICS_CONFIG.paddleHitForce).toBeGreaterThan(0);
    expect(PHYSICS_CONFIG.paddleRadius).toBeGreaterThan(0);
  });
});
