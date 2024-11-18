<template>
  <div class="chat-container">
    <h1>채팅방 번호: {{ roomId }}</h1>
    <h2>채팅방 이름: {{ roomName }}</h2>

    <div class="chat-box">
      <ul>
        <li v-for="(msg, index) in messages" :key="index">
          <strong>{{ msg.sender }}:</strong> {{ msg.message }}
        </li>
      </ul>
    </div>

    <div class="chat-input">
      <input
        type="text"
        v-model="message"
        placeholder="메시지를 입력하세요"
        @keypress.enter="sendMessage"
      />
      <button @click="sendMessage">보내기</button>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { ref, onMounted } from 'vue';

// URL 파라미터 가져오기
const route = useRoute();
const roomId = ref(route.params.roomId); // 방 번호
const roomName = ref(route.params.roomName); // 방 이름

// 채팅 상태 관리
const messages = ref([]); // 수신된 메시지를 저장
const message = ref(''); // 전송할 메시지
let stompClient = null; // STOMP 클라이언트

// 인증 토큰 설정
const token = ref(sessionStorage.getItem('session'));
const getAuthHeaders = () => ({
  Authorization: `Bearer ${token.value}`,
});

// WebSocket 연결 설정
const connect = () => {
  stompClient = new Client({
    webSocketFactory: () => new SockJS('http://localhost:8080/ws-stomp'), // SockJS WebSocket
    connectHeaders: getAuthHeaders(), // 인증 헤더 추가
    reconnectDelay: 5000, // 재연결 딜레이
    heartbeatIncoming: 4000, // 서버 → 클라이언트 핑
    heartbeatOutgoing: 4000, // 클라이언트 → 서버 핑
  });

  // 연결 성공 시
  stompClient.onConnect = () => {
    console.log('WebSocket 연결 성공');
    stompClient.subscribe(`/sub/chat/room/${roomId.value}`, (response) => {
      const receivedMessage = JSON.parse(response.body);
      messages.value.push({
        sender: receivedMessage.userId === 1 ? '[나]' : `[유저 ${receivedMessage.userId}]`,
        message: receivedMessage.message,
      });
    });

    // 방 입장 메시지 전송
    stompClient.publish({
      destination: '/pub/chat/message',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        roomId: roomId.value,
        userId: 1, // 예제에서는 1번 유저
        message: `${roomName.value} 방에 입장했습니다.`,
      }),
    });
  };

  // 연결 실패 시
  stompClient.onStompError = (frame) => {
    console.error('STOMP 에러:', frame.headers['message']);
  };

  // 연결 종료 시
  stompClient.onWebSocketClose = () => {
    console.log('WebSocket 연결 종료');
  };

  // 클라이언트 활성화
  stompClient.activate();
};

// 메시지 전송
const sendMessage = () => {
  if (stompClient && stompClient.connected && message.value.trim() !== '') {
    stompClient.publish({
      destination: '/pub/chat/message',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        roomId: roomId.value,
        userId: 1, // 예제에서는 1번 유저
        message: message.value,
      }),
    });
    message.value = ''; // 입력란 초기화
  }
};

// WebSocket 연결 시작
onMounted(() => {
  connect();
});
</script>

<style scoped>
.chat-container {
  max-width: 600px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.chat-box {
  border: 1px solid #ddd;
  height: 300px;
  overflow-y: auto;
  padding: 10px;
  margin-bottom: 10px;
}

.chat-input {
  display: flex;
  gap: 10px;
}

.chat-input input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
}

.chat-input button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

.chat-input button:hover {
  background-color: #0056b3;
}
</style>
