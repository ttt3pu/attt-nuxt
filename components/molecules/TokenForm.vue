<script setup lang="ts">
import CheckIcn from 'vue-material-design-icons/LockOpen.vue';
import { useToast } from 'vue-toast-notification';

const token = ref('');

const { isTokenPassed } = useToken();

const $toast = useToast();

function submit() {
  if (token.value === 'foobar') {
    isTokenPassed.value = true;
    $toast.success('トークンの入力を受け付けました');
  } else {
    $toast.error('トークンが間違っています');
  }
}
</script>

<template>
  <form v-if="!isTokenPassed" @submit.prevent="submit">
    <div class="flex items-center justify-center">
      <input
        v-model="token"
        placeholder="トークンを入力すると全情報が閲覧できます"
        class="mr-4 grow w-[350px] px-4 py-0.5 shadow rounded bg-white"
      />
      <button class="bg-tertiary hover:bg-tertiary-300 duration-100 hover:scale-110 rounded-full p-2 shrink-0">
        <CheckIcn :size="20" class="text-white" />
      </button>
    </div>
  </form>
</template>
