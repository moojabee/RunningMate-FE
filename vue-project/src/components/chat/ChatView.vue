<template>
    <div class="chat-container">
        <!-- chat-header 전체를 조건부 렌더링 -->
        <div class="chat-header" v-if="$route.name !== 'entryRoom'">
            <nav>
                <RouterLink 
                    :to="{ name: 'privateChatList' }"
                    :class="{ active: $route.name === 'privateChatList' }">채팅방</RouterLink> |
                <RouterLink 
                    :to="{ name: 'openChatList' }"
                    :class="{ active: $route.name === 'openChatList' }">오픈 채팅방</RouterLink> |
                <RouterLink
                    :to="{ name: 'createChat' }"
                    :class="{ active: $route.name === 'createChat' }">방 생성</RouterLink>
            </nav>
        </div>
        <div class="chat-content">
            <RouterView />
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 부모 요소(main-content) 안에서 전체 높이 */
}

/* 상단바 스타일 */
.chat-header {
  height: 50px; /* 고정된 높이 */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  position: sticky; /* 상단 고정 */
  top: 0;
  z-index: 10; /* 다른 콘텐츠 위에 표시 */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.chat-header a {
  text-decoration: none;
  color: #888;
  font-weight: bold;
  font-size: 1rem;
  padding: 10px 15px;
}

.chat-header a.active {
  color: #ff5722;
  border-bottom: 2px solid #ff5722;
}

/* 콘텐츠 영역 */
.chat-content {
  flex: 1; /* 남은 공간을 채움 */
  overflow-y: auto; /* 스크롤 가능 */
}

</style>
