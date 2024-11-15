<template>
    <div>
        <h2>OpenChatting</h2>
        <hr>
        <template v-for="room in openChatRoomList" :key="room">
            <div>
                1
            </div>
        </template>
    </div>
</template>

<script setup>
    import { useChatRoomStore } from '@/stores/chatRoom';
    import { onMounted, ref } from 'vue';

    const store = useChatRoomStore()

    const openChatRoomList = ref([])
    const fetchOpenChatRoomList = function(){
        openChatRoomList.value = store.loadOpenChatRoomList();
    }

    onMounted(fetchOpenChatRoomList)
</script>

<style scoped>

</style>