<template>
    <div>
        <h2>PrivateChatting</h2>
        <hr>
        <template v-for="room in store.chatRoomList" :key="room.roomId">
            <div style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                <span @click="enterChatRoom(room.roomId, room.roomName)">
                    {{ room.roomName }}
                </span>
                <button @click="leaveChatRoom(room)" style="margin-left: 10px;">나가기</button>
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

    const leaveChatRoom = function(room) {
        if (confirm(`채팅방 '${room.roomName}'에서 나가시겠습니까?`)) {
            store.leaveChatRoom({
                roomId: room.roomId,
            });
        }
    };

    onMounted(() => fetchChatRoomList());
</script>


<style scoped>

</style>