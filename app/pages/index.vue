<script lang="ts" setup>
import AtScroll from '@/components/atoms/AtScroll.vue';
import { usePostsStore } from '@/store';
import type { CatReactionKind } from '@/types/oyatsu-toss';
import type { BlogPost } from '@prisma/client';
import type { ZennPost } from '@/types';

const tossGameOpen = ref(false);

/** CatMascot リアクション */
const catGameReaction = ref<CatReactionKind>('idle');
let catReactionClearTimer: ReturnType<typeof setTimeout> | null = null;
let lastHappyReactionAt = 0;

function clearCatReactionTimer() {
  if (catReactionClearTimer !== null) {
    clearTimeout(catReactionClearTimer);
    catReactionClearTimer = null;
  }
}

function triggerCatReaction(kind: CatReactionKind) {
  clearCatReactionTimer();
  catGameReaction.value = kind;
  const ms = kind === 'hurt' ? 520 : 400;
  catReactionClearTimer = setTimeout(() => {
    catGameReaction.value = 'idle';
    catReactionClearTimer = null;
  }, ms);
}

function onOyatsuCatReaction(kind: 'happy' | 'hurt') {
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

function onTossGameClose() {
  tossGameOpen.value = false;
  clearCatReactionTimer();
  catGameReaction.value = 'idle';
}

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
    <div class="title-container">
      <div class="title-container__inner" :class="{ 'title-container__inner--toss-open': tossGameOpen }">
        <div class="title-container__hero-left" :class="{ 'title-container__hero-left--game-open': tossGameOpen }">
          <template v-if="!tossGameOpen">
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
                🐟 PLAY FISH TOSS
              </button>
            </div>
          </template>
          <OrganismsOyatsuTossGame v-else @close="onTossGameClose" @cat-reaction="onOyatsuCatReaction" />
        </div>

        <div class="title-container__cat" :class="{ 'title-container__cat--toss-open': tossGameOpen }">
          <MoleculesCatMascot :game-reaction="catGameReaction" />
        </div>

        <AtScroll v-show="!tossGameOpen" class="title-container__scroll" />
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

  /* トスゲーム時: 画面全域をプレイ領域へ拡張 */
  .title-container__inner--toss-open {
    position: relative;
    height: 100%;
    overflow: hidden;
  }

  .title-container__inner--toss-open .title-container__hero-left {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
  }

  /* トスゲーム時の猫: 画面下端・背景化してプレイの邪魔にならず、リアクション時のみ発光 */
  .title-container__cat--toss-open {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 0;
    overflow: visible;
    flex: none;
    pointer-events: none;
    z-index: 2;
    opacity: 0.35;
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  }

  .title-container__cat--toss-open:has(.cat-mascot--react-happy) {
    opacity: 0.95;
    transform: scale(1.05);
  }
}

.title-container__hero-left {
  flex: 1 1 50%;
  min-width: 0;
  position: relative;
  isolation: isolate;
  z-index: 3;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.title-container__hero-left--game-open {
  z-index: 8;
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
  padding: 0.5rem 1.25rem;
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

@media (width <= 768px) {
  .title-container__btn-group {
    right: var(--padding-lr-sp);
    bottom: 16px;
  }

  .title-container__play-btn {
    font-size: 0.8rem;
    padding: 0.4rem 0.9rem;
  }
}
</style>
