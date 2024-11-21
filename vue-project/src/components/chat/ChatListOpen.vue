<template>
    <div class="chat-room-container">
        <template v-for="room in store.openChatRoomList" :key="room.roomId">
            <div class="chat-room-card" @click="confirmAndEnterChatRoom(room.roomName, room.roomId)">
                <div class="chat-room-info">
                    <!-- 동그란 채팅방 사진 -->
                    <img src="@/assets/default-profile.png" alt="Room Image" class="chat-room-image" />
                    <span class="chat-room-name">{{ room.roomName }}</span>
                </div>
            </div>
        </template>
    </div>
</template>


<script setup>
import { useChatRoomStore } from '@/stores/chatRoom';
import Swal from 'sweetalert2';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const store = useChatRoomStore();
const router = useRouter();

const fetchOpenChatRoomList = function() {
    store.loadOpenChatRoomList();
}

const confirmAndEnterChatRoom = async function (roomName, roomId) {
  const result = await Swal.fire({
    title: `채팅방 : ${roomName} \n 채팅방에 입장하시겠습니까?`,
    icon: "question",
    showCancelButton: true,
    cancelButtonText: "취소",
    confirmButtonText: "입장하기",
  });

  if (result.isConfirmed) {
    const party = {
      roomId: roomId,
      roomName: roomName,
    };
    store.joinChatRoom(party);
  }
};

onMounted(() => fetchOpenChatRoomList());
</script>


<style scoped>
.chat-room-container {
    padding: 20px;
    font-family: Arial, sans-serif;
}

h2 {
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 10px;
}

hr {
    margin: 10px 0 20px;
    border: 0;
    height: 1px;
    background: #ddd;
}

/* 카드 스타일 */
.chat-room-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    margin-bottom: 15px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.chat-room-card:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

/* 채팅방 정보 */
.chat-room-info {
    display: flex;
    align-items: center;
    cursor: pointer;
}

/* 동그란 채팅방 사진 */
.chat-room-image {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 15px;
    object-fit: cover; /* 이미지 비율 유지 */
    border: 1px solid #ddd;
}

/* 채팅방 이름 */
.chat-room-name {
    font-size: 0.7em;
    color: #555;
    font-weight: bold;
    white-space: nowrap; /* 한 줄로 표시 */
    overflow: hidden; /* 넘친 텍스트 숨김 */
    text-overflow: ellipsis; /* 넘친 텍스트를 '...'으로 표시 */
    max-width: 150px; /* 텍스트가 차지할 최대 너비 설정 */
}
</style>
