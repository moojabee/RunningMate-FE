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
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  base: '/', // Netlify 배포 시 절대 경로로 설정
  define: {
    global: 'window', // global 객체 정의
  },
  optimizeDeps: {
    include: ['swiper/vue'],
  },
  // build: {
  //   outDir: 'dist', // 빌드 결과물 디렉터리 설정
  //   rollupOptions: {
  //     output: {
  //       assetFileNames: '[name][extname]', // 정적 파일 이름 규칙
  //     },
  //   },
  // },
  // server: {

  //   proxy: {
  //     '/': {
  //       target: 'https://www.runningmate.shop',  // Spring Boot 서버의 실제 IP로 변경 (https:// 추가)
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, ''),  // /api 제거
  //       secure: true,  // secure를 true로 설정 (https 요청이므로)
  //     },
  //   },
  // }
});
  