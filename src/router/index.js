import { createRouter, createWebHistory } from "vue-router";
const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../App.vue"),
    // redirect: "/", // Redirect to a child route
    // children: [
    //   {
    //     path: "",
    //     name: "Detail",
    //     component: () => import("../views/Dashboard.vue"), // Child route
    //   },
    //   {
    //     path: "profile",
    //     name: "Profile",
    //     component: () => import("../views/Profile.vue"), // Another child route
    //   },
    // ],
  },
  // other routes
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
