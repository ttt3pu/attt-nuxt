export async function deployWebhook() {
  const { DEPLOY_WEBHOOK_URL } = useRuntimeConfig();

  if (DEPLOY_WEBHOOK_URL) {
    await fetch(DEPLOY_WEBHOOK_URL, {
      method: 'POST',
    });
  }
}
