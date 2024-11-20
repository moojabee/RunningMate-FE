<template>
  <div class="app-container">
    <!-- 헤더 -->
    <header class="header">
      <TheHeaderNav />
    </header>

    <!-- 라우터 영역 -->
    <main class="main-content">
      <RouterView />
    </main>

    <!-- 푸터 -->
    <footer class="footer">
      <TheFooterNav />
    </footer>
  </div>
</template>

<script setup>
import TheFooterNav from '@/components/common/TheFooterNav.vue';
import TheHeaderNav from '@/components/common/TheHeaderNav.vue';
import { useUserAuthStore } from '@/stores/userAuth';

const userAuthStore = useUserAuthStore();
const userId = sessionStorage.getItem('userId');
</script>

<style scoped>
/* 전체 레이아웃 컨테이너 */
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 화면 전체 높이 */
}

/* 헤더 스타일 */
.header {
  flex: 1; /* 높이 비율 1 */
  position: fixed; /* 화면 상단에 고정 */
  top: 0;
  left: 0;
  width: 100%;
  background-color: #f8f8f8; /* 배경색 */
  z-index: 1000; /* 상단에 표시되도록 설정 */
  border-bottom: 1px solid #ccc; /* 구분선 */
  text-align: right;
}

/* 라우터 콘텐츠 영역 */
.main-content {
  flex: 3; /* 높이 비율 3 */
  margin-top: 10%; /* 헤더 높이만큼 여백 추가 */
  margin-bottom: 10%; /* 푸터 높이만큼 여백 추가 */
  padding: 16px;
  overflow-y: auto; /* 콘텐츠가 많을 경우 스크롤 활성화 */
}

/* 푸터 스타일 */
.footer {
  flex: 1; /* 높이 비율 1 */
  position: fixed; /* 화면 하단에 고정 */
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #f8f8f8; /* 배경색 */
  z-index: 1000; /* 상단에 표시되도록 설정 */
  border-top: 1px solid #ccc; /* 구분선 */
}
</style>
