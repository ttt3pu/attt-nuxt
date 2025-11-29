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

<script lang="ts" setup>
import {
  siCss3,
  siGrunt,
  siHtml5,
  siJavascript,
  siJest,
  siJquery,
  siNuxt,
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
  siMysql,
  siPrisma,
  siNetlify,
  siVercel,
  siNextdotjs,
  siRenovate,
  siDocker,
  siRemix,
  siExpress,
  siZod,
  siGithubcopilot,
} from 'simple-icons';
import { awsIcon, awsLambdaIcon, awsApiGatewayIcon } from '~/constants/awsIcons';

const primaryItems = [
  {
    heading: 'Vue',
    icnData: siVuedotjs,
    proficiency: 5,
    description:
      '主にNuxtを通して使用していますが、たまにバニラでの開発も行っています。\n\nVue 2から3への移行経験があります。',
  },
  {
    heading: 'Nuxt',
    icnData: siNuxt,
    proficiency: 5,
    description:
      'SSGでの開発とNode.jsサーバーの開発の両方を行っています。\n\nバージョン2から3、そして4への移行経験があります。',
  },
  {
    heading: 'TypeScript',
    icnData: siTypescript,
    proficiency: 5,
    description:
      'メインはNuxtなどを通したフロントエンドとしての運用ですが、Node.jsとしてのバックエンドやインフラ開発（NuxtやLambdaなど）を行うことも多いです。',
  },
  {
    heading: 'Node.js',
    icnData: siNodedotjs,
    proficiency: 4,
    description: '主にNuxt serverやLambdaでインフラやバックエンド開発を行っています。',
  },
  {
    heading: 'Vitest',
    icnData: siVitest,
    proficiency: 5,
    description:
      'テスト開発は主にVitestで行っています。\n\n主に単体テストを目的として使用しています。\n\n以前はJestを使用していましたが、全面移行しました。',
  },
  {
    heading: 'Lambda',
    icnData: awsLambdaIcon,
    proficiency: 4,
    description: 'APIの構築や、CloudFrontのミドルウェアとしての使用、業務改善用のツール開発などに使用しています。',
  },
  {
    heading: 'GH Actions',
    icnData: siGithubactions,
    proficiency: 4,
    description:
      'CI/CDパイプラインの構築に使用しています。自動テスト、デプロイ、業務改善ツール、カスタムアクションなどの作成経験があります。',
  },
  {
    heading: 'Tailwind',
    icnData: siTailwindcss,
    proficiency: 5,
    description: 'CSS開発を行う際にメインで使用しています。',
  },
  {
    heading: 'JavaScript',
    icnData: siJavascript,
    proficiency: 5,
    description:
      'TypeScriptとしての使用がほとんどなので、素のJavaScriptを書くことはほとんどありませんが、たまに必要な場合は書いています。',
  },
  {
    heading: 'HTML',
    icnData: siHtml5,
    proficiency: 4,
    description: '過去にアクセシビリティの本格的な対応を行った経験などがあり、その際にマークアップの知識を深めました。',
  },
  {
    heading: 'CSS',
    icnData: siCss3,
    proficiency: 3,
    description:
      '最近はTailwindを使用しているので、素のCSSを書くことはほとんどありませんが、たまに必要な場合は書いています。',
  },
  {
    heading: 'Vite',
    icnData: siVite,
    proficiency: 3,
    description: '主にNuxtを通して使用しています。たまに簡単な静的サイトを作成する際に使用することもあります。',
  },
];

