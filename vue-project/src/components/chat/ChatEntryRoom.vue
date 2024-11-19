<template>
  <div class="container chat-container">
    <h2>{{ roomId }}</h2>
    <!-- 메시지 리스트 -->
    <ul class="list-group mt-3 chat-list" ref="messageList">
      <li
        class="list-group-item"
        v-for="(msg, index) in messages"
        :key="index"
        :class="{ 'my-message': msg.userId == userId, 'other-message': msg.userId != userId, 'notice':msg.userId == '[알림]' }"
      >
        <span class="message-user" v-if="msg.userId !== userId">{{ msg.userId }}</span>
        <span class="message-content">{{ msg.content }}</span>
      </li>
    </ul>
    <div class="input-group">
      <div class="input-group-prepend">
        <label class="input-group-text">내용</label>
      </div>
      <input
        type="text"
        class="form-control"
        v-model="message"
        @keypress.enter="sendMessage"
      />
      <div class="input-group-append">
        <button class="btn btn-primary" type="button" @click="sendMessage">
          보내기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useRoute } from 'vue-router';
import { useChatRoomStore } from '@/stores/chatRoom'; // Pinia store import

// Vue Router를 사용하여 roomId 가져오기
const route = useRoute();
const roomId = ref(route.params.roomId);

// Pinia Store 사용
const chatRoomStore = useChatRoomStore();

// 데이터 정의
const message = ref('');
const messages = ref([]); // 이전 채팅 및 실시간 채팅 저장
const userId = ref(sessionStorage.getItem('userId')); // 사용자 ID 저장
const stompClient = ref(null);
const messageList = ref(null); // 스크롤 처리를 위한 ref

// STOMP 연결 함수
const connect = () => {
  const socket = new SockJS('http://localhost:8080/ws-stomp');
  stompClient.value = Stomp.over(socket);
  stompClient.value.connect(
    {},
    () => {
      console.log('STOMP 연결 성공');
      // 채팅방 구독
      stompClient.value.subscribe(`/sub/chat/room/${roomId.value}`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        recvMessage(receivedMessage);
      });

      // 채팅방 입장 메시지 전송
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
    message.value = ''; // 입력 필드 초기화
  }
};

// 메시지 수신 처리 함수
const recvMessage = (receivedMessage) => {
  messages.value.push({
    userId: receivedMessage.messageType == 'ENTER' ? '[알림]' : receivedMessage.userId,
    content: receivedMessage.content,
  });

  // 새로운 메시지 도착 시 스크롤 하단 이동
  nextTick(() => scrollToBottom());
};

// 스크롤 하단으로 이동
const scrollToBottom = () => {
  if (messageList.value) {
    messageList.value.scrollTop = messageList.value.scrollHeight;
  }
};

// 이전 채팅 불러오기
const loadPreviousChats = async () => {
    try {
        await chatRoomStore.loadChatting(roomId.value);
        messages.value = chatRoomStore.chatMessage
        console.log(chatRoomStore.chatMessage)
        nextTick(() => scrollToBottom()); // 스크롤 하단 이동
    } catch (error) {
        console.error('이전 채팅 로드 실패:', error);
    }
};

// 컴포넌트 마운트 시 STOMP 연결 및 이전 채팅 불러오기
onMounted(() => {
  loadPreviousChats(); // 이전 채팅 로드
  connect(); // STOMP 연결
});
</script>
<style scoped>
.chat-container {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chat-list {
  display: flex; /* 부모 컨테이너를 flex 컨테이너로 설정 */
  flex-direction: column; /* 세로 방향 정렬 */
  max-height: 400px;
  overflow-y: auto;
  padding: 0;
  list-style: none;
  gap: 5px; /* 메시지 간격 */
  background-color: #b2c7d9;
}

.list-group-item {
  display: flex;
  flex-direction: column;
  padding: 10px;
  border: none;
  border-radius: 10px;
  max-width: 60%; /* 메시지 최대 너비 */
  word-wrap: break-word; /* 긴 텍스트 줄바꿈 */
}

.my-message {
  align-self: flex-end; /* 내 메시지는 오른쪽 */
  background-color: #fee500;
  text-align: right; /* 텍스트 오른쪽 정렬 */
}

.other-message {
  align-self: flex-start; /* 상대방 메시지는 왼쪽 */
  background-color: #fee500;
  text-align: left; /* 텍스트 왼쪽 정렬 */
}

.notice {
  align-self: center; /* 메시지를 중앙에 정렬 */
  background-color: transparent; /* 배경 투명 */
  color: #888; /* 연한 회색 글씨 */
  font-size: 0.8rem; /* 작은 글씨 */
  font-weight: 300; /* 얇게 */
  text-align: center; /* 텍스트 중앙 정렬 */
  border: none; /* 테두리 제거 */
}

.message-content {
  font-size: 1rem;
  line-height: 1.4;
}
</style>
