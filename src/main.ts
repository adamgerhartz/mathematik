import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import Storage from 'vue-ls';
import App from './App.vue'
import MainWidgetComponent from './components/MainWidgetComponent.vue';
import NotFoundComponent from './components/NotFoundComponent.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: MainWidgetComponent, props: { practiceType: "N/A" } },
    { path: "/addition", component: MainWidgetComponent, props: { practiceType: "addition" } },
    { path: "/subtraction", component: MainWidgetComponent, props: { practiceType: "subtraction" } },
    { path: "/404", component: NotFoundComponent },
    { path: "/:catchAll(.*)", redirect: "/404" }
  ]
});

const storageOptions = {
  namespace: "vuejs_",
  name: "ls",
  storage: "session"
}

const app = createApp(App)
app.use(router)
   .use(Storage, storageOptions)
   .mount('#app')
