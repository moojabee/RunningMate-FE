
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from 'axios';

const app = createApp(App)

// Axios 글로벌 기본 설정
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

app.use(createPinia())
app.use(router)

app.mount('#app')
