<template>
    <div>
        <h2>PrivateChatting</h2>
        <hr>
        <template v-for="room in store.chatRoomList" :key="room.roomId">
            <div @click="enterChatRoom(room.roomId,room.roomName)" style="cursor: pointer;">
                {{ room.roomName }}
            </div>
        </template>
    </div>
</template>

<script setup>
    import router from '@/router';
    import { useChatRoomStore } from '@/stores/chatRoom';
    import { onMounted, ref } from 'vue';

    const store = useChatRoomStore()

    const fetchChatRoomList = function(){
        store.loadChatRoomList();
    }

    const enterChatRoom = function(roomId,roomName){
        router.push({ name: 'entryRoom', params: { id: roomId, name:roomName } })
    }

    onMounted(()=>fetchChatRoomList())

</script>

<style scoped>

</style>