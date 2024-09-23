import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./assets/tailwind.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");

// const fcToggleContainer = document.querySelector("#fcToggleContainer");
// const fcToggle = document.querySelector("#fcToggle");

// fcToggleContainer.addEventListener("click", () => {
//   fcToggle.classList.toggle("translate-x-[36px]");
// });
