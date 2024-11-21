<template>
  <div class="container chat-container">
    <!-- 제목 표시 (헤더) -->
    <header class="chat-header">
      <button class="back-button" @click="goBack">뒤로</button>
      <h2 class="room-title">{{ roomName }}</h2>
    </header>

    <!-- 메시지 리스트 -->
    <ul class="list-group mt-3 chat-list" ref="messageList">
      <li
        class="list-group-item"
        v-for="(msg, index) in messages"
        :key="index"
        :class="{ 'my-message': msg.userId == userId, 'other-message': msg.userId != userId, 'notice': msg.userId == '[알림]' }"
      >
        <!-- 메시지 내용 -->
        <span class="message-user">
          <span>{{ msg.content }}</span>
        </span>
        <!-- 전송 시간 -->
        <span
          class="message-time"
          :class="{ 'time-my-message': msg.userId == userId, 'time-other-message': msg.userId != userId }"
        >
          {{ formatTime(msg.sendedDate) }}
        </span>
      </li>
    </ul>

    <!-- 메시지 입력 (푸터) -->
    <footer class="chat-footer">
      <div class="input-group">
        <input
          type="text"
          class="form-control"
          v-model="message"
          @keypress.enter="sendMessage"
          placeholder="메시지를 입력하세요"
        />
        <button class="btn btn-primary send-button" type="button" @click="sendMessage">
          전송
        </button>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useChatRoomStore } from '@/stores/chatRoom';

// Vue Router에서 roomId 가져오기
const route = useRoute();
const router = useRouter();
const roomId = ref(route.params.roomId);
const roomName = ref(route.params.roomName);
// Pinia Store 사용
const chatRoomStore = useChatRoomStore();

// 데이터 정의
const message = ref('');
const messages = computed(() => chatRoomStore.chatMessage);
const userId = computed(() => sessionStorage.getItem('userId'));
const stompClient = ref(null);
const messageList = ref(null);

// 뒤로 가기 함수
const goBack = () => {
  router.back();
};

// STOMP 연결 및 기타 함수들...
// (connect, disconnect, sendMessage, recvMessage 등은 동일)
</script>

<style scoped>
/* 모든 요소의 기본 마진, 패딩 제거 및 박스 크기 설정 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.chat-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 헤더 스타일 */
.chat-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
}

.back-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.back-button:hover {
  background-color: #0056b3;
}

.room-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

/* 메시지 리스트 */
.chat-list {
  flex: 1; /* 메시지 리스트가 가변적으로 확장되도록 설정 */
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 0.5em;
  list-style: none;
  gap: 5px;
  background-color: #b2c7d9;
}

.chat-list::-webkit-scrollbar {
  display: none;
}

/* 메시지 입력 (푸터) */
.chat-footer {
  position: sticky;
  bottom: 0;
  z-index: 10;
  background-color: #f8f9fa;
  padding: 10px 15px;
  border-top: 1px solid #ddd;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-control {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.send-button {
  flex-shrink: 0;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.send-button:hover {
  background-color: #0056b3;
}
</style>
