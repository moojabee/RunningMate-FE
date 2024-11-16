<template>
    <div>
        <h2>PrivateChatting</h2>
        <hr>
        <template v-for="room in store.chatRoomList" :key="room">
            <div>
                {{ room.roomName }}
            </div>
        </template>
    </div>
</template>

<script setup>
    import { useChatRoomStore } from '@/stores/chatRoom';
    import { onMounted, ref } from 'vue';

    const store = useChatRoomStore()

    const fetchChatRoomList = function(){
        store.loadChatRoomList();
    }

    onMounted(()=>fetchChatRoomList())

</script>

<style scoped>

</style>