const secondaryItems = [
  {
    heading: 'Rails',
    icnData: siRubyonrails,
    proficiency: 3,
    description:
      '自身で直接コードを触ることは少ないですが、業務のバックエンド開発でメインで使用しているため、知識は取り入れるようにしています。\n\n簡単なAPIエンドポイントの作成などをたまに行っています。',
  },
  {
    heading: 'Hasura',
    icnData: siHasura,
    proficiency: 3,
    description:
      '業務でGraphQL用のミドルウェアとして使用しています。Hasura Actionsといった機能も一部使用経験があります。\n\nまだまだ使いこなせていない機能が多く、勉強中です。',
  },
  {
    heading: 'GraphQL',
    icnData: siGraphql,
    proficiency: 3,
    description: '主にHasuraとの連携で使用しています。クライアントは主にApolloを使用しています。',
  },
  {
    heading: 'Terraform',
    icnData: siTerraform,
    proficiency: 3,
    description: 'AWSのインフラ構築や、GitHubの設定管理などを目的とした使用経験があります。',
  },
  {
    heading: 'AWS',
    icnData: awsIcon,
    proficiency: 3,
    description: '幅広く構築経験があります（S3、CloudFront、RDS、ECR、ECS、Lambda、API Gateway、DMS、など・・・）。',
  },
  {
    heading: 'API Gateway',
    icnData: awsApiGatewayIcon,
    proficiency: 3,
    description:
      'RESTエンドポイントの作成、WebSocket開発用のエンドポイント開発や認証機構などを、自身で一から構築しました。',
  },
  {
    heading: 'Swagger',
    icnData: siSwagger,
    proficiency: 3,
    description:
      'API設計・ドキュメント作成に使用しています。\n\nTypeScriptと連携したSDK生成機構を構築することで、Railsとフロントエンドのやり取りに使用しています。',
  },
  {
    heading: 'Zod',
    icnData: siZod,
    proficiency: 3,
    description: 'Swaggerとの連携などに使用しています。',
  },
  {
    heading: 'Renovate',
    icnData: siRenovate,
    proficiency: 4,
    description:
      '以前はdependabotを使用していましたが乗り換えました。カスタムルール、グループ化、自動マージ設定など色々試しています。',
  },
  {
    heading: 'PostgreSQL',
    icnData: siPostgresql,
    proficiency: 3,
    description: '主にHasuraを通した操作がメインですが、必要な際は自身でスキーマ設計なども行っています。',
  },
  {
    heading: 'MySQL',
    icnData: siMysql,
    proficiency: 3,
    description: '普段はPostgreSQLがメインですがたまに使います。',
  },
  {
    heading: 'Docker',
    icnData: siDocker,
    proficiency: 3,
    description: 'ECS用のコンテナイメージの作成や、開発環境の構築などに使用しています。',
  },
];

const studyingItems = [
  {
    heading: 'Vercel',
    icnData: siVercel,
    proficiency: 3,
    description: '本サイトのデプロイもVercelで行っています。業務では使用経験なし（契約などが壁・・・）。',
  },
  {
    heading: 'React',
    icnData: siReact,
    proficiency: 3,
    description: '業務ではほんのちょっとだけ。主に個人開発で使ってます。',
  },
  {
    heading: 'Next.js',
    icnData: siNextdotjs,
    proficiency: 2,
    description: '',
  },
  {
    heading: 'Remix',
    icnData: siRemix,
    proficiency: 1,
    description: '',
  },
  {
    heading: 'Prisma',
    icnData: siPrisma,
    proficiency: 3,
    description: '本サイトのデータベース管理に使用しています。',
  },
  {
    heading: 'Github Copilot',
    icnData: siGithubcopilot,
    proficiency: 2,
    description: 'Coding Agentが面白い！色々作らせてみてます。',
  },
  {
    heading: 'Express',
    icnData: siExpress,
    proficiency: 1,
    description: '',
  },
];

const experiencedItems = [
  {
    heading: 'Netlify',
    icnData: siNetlify,
    proficiency: 3,
    description:
      '以前このサイトのデプロイに使用していました。\n\n機能的には好きなのですが、無料プランだとリージョンの問題で遅すぎて乗り換え。',
  },
  {
    heading: 'Scss',
    icnData: siSass,
    proficiency: 4,
    description:
      '以前、やむを得ずモダンな開発が難しかった環境でよく使っていました。\n\nmixinや変数など、色々工夫して頑張っていました。\n\n最近はバニラのCSSが便利になってきたこともあり、ほとんど使っていません。',
  },
  {
    heading: 'Circle CI',
    icnData: siCircleci,
    proficiency: 3,
    description: '以前使用していましたが、最近はGitHub Actionsに完全に乗り換えています。',
  },
  {
    heading: 'webpack',
    icnData: siWebpack,
    proficiency: 3,
    description: '以前は使用していましたが、最近はViteに乗り換えています。\n\nv4からv5への移行経験があります。',
  },
  {
    heading: 'Storybook',
    icnData: siStorybook,
    proficiency: 2,
    description:
      'だいぶ前のバージョンですが使っていました。普段のメンテナンスに時間を取れず断念しました。\n\n開発体験自体はすごく良かったので、いつかリベンジしたいです。',
  },
  {
    heading: 'jQuery',
    icnData: siJquery,
    proficiency: 3,
    description:
      'レガシープロジェクトに携わる際に使用していました。\n\nゴリゴリ使うというよりは、どちらかというとVanilla JSへの脱却を目指すために学んでいた感じでした。',
  },
  {
    heading: 'Grunt',
    icnData: siGrunt,
    proficiency: 3,
    description: 'レガシープロジェクトでの設定経験があります。\n\n最終的にはwebpackへ乗り換えました。',
  },
  {
    heading: 'Pug',
    icnData: siPug,
    proficiency: 3,
    description:
      'やむを得ずモダンな開発が難しい環境のときに良く使用していました。\n\nミックスインや継承機能などを使って頑張っていました。最近は全く使用していません。',
  },
  {
    heading: 'Jest',
    icnData: siJest,
    proficiency: 4,
    description: 'Vitestに乗り換えたので、最近は全く使っていません。',
  },
];
</script>
