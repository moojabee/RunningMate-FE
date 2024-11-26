
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from 'axios';

import { useKakao } from 'vue3-kakao-maps/@utils';

useKakao(import.meta.env.VITE_KAKAO_API_KEY);

const app = createApp(App)

// Axios 글로벌 기본 설정
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

app.use(createPinia())
app.use(router)

app.mount('#app')
