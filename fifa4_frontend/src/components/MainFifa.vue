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
        </v-window-item>
      </v-window>
    </v-card>
    <v-card-text>
      <v-container>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="6" md="4" class="d-flex">
            <v-text-field label="Search" flex></v-text-field>
            <v-btn color="primary" height="56px" @click="search" flex>Search</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-app>
</template>

<script setup>


const items = [
  "Main", "Tab1", "Tab2", "Tab3"
]


function search() {
  // search logic
}

</script>
