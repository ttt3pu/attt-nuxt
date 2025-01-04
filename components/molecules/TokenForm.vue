<script setup lang="ts">
import CheckIcn from 'vue-material-design-icons/LockOpen.vue';
import { useToast } from 'vue-toast-notification';

const localToken = ref('');

const { passedToken } = useToken();

const $toast = useToast();

async function submit() {
  const { data } = await useFetch('/api/resume', {
    query: {
      token: localToken.value,
    },
  });

  if (data.value?.isPassed) {
    passedToken.value = localToken.value;
    $toast.success('トークンの入力を受け付けました');
  } else {
    $toast.error('トークンが間違っています');
  }
}
</script>

<template>
  <form v-if="!passedToken" @submit.prevent="submit">
    <div class="flex items-center justify-center">
      <input
        v-model="localToken"
        placeholder="トークンを入力すると全情報が閲覧できます"
        class="mr-4 grow w-[350px] px-4 py-0.5 shadow rounded bg-white"
      />
      <button class="bg-tertiary hover:bg-tertiary-300 duration-100 hover:scale-110 rounded-full p-2 shrink-0">
        <CheckIcn :size="20" class="text-white" />
      </button>
    </div>
  </form>
</template>
