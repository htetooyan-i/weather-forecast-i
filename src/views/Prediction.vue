<template>
  <div>
    <div class="">
      <BriefsPrediction></BriefsPrediction>
    </div>
    <div class="mt-5">
      <SpecificPrediction></SpecificPrediction>
    </div>
  </div>
</template>

<script setup>
import BriefsPrediction from "../components/BriefsPrediction.vue";
import SpecificPrediction from "../components/SpecificPrediction.vue";
import { usePredictionStore } from "../stores/predict";
import { useDataStore } from "../stores/counter";
import { storeToRefs } from "pinia";
import { onMounted, watch } from "vue";
const predictionDataStore = usePredictionStore();

const { lat, lon, showPrediction, finalData, predictionDate, currentData } =
  storeToRefs(predictionDataStore);
</script>
