<template>
    <div>
      <nav class="icon-nav">
        <!-- Board 버튼 -->
        <RouterLink :to="{ name: 'board' }" class="icon-link">
          <img src="@/assets/menu/Home.png" 
           style="width: 32px; height: 32px; object-fit: cover" alt="Board" />
        </RouterLink>
  
        <!-- Chat 버튼 -->
        <RouterLink :to="{ name: 'chat' }" class="icon-link">
          <img src="@/assets/menu/Chat.png"
          style="width: 30px; height: 30px; object-fit: cover"  alt="Chat" />
        </RouterLink>
  
        <!-- Run 버튼 -->
        <RouterLink :to="{ name: 'board' }" class="icon-link">
          <img src="@/assets/menu/Run.png" alt="Run"
          style="width: 35px; height: 35px; object-fit: cover"  />
        </RouterLink>
  
        <!-- MyPage 버튼 -->
        <RouterLink 
          :to="{ name: 'myPage', params: { userId: userId } }" 
          :key="userId" 
          class="icon-link"
        >
          <img src="@/assets/menu/Profile.png" alt="My Page"
          style="width: 35px; height: 35px; object-fit: cover"  />
        </RouterLink>
      </nav>
    </div>
  </template>
  
  <script setup>
    const userId = sessionStorage.getItem('userId');
  </script>
  
  <style scoped>
  /* 네비게이션 스타일 */
  .icon-nav {
    display: flex;
    justify-content: space-between; /* 버튼 간격 균등 배치 */
    align-items: center; /* 세로 정렬 */
    width: 100%; /* 네비게이션 전체 너비 */
    margin: 20px 0;
  }
  
  .icon-link {
    flex: 1; /* 각 버튼이 동일한 크기로 나눠짐 */
    text-align: center; /* 버튼을 가운데 정렬 */
  }
  
  .icon-link img {
    width: 40px; /* 버튼 크기 조정 */
    height: 40px;
    cursor: pointer;
    transition: transform 0.3s ease; /* 호버 시 애니메이션 효과 */
  }
  
  .icon-link img:hover {
    transform: scale(1.3); /* 확대 효과 */
  }
  </style>
  