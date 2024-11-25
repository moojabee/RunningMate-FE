<template>
  <div class="container chat-container">
    <!-- 헤더 -->
    <header class="chat-header">
      <button class="back-button" @click="goBack">
        <img src="@/assets/chat/back.png" alt="뒤로" class="back-icon" />
      </button>
      <h2 class="room-title">{{ roomName }}</h2>
      <button class="menu-button" @click="toggleModal">
        <img src="@/assets/chat/menu.png" alt="메뉴" class="menu-icon" />
      </button>
    </header>

    <!-- 모달 배경 -->
    <div v-bind:class="{'modal-overlay': true, 'active': isModalOpen}" @click="toggleModal"></div>

      <!-- 모달 -->
      <div v-bind:class="{'modal': true, 'open': isModalOpen}">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-header-title">대화 상대</h3>
            <button class="modal-header-quit" @click="toggleModal">X</button>
          </div>
          <!-- 참여자 목록-->
          <div class="friends-list">
            <div v-for="user in userList" :key="user.userId" class="friend-item">
              <img :src="user.userImg || defaultProfileImg" alt="프로필 이미지" class="friend-photo" />
              <span class="friend-nickname">{{ user.nickname }}</span>
              <button class="profile-button" @click="goToProfile(user.userId)">프로필</button>
            </div>
          </div>
        </div>
      </div>

    <!-- 채팅 리스트 -->
    <ul class="chat-list" ref="messageList">
      <li
        class="list-group-item"
        v-for="(msg, index) in messages"
        :key="index"
        :class="{ 'my-message': msg.userId == userId, 'other-message': msg.userId != userId, 'notice': msg.userId == '[알림]' }">
        <div class="sender-info" v-if="msg.userId != userId">
          <img v-if="msg.userImg" :src="msg.userImg" alt="프로필 이미지" style="width: 30px; height: 30px; object-fit: cover; border-radius: 20%;" />
          <img v-else src="@/assets/default-profile.png" alt="기본 프로필 이미지" style="width: 30px; height: 30px; object-fit: cover; border-radius: 20%;" />
          <span class="nickname">{{ msg.nickname }}</span>
        </div>

        <span class="message-time" :class="{ 'time-my-message': msg.userId == userId, 'time-other-message': msg.userId != userId }">
          {{ formatTime(msg.sendedDate) }}
        </span>

        <div class="message-box">{{ msg.content }}</div>
      </li>
    </ul>

    <!-- 푸터 -->
    <footer class="chat-footer">
      <div class="input-group">
        <input type="text" class="form-control" v-model="message" @keypress.enter="sendMessage" placeholder="메시지를 입력하세요" />
        <button class="btn btn-primary send-button" type="button" @click="sendMessage">전송</button>
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
import defaultProfileImg from '@/assets/default-profile.png';

// Vue Router에서 roomId 가져오기
const route = useRoute();
const roomId = ref(route.params.roomId);
const roomName = ref(route.params.roomName)
const REST_API_URL=import.meta.env.VITE_REST_API_URL;

// Pinia Store 사용
const chatRoomStore = useChatRoomStore();

// 데이터 정의
const message = ref('');
const messages = computed(() => chatRoomStore.chatMessage);
const userId = computed(() => sessionStorage.getItem('userId'));
const stompClient = ref(null);
const messageList = ref(null);

// 시간을 시:분:초 형식으로 변환하는 함수
const formatTime = (dateTime) => {
  if (!dateTime) return '';
  const date = new Date(dateTime);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

// 모달 정보
const isModalOpen = ref(false);

// 참여자 리스트
const userList = computed(()=> chatRoomStore.userListInChat)

// 모달 열기/닫기 함수
const toggleModal = () => {
  console.log(userList.value);
  isModalOpen.value = !isModalOpen.value;
};

const goBack = () => {
  router.back();
};

const goToProfile = function(userId){
  router.push({name :'myBoard' , params: { userId: userId }})
}

// STOMP 연결 함수
const connect = () => {
  const socket = new SockJS(`${REST_API_URL}/ws-stomp`);
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
    userImg: receivedMessage.userImg,
    nickname:receivedMessage.nickname
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
    nextTick(() => scrollToBottom());
  } catch (error) {
    console.error('이전 채팅 로드 실패:', error);
  }
};

onMounted(() => {
  loadPreviousChats();
  connect();
  chatRoomStore.loadUserListInChat(roomId.value)
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
  display: flex;
  overflow: hidden;
  flex-direction: column;
  height: 100vh; /* 화면 전체 높이 */
}

/* 헤더 스타일 */
.chat-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
  height: 3em; /* 고정 높이 */
}

