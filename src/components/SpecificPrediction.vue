<template>
  <div>
    <div
      class="grid grid-cols-3 h-[50px] justify-between items-center border-2 cursor-not-allowed"
    >
      <div class="border-e-2 text-center">Humidity</div>
      <div class="border-e-2 text-center">Cloudiness</div>
      <div class="text-center">Wind speed</div>
    </div>
    <div :class="primaryBgColor" class="rounded-lg shadow-2xl p-5 h-[250px]">
      <div :class="secondaryBgColor" class="rounded-md h-full shadow-2xl">
        <h1 class="text-[120px] text-center">🔜 🥲</h1>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDataStore } from "../stores/counter";
import { storeToRefs } from "pinia";

// Import the store
const dataStore = useDataStore();

// Use storeToRefs for state variables
const {
  lat,
  lon,
  weatherDescription,
  finalData,
  primaryBgColor,
  secondaryBgColor,
} = storeToRefs(dataStore);
</script>

<style scoped></style>
