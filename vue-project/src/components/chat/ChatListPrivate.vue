<template>
    <div>
        <h2>PrivateChatting</h2>
        <hr>
        <template v-for="room in chatRoomList" :key="room">
            <div>
                {{ room }}
            </div>
        </template>
    </div>
</template>

<script setup>
    import { useChatRoomStore } from '@/stores/chatRoom';
import { onMounted, ref } from 'vue';

    const store = useChatRoomStore()

    const chatRoomList = ref([]);
    const fetchChatRoomList = function(){
        chatRoomList.value = store.loadChatRoomList();
    }

    onMounted(fetchChatRoomList)

</script>

<style scoped>

</style>