/* 푸터 스타일 */
.chat-footer {
  flex: none; /* 크기를 고정 */
  background-color: #f8f9fa;
  padding: 10px 15px;
  border-top: 1px solid #ddd;
  height: 3em; /* 고정 높이 */
  z-index: 10; /* 다른 요소 위에 표시 */
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

.back-button {
  background-color: transparent;
  border: none;
  padding: 0;
}

.back-icon {
  width: 3em;
  height: 3em;
}

.menu-icon{
  width: 2em;
  height: 2em;
}

.menu-button {
  background-color: transparent;
  border: none;
  padding: 0;
  margin-left: auto; /* 버튼을 오른쪽으로 이동 */
  display: flex; /* 버튼 내부 아이콘 정렬 */
  align-items: center;
  justify-content: center;
}

.room-title{
  font-size: 0.8em;
  white-space: nowrap; /* 한 줄로 표시 */
  overflow: hidden; /* 넘친 텍스트 숨김 */
  text-overflow: ellipsis; /* 넘친 텍스트를 '...'으로 표시 */
  max-width: 300px; /* 텍스트가 차지할 최대 너비 설정 */
}

/* 채팅 리스트 스타일 */
.chat-list {
  flex: 1;
  overflow-y: auto;
  background-color: #b2c7d9; /* 배경색 유지 */
  padding: 0.5em;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: calc(100vh - 240px); /* 헤더(60px) + 푸터(60px)를 제외한 높이 */
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
  position: relative; /* 시간 위치 조정 */
}

.sender-info {
  display: flex;
  align-items: center; /* 이미지와 닉네임을 수직 가운데 정렬 */
  gap: 5px; /* 이미지와 닉네임 간격 */
  margin-bottom: 0.2em;
}

.nickname {
  font-size: 1rem; /* 닉네임 크기 조정 */
  line-height: 30px; /* 이미지 높이에 맞춰 텍스트 가운데 정렬 */
}

.message-box{
  background-color: #fee500;
  border-radius: 5px;
  padding: 10px;
  max-width: 20em;
}

.my-message {
  align-self: flex-end;
  color: black;
}

.other-message{
  align-self: flex-start;
  color: black;
}

/* 시간 스타일 */
.message-time {
  font-size: 0.75rem;
  color: #555;
  position: absolute;
  bottom: 0;
}

.time-my-message {
  left: -35px; /* 내 메시지 시간은 왼쪽 */
}

.time-other-message {
  right: -35px; /* 상대 메시지 시간은 오른쪽 */
}

/* 모달 오버레이 (어두운 배경) */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: none;
  z-index: 999;
}

.modal-overlay.active {
  display: block;
}
/* 모달 스타일 */
.modal {
  position: fixed;
  top: 3em; /* chat-header 아래 */
  right: 0;
  width: 75%; /* 오른쪽 절반 차지 */
  height: calc(100vh - 6em); /* 화면에서 헤더와 푸터를 제외한 높이 */
  background-color: white;
  display: none;
  z-index: 1000;
  transition: transform 0.3s ease;
  transform: translateX(100%);
  border-radius: 10px; /* 모서리 둥글게 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 그림자 효과 */
}

.modal.open {
  display: block;
  transform: translateX(0);
}

.modal-content {
  padding: 20px;
  overflow-y: auto;
  height: 100%;
  border-radius: 10px; /* 모서리 둥글게 */
}

/* 모달 헤더 스타일 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 2px solid #f1f1f1; /* 헤더 하단에 라인 추가 */
}

.modal-header-title {
  font-size: 1.5em;
  font-weight: bold;
  color: #333;
}

.modal-header-quit {
  background-color: #ff5722; /* 붉은색 */
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 1.2em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.modal-header-quit:hover {
  background-color: #f44336; /* 붉은색을 조금 어두운 색으로 변경 */
}

/* 친구 리스트 스타일 */
.friends-list {
  margin-top: 20px;
}

.friend-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  justify-content: flex-end; /* 항목들을 오른쪽 정렬 */
}

.friend-photo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-left: 15px; /* 사진과 다른 항목 간의 간격 */
}

.friend-nickname {
  font-size: 1.1em;
  color: #333;
  flex-grow: 1; /* 닉네임이 가능한 공간을 모두 차지하도록 설정 */
}

.profile-button {
  background-color: #007bff;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.profile-button:hover {
  background-color: #0056b3;
}

</style>
