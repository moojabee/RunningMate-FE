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
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 전체 레이아웃 컨테이너 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 전체 레이아웃 컨테이너 */
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 화면 전체 높이 */
  overflow: hidden; /* 불필요한 스크롤 제거 */
}

/* 헤더 스타일 */
.header {
  height: 50px; /* 고정된 높이 */
  position: fixed; /* 화면 상단에 고정 */
  top: 0;
  left: 0;
  width: 100%;
  background-color: #f8f8f8; /* 배경색 */
  z-index: 1000; /* 다른 요소보다 위에 표시 */
  border-bottom: 1px solid #ccc; /* 구분선 */
}

/* 라우터 콘텐츠 영역 */
.main-content {
  flex: 1; /* 헤더와 푸터를 제외한 영역 차지 */
  margin-top: 50px; /* 헤더 높이 */
  margin-bottom: 80px; /* 푸터 높이 */
  overflow: hidden; /* 스크롤 제거 */
  position: relative; /* 내부 요소 위치 조정 가능 */
}

/* 푸터 스타일 */
.footer {
  height: 80px; /* 고정된 높이 */
  position: fixed; /* 화면 하단에 고정 */
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #f8f8f8; /* 배경색 */
  z-index: 1000; /* 다른 요소보다 위에 표시 */
  border-top: 1px solid #ccc; /* 구분선 */
}
</style>