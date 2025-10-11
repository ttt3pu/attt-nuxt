<script setup lang="ts">
const { passedToken } = useToken();

const { data } = await useFetch('/api/resume', {
  method: 'POST',
  body: {
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
  <div class="profile-section">
    <AtomsHeadingLv2>Profile</AtomsHeadingLv2>

    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="md-contents" v-html="profileContent" />

    <AtomsHeadingLv3>Jobs</AtomsHeadingLv3>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="md-contents justify-left" v-html="jobsContent" />
  </div>
</template>

<style lang="scss" scoped>
.profile-section {
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
