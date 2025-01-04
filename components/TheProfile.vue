<script setup lang="ts">
const { passedToken } = useToken();

const { data } = await useFetch('/api/resume', {
  query: {
    token: passedToken,
  },
});

const profile = computed(() => {
  return data.value?.profile ?? 'loading...';
});

const jobs = computed(() => {
  return data.value?.jobs ?? 'loading...';
});

const { renderedContent: profileContent } = useMd(profile);
const { renderedContent: jobsContent } = useMd(jobs);
</script>

<template>
  <div class="the-profile">
    <v-heading-lv2>Profile</v-heading-lv2>

    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="md-contents" v-html="profileContent" />

    <v-heading-lv3>Jobs</v-heading-lv3>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="md-contents justify-left" v-html="jobsContent" />
  </div>
</template>

<style lang="scss" scoped>
.the-profile {
  @media (width >= 769px) {
    text-align: center;
  }
}

/* stylelint-disable-next-line */
::v-deep(.md-contents) {
  @apply mx-auto text-white font-jp [&:not(:last-child)]:mb-4 break-all;
}

.justify-left {
  @media (width >= 769px) {
    text-align-last: left;
    width: fit-content;
  }
}
</style>
