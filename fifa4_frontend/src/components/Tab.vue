<template>
    <v-app>
      <v-card>
        <v-tabs v-model="tab" align-tabs="left">
          <v-tab v-for="item in items" :key="item" :value="item">
            {{ item }}
          </v-tab>
        </v-tabs>
        <v-window v-model="tab">
          <v-window-item v-for="item in items" :key="item" :value="item">
            <component :is="item"></component>
          </v-window-item>
        </v-window>
      </v-card>
    </v-app>
  </template>
  
  <script>
 
  import Tab1 from "./Tab1.vue";
  import Tab2 from "./Tab2.vue";
  import Tab3 from "./Tab3.vue";
  
  export default {
    components: {

      Tab1,
      Tab2,
      Tab3,
    },
    data() {
      return {
        items: ["Tab1", "Tab2", "Tab3"],
        tab: "Main",
      };
    },
  };
  </script>
  