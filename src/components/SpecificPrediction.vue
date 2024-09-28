<template>
  <div>
    <div
      class="grid grid-cols-3 h-[50px] justify-between items-stretch border-2"
    >
      <div
        class="border-e-2 text-center cursor-pointer flex items-center justify-center"
        @click="dataType = 'humidity'"
        :class="dataType == 'humidity' ? 'bg-gray-700 bg-opacity-25' : ''"
      >
        Humidity
      </div>
      <div
        class="border-e-2 text-center cursor-pointer flex items-center justify-center"
        @click="dataType = 'cloudiness'"
        :class="dataType == 'cloudiness' ? 'bg-gray-700 bg-opacity-25' : ''"
      >
        Cloudiness
      </div>
      <div
        class="text-center cursor-pointer flex items-center justify-center"
        @click="dataType = 'windSpeed'"
        :class="dataType == 'windSpeed' ? 'bg-gray-700 bg-opacity-25' : ''"
      >
        Wind Speed
      </div>
    </div>
    <div :class="primaryBgColor" class="rounded-lg shadow-2xl p-5 h-[250px]">
      <div
        :class="secondaryBgColor"
        class="rounded-md h-full shadow-2xl flex justify-center"
      >
        <canvas ref="predictionChart" class="w-full h-full"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDataStore } from "../stores/counter";
import { storeToRefs } from "pinia";
import { usePredictionStore } from "../stores/predict";
import { ref, watch, nextTick } from "vue";
import { Chart, registerables } from "chart.js";

// Register Chart.js components
Chart.register(...registerables);

// Import the store
const dataStore = useDataStore();
const predictionDataStore = usePredictionStore();

// Use storeToRefs for state variables
const { primaryBgColor, secondaryBgColor } = storeToRefs(dataStore);
const { finalData } = storeToRefs(predictionDataStore);

// Initialize reactive variables
const predictionChart = ref(null);
const chartInstance = ref(null); // To hold the chart instance
const dataType = ref("windSpeed"); // Initial data type

// Watch for changes in finalData to create the initial chart
watch(finalData, (newData) => {
  if (newData.list) {
    updateChart(newData.list); // Pass the complete list
  }
});
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// Watch for changes in dataType to update the chart accordingly
watch(dataType, async (newType) => {
  const newData = finalData.value.list; // Get the current data
  if (newData) {
    updateChart(newData); // Update chart when dataType changes
    await sleep(2000);
  }
});

// Function to update the chart based on the current dataType
const updateChart = (dataList) => {
  // Get today's date at midnight to compare
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to midnight for accurate comparison

  // Filter out today's data and start from tomorrow
  const tomorrowData = dataList.filter((item) => new Date(item.dt_txt) > today);

  // Take only the first 32 entries (4 days of 8 readings each)
  const fourDayData = tomorrowData.slice(0, 32);
  createPredictionChart(fourDayData); // Pass filtered data to the chart creation function
};

// Function to create/update the Prediction chart
const createPredictionChart = (fourDayData) => {
  nextTick(() => {
    // Check if the canvas is rendered and ready
    if (predictionChart.value) {
      const ctx = predictionChart.value.getContext("2d");

      // Ensure the context is available
      if (ctx) {
        // Destroy previous chart instance if it exists
        if (chartInstance.value) {
          chartInstance.value.destroy();
        }

        // Prepare labels for 4 days with 8 readings each
        const labels = [];
        for (let i = 0; i < fourDayData.length; i += 8) {
          const date = new Date(fourDayData[i].dt_txt);
          labels.push(date.toLocaleDateString("en-US", { weekday: "short" })); // Get short weekday names
        }

        // Prepare prediction data based on the selected dataType
        const predictionData = [];
        if (dataType.value === "cloudiness") {
          for (let i = 0; i < 4; i++) {
            predictionData.push(
              ...fourDayData
                .slice(i * 8, (i + 1) * 8)
                .map((item) => item.clouds.all)
            );
          }
        } else if (dataType.value === "humidity") {
          for (let i = 0; i < 4; i++) {
            predictionData.push(
              ...fourDayData
                .slice(i * 8, (i + 1) * 8)
                .map((item) => item.main.humidity)
            );
          }
        } else if (dataType.value === "windSpeed") {
          for (let i = 0; i < 4; i++) {
            predictionData.push(
              ...fourDayData
                .slice(i * 8, (i + 1) * 8)
                .map((item) => item.wind.speed * 2.23694) // Convert m/s to mph
            );
          }
        } else {
          console.log("Error: Unsupported data type");
        }

        const displayUnit = dataType.value === "windSpeed" ? " (mph)" : " (%)";

        // Create a new chart instance
        chartInstance.value = new Chart(ctx, {
          type: "line",
          data: {
            labels: labels, // Using day names as labels
            datasets: [
              {
                label: dataType.value + displayUnit,
                data: predictionData, // Use prepared data
                borderColor: "rgba(93, 125, 189, 1)",
                backgroundColor: "rgba(93, 125, 189, 0.2)",
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: dataType.value + displayUnit,
                },
              },
              x: {
                title: {
                  display: true,
                  text: "Days",
                },
              },
            },
            plugins: {
              legend: {
                display: true,
              },
            },
          },
        });
      } else {
        console.error("Failed to get context from canvas");
      }
    } else {
      console.error("Canvas element not found or not yet rendered");
    }
  });
};
</script>

<style scoped>
canvas {
  max-width: 100%; /* Ensure the canvas fits its container */
  height: auto; /* Maintain aspect ratio */
}
</style>
