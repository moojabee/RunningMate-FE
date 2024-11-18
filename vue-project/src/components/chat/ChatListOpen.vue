<template>
    <div>
        <h2>OpenChatting</h2>
        <hr>
        <template v-for="room in store.openChatRoomList" :key="room.roomId">
            <div @click="confirmAndEnterChatRoom(room.roomName, room.roomId)" style="cursor: pointer;">
                {{ room.roomName }}
            </div>
        </template>
    </div>
</template>

<script setup>
import { useChatRoomStore } from '@/stores/chatRoom';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const store = useChatRoomStore();
const router = useRouter();

const fetchOpenChatRoomList = function() {
    store.loadOpenChatRoomList();
}

const confirmAndEnterChatRoom = function(roomName, roomId) {
    console.log("선택된 채팅방 ID:", roomId); // 디버깅 로그
    if (confirm(`${roomName} 채팅방에 입장하시겠습니까?`)) {
        const party = {
            roomId:roomId,
            roomName:roomName,
        }
        console.log("전달은 잘 됐다.")
        store.joinChatRoom(party)
    }
};

onMounted(() => fetchOpenChatRoomList());
</script>

<style scoped>
</style>
