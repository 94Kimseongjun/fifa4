<template>
  <v-app>
    <default-bar />
    <v-main>
      <v-container fluid>
          <default-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
  import DefaultBar from './AppBar.vue'
  import DefaultView from './View.vue'
</script>
