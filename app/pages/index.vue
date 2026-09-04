<script lang="ts" setup>
import AtScroll from '@/components/atoms/AtScroll.vue';
import { oyatsuWorkshopRuntimeKey, useOyatsuWorkshopRuntime } from '@/composables/useOyatsuWorkshopRuntime';
import { usePostsStore } from '@/store';
import type { OyatsuCatchCatReactionKind } from '@/types/oyatsu-catch';
import type { BlogPost } from '@prisma/client';
import type { ZennPost } from '@/types';
import { recordWorkshopOpen } from '@/utils/oyatsu-catch-storage';

const heroGameOpen = ref(false);
const tossGameOpen = ref(false);
const workshopRuntime = useOyatsuWorkshopRuntime(() => heroGameOpen.value);
provide(oyatsuWorkshopRuntimeKey, workshopRuntime);
/** おやつ工房やトスゲームを開いていて操作にフォーカスがある場合など */
const heroGamePlaying = computed(() => heroGameOpen.value || tossGameOpen.value);

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

function onTossGameClose() {
  tossGameOpen.value = false;
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
        :class="{
          'title-container__inner--workshop-open': heroGameOpen,
          'title-container__inner--toss-open': tossGameOpen,
        }"
      >
        <div
          class="title-container__hero-left"
          :class="{ 'title-container__hero-left--game-open': heroGameOpen || tossGameOpen }"
        >
          <template v-if="!heroGameOpen && !tossGameOpen">
            <MoleculesOyatsuWorkshopBackdrop
              class="title-container__hero-fish"
              :production-rate="workshopRuntime.productionRate"
            />
            <div class="title-container__inner-inner">
              <div class="title-container__logo">
                <MoleculesSiteLogo />
              </div>
            </div>
            <div class="title-container__btn-group">
              <button
                type="button"
                class="title-container__play-btn title-container__play-btn--primary"
                @click="tossGameOpen = true"
              >
                🐟 お魚トスで遊ぶ！
              </button>
              <button
                type="button"
                class="title-container__play-btn title-container__play-btn--secondary"
                @click="heroGameOpen = true"
              >
                おやつ工房
              </button>
            </div>
          </template>
          <OrganismsOyatsuTossGame
            v-else-if="tossGameOpen"
            @close="onTossGameClose"
            @cat-reaction="onOyatsuCatReaction"
          />
          <OrganismsOyatsuWorkshop
            v-else
            @close="onHeroGameClose"
            @playing-change="heroGamePlaying = $event"
            @cat-reaction="onOyatsuCatReaction"
          />
        </div>

        <div
          class="title-container__cat"
          :class="{
            'title-container__cat--game-open': heroGameOpen,
            'title-container__cat--toss-open': tossGameOpen,
          }"
        >
          <MoleculesCatMascot :game-reaction="catGameReaction" :sp-workshop-compact="heroGameOpen" />
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
  position: relative;
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

  /* 単独子で縦いっぱいにし、工房パネルの可動領域を確保（中央寄せの上下の無駄を減らす） */
  .title-container__inner--workshop-open .title-container__hero-left {
    flex: 1 1 0%;
    height: auto;
    min-height: 0;
    align-self: stretch;
  }

  /* 猫を flex から外し、inner（= 画面下端）基準で右下固定。中央寄せブロックの「列下端」基準だと画面上に浮いて見える */
  .title-container__inner--workshop-open .title-container__cat {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 0;
    overflow: visible;
    flex: none;
    pointer-events: none;
    z-index: var(--z-hero-cat-when-game);
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

.title-container__btn-group {
  position: absolute;
  z-index: 6;
  right: var(--padding-lr-pc);
  bottom: 24px;
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.title-container__play-btn {
  cursor: pointer;
  font-family: var(--font-family-jp), sans-serif;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.title-container__play-btn--primary {
  border: 1px solid rgb(56 189 248 / 60%);
  background: linear-gradient(135deg, rgb(56 189 248 / 25%), rgb(2 132 199 / 35%));
  color: #38bdf8;
  font-weight: 700;
  box-shadow: 0 4px 12px rgb(56 189 248 / 20%);
}

.title-container__play-btn--primary:hover {
  background: linear-gradient(135deg, rgb(56 189 248 / 40%), rgb(2 132 199 / 50%));
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgb(56 189 248 / 35%);
}

.title-container__play-btn--secondary {
  border: 1px solid rgb(249 248 113 / 40%);
  background: rgb(249 248 113 / 10%);
  color: var(--primary-color);
}

.title-container__play-btn--secondary:hover {
  background: rgb(249 248 113 / 20%);
}

@media (width <= 768px) {
  .title-container__btn-group {
    right: var(--padding-lr-sp);
    bottom: 16px;
    gap: 0.5rem;
  }

  .title-container__play-btn {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
}
</style>
