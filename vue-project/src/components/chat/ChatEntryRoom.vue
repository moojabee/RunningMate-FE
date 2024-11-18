<template>
    <div>
        <h1>채팅방입니다. 방 번호: {{ roomId }}</h1>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const roomId = route.params.id; // URL에서 전달된 방 번호
</script>

<style scoped>
</style>