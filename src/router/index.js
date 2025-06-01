import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView,
        },
        {
            path: "/search",
            name: "search",
            component: () => import("../views/SearchView.vue"),
        },
        {
            path: "/favorites",
            name: "favorites",
            component: () => import("../views/FavoritesView.vue"),
        },
        {
            path: "/movie/:id",
            name: "movie",
            component: () => import("../views/MovieView.vue"),
        },
    ],
});

export default router;
