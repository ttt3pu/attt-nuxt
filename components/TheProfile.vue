<script setup lang="ts">
import PROFILE from '@resume/profile.md?raw';
import JOBS from '@resume/jobs.md?raw';

const { renderedContent: profileContent } = useMd(PROFILE);
const { renderedContent: jobsContent } = useMd(JOBS);
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
  @apply mx-auto text-white font-jp [&:not(:last-child)]:mb-4;
}

.justify-left {
  @media (width >= 769px) {
    text-align-last: left;
    width: fit-content;
  }
}
</style>
