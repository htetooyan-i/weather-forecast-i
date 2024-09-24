// countries.js
import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";
import axios from "axios";

export const useCountriesStore = defineStore("countries", () => {
  const countryData = ref([]);
  const countryCode = ref("MM");
  const availableInputName = ref([]);
  const countryNames = ref([]);
  const userInputName = ref("");
  const filteredName = ref([]);
  const inputEntered = ref(false);

  const changeCountryFormat = async () => {
    try {
      const countryApi = await fetch(
        `https://restcountries.com/v3.1/alpha/${countryCode.value}`
      );
      const result = await countryApi.json();
      countryData.value = result[0]; // Store the result in countryData
    } catch (error) {
      console.error("Error fetching country data:", error);
    }
  };

  const getCountryInfo = async () => {
    await changeCountryFormat();
    return countryData.value;
  };

  const fetchCountryData = async () => {
    try {
      const response = await fetch("/citySmall.list.json");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const jsonData = await response.json();
      const availableInput = jsonData; // Assuming this is an array of input names

      // Map over availableInput to create an array of Promises
      const countryPromises = availableInput.map(async (inputName) => {
        countryCode.value = inputName.country;
        await getCountryInfo(); // Wait for country info to be fetched

        // Check if countryData is valid and contains the necessary info
        if (
          countryData.value &&
          countryData.value.name &&
          countryData.value.name.common
        ) {
          return {
            name: inputName.name,
            country: countryData.value.name.common, // Access common country name
          };
        }
      });

      // Wait for all promises to resolve
      const resolvedCountries = await Promise.all(countryPromises);

      // Filter out any undefined results (in case getCountryInfo failed)
      availableInputName.value = resolvedCountries.filter(Boolean);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  watch(userInputName, (input) => {
    if (input == "") {
      filteredName.value = [];
      inputEntered.value = false;
    } else {
      const filteredNames = availableInputName.value.filter((entry) => {
        return (
          entry.name.toLowerCase().startsWith(input.toLowerCase()) ||
          entry.country.toLowerCase().startsWith(input.toLowerCase())
        );
      });

      // Optionally, store the filtered results if needed for further use
      filteredName.value = filteredNames;
      inputEntered.value = true;
    }
  });

  return {
    changeCountryFormat,
    countryData,
    countryCode,
    getCountryInfo,
    availableInputName,
    fetchCountryData,
    userInputName,
    filteredName,
    inputEntered,
  };
});
