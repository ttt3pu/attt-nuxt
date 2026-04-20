import type { InjectionKey } from 'vue';
import type { OyatsuCatchSave } from '@/types/oyatsu-catch-save';
import {
  defaultOyatsuCatchSave,
  loadOyatsuCatchSave,
} from '@/utils/oyatsu-catch-storage';

/**
 * トップヒーロー用のインクリメンタル状態。ページ表示中は常に tick が回る。
 * `OrganismsOyatsuWorkshop` / 3 択モーダルは inject で共有する。
 */
export function useOyatsuWorkshopRuntime() {
  const save = ref<OyatsuCatchSave>(defaultOyatsuCatchSave());
  const incremental = useOyatsuIncremental(
    () => save.value,
    (next) => {
      save.value = next;
    },
  );

  onMounted(() => {
    if (!import.meta.client) {
      return;
    }
    save.value = loadOyatsuCatchSave();
    incremental.hydrateFromSave(save.value);
    incremental.startLoop();
  });

  return {
    save,
    ...incremental,
  };
}

export type OyatsuWorkshopRuntime = ReturnType<typeof useOyatsuWorkshopRuntime>;

export const oyatsuWorkshopRuntimeKey: InjectionKey<OyatsuWorkshopRuntime> =
  Symbol('oyatsuWorkshopRuntime');
