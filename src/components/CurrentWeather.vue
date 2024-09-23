<template>
  <div
    class="grid grid-cols-1"
    :class="[showPrediction ? 'grid-cols-1' : 'lg:grid-cols-2']"
  >
    <p v-if="loading">Waiting for data...</p>
    <div
      v-for="data in showPrediction ? weatherData : currentWeatherData"
      class="mb-5 w-full lg:max-w-[471px] bg-white h-[600px] rounded-lg shadow-2xl p-5 cursor-pointer"
      @click="displayPrediction(data.lat, data.lon)"
    >
      <header class="relative location flex flex-nowrap items-center">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6 font-color"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
            />
          </svg>
        </div>
        <div id="location-name" class="ms-3">
          <h3 class="font-bold font-color cursor-text">{{ data.cityName }}</h3>
          <p class="font-bold font-color cursor-text">
            {{ data.countryNameInEng }} | {{ data.countryNameInNative }}
          </p>
        </div>
        <div class="grow text-right">
          <p class="font-bold font-color cursor-text">{{ currentDate() }}</p>
        </div>
      </header>
      <main class="my-5">
        <div class="grid grid-cols-2 gap-2 items-center">
          <div class="w-[200px] h-[100px] font-color">
            <img
              v-if="data.currentWeatherId > 199 && data.currentWeatherId < 300"
              src="../icons/thunder.svg"
              :alt="data.currentWeatherId.toString()"
              class="object-contain w-[100px] ms-auto font-color"
            />
            <img
              v-else-if="
                data.currentWeatherId > 299 && data.currentWeatherId < 400
              "
              src="../icons/drizzle.svg"
              :alt="data.currentWeatherId.toString()"
              class="object-contain w-[100px] ms-auto font-color"
            />
            <img
              v-else-if="
                data.currentWeatherId > 399 && data.currentWeatherId < 600
              "
              src="../icons/rain.svg"
              :alt="data.currentWeatherId.toString()"
              class="object-contain w-[100px] ms-auto font-color"
            />
            <img
              v-else-if="
                data.currentWeatherId > 699 && data.currentWeatherId < 700
              "
              src="../icons/snow.svg"
              :alt="data.currentWeatherId.toString()"
              class="object-contain w-[100px] ms-auto font-color"
            />
            <img
              v-else-if="
                data.currentWeatherId > 799 && data.currentWeatherId < 800
              "
              src="../icons/atmosphere.svg"
              :alt="data.currentWeatherId.toString()"
              class="object-contain w-[100px] ms-auto font-color"
            />
            <img
              v-else-if="data.currentWeatherId == 800"
              src="../icons/clear.svg"
              :alt="data.currentWeatherId.toString()"
              class="object-contain w-[100px] ms-auto font-color"
            />
            <img
              v-else
              src="../icons/cloud.svg"
              :alt="data.currentWeatherId.toString()"
              class="object-contain w-[100px] ms-auto font-color"
            />
          </div>
          <div class="w-[200px] font-color">
            <p class="cursor-text">{{ data.currentWeatherMain }}</p>
            <p class="cursor-text">{{ data.currentWeatherDescription }}</p>
          </div>
        </div>
        <div id="temp">
          <div id="temp-display" class="my-2 grid grid-cols-2">
            <div class="ms-auto text-[70px] text-center font-color cursor-text">
              <span v-if="isFahrenheit">
                {{ temperatureInFahrenheit(data.currentTemp) }}°F
              </span>
              <span v-else>
                {{ temperatureInCelsius(data.currentTemp) }}°C
              </span>
            </div>
            <div class="flex flex-col flex-nowrap items-start justify-center">
              <div
                class="flex flex-row text-yellow-400 text-[25px] cursor-text"
              >
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-10 text-[30px]"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18"
                    />
                  </svg>
                </div>
                <span v-if="isFahrenheit">
                  {{ temperatureInFahrenheit(data.currentTempMax) }}°F
                </span>
                <span v-else>
                  {{ temperatureInCelsius(data.currentTempMax) }}°C
                </span>
              </div>
              <div
                class="flex flex-row text-indigo-300 text-[25px] cursor-text"
              >
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-10"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3"
                    />
                  </svg>
                </div>
                <span v-if="isFahrenheit">
                  {{ temperatureInFahrenheit(data.currentTempMin) }}°F
                </span>
                <span v-else>
                  {{ temperatureInCelsius(data.currentTempMin) }}°C
                </span>
              </div>
            </div>
          </div>
        </div>
        <div id="sun" class="grid grid-cols-2 justify-center items-center">
          <div
            id="sunrise"
            class="my-2 font-color flex flex-col justify-center items-center"
          >
            <span class="cursor-text">Sunrise</span>
            <div>
              <img
                src="../icons/sunrise.svg"
                alt=""
                class="w-[48px] h-[48px]"
              />
            </div>
            <div class="cursor-text">
              {{ formatTime(data.sunriseTime, data.timezone) }}
            </div>
          </div>
          <div
            id="sunset"
            class="font-color flex flex-col justify-center items-center"
          >
            <span class="cursor-text">Sunset</span>
            <div>
              <img src="../icons/sunset.svg" alt="" class="w-[48px] h-[48px]" />
            </div>
            <div class="cursor-text">
              {{ formatTime(data.sunsetTime, data.timezone) }}
            </div>
          </div>
        </div>
      </main>
      <hr class="border-1 border-indigo-300" />
      <footer>
        <div class="grid grid-cols-2 gap-4 p-2">
          <div class="flex flex-col flex-nowrap justify-center items-center">
            <p class="text-center font-color mb-2 cursor-text">Cloudiness</p>
            <img src="../icons/cloud.svg" alt="" class="w-[50px] h-[50px]" />
            <span class="font-color cursor-text">{{ data.cloudiness }}%</span>
          </div>
          <div class="flex flex-col flex-nowrap justify-center items-center">
            <p class="text-center font-color mb-2 cursor-text">Humidity</p>
            <img src="../icons/humidity.svg" alt="" class="w-[50px] h-[50px]" />
            <span class="font-color cursor-text">{{ data.humidity }}%</span>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { useDataStore } from "../stores/counter";
