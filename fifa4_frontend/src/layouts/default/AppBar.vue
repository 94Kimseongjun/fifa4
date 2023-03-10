<template>
  <v-app-bar color="primary" density="compact" flat>

    <v-btn text @click="handleClickFIFA4">
      <v-icon icon="mdi-circle-slice-4" />
      FIFA4
    </v-btn>

    <!--  
    <v-app-bar-title class="title">
        <v-icon icon="mdi-circle-slice-4" />
        FIFA4
    </v-app-bar-title>
-->
    <v-tabs v-model="selectedTab" align-tabs="right">
      <v-tab v-for="(tab, index) in tabs" :key="index" :to="tab.to">
        {{ tab.title }}
      </v-tab>
    </v-tabs>
  </v-app-bar>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const tabs = [
  {
    title: 'Tab1',
    to: '/tab1',
  },
  {
    title: 'Tab2',
    to: '/tab2',
  },
  {
    title: 'Tab3',
    to: '/tab3',
  },
];
const router = useRouter();

const selectedTab = computed(() => {
  const route = useRoute();
  const index = tabs.findIndex((tab) => tab.to === route.path);
  return index === -1 ? null : index;
});

const title = computed(() => tabs[selectedTab.value]?.title ?? 'App');

let drawer = false;

const toggleDrawer = () => {
  drawer = !drawer;
};

const handleClickFIFA4 = () => {
  if (router.currentRoute.value.path !== '/') {
    router.push('/');
  }
};

</script>


<style scoped>
.title {
  max-width: 100px;
  /* 적절한 크기로 조정 */
}
</style>