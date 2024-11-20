<template>
    <div class="find-password-page">
      <!-- 이미지와 로고 컨테이너 -->
      <div class="image-logo-container">
        <!-- 달리는 사람 이미지 -->
        <img 
          src="https://cdni.iconscout.com/illustration/premium/thumb/running-5071161-4257158.png?f=webp" 
          alt="Running Person" 
          class="running-image" 
        />
        <!-- 로고 이미지 -->
        <img 
          src="@/assets/logo.png" 
          alt="Company Logo" 
          class="company-logo" 
        />
      </div>
  
      <!-- 비밀번호 찾기 박스 -->
      <div class="find-password-container">
        <h2 class="title">비밀번호 찾기</h2>
        <p class="subtitle">가입한 이메일을 입력해주세요.</p>
        <div class="input-group">
          <input 
            type="text" 
            placeholder="이메일 입력" 
            v-model.trim="email" 
            class="input-field" 
            @keyup.enter="find"
          />
        </div>
        <button class="find-button" @click="find">
          비밀번호 찾기
        </button>
        <div class="link-group">
          <RouterLink :to="{ name: 'login' }" class="link">로그인</RouterLink>
          <RouterLink :to="{ name: 'regist' }" class="link">회원가입</RouterLink>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useUserAuthStore } from '@/stores/userAuth';
  
  const email = ref('');
  const store = useUserAuthStore();
  
  const find = () => {
    if (!email.value.trim()) {
      alert('이메일을 입력해주세요.');
      return;
    }
    store.findPassword(email.value);
  };
  </script>
  
  <style scoped>
  /* 전체 페이지 스타일 */
  .find-password-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #FAB058; /* 로그인과 동일한 배경색 */
  }
  
  /* 이미지와 로고 컨테이너 */
  .image-logo-container {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 50px;
  }
  
  .running-image {
    width: 180px;
    height: auto;
  }
  
  .company-logo {
    width: 240px;
    height: auto;
  }
  
  /* 비밀번호 찾기 박스 스타일 */
  .find-password-container {
    max-width: 400px;
    width: 70%;
    padding: 20px;
    border-radius: 12px;
    background-color: #f8f8f8;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    margin-bottom: 100px;
  }
  
  .title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }
  
  .subtitle {
    font-size: 14px;
    color: #666;
    margin-bottom: 20px;
  }
  
  .input-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .input-field {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.3s;
  }
  
  .input-field:focus {
    border-color: #007bff;
    outline: none;
  }
  
  .find-button {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    color: #fff;
    background-color: #F7555C;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .find-button:hover {
    background-color: #8300b3;
  }
  
  .link-group {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
  }
  
  .link {
    font-size: 14px;
    color: #007bff;
    text-decoration: none;
    transition: color 0.3s;
  }
  
  .link:hover {
    color: #0056b3;
  }
  
  /* 반응형 스타일 */
  @media (max-width: 768px) {
    .image-logo-container {
      flex-direction: column; /* 이미지를 세로로 정렬 */
      gap: 10px; /* 간격 축소 */
    }
  
    .running-image {
      width: 140px; /* 이미지 크기 축소 */
    }
  
    .company-logo {
      width: 180px; /* 로고 크기 축소 */
    }
  
    .find-password-container {
      padding: 15px; /* 내부 여백 축소 */
      max-width: 90%; /* 전체 화면의 90%로 설정 */
    }
  
    .title {
      font-size: 20px; /* 제목 크기 축소 */
      margin-bottom: 1em;
    }
  
    .subtitle {
      font-size: 12px; /* 부제목 크기 축소 */
    }
  
    .input-field {
      font-size: 12px; /* 입력 필드 글자 크기 축소 */
    }
  
    .find-button {
      font-size: 14px; /* 버튼 글자 크기 축소 */
      padding: 10px; /* 버튼 높이 축소 */
    }
  
    .link {
      font-size: 12px; /* 링크 글자 크기 축소 */
    }
  }
  </style>
  