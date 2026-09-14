<script lang="ts" setup>
import { primaryItems, secondaryItems, studyingItems, experiencedItems } from '~/constants/skills';
</script>

<template>
  <div>
    <AtomsHeadingLv2 class="font-en"> Skills </AtomsHeadingLv2>

    <AtomsHeadingLv3 class="font-en">Primary</AtomsHeadingLv3>
    <p class="font-jp text-white mb-6">業務でメインスキルとして使用中</p>
    <MoleculesSkillMapItems :items="primaryItems" />

    <AtomsHeadingLv3 class="font-en">Secondary</AtomsHeadingLv3>
    <p class="font-jp text-white mb-6">業務でサブスキルとして使用中</p>
    <MoleculesSkillMapItems :items="secondaryItems" />

    <AtomsHeadingLv3>Studying</AtomsHeadingLv3>
    <p class="font-jp text-white mb-6">勉強中</p>
    <MoleculesSkillMapItems :items="studyingItems" />

    <AtomsHeadingLv3>Experienced</AtomsHeadingLv3>
    <p class="font-jp text-white mb-6">以前使ってた</p>
    <MoleculesSkillMapItems :items="experiencedItems" />
  </div>
</template>
