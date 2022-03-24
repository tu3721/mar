import { createRouter,createWebHashHistory } from "vue-router";
import Index from '../views/index';

const routes = [
    { path: "/", redirect: "/index" },
    {
        path: "/index",
        name: "index",
        component: Index,

    },
]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router