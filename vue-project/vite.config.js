import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  server: {
    proxy: {
      '/ws-stomp': {
        target: 'http://localhost:8080', // Spring Boot 서버 URL
        changeOrigin: true,
        ws: true, // WebSocket 프록시 활성화
        rewrite: (path) => path.replace(/^\/ws-stomp/, '/ws-stomp'),
      },
    },
  },
  define: {
    global: {}, // global 객체 정의
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
