<template>
  <div class="container chat-container">
    <!-- 헤더 -->
    <header class="chat-header">
      <button class="back-button" @click="goBack">
        <img src="@/assets/chat/back.png" alt="뒤로" class="back-icon" />
      </button>
      <h2 class="room-title">{{ roomName }}</h2>
    </header>

    <!-- 채팅 리스트 -->
    <ul class="chat-list" ref="messageList">
      <li
        class="list-group-item"
        v-for="(msg, index) in messages"
        :key="index"
        :class="{ 'my-message': msg.userId == userId, 'other-message': msg.userId != userId, 'notice': msg.userId == '[알림]' }"
      >
        <!-- 시간 -->
        <span
          class="message-time"
          :class="{ 'time-my-message': msg.userId == userId, 'time-other-message': msg.userId != userId }"
        >
          {{ formatTime(msg.sendedDate) }}
        </span>
        <!-- 메시지 내용 -->
        <span class="message-user">{{ msg.content }}</span>
      </li>
    </ul>

    <!-- 푸터 -->
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
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useRoute } from 'vue-router';
import { useChatRoomStore } from '@/stores/chatRoom';
import router from '@/router';

// Vue Router에서 roomId 가져오기
const route = useRoute();
const roomId = ref(route.params.roomId);
const roomName = ref(route.params.roomName)
// Pinia Store 사용
const chatRoomStore = useChatRoomStore();

// 데이터 정의
const message = ref('');
const messages = computed(() => chatRoomStore.chatMessage);
const userId = computed(() => sessionStorage.getItem('userId'));
const stompClient = ref(null);
const messageList = ref(null);
const isLoad = ref(false);

// 시간을 시:분:초 형식으로 변환하는 함수
const formatTime = (dateTime) => {
  if (!dateTime) return '';
  const date = new Date(dateTime);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

const goBack = () => {
  router.back();
};

// STOMP 연결 함수
const connect = () => {
  const socket = new SockJS('http://localhost:8080/ws-stomp');
  stompClient.value = Stomp.over(socket);
  stompClient.value.connect(
    {},
    () => {
      console.log('STOMP 연결 성공');
      stompClient.value.subscribe(`/sub/chat/room/${roomId.value}`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        recvMessage(receivedMessage);
      });

      stompClient.value.send(
        '/pub/chat/message',
        {},
        JSON.stringify({
          messageType: 'ENTER',
          roomId: roomId.value,
          userId: userId.value,
          content: '',
        })
      );
    },
    (error) => {
      console.error('STOMP 연결 실패: ', error);
    }
  );
    console.log(userId.value);
};

// STOMP 해제 함수
const disconnect = () => {
  if (stompClient.value) {
    stompClient.value.disconnect(() => {
      console.log('STOMP 연결 해제 성공');
    }, (error) => {
      console.error('STOMP 연결 해제 실패:', error);
    });
  }
};

// 메시지 전송 함수
const sendMessage = () => {
  if (stompClient.value && message.value.trim()) {
    stompClient.value.send(
      '/pub/chat/message',
      {},
      JSON.stringify({
        messageType: 'TALK',
        roomId: roomId.value,
        userId: userId.value,
        content: message.value.trim(),
      })
    );
    message.value = '';
  }
};

// 메시지 수신 처리 함수
const recvMessage = (receivedMessage) => {
  messages.value.push({
    userId: receivedMessage.messageType == 'ENTER' ? '[알림]' : receivedMessage.userId,
    content: receivedMessage.content,
    sendedDate: receivedMessage.sendedDate,
  });

  nextTick(() => scrollToBottom());
};

// 스크롤 하단 이동
const scrollToBottom = () => {
  if (messageList.value) {
    messageList.value.scrollTop = messageList.value.scrollHeight;
  }
};

// 이전 채팅 불러오기
const loadPreviousChats = async () => {
  try {
    await chatRoomStore.loadChatting(roomId.value);
    messages.value = chatRoomStore.chatMessage;
  } catch (error) {
    console.error('이전 채팅 로드 실패:', error);
  }
};

onMounted(() => {
  loadPreviousChats();
  connect();
});

onUnmounted(()=>{
  disconnect();
});
</script>
<style scoped>
/* 기본 스타일 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.chat-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 헤더 스타일 */
.chat-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
  height: 60px; /* 고정 높이 */
}

.back-button {
  background-color: transparent;
  border: none;
  padding: 0;
}

.back-icon {
  width: 40px;
  height: 40px;
}

/* 채팅 리스트 스타일 */
.chat-list {
  flex: 1;
  overflow-y: auto;
  background-color: #b2c7d9; /* 배경색 유지 */
  padding: 10px;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: calc(100vh - 120px); /* 헤더(60px) + 푸터(60px)를 제외한 높이 */
}

/* 메시지가 없을 때 기본 메시지 추가 */
.chat-list:empty::after {
  content: '메시지가 없습니다.'; /* 기본 텍스트 */
  color: #888;
  text-align: center;
  font-size: 1rem;
  width: 100%;
  display: block;
  margin-top: 20px;
}

/* 메시지 스타일 */
.list-group-item {
  padding: 10px;
  border-radius: 5px;
  background-color: #fee500;
  max-width: 80%;
  align-self: flex-start;
  position: relative; /* 시간 위치 조정 */
}

.my-message {
  align-self: flex-end;
  background-color: #fee500;
  color: black;
}

/* 시간 스타일 */
.message-time {
  font-size: 0.75rem;
  color: #555;
  position: absolute;
  bottom: 5px;
}

.time-my-message {
  left: -50px; /* 내 메시지 시간은 왼쪽 */
}

.time-other-message {
  right: -50px; /* 상대 메시지 시간은 오른쪽 */
}

/* 푸터 스타일 */
.chat-footer {
  position: sticky;
  bottom: 0;
  z-index: 10;
  background-color: #f8f9fa;
  padding: 10px 15px;
  border-top: 1px solid #ddd;
  height: 60px; /* 고정 높이 */
}

.input-group {
  display: flex;
  gap: 10px;
}

.form-control {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.send-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
}

.send-button:hover {
  background-color: #0056b3;
}
</style>
