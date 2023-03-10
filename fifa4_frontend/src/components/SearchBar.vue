<template>
    <v-card-text>
      <v-container>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="6" md="4" class="d-flex">
            <v-text-field label="Search" v-model="searchTerm" flex></v-text-field>
            <v-btn color="primary" height="56px" @click="search" flex>Search</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </template>
  
  <script setup>
  let searchTerm = "";
  
  function search() {
    // search logic
    console.log("Search term: ", searchTerm);
  }
  </script>
v  