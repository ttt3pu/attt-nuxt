<script setup lang="ts">
import icnBack from 'vue-material-design-icons/ChevronLeft.vue';
const route = useRoute();
const { signOut, getSession } = useAuth();

const breadcrumbs = computed(() => [
  {
    to: '/',
    name: 'Main page',
  },
  ...(route.meta?.breadcrumbs?.length ? route.meta.breadcrumbs : []),
]);

async function handleSignOut() {
  await signOut();
}

const isAdminPage = computed(() => route.path.startsWith('/admin'));

const session = await getSession();
const loggedIn = computed(() => !!session?.user);
</script>

<template>
  <div class="logo-area">
    <div class="md:flex justify-between items-end">
      <div>
        <MoleculesSiteLogo :mini="true" :is-active-logo="false" />
        <p v-if="isAdminPage" class="text-white mb-6">( Admin )</p>

        <div class="flex gap-2 -ml-2">
          <NuxtLink
            v-for="breadcrumb in breadcrumbs"
            :key="breadcrumb.to"
            class="relative text-right font-en text-white flex items-center"
            :to="breadcrumb.to"
          >
            <icn-back class="relative w-6 h-6" />
            <span>{{ breadcrumb.name }}</span>
          </NuxtLink>
        </div>
      </div>

      <div v-if="isAdminPage && loggedIn" class="md:mt-0 mt-6">
        <button class="logout" @click="handleSignOut">
          <span>Logout</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.logo-area {
  max-width: var(--max-width);
  margin: 0 auto;

  @media (width >= 769px) {
    padding: 48px var(--padding-lr-pc) 56px;
  }

  @media (width <= 768px) {
    padding: 32px var(--padding-lr-sp) 44px;
  }
}

/* stylelint-disable-next-line */
::v-deep(svg) {
  width: 100%;
  height: 100%;
}

.logout {
  @apply cursor-pointer rounded font-en bg-white text-xl px-8 py-4 inline-flex items-center whitespace-nowrap;

  svg {
    @apply ml-3 w-6 h-6;
  }
}
</style>
