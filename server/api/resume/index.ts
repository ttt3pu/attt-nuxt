import { z } from 'zod';
import PROFILE from '@resume/profile.md';
import JOBS from '@resume/jobs.md';

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
