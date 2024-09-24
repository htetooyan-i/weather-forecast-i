<template>
  <div :class="primaryBgColor" class="rounded-lg shadow-2xl p-5 h-[250px]">
    <div
      :class="secondaryBgColor"
      class="rounded-md h-full shadow-2xl grid grid-cols-4"
    >
       <!-- weather prediction for next four days -->
      <div v-for="prediction in predictionData" class="py-2 font-color">
        <p id="day" class="text-center">{{ prediction.day }}</p>
        <div class="font-color my-2 grow">
          <img
            v-if="
              prediction.mostFrequentWeatherId > 199 &&
              prediction.mostFrequentWeatherId < 300
            "
            src="../icons/thunder.svg"
            :alt="prediction.mostFrequentWeatherId"
            class="object-contain w-[50px] mx-auto font-color"
          />
          <img
            v-else-if="
              prediction.mostFrequentWeatherId > 299 &&
              prediction.mostFrequentWeatherId < 400
            "
            src="../icons/drizzle.svg"
            :alt="prediction.mostFrequentWeatherId"
            class="object-contain w-[50px] mx-auto font-color"
          />
          <img
            v-else-if="
              prediction.mostFrequentWeatherId > 399 &&
              prediction.mostFrequentWeatherId < 600
            "
            src="../icons/rain.svg"
            :alt="prediction.mostFrequentWeatherId"
            class="object-contain w-[50px] mx-auto font-color"
          />
          <img
            v-else-if="
              prediction.mostFrequentWeatherId > 699 &&
              prediction.mostFrequentWeatherId < 700
            "
            src="../icons/snow.svg"
            :alt="prediction.mostFrequentWeatherId"
            class="object-contain w-[50px] mx-auto font-color"
          />
          <img
            v-else-if="
              prediction.mostFrequentWeatherId > 799 &&
              prediction.mostFrequentWeatherId < 800
            "
            src="../icons/atmosphere.svg"
            :alt="prediction.mostFrequentWeatherId"
            class="object-contain w-[50px] mx-auto font-color"
          />
          <img
            v-else-if="prediction.mostFrequentWeatherId == 800"
            src="../icons/clear.svg"
            :alt="prediction.avg_weather_id"
            class="object-contain w-[50px] mx-auto font-color"
          />
          <img
            v-else
            src="../icons/cloud.svg"
            :alt="prediction.avg_weather_id"
            class="object-contain w-[50px] mx-auto font-color"
          />
        </div>
        <p class="text-center h-[70px]">
          {{ prediction.mostFrequentDescription }}
        </p>
        <p class="text-center text-[14px]">
          <span v-if="isFahrenheit" class="text-yellow-400">
            {{ temperatureInFahrenheit(prediction.avg_temp_max) }}°F
          </span>
          <span v-else class="text-yellow-500">
            {{ temperatureInCelsius(prediction.avg_temp_max) }}°C
          </span>
          /
          <span v-if="isFahrenheit">
            {{ temperatureInFahrenheit(prediction.avg_temp_min) }}°F
          </span>
          <span v-else>
            {{ temperatureInCelsius(prediction.avg_temp_min) }}°C
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDataStore } from "../stores/counter";
import { storeToRefs } from "pinia";
import { usePredictionStore } from "../stores/predict";
import { onMounted, watch, ref } from "vue";

// Import the store
const dataStore = useDataStore();
const { isFahrenheit } = storeToRefs(dataStore);
const predictionDataStore = usePredictionStore();
const predictionData = ref([]);

//declare data from prediction pinia store file
const { finalData } = storeToRefs(predictionDataStore);

//watch user choice and display predictions
watch(finalData, (newData) => {
  if (newData && Array.isArray(newData.list)) {
    const todayTimestamp = new Date().getTime();

    // Filter for future weather data
    const futureWeatherData = newData.list.filter((data) => {
      const dataTimestamp = new Date(data.dt_txt).getTime();
      return dataTimestamp > todayTimestamp;
    });

    // Get only the next four days
    const uniqueDates = new Set();
    const limitedData = futureWeatherData.filter((data) => {
      const date = data.dt_txt.split(" ")[0]; // Extract the date
      if (!uniqueDates.has(date) && uniqueDates.size < 4) {
        uniqueDates.add(date);
        return true;
      }
      return false;
    });

    // Grouping by date
    const groupedData = limitedData.reduce((acc, data) => {
      const date = data.dt_txt.split(" ")[0]; // Extract the date (YYYY-MM-DD)
      if (!acc[date]) {
        acc[date] = {
          temp_min: 0,
          temp_max: 0,
          count: 0,
          weatherIds: [],
          descriptions: [],
        };
      }
      acc[date].temp_min += data.main.temp_min;
      acc[date].temp_max += data.main.temp_max;
      acc[date].weatherIds.push(data.weather[0].id);
      acc[date].descriptions.push(data.weather[0].description);
      acc[date].count += 1;
      return acc;
    }, {});

    // Calculating averages and including day of the week
    const averages = Object.entries(groupedData).map(([date, values]) => {
      const avg_temp_min = values.temp_min / values.count;
      const avg_temp_max = values.temp_max / values.count;

      // Get the most frequent weather ID and description
      const weatherIdCounts = values.weatherIds.reduce((acc, id) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
      }, {});

      const mostFrequentWeatherId = parseInt(
        Object.keys(weatherIdCounts).reduce((a, b) =>
          weatherIdCounts[a] > weatherIdCounts[b] ? a : b
        )
      );

      // Find the description that corresponds to the most frequent weather ID
      const mostFrequentDescription =
        values.descriptions[values.weatherIds.indexOf(mostFrequentWeatherId)];

      // Get the day of the week
      const dayOfWeek = new Date(date).toLocaleString("en-US", {
        weekday: "long",
      });

      return {
        date,
        day: dayOfWeek,
        avg_temp_min,
        avg_temp_max,
        mostFrequentWeatherId,
        mostFrequentDescription,
      };
    });

    predictionData.value = averages;
  } else {
    console.error("finalData does not have a valid structure", newData);
  }
});

// method to change temp to celsius
const temperatureInCelsius = (temp) => {
  return Math.round(temp - 273.15);
};
// method to change temp to fahrenheit
const temperatureInFahrenheit = (temp) => {
  return Math.round((temp - 273.15) * (9 / 5) + 32);
};

// Use storeToRefs for state variables
const { primaryBgColor, secondaryBgColor } = storeToRefs(dataStore);
</script>

<style scoped></style>
