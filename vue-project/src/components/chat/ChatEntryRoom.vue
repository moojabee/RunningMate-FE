<template>
  <div class="container">
    <h2>{{ roomId }}</h2>
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
    <ul class="list-group mt-3">
      <li class="list-group-item" v-for="msg in messages" :key="msg.id">
        {{ msg.sender }} - {{ msg.message }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useRoute } from 'vue-router';

const route = useRoute()
const roomId = ref(route.params.roomId);
const message = ref('');
const messages = ref([]);
const sender = ref(1);
const stompClient = ref(null);
const headers = ref(sessionStorage.getItem('session'))
    const getAuthHeaders = () => ({
        Authorization : token.value
    })

const connect = () => {
  const socket = new SockJS('http://localhost:8080/ws-stomp');
  stompClient.value = Stomp.over(socket);
  stompClient.value.connect(headers.value, () => {
    console.log(stompClient.value)
    stompClient.value.subscribe(`/sub/chat/room/${roomId.value}`, (message) => {
      console.log(`${roomId.value}`)
      const receivedMessage = JSON.parse(message.body);
      recvMessage(receivedMessage);
    });

    stompClient.value.send('/pub/chat/message', {}, JSON.stringify({
      type: 'ENTER',
      roomId: roomId.value,
      sender: sender.value
    }));
  });
};

const sendMessage = () => {
  if (stompClient.value && message.value) {
    stompClient.value.send(`/pub/chat/message/${roomId.value}`, {}, JSON.stringify({
      type: 'TALK',
      roomId: roomId.value,
      sender: sender.value,
      message: message.value
    }));
    message.value = '';
  }
  else {
    console.error("WebSocket 연결이 끊겼습니다. 재연결 시도 중...");
    connect(); // WebSocket 재연결 시도
  }
};

const recvMessage = (receivedMessage) => {
  messages.value.unshift({
    sender: receivedMessage.type === 'ENTER' ? '[알림]' : receivedMessage.sender,
    message: receivedMessage.message
  });
};

onMounted(() => {
  connect();
});
</script>

<style scoped>
[v-cloak] {
  display: none;
}
</style>
