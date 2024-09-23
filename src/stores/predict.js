import { ref } from "vue";
import { defineStore } from "pinia";

export const usePredictionStore = defineStore("prediction", () => {
  const lat = ref(null);
  const lon = ref(null);
  const finalData = ref([]);
  const predictionDate = ref([]);
  const currentData = ref(null);
  const apiKey = "c4603d27d3f09b837913e033aaca0017";

  const getWeatherPrediction = async () => {
    const urlForNextFourDays = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat.value}&lon=${lon.value}&appid=${apiKey}`;
    try {
      const response = await fetch(urlForNextFourDays);
      predictionDate.value = await response.json(); // Storing final data in reactive ref
      finalData.value = predictionDate.value;
    } catch (error) {
      console.error("Error fetching weather forecast:", error);
    }
  };

  const showPrediction = ref(false);

  return {
    lat,
    lon,
    showPrediction,
    finalData,
    getWeatherPrediction,
    predictionDate,
    currentData,
  };
});
