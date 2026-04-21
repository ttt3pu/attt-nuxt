<script lang="ts" setup>
import AtScroll from '@/components/atoms/AtScroll.vue';
import {
  oyatsuWorkshopRuntimeKey,
  useOyatsuWorkshopRuntime,
} from '@/composables/useOyatsuWorkshopRuntime';
import { usePostsStore } from '@/store';
import type { OyatsuCatchCatReactionKind } from '@/types/oyatsu-catch';
import type { BlogPost } from '@prisma/client';
import type { ZennPost } from '@/types';
import { recordWorkshopOpen } from '@/utils/oyatsu-catch-storage';

const heroGameOpen = ref(false);
const workshopRuntime = useOyatsuWorkshopRuntime(() => heroGameOpen.value);
provide(oyatsuWorkshopRuntimeKey, workshopRuntime);
/** おやつ工房を開いていて操作にフォーカスがある場合など（現状は常に false） */
const heroGamePlaying = ref(false);

/** CatMascot おやつ工房連動リアクション */
type CatFaceReaction = 'idle' | OyatsuCatchCatReactionKind;
const catGameReaction = ref<CatFaceReaction>('idle');
let catReactionClearTimer: ReturnType<typeof setTimeout> | null = null;
let lastHappyReactionAt = 0;

function clearCatReactionTimer() {
  if (catReactionClearTimer !== null) {
    clearTimeout(catReactionClearTimer);
    catReactionClearTimer = null;
  }
}

function triggerCatReaction(kind: OyatsuCatchCatReactionKind) {
  clearCatReactionTimer();
  catGameReaction.value = kind;
  const ms = kind === 'hurt' ? 520 : 400;
  catReactionClearTimer = setTimeout(() => {
    catGameReaction.value = 'idle';
    catReactionClearTimer = null;
  }, ms);
}

function onOyatsuCatReaction(kind: OyatsuCatchCatReactionKind) {
  if (kind === 'hurt') {
    triggerCatReaction('hurt');
    return;
  }
  const now = Date.now();
  if (now - lastHappyReactionAt < 140) {
    return;
  }
  lastHappyReactionAt = now;
  triggerCatReaction('happy');
}

function onHeroGameClose() {
  heroGameOpen.value = false;
  clearCatReactionTimer();
  catGameReaction.value = 'idle';
}

watch(heroGameOpen, (open) => {
  if (open) {
    workshopRuntime.save.value = recordWorkshopOpen(workshopRuntime.save.value);
    workshopRuntime.hydrateFromSave(workshopRuntime.save.value);
    workshopRuntime.tryOpenChoiceModalWhenEligible();
  } else {
    clearCatReactionTimer();
    catGameReaction.value = 'idle';
  }
});

onBeforeUnmount(() => {
  clearCatReactionTimer();
});

const postsStore = usePostsStore();

const { data: blogPosts } = await useFetch<BlogPost[]>('/api/blog');
const zennPosts = await useFetch<ZennPost[]>('/api/zenn');

postsStore.$patch({
  blogPosts: blogPosts.value!,
  zennPosts: zennPosts.data.value!,
});

prerenderRoutes(blogPosts.value!.map((post) => `/blog/${post.id}`));

useHead({
  title: 'attt - Front End Developer',
});
</script>

<template>
  <div>
    <MoleculesTokenForm class="fixed bottom-0 right-0 p-4 z-50" />
    <OrganismsOyatsuWorkshopChoiceModal @cat-reaction="onOyatsuCatReaction" />
    <div class="title-container">
      <div
        class="title-container__inner"
        :class="{ 'title-container__inner--workshop-open': heroGameOpen }"
      >
        <div
          class="title-container__hero-left"
          :class="{ 'title-container__hero-left--game-open': heroGameOpen }"
        >
          <template v-if="!heroGameOpen">
            <MoleculesOyatsuWorkshopBackdrop
              class="title-container__hero-fish"
              :production-rate="workshopRuntime.productionRate"
            />
            <div class="title-container__inner-inner">
              <div class="title-container__logo">
                <MoleculesSiteLogo />
              </div>
            </div>
            <button type="button" class="title-container__play-btn" @click="heroGameOpen = true">
              おやつ工房
            </button>
          </template>
          <OrganismsOyatsuWorkshop
            v-else
            @close="onHeroGameClose"
            @playing-change="heroGamePlaying = $event"
            @cat-reaction="onOyatsuCatReaction"
          />
        </div>

        <div
          class="title-container__cat"
          :class="{ 'title-container__cat--game-open': heroGameOpen }"
        >
          <MoleculesCatMascot :game-reaction="catGameReaction" />
        </div>

        <AtScroll v-show="!heroGamePlaying" class="title-container__scroll" />
      </div>
    </div>
    <!-- /title-container -->

    <div class="main-contents">
      <AtomsContentsBox>
        <OrganismsPostList />
      </AtomsContentsBox>

      <AtomsContentsBox :color="2">
        <OrganismsProfileSection />
      </AtomsContentsBox>

      <AtomsContentsBox>
        <OrganismsSkillMap />
      </AtomsContentsBox>
    </div>
    <!-- /main-contents -->
  </div>
