<template>
  <div
    style="
      background-image: url('./img/blue-sky-with-white-clouds-sky-background.jpg');
    "
  >
    <!-- Alert when city input is invalid -->
    <div
      v-if="invalidCity"
      id="alert-border-2"
      class="z-50 flex items-center p-4 mb-4 text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800"
      role="alert"
    >
      <svg
        class="flex-shrink-0 w-4 h-4"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
        />
      </svg>
      <div class="ms-3 text-sm font-medium">
        Your input {{ inputName }} is not a valid city. Please enter a valid
        city name.
      </div>
      <button
        type="button"
        class="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
        @click="invalidCity = false"
        aria-label="Close"
      >
        <span class="sr-only">Dismiss</span>
        <svg
          class="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>

    <div class="max-w-5xl mx-auto min-h-screen px-5 pt-3">
      <!-- search bar and temperature unit toggle -->
      <header class="flex flex-rows w-full justify-between items-center">
        <div class="max-w-md grow relative">
          <input
            v-model="inputName"
            type="text"
            class="w-full md:w-[471px] rounded-full h-[50px] px-10 text-[1.2rem] focus:outline-none focus:border-0"
            :placeholder="[
              emptyInput ? 'Enter city name first...' : 'Search...',
            ]"
            @keyup.enter="getData"
            @blur="handleBlur"
            :class="[emptyInput ? 'placeholder:text-red-300' : '']"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-8 float-end absolute top-2 right-2 cursor-pointer"
            @click="getData"
            v-if="inputName.length == 0"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m20.893 13.393-1.135-1.135a2.252 2.252 0 0 1-.421-.585l-1.08-2.16a.414.414 0 0 0-.663-.107.827.827 0 0 1-.812.21l-1.273-.363a.89.89 0 0 0-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 0 1-1.81 1.025 1.055 1.055 0 0 1-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 0 1-1.383-2.46l.007-.042a2.25 2.25 0 0 1 .29-.787l.09-.15a2.25 2.25 0 0 1 2.37-1.048l1.178.236a1.125 1.125 0 0 0 1.302-.795l.208-.73a1.125 1.125 0 0 0-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 0 1-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 0 1-1.458-1.137l1.411-2.353a2.25 2.25 0 0 0 .286-.76m11.928 9.869A9 9 0 0 0 8.965 3.525m11.928 9.868A9 9 0 1 1 8.965 3.525"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-8 float-end absolute top-2 right-2 cursor-pointer"
            @click="handleBlur"
            v-if="inputName.length != 0"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>

          <!-- <div
            class="md:absolute w-full bg-white border border-gray-300 rounded-b-xl md:w-[471px] max-h-[400px] overflow-auto z-50 shadow-2xl shadow-slate-900"
            v-if="inputEntered"
          >
            <p
              v-if="filteredName.length === 0"
              class="px-10 py-2 text-gray-400"
            >
              No matching cities found.
            </p>
            <p
              v-for="(city, index) in filteredName"
              :key="index"
              class="hover:bg-gray-200 px-10 py-2 cursor-pointer"
              @click="getWeatherWithAutoComplete(city.name)"
            >
              {{ city.name }}, {{ city.country }}
            </p>
          </div> -->
        </div>
        <div>
          <div
            id="fcToggleContainer"
            class="w-[80px] h-[40px] p-[2px] rounded-sm shadow-inner shadow-gray-500 transition-all duration-300 ms-auto relative flex flex-row items-center cursor-pointer"
            @click="toggleUnit"
            :class="[isFahrenheit ? 'bg-red-500' : 'bg-green-800']"
          >
            <span class="grow text-center text-white">F</span>
            <div
              id="fcToggle"
              class="w-[40px] h-[36px] bg-gray-100 rounded-sm flex items-center justify-center transition-transform duration-300 absolute"
              :class="[isFahrenheit ? 'translate-x-[36px]' : '']"
            >
              <img src="./icons/temp.svg" alt="" class="w-[30px] h-[30px]" />
            </div>
            <span class="grow text-center text-white">C</span>
          </div>
        </div>
      </header>
      <main
        class="grid mt-5"
        :class="[showPrediction ? 'lg:grid-cols-2' : 'grid-cols-1']"
      >
        <div class="">
          <CurrentWeather></CurrentWeather>
        </div>
        <div v-if="showPrediction">
          <div class="w-full flex justify-end">
            <button
              class="bg-transparent p-2 border border-black rounded-md ms-auto"
              @click="backToDashboard"
            >
              Back
            </button>
          </div>
          <Prediction></Prediction>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import CurrentWeather from "./components/CurrentWeather.vue";
import Prediction from "./views/Prediction.vue";
import { useDataStore } from "./stores/counter";
import { storeToRefs } from "pinia";
import { usePredictionStore } from "./stores/predict";
import { useCountriesStore } from "./stores/countries";

const inputName = ref("");
const invalidInput = ref(false);

// Define a method to toggle the unit
const toggleUnit = () => {
  isFahrenheit.value = !isFahrenheit.value;
};

//* get country data from pinia store file
const countriesDataStore = useCountriesStore();

const {
  changeCountryFormat,
  countryData,
  countryCode,
  getCountryInfo,
  availableInputName,
  userInputName,
  filteredName,
  inputEntered,
} = storeToRefs(countriesDataStore);

//* watch for input changes
watch(inputName, (newValue) => {
  userInputName.value = newValue;
});

// Fetch country data from pinia store file
onMounted(async () => {
  // Fetch the data
  await countriesDataStore.fetchCountryData();
});

const predictionDataStore = usePredictionStore();

const { lat, lon, showPrediction, finalData, predictionDate, currentData } =
  storeToRefs(predictionDataStore);
// Import the store
const dataStore = useDataStore();
// Use storeToRefs for state variables
const { primaryBgColor, secondaryBgColor, city, isFahrenheit, invalidCity } =
  storeToRefs(dataStore);

// Access `getWeather` and `setCity` from the store
const getWeather = dataStore.getWeather;
const setCity = dataStore.setCity;
const emptyInput = ref(false);
const emptyInputText = ref("Enter city name first...");
// Watch for changes to the city input
watch(inputName, (newCity) => {
  if (newCity) {
    setCity(newCity);
  }
});

// get weather data for default city
getWeather();

//look for cursor to check the input
const handleBlur = () => {
  setTimeout(() => {
    clearInput();
  }, 200); // Adding a delay of 200ms to give time for clicks on autocomplete options
};

// clear input when user search
const clearInput = () => {
  inputName.value = ""; // Clear the input field value
  inputEntered.value = false; // Reset inputEntered state
};

//FIXME: get city and country names with api
const getWeatherWithAutoComplete = (cityName) => {
  inputName.value = cityName;
  getData();
};

// Method to update the city and weather data
const getData = () => {
  if (inputName.value) {
    console.log(inputName.value);
    console.log(filteredName.value);
    setCity(inputName.value);
    city.value = inputName.value;
    inputName.value = "";
    getWeather();
    showPrediction.value = false;
    filteredName.value = [];
  } else {
    emptyInput.value = true;
  }
};
// back to views current weather display
const backToDashboard = () => {
  showPrediction.value = false;
};
</script>
