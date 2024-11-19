<template>
  <div class="container">
    <h2>{{ roomId}}</h2>
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
        {{ msg.userId }} - {{ msg.content }}
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


const room = ref({});
const message = ref('');
const messages = ref([]);
const userId = ref(sessionStorage.getItem('userId'));
const stompClient = ref(null);

const connect = () => {
      const socket = new SockJS('http://localhost:8080/ws-stomp');
      stompClient.value = Stomp.over(socket);
      stompClient.value.connect({}, () => {
          console.log("STOMP 연결 성공");
      }, (error) => {
          console.error("STOMP 연결 실패: ", error);
      }); 
      
      stompClient.value.connect({}, () => {
        console.log("헤이2")
        stompClient.value.subscribe(`/sub/chat/room/${roomId.value}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          recvMessage(receivedMessage);
        });


        stompClient.value.send('/pub/chat/message', {}, JSON.stringify({
          messageType: 'ENTER',
          roomId: roomId.value,
          userId: userId.value,
          content: message.value,
        }));

      }, (error) => {
          console.error("STOMP 연결 실패: ", error);
      }); 
    };

    const sendMessage = () => {
      if (stompClient.value && message.value) {
        stompClient.value.send('/pub/chat/message', {}, JSON.stringify({
          messageType: 'TALK',
          roomId: roomId.value,
          userId: userId.value,
          content: message.value,
        }));

        message.value = '';
      }
    };

    const recvMessage = (receivedMessage) => {
      messages.value.unshift({
        userId: receivedMessage.messageType === 'ENTER' ? '[알림]' : receivedMessage.userId,
        content: receivedMessage.content,
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
