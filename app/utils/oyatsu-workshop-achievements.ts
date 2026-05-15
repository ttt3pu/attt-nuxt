import type { OyatsuCatchSave } from '~/types/oyatsu-catch-save';
import { WORKSHOP_ACHIEVEMENT_DEFS } from '~/types/oyatsu-workshop-achievements';

/** 条件を満たした実績フラグを付与（既存は維持） */
export function evaluateWorkshopAchievements(save: OyatsuCatchSave): OyatsuCatchSave {
  let changed = false;
  const achievements = { ...save.achievements };
  for (const def of WORKSHOP_ACHIEVEMENT_DEFS) {
    if (!achievements[def.id] && def.check(save)) {
      achievements[def.id] = true;
      changed = true;
    }
  }
  if (!changed) {
    return save;
  }
  return { ...save, achievements };
}
