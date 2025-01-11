export async function deployWebhook() {
  const { DEPLOY_WEBHOOK_URL } = useRuntimeConfig();

  if (DEPLOY_WEBHOOK_URL) {
    await useFetch(DEPLOY_WEBHOOK_URL, {
      method: 'POST',
    });
  }
}
