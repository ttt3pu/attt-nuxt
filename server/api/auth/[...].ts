import { NuxtAuthHandler } from '#auth';
import { authOptions } from '#server/utils/auth';

export default NuxtAuthHandler(authOptions);
