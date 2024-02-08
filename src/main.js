import { createApp } from 'vue'
import { createWebHistory, createRouter } from "vue-router";

import App from './App.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [],
});

createApp(App).use(router).mount('#app')
