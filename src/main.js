import { createApp } from 'vue'
import App from './App.vue'
import $http from './utils/http';
import router from './router';

const app = createApp(App);
app.use(router);
app.config.globalProperties.$http=$http;
app.mount('#app')
