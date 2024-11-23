import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)), // @ 경로 설정
    },
  },
  base: '/', // Netlify 배포 시 절대 경로로 설정
  define: {
    global: 'window', // global 객체 정의
  },
  optimizeDeps: {
    include: ['swiper/vue'], // Swiper를 명시적으로 포함
  },
  build: {
    outDir: 'dist', // 빌드 결과물 디렉터리 설정
    rollupOptions: {
      output: {
        assetFileNames: '[name][extname]', // 정적 파일 이름 규칙
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://www.runningmate.shop:', // 백엔드 서버 URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // /api 제거
        secure: true, // HTTPS 요청 허용
      },
    },
  },
});
