<template>
  <div>
    <h2>{{ userAuthStore.user }}님 안녕하세요</h2>
    <hr>
  </div>
</template>

<script setup>
import { useUserAuthStore } from '@/stores/userAuth';

const userAuthStore = useUserAuthStore();

</script>

<style scoped>

</style>