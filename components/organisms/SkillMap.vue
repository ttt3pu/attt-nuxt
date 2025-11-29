<template>
  <div>
    <AtomsHeadingLv2 class="font-en"> Skills </AtomsHeadingLv2>

    <AtomsHeadingLv3 class="font-en">Primary</AtomsHeadingLv3>
    <p class="font-jp text-white mb-6">メイン業務で使用中</p>
    <MoleculesSkillMapItems :items="primaryItems" />

    <AtomsHeadingLv3 class="font-en">Secondary</AtomsHeadingLv3>
    <p class="font-jp text-white mb-6">サブ業務で使用中</p>
    <MoleculesSkillMapItems :items="secondaryItems" />

    <AtomsHeadingLv3>Tertiary</AtomsHeadingLv3>
    <p class="font-jp text-white mb-6">勉強中 or 古いバージョンなら使ったことがある</p>
    <MoleculesSkillMapItems :items="tertiaryItems" />
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
    proficiency: 5,
    description:
      'Vue 2/3の両方に精通。Composition API、Options API、カスタムディレクティブ、プラグイン開発など幅広く経験。',
  },
  {
    heading: 'Nuxt',
    icnData: siNuxt,
    proficiency: 5,
    description: 'Nuxt 2/3でのSPA・SSR・SSG開発経験あり。モジュール開発やサーバーAPI構築も実施。',
  },
  {
    heading: 'TypeScript',
    icnData: siTypescript,
    proficiency: 4,
    description: '型安全なコード設計を重視。ジェネリクス、ユーティリティ型、型推論を活用した開発が得意。',
  },
  {
    heading: 'Vitest',
    icnData: siVitest,
    proficiency: 4,
    description: 'Viteベースの高速テスト環境構築。コンポーネントテストやユニットテストの設計・実装経験。',
  },
  {
    heading: 'Tailwind',
    icnData: siTailwindcss,
    proficiency: 5,
    description: 'ユーティリティファーストでのUI構築。カスタム設定、レスポンシブデザイン、ダークモード対応など。',
  },
  {
    heading: 'Jest',
    icnData: siJest,
    proficiency: 4,
    description: 'スナップショットテスト、モック、カバレッジ計測など幅広いテスト戦略を実践。',
  },
  {
    heading: 'JavaScript',
    icnData: siJavascript,
    proficiency: 5,
    description: 'ES6+の機能を熟知。非同期処理、クロージャ、プロトタイプチェーンなど深い理解。',
  },
  {
    heading: 'HTML',
    icnData: siHtml5,
    proficiency: 5,
    description: 'セマンティックHTML、アクセシビリティ、SEO対策を意識したマークアップ。',
  },
  {
    heading: 'CSS',
    icnData: siCss3,
    proficiency: 5,
    description: 'FlexboxやGridレイアウト、アニメーション、変数、メディアクエリなど幅広く活用。',
  },
];

