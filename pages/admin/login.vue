<template>
  <div class="text-center">
    <AtomsContentsBox :color="2">
      <p v-if="roleError" class="font-en text-red-400 text-3xl mb-8">Access Denied.</p>

      <button v-if="loggedIn" @click="handleSignOut">Logout</button>
      <button v-else @click="handleSignIn">
        <span>Login with GitHub</span>
        <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path :d="siGithub.path" />
        </svg>
      </button>
    </AtomsContentsBox>
  </div>
</template>
<script setup lang="ts">
const { status, signIn, signOut, getSession } = useAuth();
import { siGithub } from 'simple-icons';
const session = await getSession();
const loggedIn = computed(() => status.value === 'authenticated');
const roleError = computed(() => loggedIn.value && session.user?.email !== 'ttt3pu@gmail.com');

definePageMeta({
  middleware: ['admin-check'],
});

async function handleSignIn() {
  await signIn('github');
}

async function handleSignOut() {
  await signOut();
}
</script>

<style scope lang="scss">
button {
  @apply cursor-pointer rounded font-en bg-white text-xl px-8 py-4 inline-flex items-center whitespace-nowrap;

  svg {
    @apply ml-3 w-6 h-6;
  }
}
</style>
