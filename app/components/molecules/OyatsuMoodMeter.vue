<script setup lang="ts">
const props = defineProps<{
  /** 0〜100 */
  percent: number;
}>();

const barWidth = computed(() => {
  const m = props.percent;
  if (Number.isNaN(m)) {
    return 0;
  }
  return Math.min(100, Math.max(0, m));
});

const isHigh = computed(() => props.percent >= 72);
</script>

<template>
  <div
    class="oyatsu-mood-meter"
    :class="{ 'oyatsu-mood-meter--high': isHigh }"
    aria-label="ごきげんメーター"
  >
    <div class="oyatsu-mood-meter__label" aria-hidden="true">ごきげん</div>
    <div class="oyatsu-mood-meter__bar" aria-hidden="true">
      <div class="oyatsu-mood-meter__fill" :style="{ width: `${barWidth}%` }" />
    </div>
  </div>
</template>

<style scoped>
@reference "~/assets/css/tailwind.css";

.oyatsu-mood-meter {
  @apply w-full pointer-events-none;
}

.oyatsu-mood-meter__label {
  @apply text-[11px] text-white/55 mb-1 font-jp;
}

.oyatsu-mood-meter__bar {
  @apply h-[7px] rounded-full overflow-hidden;
  background: rgb(255 255 255 / 16%);
}

.oyatsu-mood-meter__fill {
  @apply h-full rounded-full;
  background: linear-gradient(90deg, #fec6db, #f8e042);
  transition: width 0.35s ease;
}

.oyatsu-mood-meter--high .oyatsu-mood-meter__fill {
  box-shadow: 0 0 12px rgb(248 224 66 / 40%);
}
</style>
