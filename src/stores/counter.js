// data.js
import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import { useCountriesStore } from "./countries"; // Ensure correct path
import { storeToRefs } from "pinia";

export const useDataStore = defineStore("data", () => {
  const primaryBgColor = ref("primary-bg-color");
  const secondaryBgColor = ref("secondary-bg-color");
  const weatherDescription = ref("");
  const city = ref("Yangon");
  const cityName = ref("");
  const currentData = ref(null);
  const tempData = ref([]);
  const loading = ref(null);
  const currentWeatherData = ref([]);
  const apiKey = "c4603d27d3f09b837913e033aaca0017";

  const countryInfo = useCountriesStore();
  const { countryData, countryCode } = storeToRefs(countryInfo);

  const getWeather = async () => {
    loading.value = true;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=${apiKey}`;
    try {
      const locationResponse = await fetch(url);
      const locationData = await locationResponse.json();
      currentData.value = locationData;
      countryCode.value = currentData.value.sys.country;
      await countryInfo.changeCountryFormat();
      const firstNativeLanguage = Object.keys(
        countryData.value.name.nativeName
      )[0];

      tempData.value.unshift({
        lat: locationData.coord.lat,
        lon: locationData.coord.lon,
        currentWeatherId: currentData.value.weather[0].id,
        currentTempMax: currentData.value.main.temp_max,
        currentTempMin: currentData.value.main.temp_min,
        sunsetTime: currentData.value.sys.sunset,
        sunriseTime: currentData.value.sys.sunrise,
        countryName: currentData.value.sys.country,
        timezone: currentData.value.timezone,
        currentTemp: currentData.value.main.temp,
        currentWeatherMain: currentData.value.weather[0].main,
        currentWeatherDescription: currentData.value.weather[0].description,
        cityName: currentData.value.name,
        humidity: currentData.value.main.humidity,
        windSpeed: currentData.value.wind.speed,
        cloudiness: currentData.value.clouds.all,
        countryNameInEng: countryData.value.name.common,
        countryNameInNative:
          countryData.value.name.nativeName[firstNativeLanguage].common,
      });
      currentWeatherData.value = tempData.value;
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      loading.value = false;
    }
  };

  const setCity = (newCity) => {
    cityName.value = newCity;
  };

  const isFahrenheit = ref(false);

  return {
    weatherDescription,
    getWeather,
    primaryBgColor,
    secondaryBgColor,
    city,
    setCity,
    currentData,
    cityName,
    isFahrenheit,
    tempData,
    currentWeatherData,
    loading,
  };
});
