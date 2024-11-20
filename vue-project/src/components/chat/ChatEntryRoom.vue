<template>
  <div class="container chat-container">
    <div class="container title">
      <h2>{{ roomName }}</h2>
    </div>
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
    <!-- 메시지 입력 -->
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
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed, onUnmounted } from 'vue';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useRoute } from 'vue-router';
import { useChatRoomStore } from '@/stores/chatRoom';

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
.chat-container {
  max-width: 300px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.chat-list {
  display: flex;
  flex-direction: column;
  height: 250px;
  margin: 0;
  overflow-y: auto;
  padding: 0.5em;
  list-style: none;
  gap: 5px;
  background-color: #b2c7d9;
}

.list-group-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-top: 0.2em;
  padding: 10px;
  border: none;
  border-radius: 10px;
  max-width: 80%;
  word-wrap: break-word;
  background-color: #fee500;
}

.my-message {
  align-self: flex-end;
  text-align: right;
  font-size: 0.4em;
}

.other-message {
  align-self: flex-start;
  text-align: left;
  font-size: 0.4em;
}

.notice {
  align-self: center;
  background-color: transparent;
  color: #888;
  font-size: 0.8rem;
  font-weight: 300;
  text-align: center;
  border: none;
}

.message-time {
  font-size: 0.5rem;
  color: #555;
}

.input-group {
  display: flex; /* Flexbox 설정 */
  align-items: center;
  gap: 10px; /* 입력 필드와 버튼 간의 간격 */
  margin-top: 10px;
  width: 100%; /* 가로 공간 꽉 채우기 */
}

.form-control {
  flex: 1; /* 입력 필드가 가로 공간의 대부분을 차지하도록 설정 */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.send-button {
  flex-shrink: 0; /* 버튼 크기 고정 */
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
