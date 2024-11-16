<template>
    <div>
        <h2>OpenChatting</h2>
        <hr>
        <template v-for="room in store.openChatRoomList" :key="room">
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

    const fetchOpenChatRoomList = function(){
        store.loadOpenChatRoomList();
    }

    onMounted(()=>fetchOpenChatRoomList())

</script>

<style scoped>

</style>