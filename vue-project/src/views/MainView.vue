<template>
  <div>
    <h2>{{ userAuthStore.user }}님 안녕하세요</h2>
    <hr>
    <TheFooterNav/>
    <hr>
    <button @click="userAuthStore.logout">로그아웃</button>
  </div>
</template>

<script setup>
  import TheFooterNav from '@/components/common/TheFooterNav.vue';
  import { useUserAuthStore } from '@/stores/userAuth';
  const userAuthStore = useUserAuthStore();

</script>

<style scoped>

</style>