</template>

<style scoped>
.title-container {
  background: linear-gradient(to top, #2e3255, #081025);
  border-bottom: 1px solid var(--color-gray);
  height: calc(var(--vh) * 100);
}

.title-container__inner {
  max-width: var(--max-width);
  margin: 0 auto;
  position: relative;
  height: 100%;
}

@media (width >= 769px) {
  .title-container__inner {
    display: flex;
  }
}

@media (width <= 768px) {
  .title-container__inner {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }

  /* 工房オープン時: 上 50% / 下 50% に分かれず、工房＋猫の塊を画面タテ中央へ */
  .title-container__inner--workshop-open {
    justify-content: center;
    gap: 0.75rem;
  }

  .title-container__inner--workshop-open .title-container__hero-left {
    flex: 0 1 auto;
    height: auto;
    min-height: 0;
  }

  .title-container__inner--workshop-open .title-container__cat {
    flex: 0 0 auto;

    /* 猫は absolute のため、列の高さを確保 */
    min-height: min(38vh, 260px);
  }
}

.title-container__hero-left {
  flex: 1 1 50%;
  min-width: 0;
  position: relative;
  isolation: isolate;

  /* 工房クローズ時は猫列より手前（遊ぶボタンが猫に隠れないように） */
  z-index: 3;
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* ロゴ・SNS・タイトルより奥で魚が流れる（MoleculesOyatsuWorkshopBackdrop） */
.title-container__hero-fish {
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 0;
  min-height: 0;
  overflow: hidden;
}

.title-container__hero-left--game-open {
  /* 工房・閉じる・施設ボタンを猫より手前（猫は SP で左列に重なる） */
  z-index: var(--z-hero-workshop);
}

.title-container__inner-inner {
  position: relative;
  z-index: 1;
  flex-grow: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
}

@media (width >= 769px) {
  .title-container__inner-inner {
    justify-content: center;
  }
}

.title-container__logo {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: var(--z-title);
  margin-bottom: 32px;
}

@media (width >= 769px) {
  .title-container__logo {
    padding: 35px var(--padding-lr-pc) 40px;
  }
}

@media (width <= 768px) {
  .title-container__logo {
    padding: 16px var(--padding-lr-sp) 24px;
  }
}

.title-container__scroll {
  position: absolute;
  z-index: var(--z-scroll);
}

@media (width >= 769px) {
  .title-container__scroll {
    left: calc(var(--padding-lr-pc) - 4px);
    bottom: 80px;
  }
}

@media (width <= 768px) {
  .title-container__scroll {
    left: calc(var(--padding-lr-sp) - 4px);
    bottom: 48px;
  }
}

.title-container__cat {
  position: relative;
  z-index: 2;
  flex: 1 1 50%;
  min-width: 0;
}

/* 工房表示中: 猫はスクロールより前だが工房（--z-hero-workshop）より奥 */
.title-container__cat--game-open {
  z-index: var(--z-hero-cat-when-game);

  /* 重なり残りのクリックを工房へ通す（装飾のみのため） */
  pointer-events: none;
}

.title-container__play-btn {
  position: absolute;
  z-index: 6;
  right: var(--padding-lr-pc);
  bottom: 24px;
  cursor: pointer;
  font-family: var(--font-family-jp), sans-serif;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid rgb(249 248 113 / 50%);
  background: rgb(249 248 113 / 12%);
  color: var(--primary-color);
}

.title-container__play-btn:hover {
  background: rgb(249 248 113 / 22%);
}

@media (width <= 768px) {
  .title-container__play-btn {
    right: var(--padding-lr-sp);
    bottom: 16px;
  }
}
</style>
