<template>
    <div class="header-container">
      <!-- 로고 -->
      <button class="image-logo-container" @click="goHome">
        <img 
          src="@/assets/logo.png" 
          alt="Company Logo" 
          class="company-logo" 
        />
      </button>
  
      <!-- 사용자 이름과 로그아웃 버튼 -->
      <div class="user-info">
        <span class="user-nickname">{{ userNickname }}님 </span>
        <button @click="userAuthStore.logout" class="logout-button">로그아웃</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import router from '@/router';
  import { useUserAuthStore } from '@/stores/userAuth';
  
  const userAuthStore = useUserAuthStore();
  const userNickname = sessionStorage.getItem('userNickname');
  
  const goHome = function(){
    router.push({name:"main"});
  }
  </script>
  
  <style scoped>
  /* 컨테이너 스타일 */
  .header-container {
    display: flex;
    align-items: center;
    justify-content: space-between; /* 왼쪽과 오른쪽 정렬 */
    padding: 10px 20px; /* 내부 여백 */
    background-color: #ffffff; /* 배경색 */
    border-bottom: 1px solid #ccc; /* 구분선 */
  }
  
  /* 로고 영역 */
  .image-logo-container {
    display: flex;
    align-items: center;
    all: unset; /* 버튼의 기본 스타일 제거 */
    cursor: pointer; /* 클릭 가능 표시 */
  }
  
  .company-logo {
    width: 100px; /* 로고 크기 */
    height: auto;
  }
  
  /* 사용자 정보 영역 */
  .user-info {
    display: flex;
    align-items: center;
    gap: 10px; /* 텍스트와 버튼 사이 간격 */
  }

  .user-nickname {
    font-weight: bold;
  }
  
  .logout-button {
    padding: 5px 10px;
    font-size: 14px;
    color: #555;
    background-color: #ffffff;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .logout-button:hover {
    background-color: #ff5722;
  }
  </style>
  