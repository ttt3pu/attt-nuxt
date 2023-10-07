export default defineEventHandler(async (event) => {
  const slug = event.context.params.slug;
  const runtimeConfig = useRuntimeConfig();
  return await fetch(`https://attt.microcms.io/api/v1/blog/${slug}`, {
    headers: { 'X-MICROCMS-API-KEY': runtimeConfig.MICROCMS_API_KEY },
  }).then((res) => res.json());
});
