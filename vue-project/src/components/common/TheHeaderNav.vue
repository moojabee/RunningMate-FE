<template>
    <div class="header-container">
      <!-- 로고 -->
      <span class="image-logo-container">
        <img 
          src="@/assets/logo.png" 
          alt="Company Logo" 
          class="company-logo" 
        />
      </span>
  
      <!-- 사용자 이름과 로그아웃 버튼 -->
      <div class="user-info">
        <span>{{ userNickname }}님</span>
        <button @click="userAuthStore.logout" class="logout-button">로그아웃</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useUserAuthStore } from '@/stores/userAuth';
  
  const userAuthStore = useUserAuthStore();
  const userNickname = sessionStorage.getItem('userNickname');
  </script>
  
  <style scoped>
  /* 컨테이너 스타일 */
  .header-container {
    display: flex;
    align-items: center;
    justify-content: space-between; /* 왼쪽과 오른쪽 정렬 */
    padding: 10px 20px; /* 내부 여백 */
    background-color: #f8f8f8; /* 배경색 */
    border-bottom: 1px solid #ccc; /* 구분선 */
  }
  
  /* 로고 영역 */
  .image-logo-container {
    display: flex;
    align-items: center;
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
  
  .logout-button {
    padding: 5px 10px;
    font-size: 14px;
    color: white;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .logout-button:hover {
    background-color: #0056b3;
  }
  </style>
  