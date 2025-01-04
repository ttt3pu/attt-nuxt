import { z } from 'zod';
// FIXME
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import PROFILE from '../../../packages/resume/src/profile.md';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import JOBS from '../../../packages/resume/src/jobs.md';

const querySchema = z.object({
  token: z.string().optional(),
});

function createMaskedText(text: string, isPassed: boolean) {
  if (isPassed) {
    return text;
  }

  return text.replace(/\[secret\](.*?)\[\/secret\]/g, (_, p1) => {
    return `[secret]${'█'.repeat(p1.length)}[/secret]`;
  });
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const params = await getValidatedQuery(event, (body) => querySchema.safeParse(body));
  const isPassed = params.data?.token === config.SECRET_TOKEN;

  return {
    isPassed,
    profile: createMaskedText(PROFILE, isPassed),
    jobs: createMaskedText(JOBS, isPassed),
  };
});
