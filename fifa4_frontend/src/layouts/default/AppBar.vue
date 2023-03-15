<template>
  <v-app-bar color="primary" dense flat>
    <v-btn text @click="handleClickFIFA4">
      <v-icon icon="mdi-circle-slice-4" />FIFA4
    </v-btn>
    <v-tabs v-model="selectedTab" align-tabs="right">
      <v-tab v-for="(tab, index) in tabs" :key="index" :to="tab.to">
        {{ tab.title }}
      </v-tab>
    </v-tabs>
    <v-row xs12 md4>
      <v-col>
        <v-text-field v-model="searchText" label="Search" outlined dense solo-inverted hide-details clearable
          class="search-field" placeholder="Search" append-icon="mdi-magnify" @click:append="handleSearch"></v-text-field>
      </v-col>
    </v-row>
  </v-app-bar>
</template>
<script setup>
import { ref } from 'vue';
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
const searchText = ref('');
const selectedTab = ref(null);
const route = useRoute();
const index = tabs.findIndex((tab) => tab.to === route.path);
if (index !== -1) {
  selectedTab.value = index;
}

const handleClickFIFA4 = () => {
  if (router.currentRoute.value.path !== '/') {
    router.push('/');
  }
};

const handleSearch = async () => {
  try {
    router.push({ 
      name: 'Home', 
      query: { nickName: searchText.value },
    });
  } catch (error) {
    console.log(error);
  }
};

</script>
<style scoped>
.v-btn {
  min-width: 0;
}

.v-tabs {
  margin-left: 10px;
}

.search-field {
  min-width: 150px;
  margin-right: 10px;
}
</style>
