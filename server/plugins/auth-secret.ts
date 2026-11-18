export default defineNitroPlugin(() => {
  // 未展開のプレースホルダーを共通 secret として使用させない。
  // 公開ページの事前生成では認証設定を要求しない。
  if (!import.meta.prerender && !process.env.AUTH_SECRET && !process.env.NUXT_APP_SECRET) {
    throw new Error('認証には既存の AUTH_SECRET の設定が必要です。');
  }
});