import { useCountriesStore } from "../stores/countries";
import { storeToRefs } from "pinia";
import { usePredictionStore } from "../stores/predict";
import { computed } from "vue";
import { ref, onMounted, watch } from "vue";
import { reactive } from "vue";

const predictionDataStore = usePredictionStore();

const { lat, lon, showPrediction, finalData, predictionDate, currentData } =
  storeToRefs(predictionDataStore);

// Import the store
const dataStore = useDataStore();

const { isFahrenheit, tempData, loading, currentWeatherData } =
  storeToRefs(dataStore);

const weatherData = ref(tempData.value);

const displayPrediction = async (lati, long) => {
  lat.value = lati;
  lon.value = long;
  showPrediction.value = true;
  await predictionDataStore.getWeatherPrediction();
  weatherData.value = tempData.value;
  weatherData.value = weatherData.value.filter((data) => {
    return data.lat == lati && data.lon == long;
  });
};

const currentDate = () => {
  const today = new Date();
  return today.toDateString();
};

const temperatureInCelsius = (temp) => {
  return Math.round(temp - 273.15);
};

const temperatureInFahrenheit = (temp) => {
  return Math.round((temp - 273.15) * (9 / 5) + 32);
};

const changeSpeed = (speed) => {
  return (speed * 2.23694).toFixed(2);
};

const formatTime = (timestamp, timeOffset) => {
  // Create a Date object from the timestamp
  const utcTime = new Date(timestamp * 1000);

  // Calculate the offset in milliseconds
  const offsetInMilliseconds = timeOffset * 1000;

  // Apply the offset to the UTC time
  const localTime = new Date(utcTime.getTime() + offsetInMilliseconds);

  // Extract hours, minutes, and seconds
  const hours = String(localTime.getUTCHours()).padStart(2, "0");
  const minutes = String(localTime.getUTCMinutes()).padStart(2, "0");
  const seconds = String(localTime.getUTCSeconds()).padStart(2, "0");

  // Format the time in 24-hour format
  return `${hours}:${minutes}:${seconds}`;
};
</script>

<style scoped></style>
