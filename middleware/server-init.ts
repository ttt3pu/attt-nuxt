import { useStore } from '@/store';

const middleware = async ({ $pinia }) => {
  if (process.server) {
    const store = useStore($pinia);
    await store.nuxtServerInit();
  }
};

export default middleware;
