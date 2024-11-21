<template>
    <div class="chat-room-container">
        <template v-for="room in store.chatRoomList" :key="room.roomId">
            <div class="chat-room-card" @click="enterChatRoom(room.roomId, room.roomName)">
                <div class="chat-room-info">
                    <!-- 동그란 채팅방 사진 -->
                    <img src="@/assets/default-profile.png" alt="Room Image" class="chat-room-image" />
                    <span class="chat-room-name">
                        {{ room.roomName }}
                    </span>
                </div>
                <button class="leave-button" @click.stop="leaveChatRoom(room)">나가기</button>
            </div>
        </template>
    </div>
</template>



<script setup>
    import router from '@/router';
    import { useChatRoomStore } from '@/stores/chatRoom';
    import { onMounted } from 'vue';

    const store = useChatRoomStore();

    const fetchChatRoomList = function() {
        store.loadChatRoomList();
    };

    const enterChatRoom = function(roomId, roomName) {
        router.push({ name: 'entryRoom', params: { roomId: roomId, roomName: roomName } });
    };

    import Swal from "sweetalert2"; // SweetAlert2 가져오기

    const leaveChatRoom = async function (room) {
    const result = await Swal.fire({
        title: `채팅방 : ${room.roomName}\n 나가시겠습니까?`,
        icon: "warning", // 경고 아이콘
        showCancelButton: true, // 취소 버튼 표시
        confirmButtonText: "나가기", // 확인 버튼 텍스트
        cancelButtonText: "취소", // 취소 버튼 텍스트
    });

    if (result.isConfirmed) {
        store.leaveChatRoom({
        roomId: room.roomId,
        });
        Swal.fire({
        title: "나갔습니다!",
        text: `채팅방 '${room.roomName}'에서 나왔습니다.`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        });
    }
    };


    onMounted(() => fetchChatRoomList());
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

/* 나가기 버튼 */
.leave-button {
    padding: 5px 10px;
    background-color: #ff4d4d;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s;
}

.leave-button:hover {
    background-color: #ff3333;
}
</style>
