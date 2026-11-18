<script setup lang="ts">
import { siGoogle } from 'simple-icons';
const { loggedIn, user, clear } = useUserSession();
const route = useRoute();
const roleError = computed(() => loggedIn.value && user.value?.email !== 'ttt3pu@gmail.com');
const oauthError = computed(() => route.query.error === 'oauth');

definePageMeta({
  middleware: ['admin-check'],
});

async function handleSignIn() {
  await navigateTo('/auth/google', { external: true });
}

async function handleSignOut() {
  await clear();
}
</script>

<template>
  <div class="text-center">
    <AtomsContentsBox :color="2">
      <p v-if="oauthError" class="mb-8 text-red-400">ログインに失敗しました。もう一度お試しください。</p>
      <p v-if="roleError" class="font-en text-red-400 text-3xl mb-8">Access Denied.</p>

      <button v-if="loggedIn" @click="handleSignOut">Logout</button>
      <button v-else @click="handleSignIn">
        <span>Login</span>
        <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" :fill="'#' + siGoogle.hex">
          <path :d="siGoogle.path" />
        </svg>
      </button>
    </AtomsContentsBox>
  </div>
</template>

<style scoped>
@reference "~/assets/css/tailwind.css";

button {
  @apply cursor-pointer rounded font-en bg-white text-xl px-8 py-4 inline-flex items-center whitespace-nowrap;

  svg {
    @apply ml-3 w-6 h-6;
  }
}
</style>
