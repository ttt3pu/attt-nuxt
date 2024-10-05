<template>
  <div>
    <v-heading-lv2 class="font-en"> Skills </v-heading-lv2>

    <v-heading-lv3 class="font-en">Primary</v-heading-lv3>
    <p class="font-jp text-white mb-6">メイン業務で使用中</p>
    <MoleculesSkillMapItems :items="primaryItems" :size="1" />

    <v-heading-lv3 class="font-en">Secondary</v-heading-lv3>
    <p class="font-jp text-white mb-6">サブ業務で使用中</p>
    <MoleculesSkillMapItems :items="secondaryItems" :size="2" />

    <v-heading-lv3>Tertiary</v-heading-lv3>
    <p class="font-jp text-white mb-6">勉強中 or 古いバージョンなら使ったことがある</p>
    <MoleculesSkillMapItems :items="tertiaryItems" :size="3" />
  </div>
</template>

<script lang="ts" setup>
import {
  siCss3,
  siGrunt,
  siHtml5,
  siJavascript,
  siJest,
  siJquery,
  siNuxtdotjs,
  siPug,
  siReact,
  siSass,
  siStorybook,
  siTailwindcss,
  siTypescript,
  siVuedotjs,
  siWebpack,
  siRubyonrails,
  siSwagger,
  siGithubactions,
  siCircleci,
  siVite,
  siGraphql,
  siVitest,
  siNodedotjs,
  siHasura,
  siTerraform,
  siPostgresql,
  siAmazonwebservices,
  siMysql,
  siPrisma,
  siNetlify,
  siVercel,
  siAwslambda,
  siNextdotjs,
  siRenovate,
  siDocker,
  siRemix,
  siExpress,
} from 'simple-icons';

const primaryItems = [
  {
    heading: 'Vue',
    icnData: siVuedotjs,
  },
  {
    heading: 'Nuxt',
    icnData: siNuxtdotjs,
  },
  {
    heading: 'TypeScript',
    icnData: siTypescript,
  },
  {
    heading: 'Vitest',
    icnData: siVitest,
  },
  {
    heading: 'Tailwind',
    icnData: siTailwindcss,
  },
  {
    heading: 'Jest',
    icnData: siJest,
  },
  {
    heading: 'JavaScript',
    icnData: siJavascript,
  },
  {
    heading: 'HTML',
    icnData: siHtml5,
  },
  {
    heading: 'CSS',
    icnData: siCss3,
  },
];

const secondaryItems = [
  {
    heading: 'Rails',
    icnData: siRubyonrails,
  },
  {
    heading: 'Node.js',
    icnData: siNodedotjs,
  },
  {
    heading: 'GH Actions',
    icnData: siGithubactions,
  },
  {
    heading: 'Hasura',
    icnData: siHasura,
  },
  {
    heading: 'GraphQL',
    icnData: siGraphql,
  },
  {
    heading: 'Terraform',
    icnData: siTerraform,
  },
  {
    heading: 'AWS',
    icnData: siAmazonwebservices,
  },
  {
    heading: 'Lambda',
    icnData: siAwslambda,
  },
  {
    heading: 'postgresql',
    icnData: siPostgresql,
  },
  {
    heading: 'Swagger',
    icnData: siSwagger,
  },
  {
    heading: 'Renovate',
    icnData: siRenovate,
  },
  {
    heading: 'Docker',
    icnData: siDocker,
  },
  {
    heading: 'Circle CI',
    icnData: siCircleci,
  },
  {
    heading: 'Scss',
    icnData: siSass,
  },
  {
    heading: 'Vite',
    icnData: siVite,
  },
];

const tertiaryItems = [
  {
    heading: 'React',
    icnData: siReact,
  },
  {
    heading: 'Next.js',
    icnData: siNextdotjs,
  },
  {
    heading: 'Remix',
    icnData: siRemix,
  },
  {
    heading: 'Prisma',
    icnData: siPrisma,
  },
  {
    heading: 'Express',
    icnData: siExpress,
  },
  {
    heading: 'Netlify',
    icnData: siNetlify,
  },
  {
    heading: 'Vercel',
    icnData: siVercel,
  },
  {
    heading: 'webpack',
    icnData: siWebpack,
  },
  {
    heading: 'Stoybook',
    icnData: siStorybook,
  },
  {
    heading: 'jQuery',
    icnData: siJquery,
  },
  {
    heading: 'MySQL',
    icnData: siMysql,
  },
  {
    heading: 'Grunt',
    icnData: siGrunt,
  },
  {
    heading: 'Pug',
    icnData: siPug,
  },
];
</script>