const secondaryItems = [
  {
    heading: 'Rails',
    icnData: siRubyonrails,
    proficiency: 3,
    description: 'バックエンドAPIの開発経験。MVC設計、ActiveRecord、Rspecでのテスト実装など。',
  },
  {
    heading: 'Node.js',
    icnData: siNodedotjs,
    proficiency: 4,
    description: 'Express、Fastifyでのサーバー構築。Lambda関数、CLIツール開発にも活用。',
  },
  {
    heading: 'GH Actions',
    icnData: siGithubactions,
    proficiency: 4,
    description: 'CI/CDパイプラインの構築。自動テスト、デプロイ、カスタムアクション作成経験。',
  },
  {
    heading: 'Hasura',
    icnData: siHasura,
    proficiency: 3,
    description: 'GraphQLエンドポイントの自動生成。権限設定、リレーション設計、イベントトリガー活用。',
  },
  {
    heading: 'GraphQL',
    icnData: siGraphql,
    proficiency: 3,
    description: 'スキーマ設計、クエリ・ミューテーション実装。Apollo Clientとの連携経験。',
  },
  {
    heading: 'Terraform',
    icnData: siTerraform,
    proficiency: 3,
    description: 'インフラのコード化。AWS/GCPリソースの管理、モジュール設計、状態管理。',
  },
  {
    heading: 'AWS',
    icnData: siAmazonwebservices,
    proficiency: 3,
    description: 'EC2、S3、CloudFront、RDSなど基本サービスの構築・運用経験。',
  },
  {
    heading: 'Lambda',
    icnData: siAwslambda,
    proficiency: 4,
    description: 'サーバーレス関数の開発。API Gateway連携、イベント駆動アーキテクチャの設計。',
  },
  {
    heading: 'postgresql',
    icnData: siPostgresql,
    proficiency: 3,
    description: 'リレーショナルDB設計。インデックス最適化、クエリチューニング経験。',
  },
  {
    heading: 'Swagger',
    icnData: siSwagger,
    proficiency: 4,
    description: 'OpenAPI仕様でのAPI設計・ドキュメント作成。コード生成ツール活用。',
  },
  {
    heading: 'Renovate',
    icnData: siRenovate,
    proficiency: 4,
    description: '依存関係の自動更新設定。カスタムルール、グループ化、自動マージ設定。',
  },
  {
    heading: 'Docker',
    icnData: siDocker,
    proficiency: 3,
    description: '開発環境のコンテナ化。Dockerfileの最適化、docker-compose活用。',
  },
  {
    heading: 'Circle CI',
    icnData: siCircleci,
    proficiency: 3,
    description: 'パイプライン設定、並列実行、キャッシュ活用、Orbsの利用経験。',
  },
  {
    heading: 'Scss',
    icnData: siSass,
    proficiency: 4,
    description: '変数、ミックスイン、関数を活用したスタイル設計。BEMなどの命名規則遵守。',
  },
  {
    heading: 'Vite',
    icnData: siVite,
    proficiency: 4,
    description: '高速な開発サーバー構築。プラグイン設定、ビルド最適化の経験。',
  },
];

const tertiaryItems = [
  {
    heading: 'React',
    icnData: siReact,
    proficiency: 2,
    description: '基本的なコンポーネント設計、Hooks、状態管理の理解。個人プロジェクトでの使用経験。',
  },
  {
    heading: 'Next.js',
    icnData: siNextdotjs,
    proficiency: 2,
    description: 'SSR/SSGの基本的な実装経験。App Routerの学習中。',
  },
  {
    heading: 'Remix',
    icnData: siRemix,
    proficiency: 1,
    description: 'ドキュメントベースでの学習経験。ローダー/アクションパターンの理解。',
  },
  {
    heading: 'Prisma',
    icnData: siPrisma,
    proficiency: 2,
    description: 'スキーマ定義、マイグレーション、型安全なクエリビルダーの使用経験。',
  },
  {
    heading: 'Express',
    icnData: siExpress,
    proficiency: 2,
    description: 'ミドルウェア設計、ルーティング、REST APIの基本実装経験。',
  },
  {
    heading: 'Netlify',
    icnData: siNetlify,
    proficiency: 2,
    description: '静的サイトのデプロイ、Functions、フォーム機能の利用経験。',
  },
  {
    heading: 'Vercel',
    icnData: siVercel,
    proficiency: 3,
    description: 'Nuxt/Next.jsアプリのデプロイ。Edge Functions、環境変数設定の経験。',
  },
  {
    heading: 'webpack',
    icnData: siWebpack,
    proficiency: 2,
    description: 'ローダー/プラグイン設定、バンドル最適化の基本経験。現在はViteに移行。',
  },
  {
    heading: 'Stoybook',
    icnData: siStorybook,
    proficiency: 2,
    description: 'コンポーネントカタログの作成、ビジュアルテストの設定経験。',
  },
  {
    heading: 'jQuery',
    icnData: siJquery,
    proficiency: 3,
    description: 'レガシープロジェクトでの保守経験。DOM操作、イベント処理の知識。',
  },
  {
    heading: 'MySQL',
    icnData: siMysql,
    proficiency: 2,
    description: '基本的なCRUD操作、JOIN、インデックス設計の理解。',
  },
  {
    heading: 'Grunt',
    icnData: siGrunt,
    proficiency: 1,
    description: 'レガシープロジェクトでの設定経験。現在は非推奨のため使用機会なし。',
  },
  {
    heading: 'Pug',
    icnData: siPug,
    proficiency: 2,
    description: 'テンプレートエンジンとしての使用経験。ミックスイン、継承機能の活用。',
  },
];
</script>
